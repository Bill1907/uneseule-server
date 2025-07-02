export interface AiTutorPersona {
  id?: string;
  userId?: string; // 특정 사용자에게 최적화된 페르소나일 경우
  name: string;
  promptTemplate: string;
  tone: 'formal' | 'friendly' | 'casual';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  expertiseArea: string;
  languageStyle: 'academic' | 'conversational';
  createdAt: Date;
  updatedAt: Date;
}
