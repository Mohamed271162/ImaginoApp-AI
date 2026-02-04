import React from "react";

function DashboardSidebarSkeleton() {
  const navItems = Array.from({ length: 8 });

  return (
    <div className="flex h-[100vh] flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm animate-pulse">
      <div className="flex flex-col items-center gap-2 pb-4">
        <div className="h-14 w-14 rounded-full skeleton-shimmer" />
        <div className="space-y-1 text-center">
          <div className="mx-auto h-3 w-24 rounded skeleton-shimmer" />
          <div className="mx-auto h-3 w-32 rounded skeleton-shimmer" />
        </div>
      </div>

      <div className="my-2 h-px w-full bg-[#E5E7EB]" />

      <nav className="flex-1 space-y-1 pt-1">
        {navItems.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-full px-3 py-2"
          >
            <div className="h-4 w-4 rounded-full skeleton-shimmer" />
            <div className="h-3 w-32 rounded skeleton-shimmer" />
          </div>
        ))}
      </nav>
    </div>
  );
}

export default React.memo(DashboardSidebarSkeleton);
