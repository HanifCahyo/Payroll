<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MailConfiguration extends Model
{
    protected $fillable = [
        'name',
        'host',
        'port',
        'username',
        'password',
        'encryption',
        'from_address',
        'from_name',
        'is_active',
    ];

    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = encrypt($value);
    }

    public function getPasswordAttribute(string $value): string
    {
        return decrypt($value);
    }

    public static function getActive(): self
    {
        return static::where('is_active', true)->firstOrFail();
    }

    public static function applyToMailer(self $config): void
    {
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => $config->host,
            'mail.mailers.smtp.port' => $config->port,
            'mail.mailers.smtp.username' => $config->username,
            'mail.mailers.smtp.password' => $config->password,
            'mail.mailers.smtp.encryption' => $config->encryption,
            'mail.from.address' => $config->from_address,
            'mail.from.name' => $config->from_name,
        ]);

        app('mail.manager')->purge('smtp');
    }
}
