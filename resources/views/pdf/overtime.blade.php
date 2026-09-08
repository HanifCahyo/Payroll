{{-- resources/views/pdf/overtime.blade.php --}}
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Slip Lembur — {{ $employee->nama }} — {{ $employee->import->period }}</title>
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

        /* Financial Data Rows */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .data-table tr td {
            padding: 4.5px 6px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 8.5px;
        }

        .col-name {
            color: #334155;
            font-weight: 600;
        }

        .col-qty {
            text-align: right;
            color: #64748b;
            width: 80px;
        }

        .col-amt {
            text-align: right;
            font-weight: 700;
            color: #0f172a;
            width: 130px;
        }

        /* Subtotal Box */
        .subtotal-row {
            background: #f8fafc;
            border-top: 1.5px solid #cbd5e1 !important;
            font-weight: 700;
        }

        .subtotal-row td {
            padding: 5px 6px !important;
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
                    <div class="badge-title">SLIP LEMBUR KARYAWAN</div>
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

        <!-- Overtime Breakdown Table -->
        <div class="sec-title">RINCIAN UPAH LEMBUR</div>
        <table class="data-table">
            <thead>
                <tr style="background: #f1f5f9; font-weight: 700; color: #475569;">
                    <td style="padding: 4.5px 6px;">Kategori Lembur</td>
                    <td style="text-align: right; padding: 4.5px 6px;">Total Jam</td>
                    <td style="text-align: right; padding: 4.5px 6px;">Subtotal Nominal</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="col-name">Lembur Hari Biasa (LB)</td>
                    <td class="col-qty">{{ $qty($employee->jam_lb) }} Jam</td>
                    <td class="col-amt">{{ $rp($employee->lembur_biasa) }}</td>
                </tr>
                <tr>
                    <td class="col-name">Lembur Hari Libur (LL)</td>
                    <td class="col-qty">{{ $qty($employee->jam_ll) }} Jam</td>
                    <td class="col-amt">{{ $rp($employee->lembur_libur) }}</td>
                </tr>
                <tr class="subtotal-row">
                    <td colspan="2">TOTAL KESELURUHAN UPAH LEMBUR</td>
                    <td class="col-amt" style="color: #047857;">{{ $rp($employee->upah_diterima) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Grand Total Card -->
        <table class="total-card">
            <tr>
                <td>
                    <div class="total-label">JUMLAH LEMBUR YANG DITERIMA</div>
                    <div style="font-size: 7.5px; color: #065f46; margin-top: 1px;">Range Periode:
                        {{ $employee->import->period_range }}
                    </div>
                </td>
                <td class="total-val">
                    {{ $rp($employee->upah_diterima) }}
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