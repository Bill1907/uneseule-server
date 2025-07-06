import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserTrainingDataRepository } from './user-training-data.repository';
import { UserTrainingData, CreateUserTrainingDataDto } from 'src/types/index';

@Injectable()
export class UserTrainingDataService {
  constructor(
    private readonly userTrainingDataRepository: UserTrainingDataRepository,
  ) {}

  async getUserTrainingDataByUserId(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('User ID is required and cannot be empty');
    }
    return this.userTrainingDataRepository.getUserTrainingDataByUserId(userId);
  }

  async createUserTrainingData(
    userId: string,
    createUserTrainingDataDto: CreateUserTrainingDataDto,
  ) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('User ID is required and cannot be empty');
    }
    return this.userTrainingDataRepository.createUserTrainingData(userId, {
      ...createUserTrainingDataDto,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      isUpdatedOnboarding: true,
    });
  }

  async updateUserTrainingDataByUserId(
    userId: string,
    updateUserTrainingDataDto: CreateUserTrainingDataDto,
  ) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('User ID is required and cannot be empty');
    }
    const userTrainingData = await this.getUserTrainingDataByUserId(userId);
    if (!userTrainingData) {
      throw new NotFoundException('User training data not found');
    }
    return this.userTrainingDataRepository.updateUserTrainingData(userId, {
      ...updateUserTrainingDataDto,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: userTrainingData.version + 1,
      isUpdatedOnboarding: true,
    });
  }

  async updateEmptyUserTrainingData(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('User ID is required and cannot be empty');
    }
    const userTrainingData = await this.getUserTrainingDataByUserId(userId);
    if (!userTrainingData) {
      await this.userTrainingDataRepository.createUserTrainingData(userId, {
        userId,
        age: 0,
        learningLanguage: '',
        sex: '',
        learningGoals: '',
        languageLevel: '',
        interests: [],
        tutorStyle: '',
        feedbackStyle: '',
        isUpdatedOnboarding: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
      });
    } else {
      await this.userTrainingDataRepository.updateUserTrainingData(userId, {
        ...userTrainingData,
        isUpdatedOnboarding: false,
      });
    }
  }
}
