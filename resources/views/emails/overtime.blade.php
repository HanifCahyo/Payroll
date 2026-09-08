<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slip Lembur — PT. Gading Gadjah Mada</title>
</head>

<body
    style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color: #f1f5f9; padding: 20px 10px;">
        <tr>
            <td align="center">
                <!-- Main Email Card -->
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                    style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);">

                    <!-- Factory Slogan Banner Bar -->
                    <tr>
                        <td
                            style="background-color: #ecfdf5; border-bottom: 1px solid #a7f3d0; padding: 6px 16px; text-align: center;">
                            <p
                                style="margin: 0; font-size: 11px; font-weight: 700; color: #065f46; letter-spacing: 0.08em; text-transform: uppercase;">
                                ATAS BERKAT ROHMAT ALLOH YANG MAHA KUASA
                            </p>
                        </td>
                    </tr>

                    <!-- Top Emerald Header Banner -->
                    <tr>
                        <td
                            style="background: linear-gradient(135deg, #064e3b 0%, #047857 100%); padding: 18px 24px; color: #ffffff;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <p
                                            style="margin: 2px 0 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">
                                            PT. GADING GADJAH MADA
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 20px 24px;">
                            <!-- Greeting & Employee Info -->
                            <p style="margin: 0 0 4px; font-size: 13px; color: #64748b;">Kepada Yth.</p>
                            <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0f172a;">
                                {{ $employee->nama }}
                            </p>
                            <p style="margin: 0 0 14px; font-size: 12.5px; color: #475569;">
                                NIP : <span
                                    style="font-weight: 600; color: #047857;">{{ $employee->nip_baru ?: $employee->nip }}</span>
                                &bull; Bagian: <span
                                    style="font-weight: 600; color: #0f172a;">{{ $employee->bagian }}</span>
                            </p>

                            <!-- Document Description -->
                            <p style="margin: 0 0 12px; font-size: 13.5px; line-height: 1.5; color: #334155;">
                                Bersama email ini kami sampaikan dokumen resmi <strong>Slip Lembur Karyawan</strong>
                                untuk periode <strong>{{ $employee->import->period }}</strong>.
                            </p>

                            <!-- Summary Details Box -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                                style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 14px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 8px 14px; border-bottom: 1px dashed #e2e8f0;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0"
                                            cellpadding="0">
                                            <tr>
                                                <td style="font-size: 12.5px; color: #64748b;">Jenis Dokumen</td>
                                                <td align="right"
                                                    style="font-size: 12.5px; font-weight: 700; color: #047857;">Slip
                                                    Lembur Karyawan</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 14px; border-bottom: 1px dashed #e2e8f0;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0"
                                            cellpadding="0">
                                            <tr>
                                                <td style="font-size: 12.5px; color: #64748b;">Periode Pembayaran</td>
                                                <td align="right"
                                                    style="font-size: 12.5px; font-weight: 700; color: #0f172a;">
                                                    {{ $employee->import->period }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 14px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0"
                                            cellpadding="0">
                                            <tr>
                                                <td style="font-size: 12.5px; color: #64748b;">Rentang Waktu Kerja</td>
                                                <td align="right"
                                                    style="font-size: 12.5px; font-weight: 600; color: #334155;">
                                                    {{ $employee->import->period_range }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Confidentiality & Complaint Callout -->
                            <div
                                style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px;">
                                <p style="margin: 0 0 4px; font-size: 12px; line-height: 1.4; color: #065f46;">
                                    Slip bersifat rahasia, mohon disimpan dengan aman.
                                </p>
                                <p style="margin: 0; font-size: 12px; line-height: 1.4; color: #047857;">
                                    Apabila ada pertanyaan,ketidaksesuaian data, atau komplain mengenai rincian ini,
                                    silakan hubungi HRD di nomor <strong>081337649261</strong> maksimal <strong>1x24
                                        jam</strong> setelah email diterima, dengan menyebutkan <strong>Nama,
                                        NIP, dan Bagian/Departemen</strong> Anda.
                                </p>
                            </div>

                            <!-- Closing -->
                            <p style="margin: 0 0 12px; font-size: 13px; color: #334155;">
                                Demikian pemberitahuan ini disampaikan. Atas perhatian dan dedikasi Anda, kami ucapkan
                                terima kasih.
                            </p>

                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"
                                style="margin-top: 14px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-size: 12px; color: #64748b;">Hormat kami,</p>
                                        <p
                                            style="margin: 2px 0 0; font-size: 13.5px; font-weight: 700; color: #047857;">
                                            HRD Gading Gadjah Mada</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Corporate Footer -->
                    <tr>
                        <td
                            style="background-color: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0; font-size: 10.5px; color: #94a3b8; line-height: 1.4;">
                                Jl. Albisindo Raya No. 9, Gebog, Kudus, Jawa Tengah 59333 &bull; System-Generated Email
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>