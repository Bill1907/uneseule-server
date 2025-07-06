export interface UserTrainingData {
  userId: string;
  age: number;
  learningLanguage: string;
  sex: string;
  learningGoals: string;
  languageLevel: string;
  interests: string[];
  tutorStyle: string;
  feedbackStyle: string;
  isUpdatedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export type CreateUserTrainingDataDto = Omit<
  UserTrainingData,
  'userId' | 'createdAt' | 'updatedAt' | 'version' | 'isUpdatedOnboarding'
>;
