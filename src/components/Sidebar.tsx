"use client";

import { useState, useEffect } from "react";
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

import { useUser, UserButton } from "@clerk/nextjs";

const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: ListOrdered },
    { name: "Saved Searches", href: "/saved", icon: Search },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();
    const [dashboardName, setDashboardName] = useState("Xartup");

    useEffect(() => {
        const updateName = () => {
            const savedName = localStorage.getItem("vc-dashboard-name");
            if (savedName) setDashboardName(savedName);
        };

        updateName();
        window.addEventListener("storage-update", updateName);
        return () => window.removeEventListener("storage-update", updateName);
    }, []);

    // Get initials for fallback if no avatar
    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`
        : user?.firstName
            ? user.firstName[0]
            : "U";

    return (
        <div className="w-64 glass flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
                    <TrendingUp className="text-white dark:text-black w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">{dashboardName}</span>
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
                    </div>
                    {/* Mock lists would go here */}
                    <div className="px-3 py-2 text-sm text-s-foreground italic">
                        No lists created yet
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <Link href="/settings" className={`sidebar-item ${pathname === "/settings" ? "active" : ""}`}>
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
                <div className="mt-4 flex items-center justify-between px-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                            <UserButton afterSignOutUrl="/sign-in" appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8"
                                }
                            }} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate">
                                {isLoaded ? (user?.fullName || "Member") : "Loading..."}
                            </span>
                            <span className="text-[10px] text-s-foreground truncate">
                                {user?.primaryEmailAddress?.emailAddress || "Partner"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
