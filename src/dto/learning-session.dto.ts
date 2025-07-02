import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLearningSessionDto {
  @IsString()
  userId: string;

  @IsString()
  topicId: string;

  @IsOptional()
  @IsString()
  curriculumId?: string;

  @IsDateString()
  startTime: string;
}

export class EndLearningSessionDto {
  @IsDateString()
  endTime: string;

  @IsString()
  summary: string;
}

export class UserFeedbackDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  text: string;
}

export class PerformanceMetricsDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  answerAccuracy: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  understandingScore: number;

  @IsArray()
  @IsString({ each: true })
  weakAreas: string[];

  @IsArray()
  @IsString({ each: true })
  strongAreas: string[];
}

export class DynamicUiComponentDataDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsArray()
  options?: any[];

  @IsOptional()
  correctAnswer?: string | string[];
}

export class DynamicUiDataDto {
  @IsString()
  componentType: string;

  @ValidateNested()
  @Type(() => DynamicUiComponentDataDto)
  data: DynamicUiComponentDataDto;

  @IsNumber()
  version: number;
}

export class CreateChatMessageDto {
  @IsIn(['user', 'ai'])
  sender: 'user' | 'ai';

  @IsIn(['text', 'audio', 'dynamic_ui'])
  type: 'text' | 'audio' | 'dynamic_ui';

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DynamicUiDataDto)
  dynamicUiData?: DynamicUiDataDto;
}
