import {
  Controller,
  HttpException,
  HttpStatus,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { RecommendClassDto, ClassRecommendation } from '../dto/lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get('recommendations')
  async recommendClasses(@Query() dto: RecommendClassDto) {
    try {
      // userId 검증
      if (!dto.userId || dto.userId.trim() === '') {
        throw new HttpException(
          'Valid userId is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const recommendations = await this.lessonService.recommendLessons(
        dto.userId,
      );

      return {
        success: true,
        data: recommendations,
        message: 'Class recommendations generated successfully',
      };
    } catch (error) {
      console.error('Class recommendation error:', error);

      // 이미 HttpException인 경우 그대로 throw
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to generate class recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('contents')
  async createLesson(
    @Query('userId') userId: string,
    @Body() dto: ClassRecommendation,
  ) {
    try {
      const lesson = await this.lessonService.createLesson(userId, dto);
      console.log(lesson);
      return {
        success: true,
        data: lesson,
        message: 'Class created successfully',
      };
    } catch (error) {
      console.error('Class creation error:', error);
      throw new HttpException(
        'Failed to create class',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
