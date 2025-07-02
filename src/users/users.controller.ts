import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { OnboardingData } from 'src/types/user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Req() req: Request) {
    const uid = req['user'].uid;
    let user = await this.usersService.getUsers(uid);
    if (!user) {
      user = await this.usersService.createUsers(uid, {
        uid,
        email: req['user'].email,
        displayName: req['user'].name,
        profileImageUrl: req['user'].photoURL || '',
        onboardingData: {
          age: 0,
          learningLanguage: '',
          sex: '',
          learningGoals: '',
          languageLevel: '',
          interests: [],
          tutorStyle: '',
          feedbackStyle: '',
        },
        isUpdatedOnboarding: false,
        settings: {
          notificationsEnabled: true,
          theme: 'light',
        },
        version: 1,
        lastLoginAt: new Date(),
      });
    }
    return user;
  }
  @Post()
  async createUsers(@Req() req: Request, @Body() body: any) {
    const uid = req['user'].uid;
    const user = await this.usersService.createUsers(uid, body);
    return user;
  }
  @Post('onboarding')
  async createOnboarding(@Req() req: Request, @Body() body: OnboardingData) {
    const uid = req['user'].uid;
    await this.usersService.createOnboarding(uid, body);
    return {
      success: true,
      message: 'Onboarding created successfully',
    };
  }
}
