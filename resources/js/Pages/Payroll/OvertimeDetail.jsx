import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PayrollDetailView from "./PayrollDetailView";

export default function PayrollOvertimeDetail({
    auth,
    import: imp,
    employees,
    pendingJobsCount = 0,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-slate-900">
                    Lembur
                </h2>
            }
        >
            <PayrollDetailView
                auth={auth}
                import={imp}
                employees={employees}
                pendingJobsCount={pendingJobsCount}
                mode="overtime"
            />
        </AuthenticatedLayout>
    );
}
