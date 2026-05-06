<?php
namespace App\Http\Controllers;

use App\Jobs\SendPayrollSlipJob;
use App\Mail\PayrollSlipMail;
use App\Models\MailConfiguration;
use App\Models\PayrollEmployee;
use App\Models\PayrollImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PayrollEmailController extends Controller
{
    // Kirim 1 email (preview/test per karyawan)
    public function sendOne(PayrollEmployee $employee)
    {
        abort_if(empty($employee->email), 422, 'Email karyawan kosong.');

        $config = MailConfiguration::getActive();
        MailConfiguration::applyToMailer($config);

        $pdfPath = PayrollController::generateAndStorePdf($employee);
        Mail::to($employee->email)->send(new PayrollSlipMail($employee, $pdfPath));

        $employee->update(['email_sent' => true, 'email_sent_at' => now()]);

        return back()->with('success', "Email terkirim ke {$employee->email}");
    }

    // Kirim massal dengan range row_number
    public function sendBulk(Request $request, PayrollImport $import)
    {
        $request->validate([
            'from' => 'required|integer|min:1',
            'to' => 'required|integer|gte:from',
        ]);

        $config = MailConfiguration::getActive();

        $employees = $import->employees()
            ->whereBetween('row_number', [$request->from, $request->to])
            ->where('email_sent', false)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->orderBy('row_number')
            ->get();

        $delay = 0;
        foreach ($employees as $employee) {
            SendPayrollSlipJob::dispatch($employee, $config->id)
                ->delay(now()->addSeconds($delay));
            $delay += 3; // 3 detik antar email → aman untuk Gmail 500/hari
        }

        $import->update(['status' => 'sending']);

        return back()->with('success', "Berhasil dispatch {$employees->count()} job email.");
    }
}
