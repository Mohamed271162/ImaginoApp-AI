'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { UserImageListItem } from '@/types/images';
import { getUserImages } from '@/services/images.service';
import { toast } from 'sonner';

type JobType = 'user-image';
type JobStatus = 'done' | 'processing' | 'failed' | 'uploading' | 'completed' | 'deleted';

function prettyType(t: JobType) {
  switch (t) {
    case 'user-image':
      return 'User Image';
  }
}

function StatusPill({ status }: { status: JobStatus }) {
  if (status === 'done' || status === 'completed')
    return (
      <span className="status-pill status-done" role="status" aria-label="done">
        <CheckCircle className="h-3 w-3" /> Done
      </span>
    );
  if (status === 'processing' || status === 'uploading')
    return (
      <span className="status-pill status-processing" role="status" aria-label="processing">
        <Loader2 className="h-3 w-3 animate-spin" /> Processing
      </span>
    );

  return (
    <span className="status-pill status-failed" role="status" aria-label="failed">
      <XCircle className="h-3 w-3" /> Failed
    </span>
  );
}

export default function HistoryList() {
  const [items, setItems] = useState<UserImageListItem[]>([]);
  const [selected, setSelected] = useState<UserImageListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getUserImages({ page, size });
        setItems(res.result?.items ?? []);
        setTotalPages(res.result?.totalPages ?? 1);
        setTotalCount(res.result?.totalCount ?? 0);
      } catch (err) {
        console.error('Failed to fetch user images', err);
        toast.error('Could not load your images.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, size]);

  const startIndex = items.length ? (page - 1) * size + 1 : 0;
  const endIndex = (page - 1) * size + items.length;

  return (
    <section className="history-section rounded-2xl border p-4 md:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{`Processing history`}</h2>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>All time</span>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your images...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            No history yet
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={it._id}
                className="history-item flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg transition p-3"
              >
                <div className="relative w-full sm:w-24 h-44 sm:h-20 flex-none overflow-hidden rounded-md thumb-surface">
                  {it.url ? (
                    <Image
                      src={it.url}
                      alt={`thumbnail ${it.filename || it._id}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No preview
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate text-sm font-semibold">
                          {prettyType('user-image')}
                        </h3>
                        <StatusPill status={it.status === 'deleted' ? 'failed' : 'done'} />
                      </div>
                      <p className="truncate text-sm text-muted-foreground mt-1">
                        {it.filename ?? '—'}
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-2">
                      <div className="text-xs text-muted-foreground">
                        {it.aiEdits?.[0]?.timestamp
                          ? new Date(it.aiEdits[0].timestamp).toLocaleString()
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col items-start gap-2 sm:hidden">
                    <div className="text-xs text-muted-foreground">
                      {it.aiEdits?.[0]?.timestamp
                        ? new Date(it.aiEdits[0].timestamp).toLocaleString()
                        : ''}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-md px-2 py-1 text-xs pill-surface">
                        {it.dimensions?.width} × {it.dimensions?.height}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(it.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 sm:mt-0 sm:ml-auto flex w-full sm:w-auto flex-col gap-2">
                  <button
                    onClick={() => setSelected(it)}
                    className="action-btn"
                    aria-haspopup="dialog"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      if (it.url) window.open(it.url, '_blank');
                    }}
                    className="text-sm text-primary underline"
                  >
                    View
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-lg surface-quiet p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-2">
        <div className="text-sm text-muted-foreground">
          {totalCount === 0
            ? 'No records yet'
            : `Showing ${startIndex}-${endIndex} of ${totalCount}`}
        </div>

        <div className="flex items-center gap-2">
          <button
            className="outline-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || page <= 1}
          >
            Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <button
            className="primary-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={loading || page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${prettyType('user-image')} details`}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            className="absolute inset-0 modal-backdrop"
            onClick={() => setSelected(null)}
            aria-hidden
          />

          <div className="relative z-10 w-full sm:w-[min(900px,92%)] max-h-[90vh] overflow-auto modal-card">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {prettyType('user-image')} — {selected._id}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selected.aiEdits?.[0]?.timestamp
                    ? new Date(selected.aiEdits[0].timestamp).toLocaleString()
                    : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusPill status={selected.status} />
                <button onClick={() => setSelected(null)} className="ghost-btn">
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm font-medium">Input</div>
                <div className="rounded-md surface-quiet p-3 text-sm">
                  {selected.filename ?? '—'}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm font-medium">Result</div>
                <div className="rounded-md surface-quiet p-3 text-sm">
                  {selected.storageKey || 'No details available'}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="mb-2 text-sm font-medium">Preview</div>

                <div className="flex flex-wrap gap-3">
                  <div className="relative h-40 w-full sm:w-40 overflow-hidden rounded-md thumb-surface">
                    {selected.url ? (
                      <Image src={selected.url} alt="preview" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No preview
                      </div>
                    )}
                  </div>

                  <div className="rounded-md px-2 py-1 text-xs pill-surface">
                    {selected.dimensions?.width} × {selected.dimensions?.height}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(selected.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <a
                href={selected.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="outline-btn"
              >
                Open original
              </a>

              <button onClick={() => setSelected(null)} className="primary-btn">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
