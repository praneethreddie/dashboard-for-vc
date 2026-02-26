export function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-black/5 dark:bg-white/5 rounded-md ${className}`} />
    );
}

export function StartupCardSkeleton() {
    return (
        <div className="bg-card-bg border border-border-subtle rounded-xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                    <Skeleton className="w-32 h-4 mb-2" />
                    <Skeleton className="w-24 h-3" />
                </div>
            </div>
            <Skeleton className="w-full h-16" />
            <div className="flex gap-2">
                <Skeleton className="w-16 h-5 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
            </div>
        </div>
    );
}
