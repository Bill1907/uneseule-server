import { Controller, Get, Post, Put, Query, Body, Req } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from '../dto/onboarding.dto';
import { Request } from 'express';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('questions')
  getOnboardingQuestion(@Query('age') age: number) {
    // 나이에 따른 맞춤형 온보딩 질문 제공
    const questions = this.onboardingService.getOnboardingQuestion(age);

    return {
      ...questions,
      metadata: {
        age,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('responses')
  async createOnboardingResponse(
    @Body() createOnboardingDto: CreateOnboardingDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    createOnboardingDto.userId = user.uid;

    const responseId =
      await this.onboardingService.saveOnboardingResponse(createOnboardingDto);

    return {
      id: responseId,
      message: 'Onboarding response saved successfully',
    };
  }

  @Get('my-response')
  async getMyOnboardingResponse(@Req() req: Request) {
    const user = req['user'];
    const onboarding = await this.onboardingService.getUserOnboarding(user.uid);

    if (!onboarding) {
      return { message: 'No onboarding response found' };
    }

    return onboarding;
  }

  @Put('interests')
  async updateInterests(
    @Body() body: { interests: string[] },
    @Req() req: Request,
  ) {
    const user = req['user'];
    await this.onboardingService.updateUserInterests(user.uid, body.interests);

    return { message: 'Interests updated successfully' };
  }

  @Get('stats')
  async getOnboardingStats() {
    return await this.onboardingService.getOnboardingStats();
  }
}
