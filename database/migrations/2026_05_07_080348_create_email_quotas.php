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
        Schema::create('email_quotas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_configuration_id')->constrained('mail_configurations')->cascadeOnDelete();
            $table->date('quota_date');
            $table->integer('sent_count')->default(0);
            $table->integer('daily_limit')->default(400);
            $table->timestamps();
            $table->unique(['mail_configuration_id', 'quota_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_quotas');
    }
};
