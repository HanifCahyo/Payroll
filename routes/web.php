<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{PayrollController, PayrollEmailController, MailConfigController};

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware(['auth', 'verified'])->group(function () {

    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::post('/upload', [PayrollController::class, 'upload'])->name('upload');
        Route::get('/{import}', [PayrollController::class, 'detail'])->name('detail');
        Route::get('/pdf/{employee}', [PayrollController::class, 'exportPdf'])->name('pdf');
        Route::post('/email/{employee}/send-one', [PayrollEmailController::class, 'sendOne'])->name('email.one');
        Route::post('/{import}/send-bulk', [PayrollEmailController::class, 'sendBulk'])->name('email.bulk');
    });

    Route::prefix('mail-config')->name('mail-config.')->group(function () {
        Route::get('/', [MailConfigController::class, 'index'])->name('index');
        Route::post('/', [MailConfigController::class, 'store'])->name('store');
        Route::put('/{mailConfiguration}', [MailConfigController::class, 'update'])->name('update');
        Route::delete('/{mailConfiguration}', [MailConfigController::class, 'destroy'])->name('destroy');
        Route::patch('/{mailConfiguration}/activate', [MailConfigController::class, 'setActive'])->name('activate');
        Route::post('/{mailConfiguration}/test', [MailConfigController::class, 'testSend'])->name('test');
    });

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
