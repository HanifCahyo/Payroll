<?php
namespace App\Http\Controllers;

use App\Jobs\SendPayrollSlipJob;
use App\Mail\PayrollSlipMail;
use App\Models\MailConfiguration;
use App\Models\PayrollEmployee;
use App\Models\PayrollImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class PayrollEmailController extends Controller
{
    private const TYPE_SALARY = PayrollSlipMail::TYPE_SALARY;
    private const TYPE_OVERTIME = PayrollSlipMail::TYPE_OVERTIME;

    public function sendOne(PayrollEmployee $employee)
    {
        return $this->sendSingleDocument($employee, self::TYPE_SALARY);
    }

    public function sendOvertimeOne(PayrollEmployee $employee)
    {
        return $this->sendSingleDocument($employee, self::TYPE_OVERTIME);
    }

    public function sendBulk(Request $request, PayrollImport $import)
    {
        return $this->dispatchBulkDocument($request, $import, self::TYPE_SALARY);
    }

    public function sendOvertimeBulk(Request $request, PayrollImport $import)
    {
        return $this->dispatchBulkDocument($request, $import, self::TYPE_OVERTIME);
    }

    private function sendSingleDocument(PayrollEmployee $employee, string $documentType)
    {
        if (empty($employee->email)) {
            return back()->with('error', 'Email karyawan kosong.');
        }

        $config = MailConfiguration::getActiveWithQuota();
        if (!$config) {
            return back()->with('error', 'Belum ada konfigurasi SMTP yang aktif atau kuota email hari ini sudah penuh. Silakan atur konfigurasi email di menu SMTP Config.');
        }

        MailConfiguration::applyToMailer($config);

        try {
            $pdfPath = $this->generatePdfForType($employee, $documentType);
            Mail::to($employee->email)->send(new PayrollSlipMail($employee, $pdfPath, $documentType));
        } catch (TransportExceptionInterface $e) {
            return back()->with('error', 'Autentikasi SMTP gagal. Untuk Gmail gunakan App Password 16 karakter, bukan password biasa, dan pastikan 2FA aktif.');
        } catch (\Throwable $e) {
            return back()->with('error', 'Gagal mengirim email: ' . $e->getMessage());
        }

        $employee->update(['email_sent' => true, 'email_sent_at' => now()]);
        $config->incrementSentCount();

        return back()->with('success', $this->singleSuccessMessage($employee->email, $documentType, $config->name));
    }

    private function dispatchBulkDocument(Request $request, PayrollImport $import, string $documentType)
    {
        $request->validate([
            'from' => 'required|integer|min:1',
            'to' => 'required|integer|gte:from',
        ]);

        $employees = $import->employees()
            ->whereBetween('row_number', [$request->from, $request->to])
            ->where('email_sent', false)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->orderBy('row_number')
            ->get();

        if ($employees->isEmpty()) {
            return back()->with('info', 'Tidak ada email yang perlu dikirim.');
        }

        $totalDispatched = 0;

        foreach ($employees as $employee) {
            $config = MailConfiguration::getActiveWithQuota();

            if (!$config) {
                break;
            }

            SendPayrollSlipJob::dispatch($employee, $config->id, $documentType);

            $config->incrementSentCount();
            $totalDispatched++;
        }

        $import->update(['status' => 'sending']);

        if ($totalDispatched > 0) {
            PayrollController::startBackgroundWorker();
        }

        $message = $this->bulkSuccessMessage($totalDispatched, $employees->count(), $documentType);

        return back()->with('success', $message);
    }

    private function generatePdfForType(PayrollEmployee $employee, string $documentType): string
    {
        return $documentType === self::TYPE_OVERTIME
            ? PayrollController::generateAndStoreOvertimePdf($employee)
            : PayrollController::generateAndStorePdf($employee);
    }

    private function singleSuccessMessage(string $email, string $documentType, string $configName): string
    {
        $label = $documentType === self::TYPE_OVERTIME ? 'slip lembur' : 'slip gaji';

        return "Email {$label} terkirim ke {$email} via {$configName}";
    }

    private function bulkSuccessMessage(int $totalDispatched, int $totalEmployees, string $documentType): string
    {
        $label = $documentType === self::TYPE_OVERTIME ? 'job email lembur' : 'job email gaji';

        $message = "Berhasil dispatch {$totalDispatched} {$label}.";
        if ($totalDispatched < $totalEmployees) {
            $message .= " (" . ($totalEmployees - $totalDispatched) . " tertunda karena quota penuh)";
        }

        return $message;
    }
}
