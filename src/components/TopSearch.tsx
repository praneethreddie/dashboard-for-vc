"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function TopSearch() {
    const [query, setQuery] = useState("");
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/companies?q=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/companies');
        }
    };

    return (
        <div className="h-16 border-b border-border-subtle bg-background/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <form onSubmit={handleSubmit} className="relative w-full max-w-xl group">
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-s-foreground group-focus-within:text-accent-primary transition-colors">
                    <Search size={18} />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search startups, sectors, or people..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:bg-transparent focus:border-accent-primary/20 rounded-lg py-2 pl-10 pr-4 text-sm transition-all outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded border border-border-subtle text-s-foreground pointer-events-none">
                    <Command size={10} />
                    <span>K</span>
                </div>
            </form>

            <div className="flex items-center gap-4">
                <div className="text-xs text-s-foreground font-medium bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer mr-2">
                    Enrich API: 80% left
                </div>

                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-sm font-medium bg-accent-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-8 w-8"
                            }
                        }}
                    />
                </SignedIn>
            </div>
        </div>
    );
}
