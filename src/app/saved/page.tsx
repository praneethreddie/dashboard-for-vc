"use client";

import { useState, useEffect } from "react";
import {
    Bookmark,
    Trash2,
    Play,
    Search,
    Filter,
    Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SavedSearch {
    id: string;
    name: string;
    query: string;
    sector: string;
    timestamp: string;
}

export default function SavedPage() {
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem("vc-saved-searches");
        if (saved) setSearches(JSON.parse(saved));
    }, []);

    const handleDelete = (id: string) => {
        const updated = searches.filter(s => s.id !== id);
        setSearches(updated);
        localStorage.setItem("vc-saved-searches", JSON.stringify(updated));
    };

    const handleRunSearch = (search: SavedSearch) => {
        const params = new URLSearchParams();
        if (search.query) params.set("q", search.query);
        if (search.sector !== "All") params.set("sector", search.sector);
        router.push(`/companies?${params.toString()}`);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Searches</h1>
                <p className="text-s-foreground">Quickly return to your favorite discovery filters.</p>
            </div>

            <div className="grid gap-4">
                {searches.map((search) => (
                    <div
                        key={search.id}
                        className="bg-card-bg border border-border-subtle rounded-xl p-6 flex items-center justify-between group hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-sidebar rounded-lg flex items-center justify-center text-accent-primary">
                                <Bookmark size={20} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-lg">{search.name || "Untitled Search"}</h3>
                                <div className="flex items-center gap-4 text-xs text-s-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Search size={12} />
                                        <span>Query: {search.query || "None"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Filter size={12} />
                                        <span>Sector: {search.sector}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        <span>{new Date(search.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleRunSearch(search)}
                                className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <Play size={14} fill="currentColor" />
                                Run Search
                            </button>
                            <button
                                onClick={() => handleDelete(search.id)}
                                className="p-2 text-s-foreground hover:text-red-500 transition-colors"
                                title="Delete saved search"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {searches.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 text-center grayscale opacity-40">
                        <Bookmark size={48} className="mb-4" />
                        <h3 className="text-lg font-semibold">No Saved Searches</h3>
                        <p className="text-sm max-w-xs mx-auto mb-6">
                            Use the &quot;Save Search&quot; button on the discovery page to bookmark your filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
