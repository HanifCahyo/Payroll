import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";

export default function PayrollIndex({ auth, imports }) {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
        period: "",
        period_range: "",
        sheet_name: "SLIP GAJI", // default
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("payroll.upload"), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payroll Import
                </h2>
            }
        >
            <Head title="Payroll Import" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">
                    {/* Upload Card */}
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            📤 Upload Excel Gaji
                        </h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Periode{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="APRIL 2026"
                                        className="w-full text-sm border-gray-300 rounded-md shadow-sm"
                                        value={data.period}
                                        onChange={(e) =>
                                            setData("period", e.target.value)
                                        }
                                    />
                                    {errors.period && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.period}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Range Periode{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="26 Maret - 28 April 2026"
                                        className="w-full text-sm border-gray-300 rounded-md shadow-sm"
                                        value={data.period_range}
                                        onChange={(e) =>
                                            setData(
                                                "period_range",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.period_range && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.period_range}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Sheet Name (opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="SLIP GAJI"
                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm"
                                    value={data.sheet_name}
                                    onChange={(e) =>
                                        setData("sheet_name", e.target.value)
                                    }
                                />
                                {errors.sheet_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.sheet_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    File Excel (.xlsx / .xls){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.xlsm"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                                    onChange={(e) =>
                                        setData("file", e.target.files[0])
                                    }
                                />
                                {errors.file && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "⏳ Memproses..."
                                    : "📊 Upload & Parse"}
                            </button>
                        </form>
                    </div>

                    {/* Import History */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                📋 Riwayat Import
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs tracking-wide text-gray-600 uppercase bg-gray-50">
                                    <tr>
                                        {[
                                            "File",
                                            "Periode",
                                            "Range",
                                            "Total",
                                            "Status",
                                            "Dibuat",
                                            "Aksi",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {imports.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-4 py-8 text-center text-gray-400"
                                            >
                                                Belum ada import. Upload file
                                                Excel dulu.
                                            </td>
                                        </tr>
                                    )}
                                    {imports.map((imp) => (
                                        <tr
                                            key={imp.id}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {imp.file_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {imp.period}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
                                                {imp.period_range}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {imp.employees_count}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge
                                                    status={imp.status}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-400">
                                                {imp.created_at}
                                            </td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={route(
                                                        "payroll.detail",
                                                        imp.id,
                                                    )}
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Detail →
                                                </a>
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

function StatusBadge({ status }) {
    const map = {
        ready: "bg-blue-100 text-blue-700",
        sending: "bg-yellow-100 text-yellow-700",
        done: "bg-green-100 text-green-700",
    };
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}
        >
            {status}
        </span>
    );
}
