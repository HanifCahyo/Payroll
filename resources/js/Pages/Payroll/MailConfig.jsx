import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import EmptyState from "@/Components/EmptyState";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import { Mail, Sparkles, Plus, Edit2, Send, Trash2, Check } from "lucide-react";

const FIELDS = [
    { key: "name", label: "Label Konfigurasi", type: "text", placeholder: "Gmail HRD 1" },
    {
        key: "host",
        label: "SMTP Host",
        type: "text",
        placeholder: "smtp.gmail.com",
    },
    { key: "port", label: "Port", type: "number", placeholder: "587" },
    {
        key: "username",
        label: "Username Email",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "password",
        label: "App Password Gmail",
        type: "password",
        placeholder: "•••• •••• •••• ••••",
    },
    {
        key: "from_address",
        label: "Email Pengirim (From)",
        type: "email",
        placeholder: "email@gmail.com",
    },
    {
        key: "from_name",
        label: "Nama Pengirim (From Name)",
        type: "text",
        placeholder: "TIM HR PAYROLL",
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
    from_name: "TIM HR PAYROLL",
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
        setData({
            name: cfg.name,
            host: cfg.host,
            port: cfg.port,
            username: cfg.username,
            password: "",
            encryption: cfg.encryption,
            from_address: cfg.from_address,
            from_name: cfg.from_name,
        });
    };

    const cancelEdit = () => {
        setEditing(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route("mail-config.update", editing), {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(route("mail-config.store"), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleTest = () => {
        if (!testEmail || !testTarget) return;
        setTestLoading(true);
        router.post(
            route("mail-config.test", testTarget),
            { test_email: testEmail },
            {
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
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Pengaturan Email
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Konfigurasi SMTP
                    </h2>
                </div>
            }
        >
            <Head title="Konfigurasi SMTP Email" />

            <div className="space-y-6">
                {/* Hero Banner Card */}
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <Sparkles className="size-3.5" />
                                SMTP Configuration Manager
                            </div>
                            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Setup Pengiriman Email Payroll
                            </h3>
                            <p className="text-sm leading-6 text-slate-500">
                                Konfigurasi SMTP dipakai untuk mengirim slip gaji dan slip lembur secara otomatis kepada karyawan via email.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            <Mail className="size-4" />
                            SMTP Workspace
                        </div>
                    </div>
                </div>

                {/* Main 12-Column Grid to prevent layout collapse */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Left: Form Panel (5 Columns) */}
                    <div className="min-w-0 lg:col-span-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900">
                                    {editing ? "Edit Konfigurasi SMTP" : "Tambah Konfigurasi SMTP"}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Isi parameter akun email pengirim di bawah ini.
                                </p>
                            </div>
                            <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                                {editing ? <Edit2 className="size-4" /> : <Plus className="size-4" />}
                            </div>
                        </div>

                        <form onSubmit={submit} className="mt-5 space-y-4">
                            {FIELDS.map(({ key, label, type, placeholder }) => (
                                <div key={key} className="space-y-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        {label}
                                        {key === "password" && editing && (
                                            <span className="ml-1 font-normal text-slate-400">
                                                (kosongkan jika tidak diubah)
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        autoComplete={key === "password" ? "new-password" : undefined}
                                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                    />
                                    {key === "password" && (
                                        <p className="text-[11px] leading-tight text-amber-700">
                                            Gmail wajib pakai <strong>App Password 16 karakter</strong>. Spasi otomatis dibersihkan.
                                        </p>
                                    )}
                                    {errors[key] && (
                                        <p className="text-xs text-rose-600">{errors[key]}</p>
                                    )}
                                </div>
                            ))}

                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Enkripsi (Encryption)
                                </label>
                                <select
                                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    value={data.encryption}
                                    onChange={(e) => setData("encryption", e.target.value)}
                                >
                                    <option value="tls">TLS (Port 587 - Rekomendasi)</option>
                                    <option value="ssl">SSL (Port 465)</option>
                                </select>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {processing ? "Memproses..." : editing ? "Update Konfigurasi" : "Simpan Konfigurasi"}
                                </button>
                                {editing && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right: List Panel (7 Columns) */}
                    <div className="min-w-0 lg:col-span-7 rounded-3xl border border-emerald-100 bg-white shadow-sm flex flex-col">
                        <div className="border-b border-slate-100 px-6 py-5">
                            <h3 className="text-base font-semibold text-slate-900">
                                Daftar Konfigurasi SMTP
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Kuota harian 400 email per akun. Jika kuota penuh, sistem otomatis beralih ke akun SMTP berikutnya.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 uppercase text-[11px] font-semibold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Label</th>
                                        <th className="px-4 py-3">Host / User</th>
                                        <th className="px-4 py-3">From Email</th>
                                        <th className="px-4 py-3">Kuota Hari Ini</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {configs.length === 0 ? (
                                        <EmptyState
                                            colSpan={6}
                                            icon={Mail}
                                            title="Belum Ada Konfigurasi SMTP"
                                            description="Isi formulir di samping untuk menambahkan konfigurasi email baru."
                                        />
                                    ) : (
                                        configs.map((cfg) => (
                                            <tr
                                                key={cfg.id}
                                                className={`transition hover:bg-slate-50/70 ${
                                                    cfg.is_active ? "bg-emerald-50/40" : ""
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-semibold text-slate-900">
                                                    <div>{cfg.name}</div>
                                                    <span className="font-mono text-[10px] text-slate-400 font-normal">
                                                        {cfg.encryption.toUpperCase()}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-[11px] text-slate-700">
                                                        {cfg.host}:{cfg.port}
                                                    </div>
                                                    <div
                                                        className="max-w-[150px] truncate text-[11px] text-slate-500"
                                                        title={cfg.username}
                                                    >
                                                        {cfg.username}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div
                                                        className="max-w-[140px] truncate font-medium text-slate-800"
                                                        title={cfg.from_address}
                                                    >
                                                        {cfg.from_address}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                                                        {cfg.from_name}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="font-semibold text-slate-800">
                                                        {cfg.quota?.sent ?? 0} / {cfg.quota?.limit ?? 400}
                                                    </span>
                                                    <p className="text-[10px] text-slate-400">
                                                        Sisa: {cfg.quota?.remaining ?? 400}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {cfg.is_active ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                            <Check className="size-3" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                router.patch(
                                                                    route("mail-config.activate", cfg.id),
                                                                    {},
                                                                    { preserveScroll: true }
                                                                )
                                                            }
                                                            className="text-xs font-semibold text-emerald-700 hover:underline"
                                                        >
                                                            Set Aktif
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            onClick={() => startEdit(cfg)}
                                                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                            title="Edit Konfigurasi"
                                                        >
                                                            <Edit2 className="size-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => setTestTarget(cfg.id)}
                                                            className="rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                                                            title="Test Kirim Email"
                                                        >
                                                            <Send className="size-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Hapus konfigurasi ini?")) {
                                                                    router.delete(
                                                                        route("mail-config.destroy", cfg.id),
                                                                        { preserveScroll: true }
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded-lg border border-rose-100 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="size-3.5" />
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
            </div>

            {/* Modal Test Send */}
            {testTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl">
                        <h3 className="mb-1 text-lg font-semibold text-slate-900">
                            Test Kirim Email
                        </h3>
                        <p className="mb-4 text-xs text-slate-500">
                            Email tes akan dikirim menggunakan konfigurasi SMTP ini.
                        </p>
                        <input
                            type="email"
                            placeholder="Email tujuan test..."
                            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleTest}
                                disabled={!testEmail || testLoading}
                                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {testLoading ? "Mengirim..." : "Kirim Tes"}
                            </button>
                            <button
                                onClick={() => {
                                    setTestTarget(null);
                                    setTestEmail("");
                                }}
                                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
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
