import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository';
import { OnboardingDocument } from '../types/index.js';
import { COLLECTIONS } from '../types/collections';

@Injectable()
export class OnboardingRepository extends BaseRepository<OnboardingDocument> {
  protected collectionName = COLLECTIONS.ONBOARDING_RESPONSES;

  async findByUserId(userId: string): Promise<OnboardingDocument | null> {
    const results = await this.findByField('userId', userId);
    return results.length > 0 ? results[0] : null;
  }

  async findByAgeGroup(
    ageGroup: 'junior' | 'teens' | 'adult',
  ): Promise<OnboardingDocument[]> {
    return this.findByField('ageGroup', ageGroup);
  }

  async updateInterests(id: string, interests: string[]): Promise<void> {
    await this.update(id, { interests });
  }

  async getCompletionStats(): Promise<{
    total: number;
    byAgeGroup: Record<string, number>;
  }> {
    const allOnboarding = await this.findAll();
    const total = allOnboarding.length;

    const byAgeGroup = allOnboarding.reduce(
      (acc, item) => {
        acc[item.ageGroup] = (acc[item.ageGroup] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { total, byAgeGroup };
  }
}
