export type AiEdit = {
  operation: string;
  provider: string;
  prompt?: string;
  parameters?: Record<string, unknown>;
  timestamp: string;
  processingTime?: number;
  cost?: number;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

export type ImageDocument = {
  _id: string;
  user: string;
  parentId?: string | null;
  children?: string[];
  isOriginal: boolean;
  version: number;
  isBackgroundOnly?: boolean;
  url: string;
  storageKey: string;
  thumbnailUrl?: string;
  filename: string;
  originalFilename?: string;
  mimeType: string;
  size: number;

  dimensions: ImageDimensions;
  aiEdits: AiEdit[];
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'deleted';
  processingError?: string;
  tags: string[];
  title?: string;
  description?: string;
  category?: 'portrait' | 'landscape' | 'product' | 'art' | 'other';
  isPublic: boolean;
  shareToken?: string;
  views: number;
  downloads: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type EnhancedImageResult = {
  original: ImageDocument;
  enhanced: ImageDocument;
};

// & Enhance Image
export type EnhancedImageResponse = {
  message: string;
  status: number;
  result: EnhancedImageResult;
};

export type NewAngleImageResult = {
  original: ImageDocument;
  enhanced: ImageDocument;
};

// & New Angle Image (genImgWithNewDimension)
export type NewAngleImageResponse = {
  message: string;
  status: number;
  result: NewAngleImageResult;
};

export type ResizedImageResult = {
  originalImage: ImageDocument;
  resizedImage: ImageDocument;
};

// & Resize Image
export type ResizedImageResponse = {
  message: string;
  status: number;
  result: ResizedImageResult;
};

// &  Get Image (returns the image plus its children variants)
export type ImageResponse = {
  message: string;
  status: number;
  result: {
    image: ImageDocument;
    children: ImageDocument[];
  };
};

export type BackgroundsForImageResult = {
  parentImage: ImageDocument;
  backgrounds: ImageDocument[];
  totalCount: number;
  page: number;
  size: number;
};

// & Get List Backgrounds generated from an image
export type BackgroundsForImageResponse = {
  message: string;
  status: number;
  result: BackgroundsForImageResult;
};

export type BlurredImageResult = {
  originalImage: ImageDocument | null;
  blurredImage: ImageDocument;
};

// & Blur Image Region
export type BlurredImageResponse = {
  message: string;
  status: number;
  result: BlurredImageResult;
};

// & Generate Image with New Background
export type NewBackgroundImageResult = {
  transparentImage: ImageDocument;
  generatedImage: ImageDocument;
};

export type NewBackgroundImageResponse = {
  message: string;
  status: number;
  result: NewBackgroundImageResult;
};

// & Generate Image with Selected Background
export type SelectedBackgroundImageResult = {
  transparentImage: ImageDocument;
  generatedImage: ImageDocument;
  backgroundImage?: ImageDocument;
};

export type SelectedBackgroundImageResponse = {
  message: string;
  status: number;
  result: SelectedBackgroundImageResult;
};

// & Get User Images
export type UserImageListItem = Pick<
  ImageDocument,
  | '_id'
  | 'url'
  | 'storageKey'
  | 'filename'
  | 'mimeType'
  | 'size'
  | 'dimensions'
  | 'status'
  | 'isPublic'
  | 'aiEdits'
>;

export type GetUserImagesResponse = {
  message: string;
  status: number;
  result: {
    items: UserImageListItem[];
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
};

// & Get All Images (dashboard list)
export type GalleryImageListItem = Pick<
  ImageDocument,
  | '_id'
  | 'user'
  | 'url'
  | 'thumbnailUrl'
  | 'storageKey'
  | 'filename'
  | 'mimeType'
  | 'size'
  | 'dimensions'
  | 'tags'
  | 'title'
  | 'description'
  | 'category'
  | 'isPublic'
  | 'views'
  | 'downloads'
  | 'createdAt'
  | 'updatedAt'
>;

export type GetAllImagesResponse = {
  message: string;
  status: number;
  result: {
    images: GalleryImageListItem[];
    totalCount: number;
    page: number;
    size: number;
  };
};
