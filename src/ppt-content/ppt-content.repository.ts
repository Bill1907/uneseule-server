import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository.js';
import { PptContent } from '../types/index.js';
import { COLLECTIONS } from '../types/collections.js';

@Injectable()
export class PptContentRepository extends BaseRepository<PptContent> {
  protected collectionName = COLLECTIONS.PPT_CONTENTS;

  async findByTopicId(topicId: string): Promise<PptContent[]> {
    return this.findByField('topicId', topicId);
  }

  async findByUserId(userId: string): Promise<PptContent[]> {
    return this.findByField('userId', userId);
  }

  async getLatestByTopicId(topicId: string): Promise<PptContent | null> {
    const snapshot = await this.collection
      .where('topicId', '==', topicId)
      .orderBy('version', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { ...doc.data(), id: doc.id } as PptContent;
  }

  async updateStatus(
    pptId: string,
    status: PptContent['status'],
  ): Promise<void> {
    await this.update(pptId, { status });
  }

  async updateContent(pptId: string, data: PptContent['data']): Promise<void> {
    await this.update(pptId, { data, status: 'modified' });
  }

  async incrementVersion(pptId: string): Promise<void> {
    const current = await this.findById(pptId);
    if (current) {
      await this.update(pptId, { version: current.version + 1 });
    }
  }

  async findReadyPptsByUser(userId: string): Promise<PptContent[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', 'ready')
      .get();
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as PptContent,
    );
  }
}
