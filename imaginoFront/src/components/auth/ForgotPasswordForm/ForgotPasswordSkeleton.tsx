import React from "react";

function ForgotPasswordSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <header className="space-y-2">
        <div className="h-5 w-48 rounded skeleton-shimmer" />
        <div className="h-3 w-60 rounded skeleton-shimmer" />
      </header>

      <div className="h-7 w-full rounded-md skeleton-shimmer" />

      <div className="mt-2 space-y-1.5">
        <div className="h-3 w-24 rounded skeleton-shimmer" />
        <div className="h-11 w-full rounded-lg skeleton-shimmer" />
      </div>

      <div className="h-11 w-full rounded-full skeleton-shimmer" />

      <div className="mt-4 h-11 w-full rounded-full skeleton-shimmer" />

      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="h-4 w-4 rounded-full skeleton-shimmer" />
        <div className="h-3 w-28 rounded skeleton-shimmer" />
      </div>
    </div>
  );
}
export default React.memo(ForgotPasswordSkeleton);
