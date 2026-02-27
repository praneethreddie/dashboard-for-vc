"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { startups, Startup } from "@/lib/mock-data";
import {
    Globe,
    MapPin,
    Tag,
    ArrowLeft,
    Sparkles,
    Info,
    Clock,
    Link as LinkIcon,
    Plus,
    Save,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { SectorBadge } from "@/components/SectorBadge";

interface List {
    id: string;
    name: string;
    companyIds: string[];
    createdAt: string;
}

interface EnrichmentData {
    name: string;
    website: string;
    sector: string;
    summary: string;
    whatTheyDo: string[];
    keywords: string[];
    derivedSignals: string[];
    sources: string[];
    timestamp: string;
}

export default function ProfilePage() {
    const params = useParams();
    const id = params?.id as string;

    const [startup, setStartup] = useState<Startup | null>(null);
    const [notes, setNotes] = useState("");
    const [isEnriching, setIsEnriching] = useState(false);
    const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        if (!id) return;

        // 1. Resolve startup from either mock data or custom localStorage data
        const mockStartup = startups.find(s => s.id === id);
        if (mockStartup) {
            setStartup(mockStartup);
        } else {
            const savedCustom = localStorage.getItem("vc-custom-startups");
            if (savedCustom) {
                const customStartups: Startup[] = JSON.parse(savedCustom);
                const found = customStartups.find(s => s.id === id);
                if (found) setStartup(found);
            }
        }

        const savedNotes = localStorage.getItem(`notes-${id}`);
        if (savedNotes) setNotes(savedNotes);

        const savedEnrichment = localStorage.getItem(`enrich-${id}`);
        if (savedEnrichment) setEnrichmentData(JSON.parse(savedEnrichment));

        const savedLists = localStorage.getItem("vc-lists");
        if (savedLists) setLists(JSON.parse(savedLists));
    }, [id]);

    const handleSaveNotes = () => {
        localStorage.setItem(`notes-${id}`, notes);
        alert("Notes saved to local storage!");
    };

    const handleAddToList = () => {
        if (!startup) return;

        // If no lists exist, create a default one
        let updatedLists = [...lists];
        if (updatedLists.length === 0) {
            updatedLists = [{
                id: "default",
                name: "My First List",
                companyIds: [],
                createdAt: new Date().toISOString()
            }];
        }

        // Add to the first list for simplicity in this UI
        const firstList = updatedLists[0];
        if (!firstList.companyIds.includes(startup.id)) {
            firstList.companyIds.push(startup.id);
            localStorage.setItem("vc-lists", JSON.stringify(updatedLists));
            setLists(updatedLists);
            alert(`Added ${startup.name} to ${firstList.name}`);
        } else {
            alert(`${startup.name} is already in ${firstList.name}`);
        }
    };

    const handleEnrich = async () => {
        if (!startup) return;
        setIsEnriching(true);
        try {
            const res = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: startup.name,
                    website: startup.website
                }),
            });
            const data = await res.json();
            setEnrichmentData(data);
            localStorage.setItem(`enrich-${id}`, JSON.stringify(data));
        } catch (error) {
            console.error("Enrichment failed", error);
        } finally {
            setIsEnriching(false);
        }
    };

    if (!startup) {
        return <div className="p-8">Startup not found.</div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24">
            <Link href="/companies" className="flex items-center gap-2 text-s-foreground hover:text-accent-primary transition-colors mb-8 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Discovery</span>
            </Link>

            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-black px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest w-fit">
                                {startup.stage}
                            </div>
                            <SectorBadge sector={startup.sector} />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{startup.name || "Unnamed Startup"}</h1>
                        <div className="flex items-center gap-4 text-s-foreground">
                            <a href={startup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-primary transition-colors">
                                <Globe size={16} />
                                <span>{startup.website}</span>
                            </a>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} />
                                <span>{startup.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToList}
                            className="flex items-center gap-2 border border-border-subtle bg-card-bg px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors"
                        >
                            <Plus size={18} />
                            Add to List
                        </button>
                        <button
                            onClick={handleEnrich}
                            disabled={isEnriching}
                            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isEnriching ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Sparkles size={18} />
                            )}
                            {enrichmentData ? "Re-Enrich" : "Enrich Insights"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 flex flex-col gap-8">
                        {/* Description Card */}
                        <section className="bg-card-bg border border-border-subtle rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Info size={18} className="text-s-foreground" />
                                Company Overview
                            </h2>
                            <p className="text-foreground leading-relaxed">
                                {startup.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {startup.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-border-subtle px-3 py-1 rounded-full text-xs text-s-foreground">
                                        <Tag size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Enrichment Insights */}
                        <section className="bg-card-bg border-2 border-dashed border-border-subtle rounded-xl p-8 relative overflow-hidden group">
                            {!enrichmentData && !isEnriching && (
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="text-s-foreground" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No AI Enrichment Yet</h3>
                                    <p className="text-sm text-s-foreground max-w-xs mx-auto mb-6">
                                        Click the Enrich button to pull real-time insights directly from {startup.name}&apos;s website.
                                    </p>
                                    <button
                                        onClick={handleEnrich}
                                        className="text-sm font-semibold underline underline-offset-4 hover:text-accent-primary"
                                    >
                                        Run basic enrichment
                                    </button>
                                </div>
                            )}

                            {isEnriching && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="relative mb-6">
                                        <Loader2 size={48} className="animate-spin text-accent-primary" />
                                        <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-primary animate-pulse" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground mb-2">
                                        Intelligence Engine: Scouring the Web
                                    </p>
                                    <div className="flex flex-col items-center gap-1 opacity-60">
                                        <div className="text-[10px] uppercase tracking-widest animate-pulse">Scanning LinkedIn Professionals...</div>
                                        <div className="text-[10px] uppercase tracking-widest animate-pulse delay-75">Analyzing Crunchbase Funding...</div>
                                        <div className="text-[10px] uppercase tracking-widest animate-pulse delay-150">Extracting Official {(startup.website || '').replace('https://', '')} data...</div>
                                    </div>
                                </div>
                            )}

                            {enrichmentData && !isEnriching && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Sparkles size={20} className="text-accent-primary" />
                                            AI Insights
                                        </h2>
                                        <div className="flex items-center gap-1.5 text-[10px] text-s-foreground font-mono bg-black/5 px-2 py-1 rounded uppercase">
                                            <Clock size={10} />
                                            Ran {new Date(enrichmentData.timestamp).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xs font-bold text-s-foreground uppercase tracking-wider mb-3">Executive Summary</h4>
                                            <p className="text-lg leading-snug font-medium line-clamp-2 italic">
                                                &quot;{enrichmentData.summary}&quot;
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-xs font-bold text-s-foreground uppercase tracking-wider mb-3">Key Value Propositions</h4>
                                                <ul className="space-y-2">
                                                    {enrichmentData.whatTheyDo.map((item: string, i: number) => (
                                                        <li key={i} className="text-sm flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-s-foreground uppercase tracking-wider mb-6">Market Derived Signals</h4>
                                                <div className="relative pl-4 border-l-2 border-border-subtle space-y-8">
                                                    {enrichmentData.derivedSignals.map((signal: string, i: number) => (
                                                        <div key={i} className="relative">
                                                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card-bg" />
                                                            <div className="flex flex-col gap-1">
                                                                <span className="text-sm font-semibold text-foreground leading-none">
                                                                    {signal}
                                                                </span>
                                                                <span className="text-[10px] text-s-foreground uppercase tracking-wider">
                                                                    Signal detected • {new Date(enrichmentData.timestamp).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-s-foreground uppercase tracking-wider mb-3">Extracted Keywords</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {enrichmentData.keywords.map((word: string, i: number) => (
                                                    <span key={i} className="text-xs text-s-foreground bg-black/5 px-2 py-0.5 rounded border border-border-subtle">
                                                        #{word}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-border-subtle flex items-center justify-between grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[10px]">
                                                    <LinkIcon size={12} />
                                                    <span>Sources: {enrichmentData.sources.join(', ')}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] italic">AI analysis may be inaccurate. Verify critical data.</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="flex flex-col gap-8">
                        {/* Notes Section */}
                        <div className="bg-card-bg border border-border-subtle rounded-xl p-6 shadow-sm sticky top-24">
                            <h3 className="font-semibold mb-4 flex items-center justify-between">
                                Internal Research Notes
                                <button onClick={handleSaveNotes} className="text-accent-primary hover:text-black transition-colors">
                                    <Save size={18} />
                                </button>
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add private insights, contact info, or deal status..."
                                className="w-full h-64 bg-black/5 dark:bg-white/5 rounded-lg p-4 text-sm outline-none resize-none focus:ring-1 focus:ring-accent-primary/20"
                            />
                            <p className="text-[10px] text-s-foreground mt-3 italic text-center">
                                Notes are encrypted and stored locally in your browser.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
