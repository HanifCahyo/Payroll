import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import PayrollListView from "./PayrollListView";

export default function PayrollOvertime({ auth, imports }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-900">
                    Lembur
                </h2>
            }
        >
            <Head title="Lembur" />
            <PayrollListView imports={imports} mode="overtime" />
        </AuthenticatedLayout>
    );
}
