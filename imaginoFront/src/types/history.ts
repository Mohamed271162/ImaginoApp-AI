export type JobType = 'remove-bg' | 'generate-bg' | 'generate-3d';

export type JobStatus = 'done' | 'processing' | 'failed';

export type HistoryItem = {
  id: string;
  type: JobType;
  status: JobStatus;
  createdAt: string;
  imageSrc?: string;
  inputNotes?: string;
  resultNotes?: string;
  variationCount?: number;
};

