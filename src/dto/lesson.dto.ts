import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsObject,
} from 'class-validator';

export class RecommendClassDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class ClassRecommendation {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ClassRecommendationResponse {
  @IsArray()
  recommendations: ClassRecommendation[];

  @IsString()
  @IsOptional()
  userProfile?: string;
}
