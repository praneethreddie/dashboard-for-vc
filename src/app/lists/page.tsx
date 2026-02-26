"use client";

import { useState, useEffect } from "react";
import { startups } from "@/lib/mock-data";
import {
    FolderIcon,
    Trash2,
    Download,
    Plus,
    Building2,
    ChevronRight,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { SectorBadge } from "@/components/SectorBadge";

interface List {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
}

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [customStartups, setCustomStartups] = useState<any[]>([]);
    const [newListName, setNewListName] = useState("");
    const [activeListId, setActiveListId] = useState<string | null>(null);

    useEffect(() => {
        const savedLists = localStorage.getItem("vc-lists");
        if (savedLists) {
            const parsed = JSON.parse(savedLists);
            setLists(parsed);
            if (parsed.length > 0) setActiveListId(parsed[0].id);
        }

        const savedCustom = localStorage.getItem("vc-custom-startups");
        if (savedCustom) setCustomStartups(JSON.parse(savedCustom));
    }, []);

    const saveLists = (updatedLists: List[]) => {
        setLists(updatedLists);
        localStorage.setItem("vc-lists", JSON.stringify(updatedLists));
    };

    const handleCreateList = () => {
        if (!newListName.trim()) return;
        const newList: List = {
            id: Date.now().toString(),
            name: newListName,
            companyIds: [],
            createdAt: new Date().toISOString()
        };
        saveLists([...lists, newList]);
        setNewListName("");
        setActiveListId(newList.id);
    };

    const handleDeleteList = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = lists.filter(l => l.id !== id);
        saveLists(updated);
        if (activeListId === id) setActiveListId(updated[0]?.id || null);
    };

    const handleRemoveCompany = (companyId: string) => {
        if (!activeListId) return;
        const updated = lists.map(l => {
            if (l.id === activeListId) {
                return { ...l, companyIds: l.companyIds.filter(id => id !== companyId) };
            }
            return l;
        });
        saveLists(updated);
    };

    const activeList = lists.find(l => l.id === activeListId);
    const activeCompanies = activeList
        ? startups.filter(s => activeList.companyIds.includes(s.id))
        : [];

    const exportToJson = () => {
        if (!activeList) return;
        const blob = new Blob([JSON.stringify(activeCompanies, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeList.name.toLowerCase().replace(/ /g, '-')}.json`;
        a.click();
    };

    const exportToCsv = () => {
        if (!activeList) return;
        const headers = "Name,Sector,Stage,Location,Website\n";
        const rows = activeCompanies.map(s => `${s.name},${s.sector},${s.stage},${s.location},${s.website}`).join("\n");
        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeList.name.toLowerCase().replace(/ /g, '-')}.csv`;
        a.click();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Lists</h1>
                    <p className="text-s-foreground">Organize startups into custom workstreams.</p>
                </div>
            </div>

            <div className="flex-1 flex gap-8 min-h-0">
                {/* Sidebar for Lists */}
                <div className="w-64 flex flex-col gap-4">
                    <div className="bg-card-bg border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="New list..."
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                className="flex-1 bg-black/5 dark:bg-white/5 border border-border-subtle rounded px-2 py-1 text-xs outline-none focus:border-accent-primary"
                            />
                            <button
                                onClick={handleCreateList}
                                className="p-1 bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                            {lists.map(list => (
                                <div
                                    key={list.id}
                                    onClick={() => setActiveListId(list.id)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${activeListId === list.id ? "bg-black/5 dark:bg-white/5 font-medium" : "hover:bg-black/5"}`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <FolderIcon size={14} className={activeListId === list.id ? "text-accent-primary" : "text-s-foreground"} />
                                        <span className="text-sm truncate">{list.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteList(list.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {lists.length === 0 && (
                                <p className="text-xs text-s-foreground italic p-2">Create your first list above</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {activeList ? (
                        <div className="flex-1 flex flex-col bg-card-bg border border-border-subtle rounded-xl shadow-sm min-h-0 overflow-hidden">
                            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-sidebar/30">
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-lg">{activeList.name}</h2>
                                    <span className="text-xs text-s-foreground">{activeCompanies.length} companies saved</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={exportToCsv} className="flex items-center gap-2 px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-medium hover:bg-black/5 transition-colors">
                                        <Download size={14} />
                                        CSV
                                    </button>
                                    <button onClick={exportToJson} className="flex items-center gap-2 px-3 py-1.5 border border-border-subtle rounded-lg text-xs font-medium hover:bg-black/5 transition-colors">
                                        <Download size={14} />
                                        JSON
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {activeCompanies.length > 0 ? (
                                    <div className="divide-y divide-border-subtle/50">
                                        {activeCompanies.map(startup => (
                                            <div key={startup.id} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-sidebar flex items-center justify-center border border-border-subtle group-hover:bg-card-bg group-hover:border-accent-primary transition-all">
                                                        <Building2 size={20} className="text-s-foreground group-hover:text-accent-primary transition-colors" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground">{startup.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <SectorBadge sector={startup.sector} />
                                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{startup.stage}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <a href={startup.website} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-accent-primary transition-colors" title="Visit Website">
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleRemoveCompany(startup.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                        title="Remove from list"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <Link href={`/companies/${startup.id}`} className="p-2 text-slate-400 hover:text-accent-primary" title="View Profile">
                                                        <ChevronRight size={18} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center">
                                        <div className="w-12 h-12 bg-sidebar rounded-full flex items-center justify-center mb-4">
                                            <Building2 className="text-s-foreground" size={24} />
                                        </div>
                                        <p className="text-sm text-s-foreground max-w-xs">
                                            No companies in this list yet. Go to the discovery page to add some.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-xl p-20 text-center grayscale opacity-50">
                            <FolderIcon size={48} className="mb-4" />
                            <h3 className="text-lg font-semibold">Select or Create a List</h3>
                            <p className="text-sm">Manage your investment pipeline efficiently.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
