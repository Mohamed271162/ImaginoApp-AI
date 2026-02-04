export type ChangeStyleHistoryItem = {
  id: string;
  type: "change-style";
  status: "done" | "processing" | "failed";
  createdAt: string;

  originalImageSrc?: string;
  enhancedImageSrc?: string;
  storageKey?: string;
  version?: number;
  provider?: string;
  tags?: string[];
};
