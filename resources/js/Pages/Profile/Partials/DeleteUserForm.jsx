import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600">
                    <ShieldAlert className="size-5" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Hapus Akun
                    </h2>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                    Setelah akun Anda dihapus, semua data dan akses terkait akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                <Trash2 className="size-4" />
                Hapus Akun Saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 text-rose-600">
                        <div className="grid size-10 place-items-center rounded-xl bg-rose-50">
                            <AlertTriangle className="size-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Konfirmasi Hapus Akun
                        </h2>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Apakah Anda yakin ingin menghapus akun Anda secara permanen? Silakan masukkan kata sandi Anda untuk mengonfirmasi.
                    </p>

                    <div className="mt-6 space-y-2">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi"
                            className="text-slate-700"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1"
                            isFocused
                            placeholder="Masukkan kata sandi..."
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            <Trash2 className="size-4" />
                            Ya, Hapus Permanen
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
