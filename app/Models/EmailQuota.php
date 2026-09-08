<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailQuota extends Model
{
    protected $fillable = ['mail_configuration_id', 'quota_date', 'sent_count', 'daily_limit'];
    protected $casts = ['quota_date' => 'date'];

    public function mailConfiguration()
    {
        return $this->belongsTo(MailConfiguration::class);
    }

    public function getPercentageAttribute(): int
    {
        return (int) (($this->sent_count / $this->daily_limit) * 100);
    }

    public function getStatusAttribute(): string
    {
        if ($this->percentage >= 100)
            return 'full';
        if ($this->percentage >= 80)
            return 'warning';
        return 'ok';
    }
}
