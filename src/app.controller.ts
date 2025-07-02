import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorator/public.decorator';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth(): string {
    return 'ok';
  }

  // '/profile' 경로는 AuthGuard에 의해 보호됩니다.
  @Get('profile')
  getProfile(@Req() req: Request) {
    // AuthGuard에서 request에 추가한 user 정보를 사용합니다.
    const user = req['user'];

    return {
      message: `안녕하세요, ${user.email}님! 당신의 UID는 ${user.uid}입니다.`,
    };
  }
}
