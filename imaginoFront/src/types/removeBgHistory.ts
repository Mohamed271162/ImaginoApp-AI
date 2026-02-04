export type RemoveBgJobType = "remove-bg";
export type RemoveBgJobStatus = "done" | "processing" | "failed";

export type RemoveBgHistoryItem = {
  id: string;
  type: RemoveBgJobType;
  status: RemoveBgJobStatus;
  createdAt: string;

  imageSrc?: string;
  originalImageSrc?: string;
  enhancedImageSrc?: string;
  storageKey?: string;
  tags?: string[];
  provider?: string;
};