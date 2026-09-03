import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { User, ShieldCheck } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
                        Account Settings
                    </p>
                    <h2 className="text-xl font-semibold leading-tight text-slate-900">
                        Profile
                    </h2>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="space-y-6">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                <User className="size-3.5" />
                                Pengaturan Akun
                            </div>
                            <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Kelola identitas dan keamanan akun Anda.
                            </h3>
                            <p className="text-sm leading-6 text-slate-500">
                                Perbarui nama profil, email akun, kata sandi, serta
                                pengaturan keamanan pengguna di bawah ini.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                            <ShieldCheck className="size-4" />
                            Sistem Terproteksi
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>

                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>

                    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
