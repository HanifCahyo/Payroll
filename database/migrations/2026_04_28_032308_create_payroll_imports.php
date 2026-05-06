<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payroll_imports', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');
            $table->string('period');             // "APRIL 2026"
            $table->string('period_range');       // "26 Maret - 28 April 2026"
            $table->integer('total_rows')->default(0);
            $table->enum('status', ['ready', 'sending', 'done'])->default('ready');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_imports');
    }
};
