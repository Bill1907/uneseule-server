import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../firebase/base.repository';
import { UserTrainingData } from '../types/index';
import { COLLECTIONS } from '../types/collections';

@Injectable()
export class UserTrainingDataRepository extends BaseRepository<UserTrainingData> {
  protected collectionName = COLLECTIONS.USER_TRAINING_DATA;

  async createUserTrainingData(
    userId: string,
    userTrainingData: UserTrainingData,
  ): Promise<string> {
    return await this.createWithId(userId, userTrainingData);
  }

  async updateUserTrainingData(
    userId: string,
    userTrainingData: UserTrainingData,
  ): Promise<void> {
    return await this.update(userId, userTrainingData);
  }

  async getUserTrainingDataByUserId(
    userId: string,
  ): Promise<UserTrainingData | null> {
    const userTrainingData = await this.findByField('userId', userId);
    return userTrainingData.length > 0 ? userTrainingData[0] : null;
  }
}
