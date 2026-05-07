<?php

namespace App\Http\Controllers;

use App\Models\PayrollImport;
use App\Models\PayrollEmployee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;

class PayrollController extends Controller
{
    private const COL_MAP = [
        'nip' => 'NIP',
        'rekening' => 'Rekening',
        'nama' => 'Nama',
        'bagian' => 'Bagian',
        'upah_nominal' => 'Nominal',
        'upah_hari' => 'Hari',
        'nominal_premi' => 'Nominal Premi',
        'premi' => 'Premi',
        'nominal_ut' => 'Nominal UT',
        'ut' => 'UT',
        'nominal_sumbangan' => 'Nominal Sumbangan',
        'hari_sumbangan' => 'Hari',
        'lembur_biasa' => 'Lembur Biasa',
        'jam_lb' => 'Jam',
        'lembur_libur' => 'Lembur Libur',
        'jam_ll' => 'Jam',
        'total_upah' => 'Total',
        'potongan_kedisiplinan' => 'Potongan Kedisiplinan',
        'hari_potongan' => 'Hari',
        'total_kedisiplinan' => 'TOTAL',
        'sepatu' => 'SEPATU',
        'terlambat' => 'TERLAMBAT',
        'terlambat_menit' => 'Menit',
        'hari_terlambat' => 'HARI',
        'jumlah_potongan_kedisiplinan' => 'Jumlah Potongan',
        'simpanan_wajib' => 'Simpanan Wajib',
        'koperasi' => 'Koperasi',
        'koperasi_ke' => 'Ke',
        'bpjs' => 'BPJS',
        'jumlah_potongan' => 'Jumlah Potongan',
        'upah_diterima' => 'Upah Yang Diterima',
        'email' => 'Email',
    ];

    private const STRING_FIELDS = ['nip', 'rekening', 'nama', 'bagian', 'email'];
    public function index()
    {
        return Inertia::render('Payroll/Index', [
            'imports' => PayrollImport::latest()->withCount('employees')->get(),
        ]);
    }

    public function upload(Request $request)
    {
        ini_set('max_execution_time', 300);
        set_time_limit(300);

        $request->validate([
            'file' => [
                'required',
                'file',
                'max:51200',
                function ($attribute, $value, $fail) {
                    $ext = strtolower($value->getClientOriginalExtension());
                    if (!in_array($ext, ['xlsx', 'xlsm', 'xls'])) {
                        $fail('File harus berformat xlsx, xlsm, atau xls.');
                    }
                },
            ],
            'period' => 'required|string|max:50',
            'period_range' => 'required|string|max:100',
        ]);

        $filePath = $request->file('file')->getPathname();

        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($filePath);

        $sheet = $spreadsheet->getActiveSheet();
        $allRows = $sheet->toArray(
            null,
            true,
            true,
            true
        );

        if (empty($allRows)) {
            return back()->withErrors(['file' => 'File Excel kosong atau tidak terbaca.']);
        }

        $headerRow = $allRows[1] ?? [];
        $nameToLetters = [];
        foreach ($headerRow as $letter => $value) {
            $value = trim((string) ($value ?? ''));
            if ($value !== '') {
                $nameToLetters[$value][] = $letter;
            }
        }

        $fieldToLetter = $this->resolveColumnLetters($nameToLetters);

        foreach (['nip', 'nama', 'email', 'upah_diterima'] as $required) {
            if (!isset($fieldToLetter[$required])) {
                return back()->withErrors([
                    'file' => "Kolom '{$required}' tidak ditemukan di file Excel. Pastikan format file sudah benar."
                ]);
            }
        }

        $dataRows = [];
        $namaLetter = $fieldToLetter['nama'];

        foreach ($allRows as $rowIndex => $row) {
            if ($rowIndex === 1)
                continue;

            $namaVal = trim((string) ($row[$namaLetter] ?? ''));
            if ($namaVal === '')
                continue;

            $dataRows[$rowIndex] = $row;
        }

        $totalRows = count($dataRows);

        if ($totalRows === 0) {
            return back()->withErrors(['file' => 'Tidak ada data karyawan yang ditemukan di file.']);
        }


        $import = PayrollImport::create([
            'file_name' => $request->file('file')->getClientOriginalName(),
            'period' => strtoupper(trim($request->period)),
            'period_range' => trim($request->period_range),
            'total_rows' => $totalRows,
            'status' => 'ready',
        ]);

        $batch = [];
        $rowNum = 0;

        foreach ($dataRows as $row) {
            $rowNum++;
            $record = [
                'payroll_import_id' => $import->id,
                'row_number' => $rowNum,
            ];

            foreach (self::COL_MAP as $field => $colName) {
                $letter = $fieldToLetter[$field] ?? null;
                $value = $letter ? ($row[$letter] ?? null) : null;

                if (in_array($field, self::STRING_FIELDS)) {
                    $record[$field] = trim((string) ($value ?? ''));
                } else {
                    $record[$field] = $this->toFloat($value);
                }
            }

            $batch[] = $record;

            if (count($batch) >= 100) {
                PayrollEmployee::insert($batch);
                $batch = [];
            }
        }

        if (!empty($batch)) {
            PayrollEmployee::insert($batch);
        }
        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet, $allRows, $dataRows);

        return redirect()->route('payroll.detail', $import->id)
            ->with('success', "Berhasil import {$totalRows} karyawan.");
    }

    private function resolveColumnLetters(array $nameToLetters): array
    {
        $usedCount = [];
        $result = [];

        foreach (self::COL_MAP as $field => $colName) {
            $idx = $usedCount[$colName] ?? 0;
            $usedCount[$colName] = $idx + 1;

            $letters = $nameToLetters[$colName] ?? [];
            if (isset($letters[$idx])) {
                $result[$field] = $letters[$idx];
            }
        }

        return $result;
    }


    private function toFloat(mixed $value): float
    {
        if ($value === null || $value === '')
            return 0.0;
        if (is_int($value) || is_float($value))
            return (float) $value;

        $str = trim((string) $value);
        if ($str === '')
            return 0.0;

        // Format Indonesia: titik ribuan + koma desimal → "1.500,75"
        if (str_contains($str, '.') && str_contains($str, ',')) {
            $str = str_replace('.', '', $str);  // hapus titik ribuan
            $str = str_replace(',', '.', $str); // ganti koma → titik desimal
        }
        // Hanya koma tanpa titik → "3,0" atau "500,00"
        elseif (str_contains($str, ',') && !str_contains($str, '.')) {
            $str = str_replace(',', '.', $str);
        }
        // Hanya titik atau angka biasa → biarkan

        return is_numeric($str) ? (float) $str : 0.0;
    }

    public function detail(PayrollImport $import)
    {
        return Inertia::render('Payroll/Detail', [
            'import' => $import,
            'employees' => $import->employees()->orderBy('row_number')->get(),
        ]);
    }

    public function exportPdf(PayrollEmployee $employee)
    {
        $pdf = Pdf::loadView('pdf.slip', [
            'employee' => $employee,
            'import' => $employee->import,
        ])->setPaper('a4', 'portrait');

        $filename = "SlipGaji_{$employee->nip}_{$employee->import->period}.pdf";
        return $pdf->download($filename);
    }

    public static function generateAndStorePdf(PayrollEmployee $employee): string
    {
        $pdf = Pdf::loadView('pdf.slip', [
            'employee' => $employee,
            'import' => $employee->import,
        ])->setPaper('a4', 'portrait');

        $path = "payroll/slip_{$employee->id}_{$employee->nip}.pdf";
        Storage::put($path, $pdf->output());
        $employee->update(['pdf_path' => $path]);

        return $path;
    }
}
