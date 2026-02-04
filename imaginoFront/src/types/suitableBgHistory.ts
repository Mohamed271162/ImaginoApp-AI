export type SuitableBackgroundJobType = 'suitable-bg';

export type SuitableBackgroundJobStatus = 'done' | 'processing' | 'failed';

export type SuitableBackgroundHistoryItem = {
  id: string;
  type: SuitableBackgroundJobType;
  status: SuitableBackgroundJobStatus;
  createdAt: string;
  imageSrc?: string;
  sourceImageSrc?: string;
  inputNotes?: string;
  resultNotes?: string;
  variationCount?: number;
};