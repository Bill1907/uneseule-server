import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserTrainingDataService } from './user-training-data.service';
import { UserTrainingData, CreateUserTrainingDataDto } from 'src/types/index';
import { Request } from 'express';

@Controller('user-training-data')
export class UserTrainingDataController {
  constructor(
    private readonly userTrainingDataService: UserTrainingDataService,
  ) {}

  @Get()
  async getUserTrainingData(
    @Query('userId') userId?: string,
    @Req() req?: Request,
  ) {
    // 인증된 사용자 정보를 우선 사용, 없으면 쿼리 파라미터 사용
    const finalUserId = req?.['user']?.uid || userId;

    if (!finalUserId) {
      throw new BadRequestException('User ID is required');
    }

    const userTrainingData =
      await this.userTrainingDataService.getUserTrainingDataByUserId(
        finalUserId,
      );
    if (!userTrainingData) {
      return await this.userTrainingDataService.updateEmptyUserTrainingData(
        finalUserId,
      );
    }
    return userTrainingData;
  }

  @Post()
  async createUserTrainingData(
    @Body() createUserTrainingDataDto: CreateUserTrainingDataDto,
    @Query('userId') userId?: string,
    @Req() req?: Request,
  ) {
    // 인증된 사용자 정보를 우선 사용, 없으면 쿼리 파라미터 사용
    const finalUserId = req?.['user']?.uid || userId;

    if (!finalUserId) {
      throw new BadRequestException('User ID is required');
    }

    const userTrainingData =
      await this.userTrainingDataService.getUserTrainingDataByUserId(
        finalUserId,
      );
    if (userTrainingData) {
      return await this.userTrainingDataService.updateUserTrainingDataByUserId(
        finalUserId,
        createUserTrainingDataDto,
      );
    }
    return await this.userTrainingDataService.createUserTrainingData(
      finalUserId,
      createUserTrainingDataDto,
    );
  }
}
