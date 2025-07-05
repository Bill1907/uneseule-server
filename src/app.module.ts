import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OnboardingModule } from './onboarding/onboarding.module';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { VertexAIModule } from './vertexai/vertexai.module';
import { PromptModule } from './prompt/prompt.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    OnboardingModule,
    UsersModule,
    FirebaseModule,
    AuthModule,
    VertexAIModule,
    PromptModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
