import React from "react";

function ProfileInfoCardSkeleton() {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm animate-pulse">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="h-4 w-32 rounded skeleton-shimmer" />
        <div className="h-7 w-16 rounded-md skeleton-shimmer" />
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded skeleton-shimmer" />
          <div className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <div className="h-4 w-4 rounded-full skeleton-shimmer" />
            <div className="h-3 w-40 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-12 rounded skeleton-shimmer" />
          <div className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <div className="h-4 w-4 rounded-full skeleton-shimmer" />
            <div className="h-3 w-56 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-3 w-20 rounded skeleton-shimmer" />
          <div className="flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <div className="h-4 w-4 rounded-full skeleton-shimmer" />
            <div className="h-3 w-40 rounded skeleton-shimmer" />
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <div className="h-3 w-16 rounded skeleton-shimmer" />
          <div className="h-8 w-32 rounded-md skeleton-shimmer" />
        </div>
      </div>
    </section>
  );
}

export default React.memo(ProfileInfoCardSkeleton);
