"use client";

import { cn } from "../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-black/5 dark:bg-white/5", className)}
            {...props}
        />
    );
}

export function TableSkeleton() {
    return (
        <div className="w-full space-y-4">
            <div className="flex items-center space-x-4 px-6 py-4">
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-4 w-[15%]" />
                <Skeleton className="h-4 w-[15%]" />
                <Skeleton className="h-4 w-[20%]" />
                <Skeleton className="h-4 w-[20%]" />
            </div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 px-6 py-5 border-t border-border-subtle/50">
                    <Skeleton className="h-6 w-[20%]" />
                    <Skeleton className="h-6 w-[15%]" />
                    <Skeleton className="h-6 w-[15%]" />
                    <Skeleton className="h-6 w-[20%]" />
                    <Skeleton className="h-6 w-[20%]" />
                </div>
            ))}
        </div>
    );
}
