import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ClerkModule } from 'src/clerk/clerk.module';

@Module({
  imports: [ClerkModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
