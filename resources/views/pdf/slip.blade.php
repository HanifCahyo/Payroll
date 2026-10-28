{{-- resources/views/pdf/slip.blade.php --}}
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Slip Gaji — {{ $employee->nama }} — {{ $employee->import->period }}</title>
    <style>
        @page {
            margin: 10mm 12mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            font-size: 9px;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.3;
        }

        .container {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 14px 18px;
            background: #ffffff;
            position: relative;
        }

        /* Top Emerald Accent Bar */
        .top-bar {
            height: 4px;
            background: #059669;
            border-radius: 10px 10px 0 0;
            margin: -14px -18px 12px -18px;
        }

        /* Header Layout */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .header-table td {
            vertical-align: middle;
        }

        .company-name {
            font-size: 16px;
            font-weight: 700;
            color: #064e3b;
            letter-spacing: 0.02em;
        }

        .company-sub {
            font-size: 8px;
            color: #64748b;
            margin-top: 1px;
        }

        .doc-badge {
            text-align: right;
        }

        .badge-title {
            display: inline-block;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #047857;
            font-size: 9.5px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 16px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .badge-period {
            font-size: 8px;
            color: #64748b;
            margin-top: 3px;
            text-align: right;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 8px 0 10px;
        }

        /* Employee Meta Card */
        .meta-box {
            width: 100%;
            border-collapse: collapse;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 10px;
        }

        .meta-box td {
            padding: 5px 10px;
            font-size: 8.5px;
        }

        .meta-label {
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 7.5px;
            letter-spacing: 0.04em;
        }

        .meta-value {
            color: #0f172a;
            font-weight: 700;
            font-size: 9px;
        }

        /* Main Content Columns */
        .columns-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .columns-table>tbody>tr>td {
            width: 50%;
            vertical-align: top;
        }

        .column-left {
            padding-right: 6px;
        }

        .column-right {
            padding-left: 6px;
        }

        /* Section Table Header */
        .sec-title {
            background: #047857;
            color: #ffffff;
            font-size: 8.5px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 6px;
        }

        .sec-title.deduction {
            background: #475569;
        }

        /* Financial Data Rows */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table tr td {
            padding: 3.5px 4px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 8.5px;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .col-name {
            color: #334155;
            font-weight: 500;
        }

        .col-qty {
            text-align: right;
            color: #64748b;
            width: 35px;
        }

        .col-amt {
            text-align: right;
            font-weight: 600;
            color: #0f172a;
        }

        /* Subtotal Box */
        .subtotal-row {
            background: #f8fafc;
            border-top: 1.5px solid #cbd5e1 !important;
            font-weight: 700;
        }

        .subtotal-row td {
            padding: 4.5px 4px !important;
            color: #0f172a !important;
        }

        /* Grand Total Card */
        .total-card {
            width: 100%;
            border-collapse: collapse;
            background: #ecfdf5;
            border: 1.5px solid #a7f3d0;
            border-radius: 6px;
            margin-top: 8px;
            margin-bottom: 10px;
        }

        .total-card td {
            padding: 8px 12px;
            vertical-align: middle;
        }

        .total-label {
            font-size: 9px;
            font-weight: 700;
            color: #065f46;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .total-val {
            text-align: right;
            font-size: 14px;
            font-weight: 700;
            color: #047857;
        }

        /* Footer & Signatures */
        .footer-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        .footer-table td {
            vertical-align: bottom;
            font-size: 8.5px;
        }

        .signature-box {
            text-align: right;
            color: #334155;
        }

        .sign-title {
            font-size: 8px;
            color: #64748b;
        }

        .sign-company {
            font-weight: 600;
            color: #0f172a;
            margin-top: 2px;
            margin-bottom: 25px;
        }

        .sign-name {
            font-weight: 700;
            color: #047857;
        }
    </style>
</head>

<body>
    @php
        $rp = fn($v) => 'Rp ' . number_format((float) $v, 0, ',', '.');
        $n = fn($v) => $v > 0 ? 'Rp ' . number_format((float) $v, 0, ',', '.') : '-';
        $qty = fn($v) => rtrim(rtrim(number_format((float) $v, 1, ',', ''), '0'), ',') ?: '0';
    @endphp

    <div class="container">
        <div class="top-bar"></div>

        <div
            style="text-align: center; font-size: 8px; font-weight: 700; color: #064e3b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
            ATAS BERKAT ROHMAT ALLOH YANG MAHA KUASA
        </div>

        <!-- Header -->
        <table class="header-table">
            <tr>
                <td>
                    <div class="company-name">PT. GADING GADJAH MADA</div>
                    <div class="company-sub">Jl. Albisindo Raya No. 9, Gebog, Kudus, Jawa Tengah 59333</div>
                </td>
                <td class="doc-badge">
                    <div class="badge-title">SLIP GAJI KARYAWAN</div>
                    <div class="badge-period">Periode: {{ $employee->import->period }}</div>
                </td>
            </tr>
        </table>

        <div class="divider"></div>

        <!-- Employee Info Grid -->
        <table class="meta-box">
            <tr>
                <td style="width: 25%;">
                    <div class="meta-label">Nama Karyawan</div>
                    <div class="meta-value">{{ strtoupper($employee->nama) }}</div>
                </td>
                <td style="width: 25%;">
                    <div class="meta-label">NIP</div>
                    <div class="meta-value">{{ $employee->nip_baru ?: $employee->nip }}</div>
                </td>
                <td style="width: 25%;">
                    <div class="meta-label">Bagian / Departemen</div>
                    <div class="meta-value">{{ strtoupper($employee->bagian) }}</div>
                </td>
                <td style="width: 25%;">
                    <div class="meta-label">No. Rekening</div>
                    <div class="meta-value">{{ $employee->rekening ?: '-' }}</div>
                </td>
            </tr>
        </table>

        <!-- Two Column Financial Breakdown -->
        <table class="columns-table">
            <tr>
                <td class="column-left">
                    <div class="sec-title">1. Penerimaan & Upah</div>
                    <table class="data-table">
                        <tr>
                            <td class="col-name">Upah Harian</td>
                            <td class="col-qty">{{ $qty($employee->upah_hari) }} hr</td>
                            <td class="col-amt">{{ $rp($employee->upah_nominal) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Premi Hadir</td>
                            <td class="col-qty">{{ $qty($employee->premi) }} hr</td>
                            <td class="col-amt">{{ $rp($employee->nominal_premi) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Upah Tunggu</td>
                            <td class="col-qty">{{ $qty($employee->ut) }} hr</td>
                            <td class="col-amt">{{ $rp($employee->nominal_ut) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Sumbangan</td>
                            <td class="col-qty">{{ $qty($employee->hari_sumbangan) }} hr</td>
                            <td class="col-amt">{{ $rp($employee->nominal_sumbangan) }}</td>
                        </tr>
                        @if ($employee->tambahan > 0)
                            <tr>
                                <td class="col-name">Tambahan</td>
                                <td class="col-qty"></td>
                                <td class="col-amt">{{ $rp($employee->tambahan) }}</td>
                            </tr>
                        @endif
                        <tr class="subtotal-row">
                            <td colspan="2">TOTAL PENERIMAAN</td>
                            <td class="col-amt" style="color: #047857;">
                                {{ $rp((float) $employee->total_upah + (float) $employee->tambahan) }}
                            </td>
                        </tr>
                    </table>
                </td>

                <td class="column-right">
                    <div class="sec-title deduction">2. Potongan</div>
                    <table class="data-table">
                        <tr>
                            <td class="col-name">Kedisiplinan</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->total_kedisiplinan) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Keterlambatan ({{ $qty($employee->terlambat_menit) }} mnt)</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->jumlah_potongan_kedisiplinan) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Sepatu / Potong Rambut</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->sepatu) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Simpanan Wajib</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->simpanan_wajib) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">Koperasi (Ke-{{ (int) $employee->koperasi_ke ?: '-' }})</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->koperasi) }}</td>
                        </tr>
                        <tr>
                            <td class="col-name">BPJS Kesehatan / TK</td>
                            <td class="col-amt" colspan="2">{{ $n($employee->bpjs) }}</td>
                        </tr>
                        <tr class="subtotal-row">
                            <td colspan="2">TOTAL POTONGAN</td>
                            <td class="col-amt" style="color: #e11d48;">{{ $rp($employee->jumlah_potongan) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Grand Total Card -->
        <table class="total-card">
            <tr>
                <td>
                    <div class="total-label">TOTAL UPAH DITERIMA</div>
                    <div style="font-size: 7.5px; color: #047857; margin-top: 1px;">Range:
                        {{ $employee->import->period_range }}
                    </div>
                </td>
                <td class="total-val">
                    {{ $rp((float) $employee->upah_diterima + (float) $employee->tambahan) }}
                </td>
            </tr>
        </table>

        <!-- Footer & Signatures -->
        <table class="footer-table">
            <tr>
                <td class="signature-box">
                    <div class="sign-title">Kudus, {{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM YYYY') }}
                    </div>
                    <div class="sign-company">Tertanda,</div>
                    <div class="sign-name">HRD Gading Gadjah Mada</div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>