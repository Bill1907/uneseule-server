// Firestore Collection 이름 상수
export const COLLECTIONS = {
  USERS: 'users',
  ONBOARDING_RESPONSES: 'onboardingResponses', // Legacy collection
  CURRICULUMS: 'curriculums',
  LEARNING_SESSIONS: 'learningSessions',
  PPT_CONTENTS: 'pptContents',
  AI_TUTOR_PERSONAS: 'aiTutorPersonas',
} as const;

export const SUBCOLLECTIONS = {
  TOPICS: 'topics', // curriculums/{curriculumId}/topics
  CHAT_MESSAGES: 'chatMessages', // learningSessions/{sessionId}/chatMessages
} as const;

// Collection 타입
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
export type SubcollectionName =
  (typeof SUBCOLLECTIONS)[keyof typeof SUBCOLLECTIONS];

// 서브컬렉션 경로 헬퍼
export const getSubCollectionPath = (
  parentCollection: string,
  parentId: string,
  subCollection: string,
) => {
  return `${parentCollection}/${parentId}/${subCollection}`;
};

// 일반적인 서브컬렉션 경로들
export const SUB_COLLECTION_PATHS = {
  curriculumTopics: (curriculumId: string) =>
    getSubCollectionPath(
      COLLECTIONS.CURRICULUMS,
      curriculumId,
      SUBCOLLECTIONS.TOPICS,
    ),
  sessionChatMessages: (sessionId: string) =>
    getSubCollectionPath(
      COLLECTIONS.LEARNING_SESSIONS,
      sessionId,
      SUBCOLLECTIONS.CHAT_MESSAGES,
    ),
} as const;
