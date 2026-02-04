import React from "react";

function LoginSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <header className="space-y-2 text-center">
        <div className="mx-auto h-5 w-40 rounded skeleton-shimmer" />
        <div className="mx-auto h-3 w-52 rounded skeleton-shimmer" />
      </header>

      <div className="h-7 w-full rounded-md skeleton-shimmer" />
{/* 
      <div className="space-y-1.5">
        <div className="h-3 w-24 rounded skeleton-shimmer" />
        <div className="h-11 w-full rounded-lg skeleton-shimmer" />
      </div> */}

      <div className="space-y-1.5">
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <div className="h-11 w-full rounded-lg skeleton-shimmer" />
      </div>

      <div className="-mt-2 flex justify-end">
        <div className="h-3 w-24 rounded skeleton-shimmer" />
      </div>

      <div className="mt-1 h-11 w-full rounded-full skeleton-shimmer" />

      <div className="flex items-center justify-center gap-2 text-[11px]">
        <span className="h-px flex-1 bg-[#E4E4E7]" />
        <div className="h-3 w-44 rounded skeleton-shimmer" />
        <span className="h-px flex-1 bg-[#E4E4E7]" />
      </div>

      <div className="h-11 w-full rounded-full skeleton-shimmer" />

      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="h-4 w-4 rounded-full skeleton-shimmer" />
        <div className="h-3 w-28 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}
export default React.memo(LoginSkeleton);
