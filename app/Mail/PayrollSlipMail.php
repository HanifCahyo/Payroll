<?php
namespace App\Mail;

use App\Models\PayrollEmployee;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class PayrollSlipMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public PayrollEmployee $employee,
        public string $pdfPath
    ) {
    }

    public function envelope(): Envelope
    {
        $period = $this->employee->import->period;
        $nama = $this->employee->nama;
        return new Envelope(
            subject: "SLIP GAJI {$period}_{$nama}_PT. Gading Gadjah Mada",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.slip');
    }

    public function attachments(): array
    {
        $period = $this->employee->import->period;
        $nip = $this->employee->nip;
        return [
            Attachment::fromStorage($this->pdfPath)
                ->as("SlipGaji_{$nip}_{$period}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
