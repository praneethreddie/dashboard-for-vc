"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@clerk/nextjs";
import {
    Moon,
    Sun,
    Download,
    Trash2,
    User,
    Palette,
    Database,
    AlertTriangle,
    Check
} from "lucide-react";

export default function SettingsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [isResetting, setIsResetting] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [dashboardName, setDashboardName] = useState("Xartup");

    useEffect(() => {
        const savedTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark";
        if (savedTheme) setTheme(savedTheme);

        const savedName = localStorage.getItem("vc-dashboard-name");
        if (savedName) setDashboardName(savedName);
    }, []);

    const handleNameChange = (newName: string) => {
        setDashboardName(newName);
        localStorage.setItem("vc-dashboard-name", newName);
        // Dispatch custom event to notify other components (like Sidebar)
        window.dispatchEvent(new Event("storage-update"));
    };

    const toggleTheme = (newTheme: "light" | "dark") => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const handleExportAll = () => {
        const data = {
            lists: JSON.parse(localStorage.getItem("vc-lists") || "[]"),
            customStartups: JSON.parse(localStorage.getItem("vc-custom-startups") || "[]"),
            exportDate: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `xartup-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleResetAll = () => {
        if (confirm("Are you sure? This will delete all your local lists and custom startups. This action cannot be undone.")) {
            localStorage.removeItem("vc-lists");
            localStorage.removeItem("vc-custom-startups");
            window.location.reload();
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-s-foreground">Manage your account, preferences, and data.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20">
                {/* Account Section */}
                <section className="bg-card-bg border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border-subtle bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                                <User size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">Account Profile</h2>
                                <p className="text-xs text-s-foreground">Manage your identity and security settings.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-[0.98]"
                        >
                            {showProfile ? "Close Profile" : "Manage Account"}
                        </button>
                    </div>
                    {showProfile && (
                        <div className="p-0 border-t border-border-subtle bg-white dark:bg-black/20 overflow-hidden flex flex-col items-center">
                            <div className="w-full max-w-full overflow-x-auto py-8 px-4 flex justify-center">
                                <UserProfile
                                    routing="hash"
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full max-w-[800px] mx-auto",
                                            card: "shadow-none border border-border-subtle rounded-xl",
                                            navbar: "bg-transparent",
                                            pageScrollBox: "bg-transparent",
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* UI Preferences Section */}
                <section className="bg-card-bg border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border-subtle bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Palette size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Appearance</h2>
                            <p className="text-xs text-s-foreground">Customize how Xartup looks on your screen.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold">Display Theme</h3>
                                <p className="text-xs text-s-foreground">Switch between light and dark visual modes.</p>
                            </div>
                            <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-border-subtle">
                                <button
                                    onClick={() => toggleTheme("light")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow-sm text-black' : 'text-s-foreground hover:text-foreground'}`}
                                >
                                    <Sun size={16} />
                                    <span>Light</span>
                                </button>
                                <button
                                    onClick={() => toggleTheme("dark")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-black text-white shadow-sm' : 'text-s-foreground hover:text-foreground'}`}
                                >
                                    <Moon size={16} />
                                    <span>Dark</span>
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold">Dashboard Name</h3>
                                <p className="text-xs text-s-foreground">How the app identifies itself in the sidebar.</p>
                            </div>
                            <input
                                type="text"
                                value={dashboardName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Xartup"
                                className="w-48 bg-black/5 dark:bg-white/5 border border-border-subtle rounded-xl px-4 py-2 text-sm outline-none focus:border-accent-primary transition-all text-right"
                            />
                        </div>
                    </div>
                </section>

                {/* Data Maintenance Section */}
                <section className="bg-card-bg border border-border-subtle rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-border-subtle bg-slate-50/50 dark:bg-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Database size={20} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Data & Portability</h2>
                            <p className="text-xs text-s-foreground">Manage your saved information and workspaces.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold">Export Workspace</h3>
                                <p className="text-xs text-s-foreground">Download all your lists and startups as a JSON file.</p>
                            </div>
                            <button
                                onClick={handleExportAll}
                                className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 border border-border-subtle rounded-xl text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                <Download size={16} />
                                Export Backups
                            </button>
                        </div>

                        <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-red-500">Danger Zone</h3>
                                <p className="text-xs text-s-foreground">Permanently delete all local data from this browser.</p>
                            </div>
                            <button
                                onClick={handleResetAll}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all active:scale-[0.98] shadow-sm shadow-red-500/20"
                            >
                                <Trash2 size={16} />
                                Reset App Data
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
