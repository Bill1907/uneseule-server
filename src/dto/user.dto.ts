import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TimeSlotDto {
  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class OnboardingDataDto {
  @IsArray()
  @IsString({ each: true })
  learningInterests: string[];

  @IsOptional()
  knowledgeLevel?: Record<string, string>;

  @IsString()
  ageGroup: string;

  @IsString()
  learningGoals: string;

  @IsArray()
  @IsString({ each: true })
  preferredLearningStyles: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  availableTimeSlots: TimeSlotDto[];
}

export class UserSettingsDto {
  @IsBoolean()
  notificationsEnabled: boolean;

  @IsString()
  theme: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @ValidateNested()
  @Type(() => OnboardingDataDto)
  onboardingData: OnboardingDataDto;

  @ValidateNested()
  @Type(() => UserSettingsDto)
  settings: UserSettingsDto;

  @IsOptional()
  @IsNumber()
  version?: number = 1;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardingDataDto)
  onboardingData?: OnboardingDataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserSettingsDto)
  settings?: UserSettingsDto;
}
