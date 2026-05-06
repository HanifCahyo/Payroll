import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

const fmt = (v) =>
    "Rp " + Number(v).toLocaleString("id-ID", { minimumFractionDigits: 2 });

export default function PayrollDetail({ auth, import: imp, employees }) {
    const [bulkFrom, setBulkFrom] = useState(1);
    const [bulkTo, setBulkTo] = useState(Math.min(450, imp.total_rows));
    const [sending, setSending] = useState(false);
    const [flash, setFlash] = useState(null);

    const notify = (msg, type = "success") => {
        setFlash({ msg, type });
        setTimeout(() => setFlash(null), 4000);
    };

    const handleSendOne = (employee) => {
        if (!employee.email)
            return notify("Email karyawan ini kosong!", "error");
        if (!confirm(`Kirim slip gaji ke ${employee.email}?`)) return;
        router.post(
            route("payroll.email.one", employee.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => notify(`Email terkirim ke ${employee.email}`),
                onError: () => notify("Gagal kirim email.", "error"),
            },
        );
    };

    const handleBulk = () => {
        if (bulkTo - bulkFrom >= 450) {
            return notify("Maksimal 450 email per batch!", "error");
        }
        if (!confirm(`Kirim email massal ke baris ${bulkFrom} - ${bulkTo}?`))
            return;
        setSending(true);
        router.post(
            route("payroll.email.bulk", imp.id),
            { from: bulkFrom, to: bulkTo },
            {
                preserveScroll: true,
                onSuccess: () =>
                    notify(
                        `Job email baris ${bulkFrom}-${bulkTo} berhasil di-dispatch!`,
                    ),
                onError: () => notify("Gagal dispatch job.", "error"),
                onFinish: () => setSending(false),
            },
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Slip Gaji — {imp.period}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {imp.period_range} · {imp.total_rows} karyawan
                        </p>
                    </div>
                    <a
                        href={route("payroll.index")}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Kembali
                    </a>
                </div>
            }
        >
            <Head title={`Payroll — ${imp.period}`} />

            <div className="py-12">
                <div className="mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash */}
                    {flash && (
                        <div
                            className={`px-4 py-3 rounded-md text-sm font-medium ${
                                flash.type === "error"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-green-50 text-green-700 border border-green-200"
                            }`}
                        >
                            {flash.msg}
                        </div>
                    )}

                    {/* Bulk Send Panel */}
                    <div className="p-5 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">
                            📨 Kirim Email Massal
                        </h3>
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label className="block mb-1 text-xs text-gray-500">
                                    Dari Baris
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={imp.total_rows}
                                    className="text-sm border-gray-300 rounded-md shadow-sm w-28"
                                    value={bulkFrom}
                                    onChange={(e) =>
                                        setBulkFrom(+e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-gray-500">
                                    Sampai Baris
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={imp.total_rows}
                                    className="text-sm border-gray-300 rounded-md shadow-sm w-28"
                                    value={bulkTo}
                                    onChange={(e) => setBulkTo(+e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleBulk}
                                disabled={sending}
                                className="px-5 py-2 text-sm font-medium text-white transition bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                                {sending
                                    ? "⏳ Dispatching..."
                                    : "🚀 Kirim Massal"}
                            </button>
                            <p className="self-center text-xs text-gray-400">
                                ⚠️ Maks. 450/batch (limit Gmail ~500/hari)
                            </p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {[
                            {
                                label: "Total Karyawan",
                                value: employees.length,
                                color: "indigo",
                            },
                            {
                                label: "Sudah Terkirim",
                                value: employees.filter((e) => e.email_sent)
                                    .length,
                                color: "green",
                            },
                            {
                                label: "Belum Terkirim",
                                value: employees.filter((e) => !e.email_sent)
                                    .length,
                                color: "yellow",
                            },
                            {
                                label: "Tanpa Email",
                                value: employees.filter((e) => !e.email).length,
                                color: "red",
                            },
                        ].map(({ label, value, color }) => (
                            <div
                                key={label}
                                className="p-4 bg-white shadow-sm sm:rounded-lg"
                            >
                                <p className="text-xs text-gray-500">{label}</p>
                                <p
                                    className={`text-2xl font-bold text-${color}-600`}
                                >
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Tabel Karyawan */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead className="text-xs tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                                    <tr>
                                        {[
                                            "#",
                                            "NIP",
                                            "Nama",
                                            "Bagian",
                                            "Total Upah",
                                            "Potongan",
                                            "Diterima",
                                            "Email",
                                            "Status",
                                            "Aksi",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-3 py-3 font-medium text-left whitespace-nowrap"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {employees.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-2 text-gray-400">
                                                {emp.row_number}
                                            </td>
                                            <td className="px-3 py-2 font-mono text-gray-600">
                                                {emp.nip}
                                            </td>
                                            <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">
                                                {emp.nama}
                                            </td>
                                            <td className="px-3 py-2 text-gray-500">
                                                {emp.bagian}
                                            </td>
                                            <td className="px-3 py-2 font-medium text-right">
                                                {fmt(emp.total_upah)}
                                            </td>
                                            <td className="px-3 py-2 text-right text-red-600">
                                                {fmt(emp.jumlah_potongan)}
                                            </td>
                                            <td className="px-3 py-2 font-semibold text-right text-green-700">
                                                {fmt(emp.upah_diterima)}
                                            </td>
                                            <td className="px-3 py-2 text-gray-500 max-w-[140px] truncate">
                                                {emp.email || "—"}
                                            </td>
                                            <td className="px-3 py-2">
                                                {emp.email_sent ? (
                                                    <span className="font-medium text-green-600">
                                                        ✓ Terkirim
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={route(
                                                            "payroll.pdf",
                                                            emp.id,
                                                        )}
                                                        target="_blank"
                                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        PDF
                                                    </a>
                                                    <span className="text-gray-200">
                                                        |
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleSendOne(emp)
                                                        }
                                                        className="font-medium text-green-600 hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                    >
                                                        Email
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
