'use client';
import { motion } from 'framer-motion';
import {
  Cpu,
  Download,
  Expand,
  ImageIcon,
  Loader2,
  Layers,
  Wand2,
  Sparkles,
  Trash2,
  Scan,
} from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  blurRegion,
  changeImageStyle,
  extractTextFromImage,
  getImage,
  genImgWithNewBackground,
  genImgWithSelectedBackground,
  genSuitableBackgroundById,
  getImageWithoutBackground,
  resizeImage,
  recognizeItemsInImage,
} from '@/services/images.service';
import { RecognizeItemsHistoryItem } from '@/types/RecognizeItemsHistory';
import { genImageWithNewDimension, inhanceImageQuality } from '@/services/images.service';
import { toast } from 'sonner';

type SuitableBackgroundItem = { id: string; imageSrc: string };

export default function AllFeatures() {
  const anglePresets = [
    { label: 'Front', value: 'front' },
    { label: 'Back', value: 'back' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' },
    { label: 'Front-Right', value: 'front-right' },
    { label: 'Front-Left', value: 'front-left' },
    { label: 'Back Right', value: 'back-right' },
    { label: 'Back Left', value: 'back-left' },
    { label: 'Top Right', value: 'top-right' },
    { label: 'Top Left', value: 'top-left' },
    { label: 'Bottom Right', value: 'bottom-right' },
    { label: 'Bottom Left', value: 'bottom-left' },
    { label: 'Center', value: 'center' },
  ];
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showRotate, setShowRotate] = useState(false);
  const [angle, setAngle] = useState<string>('');
  const [ImageId, setImageId] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [recognizedItems, setRecognizedItems] = useState<RecognizeItemsHistoryItem | null>(null);
  const [showBlurRegion, setShowBlurRegion] = useState(false);
  const [blurRadius, setBlurRadius] = useState<number>(25);
  const [blurRect, setBlurRect] = useState({ x: 80, y: 80, width: 260, height: 200 });
  const [imageBox, setImageBox] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });
  const [showResizeOptions, setShowResizeOptions] = useState(false);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [resizeFit, setResizeFit] = useState('inside');
  const [suitableBackgrounds, setSuitableBackgrounds] = useState<SuitableBackgroundItem[]>([]);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null);
  const [suitableBgLoading, setSuitableBgLoading] = useState(false);
  const [dragMode, setDragMode] = useState<
    'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null
  >(null);
  const dragStartRef = useRef({ x: 0, y: 0, rect: { x: 0, y: 0, width: 0, height: 0 } });
  const searchParams = useSearchParams();
  const provider = 'cloudinary';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateImageBox = () => {
    if (!previewRef.current || !imageRef.current) return;
    const imgRect = imageRef.current.getBoundingClientRect();
    const contRect = previewRef.current.getBoundingClientRect();
    setImageBox({
      left: imgRect.left - contRect.left,
      top: imgRect.top - contRect.top,
      width: imgRect.width,
      height: imgRect.height,
      naturalWidth: imageRef.current.naturalWidth || imgRect.width,
      naturalHeight: imageRef.current.naturalHeight || imgRect.height,
    });
  };

  useEffect(() => {
    if (!showBlurRegion || !previewRef.current || !imageRef.current) return;
    updateImageBox();
    const box = imageRef.current.getBoundingClientRect();
    setBlurRect((current) => {
      if (current.width > 0 && current.height > 0) return current;
      const width = Math.max(120, box.width * 0.6);
      const height = Math.max(120, box.height * 0.4);
      return {
        x: (box.width - width) / 2,
        y: (box.height - height) / 2,
        width,
        height,
      };
    });
  }, [showBlurRegion, preview]);

  useEffect(() => {
    const onResize = () => updateImageBox();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const imageIdFromQuery = searchParams.get('assetId');
    if (!imageIdFromQuery || ImageId === imageIdFromQuery) return;

    const loadImage = async () => {
      setProcessing(true);
      try {
        const res = await getImage(imageIdFromQuery);

        const doc = res?.result?.image;
        const url = doc?.url;
        if (!url) {
          console.warn('No usable URL on image document', doc);
          throw new Error('No image URL returned for this asset.');
        }

        setPreview(url);
        console.log('ImageId👉👉', doc?._id);
        setImageId(doc?._id);
      } catch (err) {
        console.error('Failed to load image from query param', err);
        toast.error('Could not load the shared image.');
      } finally {
        setProcessing(false);
      }
    };

    loadImage();
  }, [searchParams]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!dragMode || !previewRef.current) return;
      const bounds = imageBox;
      if (!bounds.width || !bounds.height) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const start = dragStartRef.current.rect;
      let { x, y, width, height } = start;
      const minSize = 20;

      const clamp = (value: number, min: number, max: number) =>
        Math.min(Math.max(value, min), max);

      const applyResize = (edge: 'left' | 'right' | 'top' | 'bottom', delta: number) => {
        if (edge === 'left') {
          const newX = clamp(x + delta, 0, x + width - minSize);
          width = width + (x - newX);
          x = newX;
        }
        if (edge === 'right') {
          const maxWidth = bounds.width - x;
          width = clamp(width + delta, minSize, maxWidth);
        }
        if (edge === 'top') {
          const newY = clamp(y + delta, 0, y + height - minSize);
          height = height + (y - newY);
          y = newY;
        }
        if (edge === 'bottom') {
          const maxHeight = bounds.height - y;
          height = clamp(height + delta, minSize, maxHeight);
        }
      };

      switch (dragMode) {
        case 'move': {
          x = clamp(x + dx, 0, bounds.width - width);
          y = clamp(y + dy, 0, bounds.height - height);
          break;
        }
        case 'nw':
          applyResize('left', dx);
          applyResize('top', dy);
          break;
        case 'ne':
          applyResize('right', dx);
          applyResize('top', dy);
          break;
        case 'sw':
          applyResize('left', dx);
          applyResize('bottom', dy);
          break;
        case 'se':
          applyResize('right', dx);
          applyResize('bottom', dy);
          break;
        case 'n':
          applyResize('top', dy);
          break;
        case 's':
          applyResize('bottom', dy);
          break;
        case 'e':
          applyResize('right', dx);
          break;
        case 'w':
          applyResize('left', dx);
          break;
        default:
          break;
      }

      setBlurRect({ x, y, width, height });
    };

    const handleUp = () => setDragMode(null);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
  }, [dragMode, imageBox]);

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>,
    mode: 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  ) => {
    if (!previewRef.current) return;
    e.preventDefault();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rect: { ...blurRect },
    };
    setDragMode(mode);
  };

  function clear() {
    setFile(null);
    setPreview(null);
  }

  async function downloadImage() {
    if (!preview) return;
    const a = document.createElement('a');
    a.href = preview;
    a.target = '_blank';
    a.download = 'product-shot.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function autoEnhance() {
    if (!file) return;
    setProcessing(true);

    try {
      const res = await inhanceImageQuality(file);
      const enhancedUrl = res?.result?.enhanced?.url;

      if (enhancedUrl) {
        setPreview(enhancedUrl);
        setImageId(res.result.enhanced._id || ImageId);
        // setHistory((h) => [enhancedUrl, ...h].slice(0, 20));
      }
    } catch (err) {
      console.error(err);
      toast.error('Error enhancing image — please try again.');
    } finally {
      setProcessing(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function rotateImage() {
    if (!file) {
      toast.error('Please upload an image first.');
      return;
    }

    if (angle === '') {
      toast.error('View is required.');
      return;
    }

    setProcessing(true);
    try {
      const res = await genImageWithNewDimension(file, angle);
      const rotatedUrl = res?.result?.enhanced?.url;
      console.log(res, '👉', rotatedUrl);

      if (rotatedUrl) {
        setPreview(rotatedUrl);
        setImageId(res.result.enhanced._id || ImageId);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error rotating image — please try again.');
    } finally {
      setProcessing(false);
    }
  }

  async function callRemoveBg() {
    if (!file) return;
    setProcessing(true);

    try {
      const fd = new FormData();
      fd.append('imageFile', file);
      const result = await getImageWithoutBackground(fd);

      const imageUrl = result.imageSrc || result.enhancedImageSrc || result.originalImageSrc;

      if (!imageUrl) {
        console.error('No image returned from remove-bg. Full result:', result);
        toast.error('No image returned from remove-bg. Check console for details.');
        return;
      }

      setPreview(imageUrl);
      setImageId(result.id);
    } catch (err) {
      console.error(err);
      toast.error('Error removing background — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function generateSuitableBg() {
    if (!ImageId) {
      toast.error('Need to remove background first to get Generate new background.');
      return;
    }
    setSuitableBgLoading(true);
    try {
      const result = await genSuitableBackgroundById(ImageId);
      const { id, imageSrc } = result;
      if (!imageSrc || !id) throw new Error('No image returned from suitable-background');
      setSuitableBackgrounds((prev) => [{ id, imageSrc }, ...prev.filter((bg) => bg.id !== id)]);
      setSelectedBackgroundId((current) => current || id);
      toast.success('Background generated');
    } catch (err) {
      console.error(err);
      toast.error('Error generating suitable background — check console.');
    } finally {
      setSuitableBgLoading(false);
    }
  }

  async function generateWithSelectedBackground() {
    if (!ImageId) {
      toast.error('Remove the background first to apply a new one.');
      return;
    }
    if (!selectedBackgroundId) {
      toast.error('Select a generated background first.');
      return;
    }

    setProcessing(true);
    try {
      const res = await genImgWithSelectedBackground({
        productImageId: ImageId,
        backgroundImageId: selectedBackgroundId,
      });
      const generatedUrl = res?.result?.generatedImage?.url;

      if (!generatedUrl) {
        throw new Error('No generated image returned from selected-background API');
      }

      setPreview(generatedUrl);
      setImageId(res.result.generatedImage._id || ImageId);
      toast.success('Applied selected background');
    } catch (err) {
      console.error(err);
      toast.error('Error applying selected background — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function genImageWithNewBackground() {
    if (!ImageId) {
      toast.error('Remove the background first to apply a new one.');
      return;
    }

    setProcessing(true);
    try {
      const res = await genImgWithNewBackground({ imageId: ImageId });
      const generatedUrl = res?.result?.generatedImage?.url;

      if (!generatedUrl) {
        throw new Error('No generated image returned from new-background API');
      }

      setPreview(generatedUrl);
      setImageId(res.result.generatedImage._id || ImageId);
    } catch (err) {
      console.error(err);
      toast.error('Error applying background — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function callChangeStyle(file: File, style: string) {
    setProcessing(true);
    try {
      const result = await changeImageStyle(file, style);
      setPreview(result.enhancedImageSrc || '');
      setImageId(result.id);
    } catch (err) {
      if (err instanceof Error && err.message === 'AUTH_EXPIRED') {
        toast.error('Session expired. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login?authExpired=1';
        }
        return;
      }
      console.error(err);
      toast.error('Error changing style — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function callExtractText(fileParam?: File) {
    const sourceFile = fileParam || file || undefined;
    const sourceImageId = ImageId || undefined;

    if (!sourceFile && !sourceImageId) {
      toast.error('Upload an image or load an existing one first.');
      return;
    }

    setProcessing(true);

    try {
      const result = await extractTextFromImage({
        file: sourceFile,
        imageId: sourceImageId,
      });

      setExtractedText(result.text);
      setRecognizedItems(null);
    } catch (err) {
      console.error(err);
      toast.error('Error extracting text — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function callRecognizeItems() {
    const sourceFile = file || undefined;
    const sourceImageId = ImageId || undefined;

    if (!sourceFile && !sourceImageId) {
      toast.error('Upload an image or load an existing one first.');
      return;
    }

    setProcessing(true);

    try {
      const result = await recognizeItemsInImage({
        file: sourceFile,
        imageId: sourceImageId,
      });
      console.log('Recognize-items result:', result);

      setRecognizedItems(result);
      // setRecognizeItemsHistory((h) => [result, ...h].slice(0, 20));
      setExtractedText('');
    } catch (err) {
      console.error(err);
      toast.error('Error recognizing items — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function callResizeCurrentImage() {
    const sourceFile = ImageId ? undefined : file || undefined;
    const sourceImageId = ImageId || undefined;

    if (!sourceFile && !sourceImageId) {
      toast.error('Upload an image or load an existing one first.');
      return;
    }

    if (!resizeWidth && !resizeHeight) {
      toast.error('Provide width, height, or both.');
      return;
    }

    const widthNumber = resizeWidth ? Number(resizeWidth) : undefined;
    const heightNumber = resizeHeight ? Number(resizeHeight) : undefined;

    if (
      (widthNumber !== undefined && (!Number.isFinite(widthNumber) || widthNumber <= 0)) ||
      (heightNumber !== undefined && (!Number.isFinite(heightNumber) || heightNumber <= 0))
    ) {
      toast.error('Width and height must be positive numbers.');
      return;
    }

    setProcessing(true);

    try {
      const res = await resizeImage({
        imageId: sourceImageId,
        file: sourceFile,
        width: widthNumber,
        height: heightNumber,
        fit: resizeFit || undefined,
      });

      const newUrl = res?.result?.resizedImage?.url;

      if (!newUrl) {
        toast.error('No image returned from resize API.');
        return;
      }

      setImageId(res.result.resizedImage._id || ImageId);
      setPreview(newUrl);
    } catch (err) {
      console.error(err);
      toast.error('Error resizing image — check console.');
    } finally {
      setProcessing(false);
    }
  }

  async function applyBlurRegion() {
    if (!preview) {
      toast.error('Upload or generate an image first.');
      return;
    }

    if (!ImageId && !file) {
      toast.error('Provide an image by upload or use an existing imageId.');
      return;
    }

    if (!imageBox.width || !imageBox.height || !imageBox.naturalWidth || !imageBox.naturalHeight) {
      toast.error('Image dimensions unavailable. Please try again.');
      return;
    }

    const scaleX = imageBox.naturalWidth / imageBox.width;
    const scaleY = imageBox.naturalHeight / imageBox.height;

    const bodyX = Math.round(blurRect.x * scaleX);
    const bodyY = Math.round(blurRect.y * scaleY);
    const bodyWidth = Math.round(blurRect.width * scaleX);
    const bodyHeight = Math.round(blurRect.height * scaleY);

    setProcessing(true);
    try {
      const res = await blurRegion({
        imageId: ImageId || undefined,
        file: ImageId ? undefined : file || undefined,
        x: bodyX,
        y: bodyY,
        width: bodyWidth,
        height: bodyHeight,
        blurRadius: Math.round(blurRadius),
      });

      const newUrl = res?.result?.blurredImage?.url;

      if (newUrl) {
        setPreview(newUrl);
        setImageId(res.result.blurredImage._id || ImageId);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error applying blur region — check console.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient from-white to-slate-50 text-slate-900 p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow">
              <ImageIcon className="w-7 h-7 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Imagino — All Features</h1>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1"
        >
          <Card className="rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Upload & Quick Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
                <div className="border-dashed border-2 border-slate-200 rounded-2xl p-4 text-center bg-white">
                  <p className="text-sm text-slate-500">Upload product image (PNG/JPG)</p>
                  <div className="mt-4 flex justify-center">
                    <Button onClick={() => inputRef.current?.click()} className="rounded-2xl">
                      Upload image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={callRemoveBg}
                    disabled={!file || processing}
                    className="rounded-2xl"
                  >
                    <Layers className="w-4 h-4 mr-2" /> Remove BG
                  </Button>

                  <Button
                    onClick={genImageWithNewBackground}
                    disabled={!preview || processing}
                    className="rounded-2xl"
                  >
                    <Wand2 className="w-4 h-4 mr-2" /> Generate BG
                  </Button>

                  <Button
                    onClick={() => ''}
                    disabled={!preview || processing}
                    className="rounded-2xl"
                  >
                    <Expand className="w-4 h-4 mr-2" /> Add Shadow
                  </Button>

                  <Button
                    onClick={autoEnhance}
                    disabled={!preview || processing}
                    className="rounded-2xl"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Auto Enhance
                  </Button>

                  <Button
                    onClick={() => callExtractText()}
                    disabled={(!file && !ImageId) || processing}
                    className="rounded-2xl"
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Extract Text
                  </Button>

                  <Button
                    onClick={callRecognizeItems}
                    disabled={(!file && !ImageId) || processing}
                    className="rounded-2xl"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Recognize Items
                  </Button>
                </div>

                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRotate((prev) => !prev)}
                    className="w-full rounded-2xl border-2 border-slate-700"
                  >
                    Extract Object in dimensions
                  </Button>

                  {showRotate && (
                    <div className="rounded-2xl border border-slate-300 bg-white p-3 flex flex-col gap-2">
                      <select
                        value={angle}
                        onChange={(e) => setAngle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                      >
                        <option value="" disabled>
                          Select view
                        </option>
                        {anglePresets.map((preset) => (
                          <option key={preset.value} value={preset.value}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={rotateImage}
                        disabled={processing || angle === ''}
                        className="rounded-2xl"
                      >
                        <Loader2 className="w-4 h-4 mr-2" /> Rotate
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!preview) {
                        toast.error('Upload or generate an image first.');
                        return;
                      }
                      setShowBlurRegion((prev) => !prev);
                    }}
                    className="w-full rounded-2xl border-2 border-slate-700"
                  >
                    Blur Region
                  </Button>

                  {showBlurRegion && (
                    <div className="rounded-2xl border border-slate-300 bg-white p-3 flex flex-col gap-3">
                      <label className="text-sm text-slate-600 flex items-center justify-between gap-2">
                        <span>Blur radius</span>
                        <span className="text-slate-800 font-medium">{blurRadius}</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={100}
                        step={1}
                        value={blurRadius}
                        onChange={(e) => setBlurRadius(Number(e.target.value))}
                        className="w-full accent-slate-700"
                      />
                      <Button
                        onClick={applyBlurRegion}
                        disabled={processing}
                        className="rounded-2xl"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-2 space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowResizeOptions((prev) => !prev)}
                    className="w-full rounded-2xl border-2 border-slate-700"
                  >
                    Resize Image
                  </Button>

                  {showResizeOptions && (
                    <div className="rounded-2xl border border-slate-300 bg-white p-3 flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="text-sm text-slate-600 flex flex-col gap-1">
                          <span>Width</span>
                          <input
                            type="number"
                            min={1}
                            value={resizeWidth}
                            onChange={(e) => setResizeWidth(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                            placeholder="e.g. 800"
                          />
                        </label>

                        <label className="text-sm text-slate-600 flex flex-col gap-1">
                          <span>Height</span>
                          <input
                            type="number"
                            min={1}
                            value={resizeHeight}
                            onChange={(e) => setResizeHeight(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                            placeholder="e.g. 600"
                          />
                        </label>
                      </div>

                      <label className="text-sm text-slate-600 flex flex-col gap-1">
                        <span>Fit</span>
                        <select
                          value={resizeFit}
                          onChange={(e) => setResizeFit(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200 bg-white"
                        >
                          {['cover', 'contain', 'fill', 'inside', 'outside'].map((fitOption) => (
                            <option key={fitOption} value={fitOption}>
                              {fitOption}
                            </option>
                          ))}
                        </select>
                      </label>

                      <Button
                        onClick={callResizeCurrentImage}
                        disabled={processing || (!file && !ImageId)}
                        className="rounded-2xl"
                      >
                        Resize
                      </Button>
                    </div>
                  )}
                </div>

                {/*                  */}

                <div className="flex gap-2 justify-between">
                  <Button variant="outline" onClick={clear} className="rounded-2xl">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear
                  </Button>

                  <Button onClick={downloadImage} disabled={!preview} className="rounded-2xl">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>

                <div className="text-xs text-slate-400">
                  Provider: <span className="font-medium text-slate-700">{provider}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Style Selection Card */}
          <Card className="mt-4 rounded-2xl">
            <CardHeader>
              <CardTitle>Select Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {['anime', 'cartoon', 'pixar', 'watercolor', 'oil', 'pencil'].map((style) => (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? 'default' : 'outline'}
                    className="rounded-2xl"
                    onClick={() => setSelectedStyle(style)}
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </CardContent>
            <Button
              onClick={() => callChangeStyle(file!, selectedStyle!)}
              disabled={!preview || processing || !selectedStyle}
              className="rounded-2xl flex items-center gap-2 mx-5"
            >
              <Sparkles className="w-5 h-5" />
              Change Style
            </Button>
          </Card>
        </motion.aside>

        {/* Middle column: Preview 1 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-1 lg:col-span-2"
        >
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Editor Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
                <div
                  ref={previewRef}
                  className="relative w-full h-[520px] rounded-2xl border border-slate-100 bg-linear-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden"
                >
                  {preview ? (
                    <motion.img
                      ref={imageRef}
                      onLoad={updateImageBox}
                      key={preview}
                      src={preview}
                      alt="preview"
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <p className="text-sm">No preview yet — upload an image and start editing.</p>
                      <div className="mt-3 inline-flex gap-2">
                        <Button onClick={() => inputRef.current?.click()} className="rounded-2xl">
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}

                  {preview && showBlurRegion && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ cursor: dragMode === 'move' ? 'grabbing' : 'default' }}
                    >
                      <div
                        className="absolute border-2 border-sky-500/80 bg-sky-300/10"
                        style={{
                          left: imageBox.left + blurRect.x,
                          top: imageBox.top + blurRect.y,
                          width: blurRect.width,
                          height: blurRect.height,
                        }}
                      >
                        <button
                          type="button"
                          className="absolute inset-0 w-full h-full cursor-move"
                          onMouseDown={(e) => startDrag(e, 'move')}
                          style={{ pointerEvents: 'auto' }}
                          aria-label="Move blur region"
                        />

                        {(
                          [
                            ['nw', 'top-0 left-0 cursor-nw-resize'],
                            ['ne', 'top-0 right-0 cursor-ne-resize'],
                            ['sw', 'bottom-0 left-0 cursor-sw-resize'],
                            ['se', 'bottom-0 right-0 cursor-se-resize'],
                            ['n', 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize'],
                            ['s', 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize'],
                            ['e', 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize'],
                            ['w', 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize'],
                          ] as const
                        ).map(([key, classes]) => (
                          <button
                            key={key}
                            type="button"
                            className={`absolute w-3 h-3 bg-white border border-sky-500 rounded-full -translate-x-1/2 -translate-y-1/2 ${classes}`}
                            onMouseDown={(e) => startDrag(e, key)}
                            style={{ pointerEvents: 'auto' }}
                            aria-label={`Resize ${key}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {processing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
                      <p className="text-sm text-slate-700">this might takes a moment...</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {(extractedText || (recognizedItems && recognizedItems.items.length > 0)) && (
            <Card className="rounded-2xl mt-4 p-4 shadow bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Image Analysis</CardTitle>
              </CardHeader>

              <CardContent>
                {/* Extracted Text & Recognized Items */}
                <div className="border rounded-xl p-4 bg-slate-50 max-h-[350px] overflow-auto whitespace-pre-wrap">
                  {/* Extracted Text */}
                  {extractedText && (
                    <div className="mb-4">
                      <p className="font-semibold mb-1">Extracted Text:</p>
                      <p>{extractedText}</p>
                    </div>
                  )}

                  {/* Recognized Items */}
                  {recognizedItems && recognizedItems.items.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2">
                        Recognized Items ({recognizedItems.totalItemsDetected}):
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {recognizedItems.items.map(
                          (item: RecognizeItemsHistoryItem['items'][number], idx: number) => (
                            <li key={idx}>
                              <span className="font-medium">{item.item_name}</span> -{' '}
                              {item.category} (Count: {item.count})
                              <p className="text-lg text-slate-500">{item.description}</p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl mt-4 shadow bg-white">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">Generated Backgrounds</CardTitle>
              <Button
                onClick={generateSuitableBg}
                disabled={suitableBgLoading || !ImageId}
                className="rounded-2xl"
              >
                {suitableBgLoading ? 'Generating…' : 'Generate suitable background'}
              </Button>
            </CardHeader>
            <CardContent>
              {suitableBackgrounds.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No backgrounds yet. Generate one to see it here.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {suitableBackgrounds.map((bg) => {
                      const isSelected = selectedBackgroundId === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setSelectedBackgroundId(bg.id)}
                          className={`relative aspect-square overflow-hidden rounded-xl border bg-slate-50 transition focus:outline-none ${
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <motion.img
                            src={bg.imageSrc}
                            alt={`bg-${bg.id}`}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <span className="absolute inset-0 border-2 border-sky-500 rounded-xl pointer-events-none" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={generateWithSelectedBackground}
                      disabled={!selectedBackgroundId || !ImageId || processing}
                      className="rounded-2xl w-full sm:w-auto"
                    >
                      Generate With Selected Background
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* add here card to show grid or generated backgrounds and can be selectable so we will pass there id later */}
        </motion.section>
      </section>
    </main>
  );
}
