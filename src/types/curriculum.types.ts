export interface Curriculum {
  id?: string;
  userId: string;
  title: string;
  description: string;
  suggestedByAI: boolean;
  status: 'active' | 'completed' | 'draft';
  startDate?: Date;
  endDate?: Date;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id?: string;
  title: string;
  order: number;
  status: 'pending' | 'inProgress' | 'completed';
  pptGenerated: boolean;
  aiPersonaPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}
