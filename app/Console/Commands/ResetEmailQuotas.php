<?php

namespace App\Console\Commands;

use App\Models\EmailQuota;
use Illuminate\Console\Command;

class ResetEmailQuotas extends Command
{
    protected $signature = 'email:reset-quotas';
    protected $description = 'Reset email quotas untuk hari baru';

    public function handle()
    {
        // Quotas otomatis di-reset saat diakses (lazy initialization)
        // Command ini hanya untuk cleanup data lama
        EmailQuota::where('quota_date', '<', today())->delete();

        $this->info('Email quotas siap untuk hari baru.');
    }
}
