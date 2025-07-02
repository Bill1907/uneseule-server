import { VertexAI } from '@google-cloud/vertexai';

export const vertexAIConfig = {
  project:
    process.env.GOOGLE_CLOUD_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'uneseule-ai',
  location: process.env.VERTEX_AI_LOCATION || 'us-central1', // 기본 위치
};

export const initializeVertexAI = () => {
  const vertexAI = new VertexAI({
    project: vertexAIConfig.project,
    location: vertexAIConfig.location,
  });

  return vertexAI;
};

// Gemini 모델을 위한 헬퍼 함수
export const getGeminiModel = (modelName: string = 'gemini-1.5-flash') => {
  const vertexAI = initializeVertexAI();
  return vertexAI.getGenerativeModel({
    model: modelName,
  });
};
