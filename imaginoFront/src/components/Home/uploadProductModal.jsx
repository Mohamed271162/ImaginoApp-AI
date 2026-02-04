'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { getImageWithoutBackground } from '@/services/images.service';

function UploadProductModal({ onClose }) {
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [productName, setProductName] = useState('');
  const [processedAsset, setProcessedAsset] = useState(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const params = useParams();

  const uploadImageWithoutBackground = useCallback(async (imageFile) => {
    setError(null);
    setIsProcessing(true);
    setPreview(null);
    setProductName('');
    setProcessedAsset(null);

    try {
      const formData = new FormData();
      formData.append('imageFile', imageFile);

      const result = await getImageWithoutBackground(formData);
      const imageUrl = result.imageSrc || result.enhancedImageSrc || result.originalImageSrc;

      if (!imageUrl) {
        throw new Error('No image returned from remove background API');
      }

      const filename = imageFile.name || '';
      setPreview(imageUrl);
      setProductName(filename || '');
      setProcessedAsset({
        id: result.id,
        url: imageUrl,
        filename,
      });
    } catch (err) {
      console.error('Failed to process image', err);
      toast.error('Something went wrong while processing the image. Please try again.');
      setError('Something went wrong while processing the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const imageFile = Array.isArray(files) ? files[0] : files.item(0);
      if (!imageFile) return;

      await uploadImageWithoutBackground(imageFile);
    },
    [uploadImageWithoutBackground]
  );

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        await handleFiles(acceptedFiles);
      }
    },
    [handleFiles]
  );

  const onClickUpload = () => {
    inputRef.current?.click();
  };

  const onFileChange = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isProcessing,
  });

  const handleSaveAsset = () => {
    if (!processedAsset?.id) {
      toast.error('Process an image before saving.');
      return;
    }

    const langParam = params?.lang;
    const lang = Array.isArray(langParam)
      ? langParam[0]
      : typeof langParam === 'string'
      ? langParam
      : 'en';

    const queryString = new URLSearchParams({ assetId: processedAsset.id });
    router.push(`/${lang}/all-features?${queryString.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Add asset</h1>
        <button
          type="button"
          onClick={onClose}
          className="text-2xl leading-none text-foreground hover:text-muted-foreground cursor-pointer"
        >
          <X size={32} />
        </button>
      </header>

      <div className="flex flex-1 flex-col sm:flex-row">
        <section className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
          {isProcessing ? (
            <div className="flex h-72 w-full max-w-md flex-col items-center justify-center rounded-[10px] border-3 border-dashed border-border bg-card text-center text-sm text-muted-foreground sm:h-88 sm:max-w-lg">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-main border-t-transparent" />
              <p className="font-medium text-foreground">Removing background...</p>
              <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                This may take a few seconds depending on your image size.
              </p>
            </div>
          ) : !preview ? (
            <div
              {...getRootProps()}
              onClick={onClickUpload}
              className="flex h-72 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-[10px] border-3 border-dashed border-border bg-card text-center text-sm text-muted-foreground transition hover:border-main hover:bg-section sm:h-88 sm:max-w-lg"
            >
              <input {...getInputProps()} className="hidden" />
              <div className="mb-4 text-3xl">🖼️</div>
              <p className="max-w-xs">
                Upload a photo of your product. We can automatically remove the background from your
                photo!
              </p>
              <p className="mt-3 font-medium text-foreground">
                {isDragActive ? 'Drop your image here' : 'Drop your image here or click'}
              </p>
              <p className="text-foreground">to select an image</p>
              <p className="mt-4 text-xs text-muted-foreground">
                All images in free accounts may be deleted after 90 days of inactivity
              </p>
            </div>
          ) : (
            <div className="flex w-full max-w-3xl items-center justify-center bg-muted px-4 py-6 sm:px-8 sm:py-10 border-2 rounded-[10px]">
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
            disabled={isProcessing}
          />
        </section>

        {/* Right: controls */}
        <aside className="flex w-full flex-col gap-4 border-t border-border px-4 py-6 sm:w-80 sm:border-l sm:border-t-0 sm:px-6 sm:py-8">
          <div className="mt-2 flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Untitled"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              className="h-9 rounded-[10px] border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-main"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="button"
            onClick={handleSaveAsset}
            className="mt-2 w-full rounded-[10px] bg-main px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-main-hover disabled:cursor-not-allowed disabled:opacity-65"
            disabled={isProcessing || !preview}
          >
            {isProcessing ? 'Processing…' : preview ? 'Save asset' : 'Select an image'}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default UploadProductModal;
