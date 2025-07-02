export interface LearningSession {
  id?: string;
  userId: string;
  topicId: string;
  curriculumId?: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  summary: string;
  feedbackSubmitted: boolean;
  userFeedback?: UserFeedback;
  performanceMetrics: PerformanceMetrics;
  createdAt: Date;
}

export interface UserFeedback {
  rating: number; // 1-5
  text: string;
}

export interface PerformanceMetrics {
  answerAccuracy: number; // 0-100
  understandingScore: number; // 0-100
  weakAreas: string[];
  strongAreas: string[];
}

export interface ChatMessage {
  id?: string;
  sender: 'user' | 'ai';
  type: 'text' | 'audio' | 'dynamic_ui';
  text: string;
  audioUrl?: string;
  timestamp: Date;
  dynamicUiData?: DynamicUiData;
}

export interface DynamicUiData {
  componentType:
    | 'codeSnippet'
    | 'quizMultipleChoice'
    | 'vocabularyCard'
    | string;
  data: DynamicUiComponentData;
  version: number;
}

export interface DynamicUiComponentData {
  title?: string;
  question?: string;
  options?: QuizOption[];
  correctAnswer?: string | string[];
  [key: string]: any; // 각 컴포넌트 타입에 따른 유연한 데이터
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// Legacy interface for backward compatibility
export interface TutorSession {
  id?: string;
  userId: string;
  topicId: string;
  startTime: Date;
  endTime: Date;
  messages: ChatMessage[];
  summary?: string;
}

export interface TutorSessionDocument extends TutorSession {
  id: string;
}
