<?php

use App\Models\PayrollEmployee;
use App\Models\PayrollImport;
use App\Models\User;

function createPayrollEmployeeForTambahanTest(float $tambahan = 0): PayrollEmployee
{
    $import = PayrollImport::create([
        'file_name' => 'payroll.xlsx',
        'type' => 'salary',
        'period' => 'OKTOBER 2026',
        'period_range' => '1 - 31 Oktober 2026',
        'total_rows' => 1,
        'status' => 'ready',
    ]);

    return PayrollEmployee::create([
        'payroll_import_id' => $import->id,
        'row_number' => 1,
        'nama' => 'Karyawan Test',
        'upah_diterima' => 100000,
        'tambahan' => $tambahan,
    ]);
}

it('saves a non-negative additional amount for an employee', function () {
    $employee = createPayrollEmployeeForTambahanTest();

    $this->actingAs(User::factory()->create())
        ->put(route('payroll.employee.update', $employee), [
            'nama' => $employee->nama,
            'tambahan' => 50000,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('payroll_employees', [
        'id' => $employee->id,
        'tambahan' => 50000,
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('payroll.employee.update', $employee), [
            'nama' => $employee->nama,
            'tambahan' => '',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('payroll_employees', [
        'id' => $employee->id,
        'tambahan' => 0,
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('payroll.employee.update', $employee), [
            'nama' => $employee->nama,
            'tambahan' => 50000,
        ])
        ->assertRedirect();

    $this->actingAs(User::factory()->create())
        ->put(route('payroll.employee.update', $employee), [
            'nama' => $employee->nama,
            'tambahan' => -1,
        ])
        ->assertSessionHasErrors('tambahan');

    $this->assertDatabaseHas('payroll_employees', [
        'id' => $employee->id,
        'tambahan' => 50000,
    ]);
});

it('shows the additional amount only when it is positive on both slips', function (float $tambahan, bool $isVisible) {
    $employee = createPayrollEmployeeForTambahanTest($tambahan)->load('import');

    foreach (['pdf.slip', 'pdf.overtime'] as $template) {
        $html = view($template, [
            'employee' => $employee,
            'import' => $employee->import,
        ])->render();

        if ($isVisible) {
            expect($html)->toContain('Tambahan')
                ->toContain('Rp 50.000')
                ->toContain('Rp 150.000');
        } else {
            expect($html)->not->toContain('Tambahan')
                ->toContain('Rp 100.000');
        }
    }
})->with([
    'with additional amount' => [50000, true],
    'without additional amount' => [0, false],
]);
