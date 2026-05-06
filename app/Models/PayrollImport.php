<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollImport extends Model
{
    protected $fillable = [
        'file_name',
        'period',
        'period_range',
        'sheet_name',
        'total_rows',
        'status',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(PayrollEmployee::class);
    }
}
