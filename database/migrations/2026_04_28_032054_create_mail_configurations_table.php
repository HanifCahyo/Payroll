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
        Schema::create('mail_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('name');               // label: "Gmail HRD 1"
            $table->string('host')->default('smtp.gmail.com');
            $table->integer('port')->default(587);
            $table->string('username');
            $table->string('password');           // encrypted
            $table->string('encryption')->default('tls');
            $table->string('from_address');
            $table->string('from_name')->default('HRD PT. Gading Gadjah Mada');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mail_configurations');
    }
};
