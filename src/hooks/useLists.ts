"use client";

import { useEffect, useState } from "react";
import { Startup } from "@/lib/mock-data";

export function useLists() {
    const [lists, setLists] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("vc-lists");
        if (saved) setLists(JSON.parse(saved));
    }, []);

    const addToList = (listId: string, startupId: string) => {
        const updated = lists.map(l => {
            if (l.id === listId) {
                if (l.companyIds.includes(startupId)) return l;
                return { ...l, companyIds: [...l.companyIds, startupId] };
            }
            return l;
        });
        setLists(updated);
        localStorage.setItem("vc-lists", JSON.stringify(updated));
    };

    return { lists, addToList };
}
