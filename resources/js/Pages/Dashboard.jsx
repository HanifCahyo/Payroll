import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/Components/EmptyState";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Clock3, FileSpreadsheet, Mail } from "lucide-react";

function StatCard({ label, value, hint }) {
    return (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                {label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
                {value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
    );
}

export default function Dashboard({ stats = {}, recentImports = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Overview
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <FileSpreadsheet className="size-3.5" />
                                Payroll control center
                            </div>
                            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Operasional payroll, gaji, lembur, dan SMTP
                                dalam satu tempat.
                            </h3>
                            <p className="text-sm leading-6 text-slate-500">
                                Ringkasan di bawah memberi akses cepat ke gaji,
                                lembur, dan konfigurasi email.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                            <Link
                                href={route("payroll.index")}
                                className="inline-flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                            >
                                Gaji
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href={route("payroll.overtime.index")}
                                className="inline-flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                            >
                                Lembur
                                <Clock3 className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Import payroll"
                        value={stats.imports}
                        hint="Batch yang tersimpan"
                    />
                    <StatCard
                        label="Karyawan"
                        value={stats.employees}
                        hint="Total data karyawan"
                    />
                    <StatCard
                        label="SMTP aktif"
                        value={stats.activeMailConfigs}
                        hint="Konfigurasi email aktif"
                    />
                    <StatCard
                        label="SMTP total"
                        value={stats.mailConfigs}
                        hint="Seluruh konfigurasi email"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-emerald-100 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Import terbaru
                            </h3>
                            <p className="text-sm text-slate-500">
                                Lima batch terakhir yang masuk ke sistem.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        {[
                                            "File",
                                            "Periode",
                                            "Karyawan",
                                            "Status",
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
                                    {recentImports.length === 0 ? (
                                        <EmptyState
                                            colSpan={4}
                                            icon={FileSpreadsheet}
                                            title="Belum ada import payroll"
                                            description="Silakan unggah file Excel gaji untuk melihat ringkasan import di sini."
                                        />
                                    ) : (
                                        recentImports.map((imp) => (
                                            <tr
                                                key={imp.id}
                                                className="hover:bg-emerald-50/40"
                                            >
                                                <td className="px-4 py-4 font-medium text-slate-900">
                                                    {imp.file_name}
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">
                                                    {imp.period}
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">
                                                    {imp.employees_count}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                        {imp.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                                Quick links
                            </p>
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                                Menu utama
                            </h3>
                        </div>

                        <Link
                            href={route("payroll.index")}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            <span>Gaji</span>
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={route("payroll.overtime.index")}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            <span>Lembur</span>
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={route("mail-config.index")}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            <span>SMTP Config</span>
                            <Mail className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
