import PayrollSectionTabs from "@/Components/PayrollSectionTabs";
import EmptyState from "@/Components/EmptyState";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowRight, FileSpreadsheet, UploadCloud, Clock3, ReceiptText, Trash2 } from "lucide-react";

const statusClasses = {
    ready: "bg-sky-50 text-sky-700 border-sky-200",
    sending: "bg-amber-50 text-amber-700 border-amber-200",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function formatNumber(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value ?? 0));
}

function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
                {value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
    );
}

export default function PayrollListView({ imports, mode = "salary" }) {
    const isOvertime = mode === "overtime";

    const importsCount = imports.length;
    const totalEmployees = imports.reduce(
        (sum, item) => sum + (item.employees_count ?? 0),
        0,
    );
    const doneCount = imports.filter((item) => item.status === "done").length;

    const handleDelete = (imp) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus data import "${imp.file_name}" (${imp.period})?\n\nSemua data karyawan (${imp.employees_count ?? 0} orang) pada batch ini akan terhapus.`,
            )
        ) {
            router.delete(route("payroll.destroy", imp.id));
        }
    };

    return (
        <div className="space-y-6">
            <Head title={isOvertime ? "Lembur" : "Gaji"} />

            <div className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                            Payroll section
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                            {isOvertime ? "Lembur" : "Gaji"}
                        </h1>
                        <p className="max-w-2xl text-sm leading-6 text-slate-500">
                            {isOvertime
                                ? "Gunakan menu ini untuk slip lembur dan distribusi email lembur."
                                : "Gunakan menu ini untuk impor payroll gaji dan distribusi slip gaji."}
                        </p>
                    </div>

                    <PayrollSectionTabs active={mode} />
                </div>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                    <StatCard
                        label="Batch"
                        value={importsCount}
                        hint="Total import payroll"
                    />
                    <StatCard
                        label="Karyawan"
                        value={formatNumber(totalEmployees)}
                        hint="Data yang sudah masuk"
                    />
                    <StatCard
                        label="Selesai"
                        value={doneCount}
                        hint="Import dengan status done"
                    />
                    <StatCard
                        label={isOvertime ? "Lembur" : "Gaji"}
                        value="Live"
                        hint="Menu aktif saat ini"
                    />
                </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            {isOvertime ? (
                                <Clock3 className="size-6" />
                            ) : (
                                <ReceiptText className="size-6" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold text-slate-900">
                                {isOvertime
                                    ? "Kelola Slip & Email Lembur"
                                    : "Kelola Slip & Email Gaji"}
                            </h2>
                            <p className="max-w-2xl text-sm leading-6 text-slate-500">
                                {isOvertime
                                    ? "Pilih batch payroll dari daftar di bawah untuk membuka detail lembur, mengunduh slip PDF lembur, atau mengirim email slip lembur."
                                    : "Pilih batch payroll dari daftar di bawah untuk melihat rincian gaji karyawan, mengunduh slip PDF, atau mengirim email slip gaji."}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route("payroll.upload.form", {
                            type: isOvertime ? "overtime" : "salary",
                        })}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
                    >
                        <UploadCloud className="size-4" />
                        + Upload {isOvertime ? "Lembur" : "Gaji"} Baru
                    </Link>
                </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Riwayat import {isOvertime ? "Lembur" : "Gaji"}
                    </h2>
                    <p className="text-sm text-slate-500">
                        {isOvertime
                            ? "Semua batch payroll lembur yang pernah diunggah."
                            : "Semua batch payroll gaji yang pernah diunggah."}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                {[
                                    "File",
                                    "Periode",
                                    "Range",
                                    "Total",
                                    "Status",
                                    "Dibuat",
                                    "Aksi",
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="px-4 py-3 text-left font-medium"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {imports.length === 0 ? (
                                <EmptyState
                                    colSpan={7}
                                    icon={FileSpreadsheet}
                                    title="Belum ada riwayat import"
                                    description={
                                        isOvertime
                                            ? "Belum ada batch payroll yang diunggah untuk data lembur."
                                            : "Upload file Excel payroll gaji terlebih dahulu untuk membuat batch baru."
                                    }
                                />
                            ) : (
                                imports.map((imp) => (
                                    <tr
                                        key={imp.id}
                                        className="transition hover:bg-emerald-50/40"
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-900">
                                            {imp.file_name}
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">
                                            {imp.period}
                                        </td>
                                        <td className="px-4 py-4 text-slate-500">
                                            {imp.period_range}
                                        </td>
                                        <td className="px-4 py-4 text-center text-slate-700">
                                            {imp.employees_count}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[imp.status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}
                                            >
                                                {imp.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-400">
                                            {imp.created_at}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={
                                                        isOvertime
                                                            ? route(
                                                                  "payroll.overtime.detail",
                                                                  imp.id,
                                                              )
                                                            : route(
                                                                  "payroll.detail",
                                                                  imp.id,
                                                              )
                                                    }
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                                >
                                                    Buka detail
                                                    <ArrowRight className="size-4" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(imp)}
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
                                                    title="Hapus Import"
                                                >
                                                    <Trash2 className="size-4" />
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
        </div>
    );
}
