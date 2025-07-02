export interface PptContent {
  id?: string;
  topicId: string;
  userId: string;
  version: number;
  status: 'generating' | 'ready' | 'modified';
  data: PptData;
  createdAt: Date;
  updatedAt: Date;
}

export interface PptData {
  slides: PptSlide[];
}

export interface PptSlide {
  slideId: string;
  title: string;
  body: string;
  images: SlideImage[];
  prompts?: string[];
  dynamicUiTriggers?: DynamicUiTrigger[];
}

export interface SlideImage {
  url: string;
  caption?: string;
  alt?: string;
}

export interface DynamicUiTrigger {
  condition: string;
  data: Record<string, any>;
}
