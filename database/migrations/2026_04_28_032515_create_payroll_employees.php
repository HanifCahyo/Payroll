<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    // database/migrations/xxxx_create_payroll_employees_table.php
    public function up(): void
    {
        Schema::create('payroll_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_import_id')->constrained()->cascadeOnDelete();
            $table->integer('row_number');
            $table->string('nip_baru')->nullable();
            $table->string('nip')->nullable();
            $table->string('rekening')->nullable();
            $table->string('nama')->nullable();
            $table->string('bagian')->nullable();
            $table->string('email')->nullable();

            // UPAH
            $table->decimal('upah_nominal', 15, 2)->default(0);
            $table->decimal('upah_hari', 15, 2)->default(0);
            $table->decimal('nominal_premi', 15, 2)->default(0);
            $table->decimal('premi', 15, 2)->default(0);
            $table->decimal('nominal_ut', 15, 2)->default(0);
            $table->decimal('ut', 15, 2)->default(0);
            $table->decimal('nominal_sumbangan', 15, 2)->default(0);
            $table->decimal('hari_sumbangan', 15, 2)->default(0);
            $table->decimal('lembur_biasa', 15, 2)->default(0);
            $table->decimal('jam_lb', 15, 2)->default(0);
            $table->decimal('lembur_libur', 15, 2)->default(0);
            $table->decimal('jam_ll', 15, 2)->default(0);
            $table->decimal('total_upah', 15, 2)->default(0);

            // POTONGAN
            $table->decimal('potongan_kedisiplinan', 15, 2)->default(0);   // col 19
            $table->decimal('hari_potongan', 15, 2)->default(0);            // col 20 "Hari"
            $table->decimal('total_kedisiplinan', 15, 2)->default(0);       // col 21 "TOTAL"
            $table->decimal('sepatu', 15, 2)->default(0);
            $table->decimal('terlambat', 15, 2)->default(0);                // nominal terlambat
            $table->decimal('terlambat_menit', 15, 2)->default(0);          // menit
            $table->decimal('hari_terlambat', 15, 2)->default(0);           // col 25 "HARI"
            $table->decimal('jumlah_potongan_kedisiplinan', 15, 2)->default(0);
            $table->decimal('simpanan_wajib', 15, 2)->default(0);
            $table->decimal('koperasi', 15, 2)->default(0);
            $table->decimal('koperasi_ke', 15, 2)->default(0);
            $table->decimal('bpjs', 15, 2)->default(0);
            $table->decimal('jumlah_potongan', 15, 2)->default(0);
            $table->decimal('upah_diterima', 15, 2)->default(0);

            $table->boolean('email_sent')->default(false);
            $table->timestamp('email_sent_at')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_employees');
    }
};
