export interface User {
  uid: string;
  id: string;
  email: string;
  displayName: string;
  profileImageUrl?: string;
  onboardingData: OnboardingData;
  isUpdatedOnboarding: boolean; // 초기 온보딩 업데이트 여부
  createdAt: Date;
  lastLoginAt: Date;
  settings: UserSettings;
  version: number;
}

export interface OnboardingData {
  age: number;
  learningLanguage: string;
  sex: string;
  learningGoals: string;
  languageLevel: string;
  interests: string[];
  tutorStyle: string;
  feedbackStyle: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  theme: string;
}

// Legacy interface for backward compatibility
export interface OnboardingResponse {
  id?: string;
  userId: string;
  ageGroup: string;
  goal: string;
  languageLevel: string;
  interests: string[];
  personality: string;
  feedbackStyle: string;
  completedAt: Date;
}

// Firestore 문서 타입 (ID 포함)
export interface UserDocument extends User {
  id: string;
}

export interface OnboardingDocument extends OnboardingResponse {
  id: string;
}
