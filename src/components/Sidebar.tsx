"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Building2,
    ListOrdered,
    Search,
    Settings,
    PlusCircle,
    TrendingUp
} from "lucide-react";

const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: ListOrdered },
    { name: "Saved Searches", href: "/saved", icon: Search },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-sidebar border-r border-border-subtle flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
                    <TrendingUp className="text-white dark:text-black w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">Antigravity VC</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="text-[11px] font-semibold text-s-foreground uppercase tracking-wider mb-2 px-3">
                    Explore
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-item ${isActive ? "active" : ""}`}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                <div className="mt-8">
                    <div className="text-[11px] font-semibold text-s-foreground uppercase tracking-wider mb-2 px-3 flex items-center justify-between">
                        <span>Lists</span>
                        <PlusCircle size={14} className="cursor-pointer hover:text-s-active" />
                    </div>
                    {/* Mock lists would go here */}
                    <div className="px-3 py-2 text-sm text-s-foreground italic">
                        No lists created yet
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <div className="sidebar-item">
                    <Settings size={18} />
                    <span>Settings</span>
                </div>
                <div className="mt-4 flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        JD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">John Doe</span>
                        <span className="text-[10px] text-s-foreground">Partner</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
