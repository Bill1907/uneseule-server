import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from '../firebase/firebase.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
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
      throw new UnauthorizedException('Authorization token not found');
    }

    try {
      // FirebaseService를 사용해 토큰을 검증합니다.
      const decodedToken = await this.firebaseService
        .getAuthInstance()
        .verifyIdToken(token);

      // 💡 [중요] 검증된 유저 정보를 request 객체에 추가합니다.
      // 이렇게 하면 뒤따르는 컨트롤러에서 @Request() 데코레이터를 통해 유저 정보에 접근할 수 있습니다.
      request['user'] = decodedToken;
    } catch (error) {
      // 토큰이 유효하지 않은 경우 (만료, 형식 오류 등)
      console.error('Firebase Auth Error:', error);
      throw new UnauthorizedException('Invalid authorization token');
    }

    return true; // 토큰 검증 성공 시 true를 반환하여 요청을 통과시킵니다.
  }

  // Request 헤더에서 'Bearer' 토큰을 추출하는 헬퍼 함수
  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
