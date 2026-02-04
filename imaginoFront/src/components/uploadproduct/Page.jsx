'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

function Page() {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    const imageFile = files?.[0];
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreview(url);
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onClickUpload = () => {
    inputRef.current?.click();
  };

  const onFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Add asset</h1>
        <button className="text-2xl leading-none">×</button>
      </header>

      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Left: canvas / uploader */}
        <section className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
          {!preview ? (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={onClickUpload}
              className="flex h-72 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-border bg-card text-center text-sm text-muted-foreground transition hover:border-main hover:bg-section sm:h-88 sm:max-w-lg"
            >
              <div className="mb-4 text-3xl">🖼️</div>
              <p className="max-w-xs">
                Upload a photo of your product. We can automatically remove the background from your
                photo!
              </p>
              <p className="mt-3 font-medium text-foreground">Drop your image here or click</p>
              <p className="text-foreground">to select an image</p>
              <p className="mt-4 text-xs text-muted-foreground">
                All images in free accounts may be deleted after 90 days of inactivity
              </p>
            </div>
          ) : (
            <div className="flex w-full max-w-3xl items-center justify-center bg-muted px-4 py-6 sm:px-8 sm:py-10">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[10px] bg-card">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </section>

        {/* Right: controls */}
        <aside className="flex w-full flex-col gap-4 border-t border-border px-4 py-6 sm:w-80 sm:border-l sm:border-t-0 sm:px-6 sm:py-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Zoom
            </span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="10"
              className="mt-2 w-full accent-main"
            />
          </div>

          <button className="mt-1 w-full rounded-[10px] bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground">
            Refine background
          </button>

          <div className="mt-2 flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Untitled"
              className="h-9 rounded-[10px] border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-main"
            />
          </div>

          <button className="mt-4 w-full rounded-[10px] bg-main px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-main-hover">
            {preview ? 'Save asset' : 'Save asset'}
          </button>
        </aside>
      </div>
    </main>
  );
}

export default Page;
