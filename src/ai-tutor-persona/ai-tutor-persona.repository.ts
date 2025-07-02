import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository.js';
import { AiTutorPersona } from '../types/index.js';
import { COLLECTIONS } from '../types/collections.js';

@Injectable()
export class AiTutorPersonaRepository extends BaseRepository<AiTutorPersona> {
  protected collectionName = COLLECTIONS.AI_TUTOR_PERSONAS;

  async findByUserId(userId: string): Promise<AiTutorPersona[]> {
    return this.findByField('userId', userId);
  }

  async findDefaultPersonas(): Promise<AiTutorPersona[]> {
    const snapshot = await this.collection.where('userId', '==', null).get();
    return snapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as AiTutorPersona,
    );
  }

  async findByExpertiseArea(expertiseArea: string): Promise<AiTutorPersona[]> {
    return this.findByField('expertiseArea', expertiseArea);
  }

  async findByDifficulty(
    difficulty: AiTutorPersona['difficulty'],
  ): Promise<AiTutorPersona[]> {
    return this.findByField('difficulty', difficulty);
  }

  async findPersonaForUser(
    userId: string,
    expertiseArea: string,
    difficulty: AiTutorPersona['difficulty'],
  ): Promise<AiTutorPersona | null> {
    // 먼저 사용자 전용 페르소나 찾기
    const userSpecificSnapshot = await this.collection
      .where('userId', '==', userId)
      .where('expertiseArea', '==', expertiseArea)
      .where('difficulty', '==', difficulty)
      .limit(1)
      .get();

    if (!userSpecificSnapshot.empty) {
      const doc = userSpecificSnapshot.docs[0];
      return { ...doc.data(), id: doc.id } as AiTutorPersona;
    }

    // 사용자 전용이 없으면 기본 페르소나 찾기
    const defaultSnapshot = await this.collection
      .where('userId', '==', null)
      .where('expertiseArea', '==', expertiseArea)
      .where('difficulty', '==', difficulty)
      .limit(1)
      .get();

    if (!defaultSnapshot.empty) {
      const doc = defaultSnapshot.docs[0];
      return { ...doc.data(), id: doc.id } as AiTutorPersona;
    }

    return null;
  }

  async createUserSpecificPersona(
    basePersonaId: string,
    userId: string,
    customizations: Partial<
      Pick<AiTutorPersona, 'name' | 'promptTemplate' | 'tone' | 'languageStyle'>
    >,
  ): Promise<string> {
    const basePersona = await this.findById(basePersonaId);
    if (!basePersona) {
      throw new Error('Base persona not found');
    }

    const { id, createdAt, updatedAt, ...baseData } = basePersona;

    const userPersonaData = {
      ...baseData,
      ...customizations,
      userId,
      name: customizations.name || `${basePersona.name} (개인화)`,
    };

    return this.create(userPersonaData);
  }
}
