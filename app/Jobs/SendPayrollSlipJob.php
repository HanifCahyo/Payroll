<?php
namespace App\Jobs;

use App\Http\Controllers\PayrollController;
use App\Mail\PayrollSlipMail;
use App\Models\MailConfiguration;
use App\Models\PayrollEmployee;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendPayrollSlipJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 90;

    public function __construct(
        public PayrollEmployee $employee,
        public int $mailConfigId,
        public string $documentType = PayrollSlipMail::TYPE_SALARY,
    ) {
    }

    public function handle(): void
    {
        $config = MailConfiguration::findOrFail($this->mailConfigId);
        MailConfiguration::applyToMailer($config);

        $pdfPath = $this->documentType === PayrollSlipMail::TYPE_OVERTIME
            ? PayrollController::generateAndStoreOvertimePdf($this->employee)
            : PayrollController::generateAndStorePdf($this->employee);

        // Jeda waktu aman 2 detik antar pengiriman agar tidak terdeteksi bot/spam oleh algoritma Google Gmail
        sleep(2);

        Mail::to($this->employee->email)
            ->send(new PayrollSlipMail($this->employee, $pdfPath, $this->documentType));

        $this->employee->update([
            'email_sent' => true,
            'email_sent_at' => now(),
        ]);
    }

    public function failed(\Throwable $e): void
    {
        $nip = $this->employee->nip_baru ?: $this->employee->nip;
        \Log::error("Gagal kirim slip {$this->documentType} [{$nip}]: " . $e->getMessage());
    }
}
