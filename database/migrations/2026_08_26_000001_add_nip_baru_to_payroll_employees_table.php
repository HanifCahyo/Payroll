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
        Schema::table('payroll_employees', function (Blueprint $table) {
            if (!Schema::hasColumn('payroll_employees', 'nip_baru')) {
                $table->string('nip_baru')->nullable()->after('row_number');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payroll_employees', function (Blueprint $table) {
            if (Schema::hasColumn('payroll_employees', 'nip_baru')) {
                $table->dropColumn('nip_baru');
            }
        });
    }
};
