import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { OnboardingModule } from './onboarding/onboarding.module';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ClerkModule } from './clerk/clerk.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { VertexAIModule } from './vertexai/vertexai.module';
import { PromptModule } from './prompt/prompt.module';
import { LessonModule } from './lesson/lesson.module';
import { UserTrainingDataModule } from './user-traning-data/user-training-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OnboardingModule,
    UsersModule,
    FirebaseModule,
    ClerkModule,
    AuthModule,
    VertexAIModule,
    PromptModule,
    LessonModule,
    UserTrainingDataModule,
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
