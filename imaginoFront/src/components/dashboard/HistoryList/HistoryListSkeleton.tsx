import React from 'react';
function HistoryListSkeleton() {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white dark:bg-slate-900/80 p-5 shadow-sm animate-pulse">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="h-5 w-48 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg p-3 bg-gray-50 dark:bg-slate-800/60"
          >
            <div className="h-20 w-20 rounded-md bg-gray-200 dark:bg-slate-700" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-64 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default React.memo(HistoryListSkeleton);
