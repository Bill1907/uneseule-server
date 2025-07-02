import {
  IsString,
  IsArray,
  IsIn,
  IsNotEmpty,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';

export class CreateOnboardingDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsIn(['junior', 'teens', 'adult'])
  ageGroup: 'junior' | 'teens' | 'adult';

  @IsString()
  @IsNotEmpty()
  goal: string;

  @IsString()
  @IsNotEmpty()
  languageLevel: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests: string[];

  @IsString()
  @IsNotEmpty()
  personality: string;

  @IsString()
  @IsNotEmpty()
  feedbackStyle: string;
}

export class UpdateOnboardingDto {
  @IsString()
  @IsIn(['junior', 'teens', 'adult'])
  ageGroup?: 'junior' | 'teens' | 'adult';

  @IsString()
  goal?: string;

  @IsString()
  languageLevel?: string;

  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsString()
  personality?: string;

  @IsString()
  feedbackStyle?: string;
}
