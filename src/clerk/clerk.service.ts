import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, ClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private clerkClient: ClerkClient;

  constructor(private configService: ConfigService) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      publishableKey: this.configService.get<string>('CLERK_PUBLISHABLE_KEY'),
    });
  }

  getClerkClient(): ClerkClient {
    return this.clerkClient;
  }

  async authenticateRequest(request: any) {
    try {
      const protocol = request.protocol || 'http';
      const host = request.get('host') || 'localhost:3000';
      const fullUrl = `${protocol}://${host}${request.originalUrl}`;

      const clerkRequest = {
        headers: request.headers,
        method: request.method,
        url: fullUrl,
      };
      const requestState = await this.clerkClient.authenticateRequest(
        clerkRequest as Request,
      );

      return requestState;
    } catch (error) {
      console.error('Clerk Auth Error:', error);
      throw new Error('Authentication failed');
    }
  }

  async getUser(userId: string) {
    try {
      return await this.clerkClient.users.getUser(userId);
    } catch (error) {
      throw new Error('User not found');
    }
  }
}
