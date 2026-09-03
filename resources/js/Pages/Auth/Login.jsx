import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FieldDescription, FieldError } from "@/Components/ui/field";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
                <aside className="relative hidden overflow-hidden rounded-[1.75rem] border border-emerald-200/70 bg-[linear-gradient(160deg,#f0fdf4_0%,#dcfce7_55%,#bbf7d0_100%)] p-8 text-emerald-950 lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_28%)]" />

                    <div className="relative space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <img
                                src="/LOGO%20GGM%20BARU.png"
                                alt="Logo GGM Baru"
                                className="w-auto h-14 drop-shadow-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="max-w-md text-4xl font-semibold tracking-tight text-balance text-emerald-950">
                                Akses payroll resmi GGM.
                            </h2>
                            <p className="max-w-md text-sm leading-6 text-emerald-900/75">
                                Masuk untuk mengelola data payroll, slip
                                karyawan, dan pengaturan terkait akun.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-900/80">
                            <LockKeyhole className="size-4 text-emerald-700" />
                            Secure corporate access
                        </div>
                    </div>

                    <div className="relative flex items-end justify-between pt-6 text-xs border-t border-emerald-200 text-emerald-900/60">
                        <span>Payroll management</span>
                        <span>GGM</span>
                    </div>
                </aside>

                <div className="rounded-[1.75rem] border border-emerald-100/80 bg-white/95 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
                    <div className="mb-8 space-y-3">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                                Masuk
                            </h2>
                            <p className="text-sm leading-6 text-slate-500">
                                Gunakan akun terdaftar untuk mengakses
                                dashboard.
                            </p>
                        </div>
                    </div>

                    {status && (
                        <div className="px-4 py-3 mb-6 text-sm font-medium border rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="nama@perusahaan.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                aria-invalid={!!errors.email}
                            />
                            {errors.email ? (
                                <FieldError>{errors.email}</FieldError>
                            ) : (
                                <FieldDescription>
                                    Email akun Anda.
                                </FieldDescription>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Masukkan password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                aria-invalid={!!errors.password}
                            />
                            {errors.password ? (
                                <FieldError>{errors.password}</FieldError>
                            ) : (
                                <FieldDescription>
                                    Password akun Anda.
                                </FieldDescription>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-sm font-semibold h-11 rounded-xl"
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Masuk"}
                            <ArrowRight className="size-4" />
                        </Button>
                    </form>
                </div>
            </section>
        </GuestLayout>
    );
}
