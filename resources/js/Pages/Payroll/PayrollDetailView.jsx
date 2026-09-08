import PayrollSectionTabs from "@/Components/PayrollSectionTabs";
import EmptyState from "@/Components/EmptyState";
import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    Ban,
    CheckCircle2,
    Download,
    Info,
    Mail,
    MailCheck,
    Pencil,
    Play,
    Send,
    ShieldCheck,
    Trash2,
    UserX,
    X,
} from "lucide-react";

const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(Number(value ?? 0));

export default function PayrollDetailView({
    auth,
    import: imp,
    employees,
    pendingJobsCount = 0,
    mode = "salary",
}) {
    const { flash: serverFlash } = usePage().props;

    const [bulkFrom, setBulkFrom] = useState(1);
    const [bulkTo, setBulkTo] = useState(imp.total_rows);
    const [sending, setSending] = useState(false);
    const [processingQueue, setProcessingQueue] = useState(false);
    const [cancelingQueue, setCancelingQueue] = useState(false);
    const [localFlash, setLocalFlash] = useState(null);

    const [editingEmployee, setEditingEmployee] = useState(null);

    const handleRunQueueWorker = () => {
        setProcessingQueue(true);
        router.post(
            route("payroll.process-queue"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingQueue(false),
            },
        );
    };

    const handleCancelQueue = () => {
        if (
            !confirm(
                `Apakah Anda yakin ingin membatalkan & menghapus ${pendingJobsCount} antrean email yang belum terkirim?`,
            )
        )
            return;

        setCancelingQueue(true);
        router.post(
            route("payroll.cancel-queue"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setCancelingQueue(false),
            },
        );
    };

    const isOvertime = mode === "overtime";
    const backHref = isOvertime
        ? route("payroll.overtime.index")
        : route("payroll.index");
    const singleRoute = isOvertime
        ? "payroll.email.overtime.one"
        : "payroll.email.one";
    const bulkRoute = isOvertime
        ? "payroll.email.overtime.bulk"
        : "payroll.email.bulk";
    const pdfRoute = isOvertime ? "payroll.pdf.overtime" : "payroll.pdf";
    const label = isOvertime ? "lembur" : "gaji";

    const notify = (msg, type = "success") => {
        setLocalFlash({ msg, type });
        setTimeout(() => setLocalFlash(null), 4000);
    };

    const {
        data: editData,
        setData: setEditData,
        put: putEdit,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        nip_baru: "",
        nip: "",
        rekening: "",
        nama: "",
        bagian: "",
        email: "",
        total_upah: 0,
        jumlah_potongan: 0,
        upah_diterima: 0,
    });

    const openEditModal = (emp) => {
        setEditingEmployee(emp);
        setEditData({
            nip_baru: emp.nip_baru ?? "",
            nip: emp.nip ?? "",
            rekening: emp.rekening ?? "",
            nama: emp.nama ?? "",
            bagian: emp.bagian ?? "",
            email: emp.email ?? "",
            total_upah: emp.total_upah ?? 0,
            jumlah_potongan: emp.jumlah_potongan ?? 0,
            upah_diterima: emp.upah_diterima ?? 0,
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingEmployee) return;

        putEdit(route("payroll.employee.update", editingEmployee.id), {
            preserveScroll: true,
            onSuccess: () => {
                notify(`Data karyawan '${editData.nama}' berhasil diperbarui.`);
                setEditingEmployee(null);
            },
            onError: () => notify("Gagal memperbarui data karyawan.", "error"),
        });
    };

    const handleDeleteEmployee = (emp) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus data karyawan "${emp.nama}" (NIP BARU: ${emp.nip_baru || emp.nip || "—"})?\n\nTindakan ini akan menghapus karyawan dari batch ini.`,
            )
        ) {
            router.delete(route("payroll.employee.destroy", emp.id), {
                preserveScroll: true,
                onSuccess: () =>
                    notify(`Data karyawan '${emp.nama}' berhasil dihapus.`),
                onError: () =>
                    notify("Gagal menghapus data karyawan.", "error"),
            });
        }
    };

    const handleSendOne = (employee) => {
        if (!employee.email || !employee.email.trim()) {
            return notify(
                "Email karyawan ini kosong. Harap lengkapi email terlebih dahulu.",
                "error",
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(employee.email.trim())) {
            return notify(
                `Format email "${employee.email}" tidak valid. Silakan edit data karyawan terlebih dahulu.`,
                "error",
            );
        }

        if (!confirm(`Kirim slip ${label} ke ${employee.email}?`)) return;

        router.post(
            route(singleRoute, employee.id),
            {},
            {
                preserveScroll: true,
                onError: () =>
                    notify(
                        "Terjadi kesalahan sistem saat mengirim email.",
                        "error",
                    ),
            },
        );
    };

    const handleBulk = () => {
        if (
            !bulkFrom ||
            !bulkTo ||
            bulkFrom < 1 ||
            bulkTo < bulkFrom ||
            bulkFrom > imp.total_rows
        ) {
            return notify(
                `Rentang baris harus di antara 1 s/d ${imp.total_rows}.`,
                "error",
            );
        }

        if (!confirm(`Kirim slip ${label} baris ${bulkFrom} - ${bulkTo}?`))
            return;

        setSending(true);
        router.post(
            route(bulkRoute, imp.id),
            { from: bulkFrom, to: bulkTo },
            {
                preserveScroll: true,
                onError: () =>
                    notify("Gagal dispatch job pengiriman email.", "error"),
                onFinish: () => setSending(false),
            },
        );
    };

    const activeError =
        serverFlash?.error ||
        (localFlash?.type === "error" ? localFlash.msg : null);
    const activeSuccess =
        serverFlash?.success ||
        (localFlash?.type === "success" ? localFlash.msg : null);
    const activeInfo = serverFlash?.info;

    return (
        <div className="space-y-6">
            <Head
                title={`Slip ${isOvertime ? "Lembur" : "Gaji"} — ${imp.period}`}
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Payroll detail
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Slip {isOvertime ? "Lembur" : "Gaji"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {imp.period} · {imp.period_range} · {imp.total_rows}{" "}
                        karyawan
                    </p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <PayrollSectionTabs active={mode} />
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        Kembali
                        <ArrowRight className="size-4 rotate-180" />
                    </Link>
                </div>
            </div>

            {/* Flash Feedback Banner */}
            {(activeError || activeSuccess || activeInfo) && (
                <div
                    className={`rounded-2xl border p-4 text-sm font-medium shadow-sm transition ${
                        activeError
                            ? "border-rose-200 bg-rose-50 text-rose-800"
                            : activeInfo
                              ? "border-sky-200 bg-sky-50 text-sky-800"
                              : "border-emerald-200 bg-emerald-50 text-emerald-800"
                    }`}
                >
                    <div className="flex items-start gap-3">
                        {activeError ? (
                            <AlertCircle className="size-5 shrink-0 text-rose-600 mt-0.5" />
                        ) : activeInfo ? (
                            <Info className="size-5 shrink-0 text-sky-600 mt-0.5" />
                        ) : (
                            <CheckCircle2 className="size-5 shrink-0 text-emerald-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <p className="font-semibold text-base">
                                {activeError
                                    ? "Gagal Terkirim / Error Email"
                                    : activeInfo
                                      ? "Informasi Pengiriman"
                                      : "Pengiriman Berhasil"}
                            </p>
                            <p className="mt-1 text-xs opacity-90 leading-relaxed">
                                {activeError || activeSuccess || activeInfo}
                            </p>

                            {activeError &&
                                (activeError.includes("SMTP") ||
                                    activeError.includes("konfigurasi") ||
                                    activeError.includes("kuota")) && (
                                    <div className="mt-3">
                                        <Link
                                            href={route("mail-config.index")}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
                                        >
                                            Atur / Periksa Konfigurasi SMTP
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Aksi batch
                            </h2>
                            <p className="text-sm text-slate-500">
                                Kirim slip {label} untuk rentang baris yang
                                dipilih.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                            <ShieldCheck className="size-4" />
                            Otomatis Rotasi Akun SMTP
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Dari baris
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={imp.total_rows}
                                value={bulkFrom}
                                onChange={(e) => setBulkFrom(+e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Sampai baris
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={imp.total_rows}
                                value={bulkTo}
                                onChange={(e) => setBulkTo(+e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={handleBulk}
                                disabled={sending}
                                className="w-full h-11 rounded-xl"
                            >
                                {sending
                                    ? "Mengirim..."
                                    : `Kirim slip ${label}`}
                                <Send className="size-4" />
                            </Button>
                        </div>
                        <div className="flex items-end">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                                Pengiriman akan memakai template slip {label}.
                            </div>
                        </div>
                    </div>

                    {/* Zero-CLI Queue Worker Control */}
                    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-t border-slate-100 pt-5">
                        <div className="flex items-center gap-2.5 text-xs text-slate-600">
                            <span className="relative flex size-2.5">
                                <span
                                    className={`absolute inline-flex h-full w-full animate-ping rounded-full ${pendingJobsCount > 0 ? "bg-amber-400 opacity-75" : "bg-emerald-400 opacity-75"}`}
                                ></span>
                                <span
                                    className={`relative inline-flex size-2.5 rounded-full ${pendingJobsCount > 0 ? "bg-amber-500" : "bg-emerald-500"}`}
                                ></span>
                            </span>
                            <span className="font-semibold text-slate-900">
                                {pendingJobsCount} Antrean Email (Pending)
                            </span>
                            <span>· Pengiriman Tanpa CLI Terminal</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {pendingJobsCount > 0 && (
                                <Button
                                    type="button"
                                    onClick={handleCancelQueue}
                                    disabled={cancelingQueue}
                                    variant="outline"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 text-xs font-semibold px-4 py-2.5 shadow-sm transition"
                                >
                                    <Ban className="size-3.5" />
                                    {cancelingQueue
                                        ? "Membatalkan..."
                                        : `Batalkan Antrean (${pendingJobsCount})`}
                                </Button>
                            )}

                            <Button
                                type="button"
                                onClick={handleRunQueueWorker}
                                disabled={processingQueue}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                <Play className="size-3.5 fill-emerald-400 text-emerald-400" />
                                {processingQueue
                                    ? "Sedang Memproses Antrean CLI..."
                                    : pendingJobsCount > 0
                                      ? `🚀 Proses ${pendingJobsCount} Antrean Email Sekarang`
                                      : "Jalankan Queue Worker (Manual)"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                        Ringkasan
                    </p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                Total karyawan
                            </p>
                            <p className="text-2xl font-semibold text-slate-900">
                                {employees.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Sudah terkirim
                            </p>
                            <p className="text-2xl font-semibold text-emerald-700">
                                {employees.filter((e) => e.email_sent).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Tanpa email
                            </p>
                            <p className="text-2xl font-semibold text-rose-600">
                                {employees.filter((e) => !e.email).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Daftar karyawan
                    </h2>
                    <p className="text-sm text-slate-500">
                        Detail slip dan status pengiriman per karyawan.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                {[
                                    "#",
                                    "NIP BARU",
                                    "NIP (Lama)",
                                    "Nama",
                                    "Bagian",
                                    "Total Upah",
                                    "Potongan",
                                    "Diterima",
                                    "Email",
                                    "Status",
                                    "Aksi",
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="px-3 py-3 text-left font-medium whitespace-nowrap"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.length === 0 ? (
                                <EmptyState
                                    colSpan={11}
                                    icon={UserX}
                                    title="Belum ada data karyawan"
                                    description="Data karyawan untuk batch import ini tidak ditemukan."
                                />
                            ) : (
                                employees.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="transition hover:bg-emerald-50/40"
                                    >
                                        <td className="px-3 py-3 text-slate-400">
                                            {emp.row_number}
                                        </td>
                                        <td className="px-3 py-3 font-mono font-medium text-slate-900">
                                            {emp.nip_baru || "—"}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-slate-500">
                                            {emp.nip || "—"}
                                        </td>
                                        <td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap">
                                            {emp.nama}
                                        </td>
                                        <td className="px-3 py-3 text-slate-500">
                                            {emp.bagian}
                                        </td>
                                        <td className="px-3 py-3 text-right font-medium text-slate-800">
                                            {formatCurrency(emp.total_upah)}
                                        </td>
                                        <td className="px-3 py-3 text-right text-rose-600">
                                            {formatCurrency(
                                                emp.jumlah_potongan,
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-right font-semibold text-emerald-700">
                                            {formatCurrency(emp.upah_diterima)}
                                        </td>
                                        <td className="px-3 py-3 max-w-[160px] truncate text-slate-500">
                                            {emp.email || "—"}
                                        </td>
                                        <td className="px-3 py-3">
                                            {emp.email_sent ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    <MailCheck className="size-3.5" />
                                                    Terkirim
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                                    <Mail className="size-3.5" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <a
                                                    href={route(
                                                        pdfRoute,
                                                        emp.id,
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800"
                                                    title="Unduh PDF Slip"
                                                >
                                                    <Download className="size-3.5" />
                                                    Slip
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleSendOne(emp)
                                                    }
                                                    className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
                                                    title="Kirim Email"
                                                >
                                                    <Send className="size-3.5" />
                                                    Kirim
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(emp)
                                                    }
                                                    className="inline-flex items-center gap-1 font-medium text-sky-600 hover:text-sky-700"
                                                    title="Edit Data Karyawan"
                                                >
                                                    <Pencil className="size-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteEmployee(
                                                            emp,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 font-medium text-rose-600 hover:text-rose-700"
                                                    title="Hapus Karyawan"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                show={Boolean(editingEmployee)}
                onClose={() => setEditingEmployee(null)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Edit Data Karyawan
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {editingEmployee?.nama} (NIP BARU:{" "}
                                {editingEmployee?.nip_baru ||
                                    editingEmployee?.nip ||
                                    "—"}
                                )
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setEditingEmployee(null)}
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSaveEdit} className="mt-5 space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Identitas Karyawan
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        NIP BARU
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.nip_baru}
                                        onChange={(e) =>
                                            setEditData(
                                                "nip_baru",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.nip_baru && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.nip_baru}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        NIP (Lama)
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.nip}
                                        onChange={(e) =>
                                            setEditData("nip", e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.nip && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.nip}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Nama Lengkap *
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.nama}
                                        onChange={(e) =>
                                            setEditData("nama", e.target.value)
                                        }
                                        className="mt-1"
                                        required
                                    />
                                    {editErrors.nama && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.nama}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Bagian / Jabatan
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.bagian}
                                        onChange={(e) =>
                                            setEditData(
                                                "bagian",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Email Karyawan
                                    </label>
                                    <Input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                            setEditData("email", e.target.value)
                                        }
                                        className="mt-1"
                                    />
                                    {editErrors.email && (
                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.email}
                                        </p>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700">
                                        Nomor Rekening
                                    </label>
                                    <Input
                                        type="text"
                                        value={editData.rekening}
                                        onChange={(e) =>
                                            setEditData(
                                                "rekening",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                Ringkasan Gaji & Upah Diterima
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Total Upah (Rp)
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={editData.total_upah}
                                        onChange={(e) =>
                                            setEditData(
                                                "total_upah",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 bg-white font-semibold text-slate-900"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-500">
                                        {formatCurrency(editData.total_upah)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">
                                        Jumlah Potongan (Rp)
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={editData.jumlah_potongan}
                                        onChange={(e) =>
                                            setEditData(
                                                "jumlah_potongan",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 bg-white font-semibold text-rose-600"
                                    />
                                    <p className="mt-1 text-[10px] text-rose-500">
                                        {formatCurrency(
                                            editData.jumlah_potongan,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-emerald-800">
                                        Upah Yang Diterima (Rp) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={editData.upah_diterima}
                                        onChange={(e) =>
                                            setEditData(
                                                "upah_diterima",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 bg-white font-bold text-emerald-700 ring-2 ring-emerald-400 focus:ring-emerald-600"
                                        required
                                    />
                                    <p className="mt-1 text-[10px] font-bold text-emerald-700">
                                        {formatCurrency(editData.upah_diterima)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingEmployee(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editProcessing}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {editProcessing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
