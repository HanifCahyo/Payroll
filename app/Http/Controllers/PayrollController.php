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
    /**
     * Mapping field DB => nama kolom ASLI di Excel (sheet SLIP GAJI).
     * Urutan PENTING — untuk resolve kolom duplikat (Hari, Jam, Jumlah Potongan).
     *
     * Verified dari file: Lembur_Harian_M-17__20_-_26_April_2026_.xlsm
     *
     * Kolom di Excel:
     *   B=No  C=NIP  D=Rekening  E=Nama  F=Bagian
     *   G=Nominal  H=Hari(1)  I=Nominal Premi  J=Premi
     *   K=Nominal UT  L=UT  M=Nominal Sumbangan  N=Hari(2)
     *   O=Lembur Biasa  P=Jam(1)  Q=Lembur Libur  R=Jam(2)
     *   S=Total  T=Potongan Kedisiplinan  U=Hari(3)  V=TOTAL
     *   W=SEPATU  X=TERLAMBAT  Y=Menit  Z=HARI
     *   AA=Jumlah Potongan(1)  AB=Simpanan Wajib  AC=Koperasi
     *   AD=Ke  AE=BPJS  AF=Jumlah Potongan(2)
     *   AG=Upah Yang Diterima  AH=Email
     */
    private const COL_MAP = [
        'nip' => 'NIP',
        'rekening' => 'Rekening',
        'nama' => 'Nama',
        'bagian' => 'Bagian',
        'upah_nominal' => 'Nominal',
        'upah_hari' => 'Hari',              // H (ke-1)
        'nominal_premi' => 'Nominal Premi',
        'premi' => 'Premi',
        'nominal_ut' => 'Nominal UT',
        'ut' => 'UT',
        'nominal_sumbangan' => 'Nominal Sumbangan',
        'hari_sumbangan' => 'Hari',              // N (ke-2)
        'lembur_biasa' => 'Lembur Biasa',
        'jam_lb' => 'Jam',               // P (ke-1)
        'lembur_libur' => 'Lembur Libur',
        'jam_ll' => 'Jam',               // R (ke-2)
        'total_upah' => 'Total',
        'potongan_kedisiplinan' => 'Potongan Kedisiplinan',
        'hari_potongan' => 'Hari',              // U (ke-3)
        'total_kedisiplinan' => 'TOTAL',
        'sepatu' => 'SEPATU',
        'terlambat' => 'TERLAMBAT',
        'terlambat_menit' => 'Menit',
        'hari_terlambat' => 'HARI',
        'jumlah_potongan_kedisiplinan' => 'Jumlah Potongan',   // AA (ke-1)
        'simpanan_wajib' => 'Simpanan Wajib',
        'koperasi' => 'Koperasi',
        'koperasi_ke' => 'Ke',
        'bpjs' => 'BPJS',
        'jumlah_potongan' => 'Jumlah Potongan',   // AF (ke-2)
        'upah_diterima' => 'Upah Yang Diterima',
        'email' => 'Email',
    ];



    private const STRING_FIELDS = ['nip', 'rekening', 'nama', 'bagian', 'email'];

    // ─────────────────────────────────────────────────────────────────
    //  INDEX
    // ─────────────────────────────────────────────────────────────────

    public function index()
    {
        return Inertia::render('Payroll/Index', [
            'imports' => PayrollImport::latest()->withCount('employees')->get(),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────
    //  UPLOAD
    // ─────────────────────────────────────────────────────────────────

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

        /**
         * Kenapa data_only=true cukup dan tidak perlu formula resolver?
         *
         * File .xlsm ini punya formula cross-sheet seperti =SECURITY!A2
         * dan =LOWER(SECURITY!AX2). Ketika file dibuka dan disimpan di Excel,
         * Excel menyimpan CACHED VALUE hasil kalkulasi terakhir di dalam file.
         *
         * openpyxl dengan data_only=True membaca cached value tersebut —
         * bukan formula string-nya. Jadi nilai yang kita baca sudah final
         * tanpa perlu evaluasi apapun.
         *
         * Tidak ada timeout karena tidak ada kalkulasi formula.
         */
        $reader = new XlsxReader();
        $reader->setReadDataOnly(true);   // baca cached value, SKIP kalkulasi
        $spreadsheet = $reader->load($filePath);

        $sheet = $spreadsheet->getActiveSheet();

        // Baca semua baris sekaligus, key = huruf kolom (A, B, C...)
        // calculateFormulas=false karena data_only sudah handle ini
        $allRows = $sheet->toArray(
            null,   // nullValue untuk sel kosong
            true,  // calculateFormulas = FALSE
            true,   // formatData
            true    // returnCellRef = TRUE (key = huruf kolom)
        );

        if (empty($allRows)) {
            return back()->withErrors(['file' => 'File Excel kosong atau tidak terbaca.']);
        }

        // ── Build header map ──
        // nameToLetters: ['NIP' => ['C'], 'Hari' => ['H','N','U'], ...]
        $headerRow = $allRows[1] ?? [];
        $nameToLetters = [];
        foreach ($headerRow as $letter => $value) {
            $value = trim((string) ($value ?? ''));
            if ($value !== '') {
                $nameToLetters[$value][] = $letter;
            }
        }

        // Resolve field → kolom letter, handle duplikat berdasarkan urutan COL_MAP
        $fieldToLetter = $this->resolveColumnLetters($nameToLetters);

        // Validasi: pastikan kolom krusial ditemukan
        foreach (['nip', 'nama', 'email', 'upah_diterima'] as $required) {
            if (!isset($fieldToLetter[$required])) {
                return back()->withErrors([
                    'file' => "Kolom '{$required}' tidak ditemukan di file Excel. Pastikan format file sudah benar."
                ]);
            }
        }

        // ── Kumpulkan baris data valid (skip header & baris nama kosong) ──
        $dataRows = [];
        $namaLetter = $fieldToLetter['nama'];

        foreach ($allRows as $rowIndex => $row) {
            if ($rowIndex === 1)
                continue; // skip header row

            $namaVal = trim((string) ($row[$namaLetter] ?? ''));
            if ($namaVal === '')
                continue; // skip baris kosong

            $dataRows[$rowIndex] = $row;
        }

        $totalRows = count($dataRows);

        if ($totalRows === 0) {
            return back()->withErrors(['file' => 'Tidak ada data karyawan yang ditemukan di file.']);
        }

        // ── Buat record import ──
        $import = PayrollImport::create([
            'file_name' => $request->file('file')->getClientOriginalName(),
            'period' => strtoupper(trim($request->period)),
            'period_range' => trim($request->period_range),
            'total_rows' => $totalRows,
            'status' => 'ready',
        ]);

        // ── Parse & bulk insert per 100 baris ──
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

        // Cleanup memory
        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet, $allRows, $dataRows);

        return redirect()->route('payroll.detail', $import->id)
            ->with('success', "Berhasil import {$totalRows} karyawan.");
    }

    // ─────────────────────────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────────────────────────

    /**
     * Resolve kolom duplikat berdasarkan urutan kemunculan di COL_MAP.
     *
     * Contoh: 'Hari' muncul di kolom H, N, U di Excel:
     *   upah_hari      → H (kemunculan ke-1)
     *   hari_sumbangan → N (ke-2)
     *   hari_potongan  → U (ke-3)
     *
     * 'Jam' muncul di P, R:
     *   jam_lb → P (ke-1)
     *   jam_ll → R (ke-2)
     *
     * 'Jumlah Potongan' muncul di AA, AF:
     *   jumlah_potongan_kedisiplinan → AA (ke-1)
     *   jumlah_potongan              → AF (ke-2)
     */
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

    /**
     * Convert berbagai format nilai ke float.
     * Handle format angka Indonesia: "1.500,75" → 1500.75
     *                                "3,0"      → 3.0
     *                                1500       → 1500.0
     */
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

    // ─────────────────────────────────────────────────────────────────
    //  DETAIL
    // ─────────────────────────────────────────────────────────────────

    public function detail(PayrollImport $import)
    {
        return Inertia::render('Payroll/Detail', [
            'import' => $import,
            'employees' => $import->employees()->orderBy('row_number')->get(),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────
    //  PDF
    // ─────────────────────────────────────────────────────────────────

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
