import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";

const FIELDS = [
    { key: "name", label: "Label", type: "text", placeholder: "Gmail HRD 1" },
    {
        key: "host",
        label: "SMTP Host",
        type: "text",
        placeholder: "smtp.gmail.com",
    },
    { key: "port", label: "Port", type: "number", placeholder: "587" },
    {
        key: "username",
        label: "Username",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "password",
        label: "App Password",
        type: "password",
        placeholder: "•••• •••• •••• ••••",
    },
    {
        key: "from_address",
        label: "From Email",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "from_name",
        label: "From Name",
        type: "text",
        placeholder: "HRD PT. Gading Gadjah Mada",
    },
];

const DEFAULT = {
    name: "",
    host: "smtp.gmail.com",
    port: 587,
    username: "",
    password: "",
    encryption: "tls",
    from_address: "",
    from_name: "HRD PT. Gading Gadjah Mada",
};

export default function MailConfig({ auth, configs }) {
    const [editing, setEditing] = useState(null);
    const [testTarget, setTestTarget] = useState(null);
    const [testEmail, setTestEmail] = useState("");
    const [testLoading, setTestLoading] = useState(false);

    const { data, setData, post, put, processing, reset, errors } =
        useForm(DEFAULT);

    const startEdit = (cfg) => {
        setEditing(cfg.id);
        setData({ ...cfg, password: "" }); // jangan tampilkan password lama
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route("mail-config.update", editing), {
                onSuccess: () => {
                    cancelEdit();
                },
            });
        } else {
            post(route("mail-config.store"), { onSuccess: () => reset() });
        }
    };

    const handleTest = () => {
        if (!testEmail) return;
        setTestLoading(true);
        router.post(
            route("mail-config.test", testTarget),
            { to: testEmail },
            {
                preserveScroll: true,
                onFinish: () => {
                    setTestLoading(false);
                    setTestTarget(null);
                    setTestEmail("");
                },
            },
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ⚙️ Konfigurasi SMTP
                </h2>
            }
        >
            <Head title="SMTP Config" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto space-y-6 sm:px-6 lg:px-8">
                    {/* Form */}
                    <div className="p-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-base font-semibold text-gray-800">
                            {editing
                                ? "✏️ Edit Konfigurasi"
                                : "➕ Tambah Konfigurasi SMTP"}
                        </h3>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                                {FIELDS.map(
                                    ({ key, label, type, placeholder }) => (
                                        <div key={key}>
                                            <label className="block mb-1 text-xs font-medium text-gray-600">
                                                {label}
                                                {key === "password" &&
                                                    editing && (
                                                        <span className="ml-1 font-normal text-gray-400">
                                                            (kosongkan jika
                                                            tidak diubah)
                                                        </span>
                                                    )}
                                            </label>
                                            <input
                                                type={type}
                                                placeholder={placeholder}
                                                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                value={data[key]}
                                                onChange={(e) =>
                                                    setData(key, e.target.value)
                                                }
                                            />
                                            {errors[key] && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors[key]}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                                <div>
                                    <label className="block mb-1 text-xs font-medium text-gray-600">
                                        Encryption
                                    </label>
                                    <select
                                        className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={data.encryption}
                                        onChange={(e) =>
                                            setData(
                                                "encryption",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="tls">
                                            TLS (port 587)
                                        </option>
                                        <option value="ssl">
                                            SSL (port 465)
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing
                                        ? "Menyimpan..."
                                        : editing
                                          ? "Update"
                                          : "Simpan"}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-5 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-800">
                                📋 Daftar Konfigurasi
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Hanya 1 konfigurasi yang aktif digunakan untuk
                                kirim email
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs tracking-wide text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        {[
                                            "Label",
                                            "Host : Port",
                                            "Username",
                                            "From Address",
                                            "Status",
                                            "Aksi",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 font-medium text-left"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {configs.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-gray-400"
                                            >
                                                Belum ada konfigurasi SMTP.
                                            </td>
                                        </tr>
                                    )}
                                    {configs.map((cfg) => (
                                        <tr
                                            key={cfg.id}
                                            className={`hover:bg-gray-50 transition ${cfg.is_active ? "bg-green-50" : ""}`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {cfg.name}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                                {cfg.host}:{cfg.port}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {cfg.username}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {cfg.from_address}
                                            </td>
                                            <td className="px-4 py-3">
                                                {cfg.is_active ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✓ Aktif
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            router.patch(
                                                                route(
                                                                    "mail-config.activate",
                                                                    cfg.id,
                                                                ),
                                                                {},
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            )
                                                        }
                                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Set Aktif
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            startEdit(cfg)
                                                        }
                                                        className="text-xs font-medium text-yellow-600 hover:text-yellow-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setTestTarget(
                                                                cfg.id,
                                                            )
                                                        }
                                                        className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                                    >
                                                        Test
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Hapus konfigurasi ini?",
                                                                )
                                                            ) {
                                                                router.delete(
                                                                    route(
                                                                        "mail-config.destroy",
                                                                        cfg.id,
                                                                    ),
                                                                    {
                                                                        preserveScroll: true,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                        className="text-xs font-medium text-red-500 hover:text-red-700"
                                                    >
                                                        Hapus
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

            {/* Modal Test Send */}
            {testTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl">
                        <h3 className="mb-1 font-semibold text-gray-800">
                            🧪 Test Kirim Email
                        </h3>
                        <p className="mb-4 text-xs text-gray-400">
                            Email test akan dikirim menggunakan konfigurasi ini.
                        </p>
                        <input
                            type="email"
                            placeholder="Email tujuan test..."
                            className="w-full mb-4 text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleTest}
                                disabled={!testEmail || testLoading}
                                className="flex-1 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {testLoading ? "Mengirim..." : "Kirim Test"}
                            </button>
                            <button
                                onClick={() => {
                                    setTestTarget(null);
                                    setTestEmail("");
                                }}
                                className="flex-1 py-2 text-sm font-medium text-gray-700 transition bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
