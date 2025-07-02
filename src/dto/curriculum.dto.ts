import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCurriculumDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  suggestedByAI?: boolean = false;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateCurriculumDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['active', 'completed', 'draft'])
  status?: 'active' | 'completed' | 'draft';

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;
}

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  order: number;

  @IsOptional()
  @IsString()
  aiPersonaPrompt?: string;
}

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @IsOptional()
  @IsIn(['pending', 'inProgress', 'completed'])
  status?: 'pending' | 'inProgress' | 'completed';

  @IsOptional()
  @IsBoolean()
  pptGenerated?: boolean;

  @IsOptional()
  @IsString()
  aiPersonaPrompt?: string;
}
