"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SectorBadgeProps {
    sector: string;
    className?: string;
}

export function SectorBadge({ sector, className }: SectorBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all duration-200 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-transparent hover:scale-105 active:scale-95 cursor-default shadow-sm",
                className
            )}
        >
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            {sector}
        </span>
    );
}
