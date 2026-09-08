<?php
namespace App\Mail;

use App\Models\PayrollEmployee;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayrollSlipMail extends Mailable
{
    use Queueable, SerializesModels;

    public const TYPE_SALARY = 'salary';
    public const TYPE_OVERTIME = 'overtime';

    public function __construct(
        public PayrollEmployee $employee,
        public string $pdfPath,
        public string $documentType = self::TYPE_SALARY,
    ) {
    }

    public function envelope(): Envelope
    {
        $period = $this->employee->import->period;
        $nama = $this->employee->nama;
        return new Envelope(
            subject: sprintf(
                '%s %s_%s_PT. Gading Gadjah Mada',
                $this->documentType === self::TYPE_OVERTIME ? 'SLIP LEMBUR' : 'SLIP GAJI',
                $period,
                $nama,
            ),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: $this->documentType === self::TYPE_OVERTIME
            ? 'emails.overtime'
            : 'emails.slip',
        );
    }

    public function attachments(): array
    {
        $period = $this->employee->import->period;
        $nip = $this->employee->nip_baru ?: $this->employee->nip;
        return [
            Attachment::fromStorage($this->pdfPath)
                ->as($this->documentType === self::TYPE_OVERTIME
                    ? "SlipLembur_{$nip}_{$period}.pdf"
                    : "SlipGaji_{$nip}_{$period}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
