import { FolderOpen } from "lucide-react";

export default function EmptyState({
    icon: Icon = FolderOpen,
    title = "Belum ada data",
    description = "Tidak ada informasi yang tersedia saat ini.",
    action = null,
    colSpan = null,
}) {
    const content = (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="grid size-14 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50/80 text-emerald-700 shadow-sm">
                <Icon className="size-7 stroke-[1.75]" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 leading-relaxed">
                {description}
            </p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    );

    if (colSpan) {
        return (
            <tr>
                <td colSpan={colSpan} className="p-0">
                    {content}
                </td>
            </tr>
        );
    }

    return content;
}
