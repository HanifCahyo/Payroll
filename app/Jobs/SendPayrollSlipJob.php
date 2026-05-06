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
        public int $mailConfigId
    ) {
    }

    public function handle(): void
    {
        $config = MailConfiguration::findOrFail($this->mailConfigId);
        MailConfiguration::applyToMailer($config);

        $pdfPath = PayrollController::generateAndStorePdf($this->employee);

        Mail::to($this->employee->email)
            ->send(new PayrollSlipMail($this->employee, $pdfPath));

        $this->employee->update([
            'email_sent' => true,
            'email_sent_at' => now(),
        ]);
    }

    public function failed(\Throwable $e): void
    {
        \Log::error("Gagal kirim slip [{$this->employee->nip}]: " . $e->getMessage());
    }
}
