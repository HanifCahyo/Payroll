import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FieldDescription, FieldError } from "@/Components/ui/field";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    UploadCloud,
    FileSpreadsheet,
    CheckCircle2,
    Clock3,
    ReceiptText,
    Sparkles,
    FileText,
} from "lucide-react";

export default function PayrollUpload({ auth, initialType = "salary", recentImports = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        type: initialType || "salary",
        file: null,
        period: "",
        period_range: "",
        sheet_name: "SLIP GAJI",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("payroll.upload"), { forceFormData: true });
    };

    const isOvertime = data.type === "overtime";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Batch Impor
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Upload Payroll
                    </h2>
                </div>
            }
        >
            <Head title="Upload Payroll" />

            <div className="space-y-6">
                {/* Hero Banner Card */}
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <UploadCloud className="size-3.5" />
                                File Excel Processor
                            </div>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Unggah File Excel Payroll
                            </h1>
                            <p className="text-sm leading-6 text-slate-500">
                                Pilih jenis file (Gaji atau Lembur) di bawah ini sebelum mengunggah. Data akan dipisahkan secara otomatis agar slip dan pengiriman email tidak tertukar.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={route("payroll.index")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                            >
                                <ReceiptText className="size-4" />
                                Daftar Gaji
                            </Link>
                            <Link
                                href={route("payroll.overtime.index")}
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                            >
                                <Clock3 className="size-4 text-emerald-700" />
                                Daftar Lembur
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Left: Upload Form */}
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Formulir Upload Payroll
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Pilih jenis file, isi periode, dan unggah file Excel Anda.
                                </p>
                            </div>
                            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <FileSpreadsheet className="size-5" />
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            {/* Type Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Jenis File Payroll
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setData("type", "salary")}
                                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                                            !isOvertime
                                                ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className={`grid size-9 place-items-center rounded-xl ${!isOvertime ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                            <ReceiptText className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">File Gaji</p>
                                            <p className="text-[11px] opacity-75">Upah, premi, & potongan</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData("type", "overtime")}
                                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                                            isOvertime
                                                ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-600/20"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <div className={`grid size-9 place-items-center rounded-xl ${isOvertime ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                            <Clock3 className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">File Lembur</p>
                                            <p className="text-[11px] opacity-75">Jam & nominal lembur</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Periode Payroll
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="APRIL 2026"
                                        value={data.period}
                                        onChange={(e) =>
                                            setData("period", e.target.value)
                                        }
                                        aria-invalid={!!errors.period}
                                    />
                                    {errors.period ? (
                                        <FieldError>{errors.period}</FieldError>
                                    ) : (
                                        <FieldDescription>
                                            Contoh: APRIL 2026
                                        </FieldDescription>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Rentang Tanggal
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="26 Maret - 28 April 2026"
                                        value={data.period_range}
                                        onChange={(e) =>
                                            setData(
                                                "period_range",
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.period_range}
                                    />
                                    {errors.period_range ? (
                                        <FieldError>
                                            {errors.period_range}
                                        </FieldError>
                                    ) : (
                                        <FieldDescription>
                                            Rentang waktu kerja
                                        </FieldDescription>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Nama Sheet di Excel
                                </label>
                                <Input
                                    type="text"
                                    placeholder="SLIP GAJI"
                                    value={data.sheet_name}
                                    onChange={(e) =>
                                        setData("sheet_name", e.target.value)
                                    }
                                    aria-invalid={!!errors.sheet_name}
                                />
                                {errors.sheet_name ? (
                                    <FieldError>{errors.sheet_name}</FieldError>
                                ) : (
                                    <FieldDescription>
                                        Gunakan nama sheet utama di Excel (opsional, default: SLIP GAJI)
                                    </FieldDescription>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    File Excel {isOvertime ? "Lembur" : "Gaji"} (.xlsx, .xls, .xlsm)
                                </label>
                                <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 transition hover:bg-emerald-50/70">
                                    <Input
                                        type="file"
                                        accept=".xlsx,.xls,.xlsm"
                                        onChange={(e) =>
                                            setData("file", e.target.files[0])
                                        }
                                        aria-invalid={!!errors.file}
                                        className="cursor-pointer"
                                    />
                                    <p className="mt-2 text-xs text-slate-500">
                                        Maksimal ukuran file: 50MB
                                    </p>
                                </div>
                                {errors.file && (
                                    <FieldError>{errors.file}</FieldError>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-12 w-full rounded-2xl bg-emerald-600 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {processing ? (
                                    "Memproses Excel..."
                                ) : (
                                    <>
                                        <UploadCloud className="size-4" />
                                        Upload & Memproses Batch {isOvertime ? "Lembur" : "Gaji"}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Right: Guidelines & Recent Uploads */}
                    <div className="space-y-6">
                        {/* Guideline Card */}
                        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 text-emerald-700">
                                <Sparkles className="size-5" />
                                <h3 className="text-base font-semibold text-slate-900">
                                    Panduan Format {isOvertime ? "File Lembur" : "File Gaji"}
                                </h3>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Pastikan header kolom sesuai untuk jenis {isOvertime ? "Lembur" : "Gaji"}.
                            </p>

                            <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                                <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                    <div>
                                        <span className="font-semibold text-slate-800">
                                            NIP BARU, NIP, Nama, Email:
                                        </span>{" "}
                                        Wajib untuk pencocokan data & pengiriman email.
                                    </div>
                                </li>

                                {!isOvertime ? (
                                    <>
                                        <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Komponen Upah:
                                                </span>{" "}
                                                Upah Harian, Premi, Upah Tunggu, Sumbangan.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Komponen Potongan:
                                                </span>{" "}
                                                Kedisiplinan, Keterlambatan, Sepatu, Simpanan, BPJS.
                                            </div>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Lembur Biasa:
                                                </span>{" "}
                                                Jam lembur biasa & nominal lembur biasa.
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2 rounded-xl bg-slate-50 p-2.5">
                                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800">
                                                    Lembur Libur:
                                                </span>{" "}
                                                Jam lembur libur & nominal lembur libur.
                                            </div>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Recent Imports Card */}
                        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Impor Terbaru
                                </h3>
                                <FileText className="size-4 text-slate-400" />
                            </div>

                            <div className="mt-4 space-y-3">
                                {recentImports.length === 0 ? (
                                    <p className="text-xs text-slate-400">
                                        Belum ada batch payroll.
                                    </p>
                                ) : (
                                    recentImports.map((imp) => {
                                        const isImpOvertime = imp.type === "overtime";
                                        const detailHref = isImpOvertime
                                            ? route("payroll.overtime.detail", imp.id)
                                            : route("payroll.detail", imp.id);

                                        return (
                                            <div
                                                key={imp.id}
                                                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-800">
                                                            {imp.period}
                                                        </span>
                                                        <span
                                                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                                                                isImpOvertime
                                                                    ? "bg-amber-100 text-amber-800"
                                                                    : "bg-emerald-100 text-emerald-800"
                                                            }`}
                                                        >
                                                            {isImpOvertime ? "Lembur" : "Gaji"}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 mt-0.5">
                                                        {imp.file_name} · {imp.employees_count} karyawan
                                                    </p>
                                                </div>

                                                <Link
                                                    href={detailHref}
                                                    className="font-medium text-emerald-700 hover:underline"
                                                >
                                                    Buka
                                                </Link>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
