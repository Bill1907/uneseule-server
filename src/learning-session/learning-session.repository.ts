import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository.js';
import { LearningSession, ChatMessage } from '../types/index.js';
import { COLLECTIONS, SUBCOLLECTIONS } from '../types/collections.js';

@Injectable()
export class LearningSessionRepository extends BaseRepository<LearningSession> {
  protected collectionName = COLLECTIONS.LEARNING_SESSIONS;

  async findByUserId(userId: string): Promise<LearningSession[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('startTime', 'desc')
      .get();
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as LearningSession,
    );
  }

  async findByTopicId(topicId: string): Promise<LearningSession[]> {
    return this.findByField('topicId', topicId);
  }

  async findByCurriculumId(curriculumId: string): Promise<LearningSession[]> {
    return this.findByField('curriculumId', curriculumId);
  }

  async updateSessionEnd(
    sessionId: string,
    endTime: Date,
    summary: string,
  ): Promise<void> {
    const startTime = (await this.findById(sessionId))?.startTime;
    if (startTime) {
      const durationMinutes = Math.round(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60),
      );
      await this.update(sessionId, {
        endTime,
        summary,
        durationMinutes,
      });
    }
  }

  async updatePerformanceMetrics(
    sessionId: string,
    metrics: LearningSession['performanceMetrics'],
  ): Promise<void> {
    await this.update(sessionId, { performanceMetrics: metrics });
  }

  async submitFeedback(
    sessionId: string,
    feedback: LearningSession['userFeedback'],
  ): Promise<void> {
    await this.update(sessionId, {
      userFeedback: feedback,
      feedbackSubmitted: true,
    });
  }

  // ChatMessage 관련 메서드들
  async addChatMessage(
    sessionId: string,
    messageData: Omit<ChatMessage, 'id' | 'timestamp'>,
  ): Promise<string> {
    const messageWithTimestamp = {
      ...messageData,
      timestamp: new Date(),
    };
    return this.createSubDocument<ChatMessage>(
      sessionId,
      SUBCOLLECTIONS.CHAT_MESSAGES,
      messageWithTimestamp,
    );
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const subCollection = this.getSubCollection<ChatMessage>(
      sessionId,
      SUBCOLLECTIONS.CHAT_MESSAGES,
    );
    const snapshot = await subCollection.orderBy('timestamp', 'asc').get();
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as ChatMessage,
    );
  }

  async getLatestChatMessages(
    sessionId: string,
    limit: number = 50,
  ): Promise<ChatMessage[]> {
    const subCollection = this.getSubCollection<ChatMessage>(
      sessionId,
      SUBCOLLECTIONS.CHAT_MESSAGES,
    );
    const snapshot = await subCollection
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }) as ChatMessage)
      .reverse();
  }
}
