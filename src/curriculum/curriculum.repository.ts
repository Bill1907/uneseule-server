import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository.js';
import { Curriculum, Topic } from '../types/index.js';
import { COLLECTIONS, SUBCOLLECTIONS } from '../types/collections.js';

@Injectable()
export class CurriculumRepository extends BaseRepository<Curriculum> {
  protected collectionName = COLLECTIONS.CURRICULUMS;

  async findByUserId(userId: string): Promise<Curriculum[]> {
    return this.findByField('userId', userId);
  }

  async getUserActiveCurriculums(userId: string): Promise<Curriculum[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as Curriculum,
    );
  }

  async updateProgress(curriculumId: string, progress: number): Promise<void> {
    await this.update(curriculumId, { progress });
  }

  // Topic 관련 메서드들
  async createTopic(
    curriculumId: string,
    topicData: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    return this.createSubDocument<Topic>(
      curriculumId,
      SUBCOLLECTIONS.TOPICS,
      topicData,
    );
  }

  async getTopics(curriculumId: string): Promise<Topic[]> {
    const topics = await this.findSubDocuments<Topic>(
      curriculumId,
      SUBCOLLECTIONS.TOPICS,
    );
    return topics.sort((a, b) => a.order - b.order);
  }

  async getTopicById(
    curriculumId: string,
    topicId: string,
  ): Promise<Topic | null> {
    return this.findSubDocumentById<Topic>(
      curriculumId,
      SUBCOLLECTIONS.TOPICS,
      topicId,
    );
  }

  async updateTopic(
    curriculumId: string,
    topicId: string,
    topicData: Partial<Omit<Topic, 'id' | 'createdAt'>>,
  ): Promise<void> {
    return this.updateSubDocument<Topic>(
      curriculumId,
      SUBCOLLECTIONS.TOPICS,
      topicId,
      topicData,
    );
  }

  async deleteTopic(curriculumId: string, topicId: string): Promise<void> {
    return this.deleteSubDocument(curriculumId, SUBCOLLECTIONS.TOPICS, topicId);
  }

  async updateTopicStatus(
    curriculumId: string,
    topicId: string,
    status: Topic['status'],
  ): Promise<void> {
    await this.updateTopic(curriculumId, topicId, { status });
  }

  async markTopicPptGenerated(
    curriculumId: string,
    topicId: string,
  ): Promise<void> {
    await this.updateTopic(curriculumId, topicId, { pptGenerated: true });
  }
}
