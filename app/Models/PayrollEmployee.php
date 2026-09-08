<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayrollEmployee extends Model
{
    protected $fillable = [
        'payroll_import_id',
        'row_number',
        'nip_baru',
        'nip',
        'rekening',
        'nama',
        'bagian',
        'email',
        'upah_nominal',
        'upah_hari',
        'nominal_premi',
        'premi',
        'nominal_ut',
        'ut',
        'nominal_sumbangan',
        'hari_sumbangan',
        'lembur_biasa',
        'jam_lb',
        'lembur_libur',
        'jam_ll',
        'total_upah',
        'potongan_kedisiplinan',
        'hari_potongan',
        'total_kedisiplinan',
        'sepatu',
        'terlambat',
        'terlambat_menit',
        'hari_terlambat',
        'jumlah_potongan_kedisiplinan',
        'simpanan_wajib',
        'koperasi',
        'koperasi_ke',
        'bpjs',
        'jumlah_potongan',
        'upah_diterima',
        'email_sent',
        'email_sent_at',
        'pdf_path',
    ];

    protected $casts = [
        'email_sent' => 'boolean',
        'email_sent_at' => 'datetime',
    ];

    public function import(): BelongsTo
    {
        return $this->belongsTo(PayrollImport::class, 'payroll_import_id');
    }

    public function getPrimaryNipAttribute(): ?string
    {
        return $this->nip_baru ?: $this->nip;
    }
}
