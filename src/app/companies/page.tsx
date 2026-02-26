"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startups, Startup } from "@/lib/mock-data";
import {
    ArrowUpDown,
    MapPin,
    Globe,
    ChevronLeft,
    ChevronRight,
    Filter,
    Sparkles,
    Loader2,
    Trash2
} from "lucide-react";
import { SectorBadge } from "@/components/SectorBadge";

interface List {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
}

export default function CompaniesPage() {
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
    const [sectorFilter, setSectorFilter] = useState(searchParams.get("sector") || "All");
    const [sortField, setSortField] = useState<keyof Startup>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [customStartups, setCustomStartups] = useState<Startup[]>([]);
    const [isDiscovering, setIsDiscovering] = useState(false);
    const itemsPerPage = 10;

    // Load custom startups from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("vc-custom-startups");
        if (saved) setCustomStartups(JSON.parse(saved));
    }, []);

    // Update search term and sector filter when URL params change
    useEffect(() => {
        const q = searchParams.get("q");
        const sector = searchParams.get("sector");

        if (q !== null) {
            setSearchTerm(q);
            // If a search query is provided without a sector, reset sector to All
            if (sector === null) setSectorFilter("All");
        }

        if (sector !== null) {
            setSectorFilter(sector);
        }
    }, [searchParams]);

    const allStartups = [...startups, ...customStartups];
    const sectors = Array.from(new Set(["All", ...allStartups.map(s => s.sector).filter(Boolean)]));

    const handleSort = (field: keyof Startup) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleSaveSearch = () => {
        const saved = localStorage.getItem("vc-saved-searches");
        const searches = saved ? JSON.parse(saved) : [];
        const newSearch = {
            id: Date.now().toString(),
            name: `${searchTerm || "All"} in ${sectorFilter}`,
            query: searchTerm,
            sector: sectorFilter,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem("vc-saved-searches", JSON.stringify([...searches, newSearch]));
        alert("Search saved to your dashboard!");
    };

    const handleMagicDiscovery = async () => {
        if (!searchTerm) return;
        setIsDiscovering(true);
        try {
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName: searchTerm }),
            });
            const data = await res.json();

            const newStartup: Startup = {
                id: `custom-${Date.now()}`,
                name: data.name || searchTerm || "Unnamed Startup",
                sector: data.sector || "Unknown",
                stage: "Seed",
                location: "Global",
                website: data.website || "",
                description: data.summary || "", // Map summary to description
                tags: data.keywords || []
            };

            const updatedCustom = [...customStartups, newStartup];
            setCustomStartups(updatedCustom);
            localStorage.setItem("vc-custom-startups", JSON.stringify(updatedCustom));

            // Also save the enrichment data for the profile page
            localStorage.setItem(`enrich-${newStartup.id}`, JSON.stringify(data));

            alert(`Found ${data.name}! Added to your discovery board.`);
        } catch (error) {
            console.error("Discovery failed", error);
        } finally {
            setIsDiscovering(false);
        }
    };

    const handleRemoveStartup = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (id.startsWith('custom-')) {
            const updated = customStartups.filter(s => s.id !== id);
            setCustomStartups(updated);
            localStorage.setItem("vc-custom-startups", JSON.stringify(updated));
        }

        // Also remove from any lists
        const savedLists = localStorage.getItem("vc-lists");
        if (savedLists) {
            const lists = JSON.parse(savedLists);
            const updatedLists = lists.map((l: List) => ({
                ...l,
                companyIds: l.companyIds.filter((cid: string) => cid !== id)
            }));
            localStorage.setItem("vc-lists", JSON.stringify(updatedLists));
        }
    };

    const filteredStartups = allStartups
        .filter(s =>
            (searchTerm === "" || s.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (sectorFilter === "All" || s.sector === sectorFilter)
        )
        .sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return 0;
        });

    const totalPages = Math.ceil(filteredStartups.length / itemsPerPage);
    const currentStartups = filteredStartups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Discovery</h1>
                    <p className="text-s-foreground">Find and enrich high-growth startups globally.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card-bg border border-border-subtle rounded-lg px-4 py-2 text-sm outline-none focus:border-accent-primary/20"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-card-bg border border-border-subtle rounded-lg px-4 py-2 text-sm">
                        <Filter size={16} className="text-s-foreground" />
                        <select
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer"
                        >
                            {sectors.map((sector, index) => (
                                <option key={`sector-${sector}-${index}`} value={sector}>{sector}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSaveSearch}
                        className="ml-auto bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Save Search
                    </button>
                </div>
            </div>

            <div className="bg-card-bg border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-sidebar border-b border-border-subtle">
                        <tr>
                            <th className="px-6 py-4 font-semibold cursor-pointer group" onClick={() => handleSort("name")}>
                                <div className="flex items-center gap-2">
                                    Name <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-semibold">Sector</th>
                            <th className="px-6 py-4 font-semibold">Stage</th>
                            <th className="px-6 py-4 font-semibold">Location</th>
                            <th className="px-6 py-4 font-semibold">Website</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/50">
                        {currentStartups.map((startup, index) => (
                            <tr
                                key={`${startup.id}-${index}`}
                                className="hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <td className="px-6 py-5">
                                    <Link href={`/companies/${startup.id}`} className="block">
                                        <span className="font-bold text-base text-foreground hover:text-accent-primary transition-colors cursor-pointer">
                                            {startup.name || "Unnamed Startup"}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-6 py-5">
                                    <SectorBadge sector={startup.sector} />
                                </td>
                                <td className="px-6 py-5 text-s-foreground">
                                    {startup.stage}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-s-foreground">
                                        <MapPin size={14} className="opacity-60" />
                                        <span>{startup.location}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <a
                                        href={startup.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-slate-500 hover:text-accent-primary transition-colors"
                                    >
                                        <Globe size={14} className="opacity-60" />
                                        <span>{(startup.website || '').replace('https://', '')}</span>
                                    </a>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={(e) => handleRemoveStartup(startup.id, e)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove from discovery"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentStartups.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                            <Sparkles className="text-s-foreground" size={32} />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-xl font-bold mb-2">
                                {searchTerm ? `No results for "${searchTerm}"` : "Search to begin discovery"}
                            </h3>
                            <p className="text-sm text-s-foreground mb-8">
                                {searchTerm
                                    ? "We couldn't find this company in our database. Use our AI to scour the web and generate a profile."
                                    : "Enter a company name above to find it in our records or scour the web."}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={handleMagicDiscovery}
                                    disabled={isDiscovering}
                                    className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-base font-bold hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100"
                                >
                                    {isDiscovering ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            Scouring the web...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={24} />
                                            Discover &quot;{searchTerm}&quot; with AI
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between bg-sidebar/50">
                    <span className="text-xs text-s-foreground">
                        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredStartups.length)} to {Math.min(currentPage * itemsPerPage, filteredStartups.length)} of {filteredStartups.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded border border-border-subtle disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card-bg transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded border border-border-subtle disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card-bg transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
