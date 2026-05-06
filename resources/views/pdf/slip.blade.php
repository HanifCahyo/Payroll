{{-- resources/views/pdf/slip.blade.php --}}
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 18mm 18mm 18mm 18mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 10px;
            color: #000;
        }

        .top-note {
            text-align: center;
            font-size: 9px;
            color: #555;
            margin-bottom: 6px;
        }

        .company {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }

        .address {
            text-align: center;
            font-size: 9px;
            color: #444;
        }

        hr.thick {
            border: none;
            border-top: 2px solid #000;
            margin: 7px 0;
        }

        hr.thin {
            border: none;
            border-top: 1px solid #ccc;
            margin: 5px 0;
        }

        .date-line {
            text-align: right;
            font-size: 9px;
            margin: 8px 0 12px;
        }

        .info {
            width: 100%;
            margin-bottom: 14px;
            border-collapse: collapse;
        }

        .info td {
            padding: 2px 0;
            font-size: 10px;
        }

        .info .lbl {
            width: 80px;
            font-weight: 700;
        }

        .info .sep {
            width: 14px;
        }

        /* Two-column salary layout */
        .cols {
            width: 100%;
            border-collapse: collapse;
        }

        .cols td {
            vertical-align: top;
            width: 50%;
            padding: 0;
        }

        .cols td:first-child {
            padding-right: 8px;
            border-right: 1px solid #bbb;
        }

        .cols td:last-child {
            padding-left: 8px;
        }

        .sec-head {
            background: #ddd;
            text-align: center;
            font-weight: 700;
            padding: 4px;
            font-size: 10px;
            margin-bottom: 5px;
        }

        .srow {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
        }

        .srow td {
            font-size: 9.5px;
            padding: 2px 1px;
            border-bottom: 1px dotted #ddd;
        }

        .srow .lbl {
            width: 90px;
        }

        .srow .sep {
            width: 8px;
            text-align: center;
        }

        .srow .qty {
            width: 22px;
            text-align: right;
        }

        .srow .x {
            width: 10px;
            text-align: center;
        }

        .srow .amt {
            text-align: right;
        }

        .subtotal {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        .subtotal td {
            font-size: 10px;
            font-weight: 700;
            padding: 4px 1px;
            border-top: 1.5px solid #000;
        }

        .subtotal .amt {
            text-align: right;
        }

        .grand {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }

        .grand td {
            font-size: 11px;
            font-weight: 700;
            padding: 7px 10px;
            background: #f0f0f0;
            border: 1px solid #ccc;
        }

        .grand .amt {
            text-align: right;
        }

        .sign {
            text-align: right;
            margin-top: 28px;
            font-size: 9.5px;
        }
    </style>
</head>

<body>
    @php
        $rp = fn($v) => 'Rp ' . number_format((float) $v, 2, ',', '.');
        $n = fn($v) => $v > 0 ? number_format((float) $v, 2, ',', '.') : '-';
        $qty = fn($v) => rtrim(rtrim(number_format((float) $v, 1, ',', ''), '0'), ',') ?: '0';
    @endphp

    <p class="top-note">ATAS BERKAT RAHMAT ALLOH YANG MAHA KUASA</p>
    <hr class="thick">
    <p class="company">PT. GADING GADJAH MADA</p>
    <p class="address">Jl. Albisindo Raya No. 9, Gebog, Kudus, Jawa Tengah, Kode Pos 59333</p>
    <hr class="thick">
    <hr class="thin">
    <p class="date-line">{{ \Carbon\Carbon::now()->locale('id')->isoFormat('D MMMM YYYY') }}</p>

    <table class="info">
        <tr>
            <td class="lbl">NO MESIN</td>
            <td class="sep">:</td>
            <td>{{ $employee->nip }}</td>
        </tr>
        <tr>
            <td class="lbl">REKENING</td>
            <td class="sep">:</td>
            <td>{{ $employee->rekening ?: '-' }}</td>
        </tr>
        <tr>
            <td class="lbl">NAMA</td>
            <td class="sep">:</td>
            <td><strong>{{ strtoupper($employee->nama) }}</strong></td>
        </tr>
        <tr>
            <td class="lbl">BAGIAN</td>
            <td class="sep">:</td>
            <td><strong>{{ strtoupper($employee->bagian) }}</strong></td>
        </tr>
    </table>

    <table class="cols">
        <tr>
            {{-- UPAH --}}
            <td>
                <div class="sec-head">UPAH</div>
                @foreach ([['Upah Harian', $employee->upah_hari, $employee->upah_nominal], ['Premi', $employee->premi, $employee->nominal_premi], ['Upah Tunggu', $employee->ut, $employee->nominal_ut], ['Sumbangan', $employee->hari_sumbangan, $employee->nominal_sumbangan], ['Lembur Biasa', $employee->jam_lb, $employee->lembur_biasa], ['Lembur Libur', $employee->jam_ll, $employee->lembur_libur]] as [$label, $jumlah, $nominal])
                    <table class="srow">
                        <tr>
                            <td class="lbl">{{ $label }}</td>
                            <td class="sep">:</td>
                            <td class="qty">{{ $qty($jumlah) }}</td>
                            <td class="x">X</td>
                            <td class="amt">{{ $rp($nominal) }}</td>
                        </tr>
                    </table>
                @endforeach
                <table class="subtotal">
                    <tr>
                        <td>Jumlah Upah</td>
                        <td class="amt">Rp {{ number_format($employee->total_upah, 2, ',', '.') }}</td>
                    </tr>
                </table>
            </td>

            {{-- POTONGAN --}}
            <td>
                <div class="sec-head">POTONGAN</div>
                @foreach ([['Kedisiplinan', null, $employee->jumlah_potongan_kedisiplinan], ['Keterlambatan ' . $qty($employee->terlambat_menit) . ' Menit', null, $employee->terlambat], ['Sepatu / Potong Rambut', null, $employee->sepatu], ['Simpanan Wajib', null, $employee->simpanan_wajib], ['Agsuran Koperasi Ke-' . ((int) $employee->koperasi_ke ?: '-'), null, $employee->koperasi], ['BPJS', null, $employee->bpjs]] as [$label, $_, $nominal])
                    <table class="srow">
                        <tr>
                            <td class="lbl">{{ $label }}</td>
                            <td class="sep">:</td>
                            <td class="amt" colspan="3">Rp {{ $n($nominal) }}</td>
                        </tr>
                    </table>
                @endforeach
                <table class="subtotal">
                    <tr>
                        <td>Jumlah Potongan</td>
                        <td class="amt">Rp {{ $n($employee->jumlah_potongan) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="grand">
        <tr>
            <td>Upah yang diterima</td>
            <td class="amt">Rp {{ number_format($employee->upah_diterima, 2, ',', '.') }}</td>
        </tr>
    </table>

    <div class="sign">
        <p>HRD PT. Gading Gadjah Mada</p>
    </div>
</body>

</html>
