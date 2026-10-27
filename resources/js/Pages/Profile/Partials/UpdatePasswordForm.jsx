import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { KeyRound, Save, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [visiblePasswords, setVisiblePasswords] = useState({
        current_password: false,
        password: false,
        password_confirmation: false,
    });

    const togglePasswordVisibility = (field) => {
        setVisiblePasswords((current) => ({
            ...current,
            [field]: !current[field],
        }));
    };

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-700">
                    <KeyRound className="size-5" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Perbarui Kata Sandi
                    </h2>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                    Gunakan kombinasi kata sandi yang kuat dan unik demi
                    keamanan akses akun Anda.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-5">
                <div className="space-y-2">
                    <InputLabel
                        htmlFor="current_password"
                        value="Kata Sandi Saat Ini"
                        className="text-slate-700"
                    />

                    <div className="relative">
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData("current_password", e.target.value)
                            }
                            type={
                                visiblePasswords.current_password
                                    ? "text"
                                    : "password"
                            }
                            className="mt-1 pr-12"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                togglePasswordVisibility("current_password")
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label={
                                visiblePasswords.current_password
                                    ? "Sembunyikan kata sandi saat ini"
                                    : "Tampilkan kata sandi saat ini"
                            }
                        >
                            {visiblePasswords.current_password ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.current_password} />
                </div>

                <div className="space-y-2">
                    <InputLabel
                        htmlFor="password"
                        value="Kata Sandi Baru"
                        className="text-slate-700"
                    />

                    <div className="relative">
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            type={
                                visiblePasswords.password ? "text" : "password"
                            }
                            className="mt-1 pr-12"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label={
                                visiblePasswords.password
                                    ? "Sembunyikan kata sandi baru"
                                    : "Tampilkan kata sandi baru"
                            }
                        >
                            {visiblePasswords.password ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                        className="text-slate-700"
                    />

                    <div className="relative">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            type={
                                visiblePasswords.password_confirmation
                                    ? "text"
                                    : "password"
                            }
                            className="mt-1 pr-12"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                togglePasswordVisibility(
                                    "password_confirmation",
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label={
                                visiblePasswords.password_confirmation
                                    ? "Sembunyikan konfirmasi kata sandi"
                                    : "Tampilkan konfirmasi kata sandi"
                            }
                        >
                            {visiblePasswords.password_confirmation ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing}>
                        <Save className="size-4" />
                        Update Kata Sandi
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                            <CheckCircle2 className="size-4" />
                            Kata sandi berhasil diubah.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
