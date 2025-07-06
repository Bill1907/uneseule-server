import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClerkService } from '../clerk/clerk.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly clerkService: ClerkService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.clerkService.authenticateRequest(request);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  // Request 헤더에서 'Bearer' 토큰을 추출하는 헬퍼 함수
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
