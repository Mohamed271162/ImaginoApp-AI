'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Section from '@/components/shared/Section/Section';
import GalleryTempLayer from '@/components/gallery/GalleryTempLayer/GalleryTempLayer';
import Popup from '@/components/gallery/Popup/Popup';
import { getAllImages } from '@/services/images.service';
import type { GalleryImageListItem } from '@/types/images';

const FALLBACK_IMAGE = '/assets/gallery/gallery1.jpg';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        // Do not filter by isPublic so we fetch all available images for the user
        const res = await getAllImages({ page: 1, size: 60 });
        console.log('Gallery images loaded:👉👉', res);
        if (!active) return;
        setImages(res.result?.images ?? []);
      } catch (err) {
        console.error('Failed to load gallery images', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex flex-col gap-8 pb-16">
      <header className="p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Find your next winning shot</h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Filter by category and preview product photos instantly — just like in your Imagino flow.
        </p>
      </header>

      <Section className="px-4 md:px-8 lg:px-16">
        <div className="rounded-2xl border border-border bg-card/50 p-4 shadow-sm">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-main border-t-transparent" />
              Loading images…
            </div>
          ) : images.length === 0 ? (
            <div className="text-muted-foreground text-sm">No images found.</div>
          ) : (
            <div className="gallery-columns">
              {images.map((image) => {
                const img = image.url || image.thumbnailUrl || FALLBACK_IMAGE;
                return (
                  <div
                    key={image._id}
                    className="gallery-item"
                    tabIndex={0}
                    role="button"
                    aria-label={`Open image ${image.filename || image._id}`}
                    onClick={() => setSelectedImage(img)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedImage(img);
                    }}
                  >
                    <div className="img-wrap" style={{ aspectRatio: '4 / 3' }}>
                      <Image
                        src={img}
                        alt={image.filename || image._id}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain w-full h-full block bg-background"
                      />
                    </div>
                    <GalleryTempLayer />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {selectedImage && <Popup selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
    </main>
  );
}
