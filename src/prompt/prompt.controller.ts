import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import { CreateOnboardingVoicePromptDto } from '../dto/onboarding.dto';

@Controller('prompt')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post('onboarding-voice-assistant')
  async createOnboardingVoiceAssistant(
    @Body() createOnboardingVoicePromptDto: CreateOnboardingVoicePromptDto,
  ) {
    try {
      // userId 검증
      if (
        !createOnboardingVoicePromptDto.userId ||
        createOnboardingVoicePromptDto.userId.trim() === ''
      ) {
        throw new HttpException(
          'Valid userId is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const prompt = await this.promptService.generateOnboardingVoicePrompt(
        createOnboardingVoicePromptDto.userId,
      );

      return {
        success: true,
        prompt,
      };
    } catch (error) {
      console.error(error);

      // 이미 HttpException인 경우 그대로 throw
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create onboarding voice assistant',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
