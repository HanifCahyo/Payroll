import { Link } from "@inertiajs/react";

const tabs = [
    { key: "salary", label: "Gaji", href: route("payroll.index") },
    {
        key: "overtime",
        label: "Lembur",
        href: route("payroll.overtime.index"),
    },
];

export default function PayrollSectionTabs({ active }) {
    return (
        <div className="inline-flex w-full rounded-2xl border border-emerald-100 bg-white p-1 shadow-sm sm:w-auto">
            {tabs.map((tab) => {
                const isActive = active === tab.key;

                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-medium transition sm:flex-none ${
                            isActive
                                ? "bg-emerald-600 text-white shadow"
                                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
