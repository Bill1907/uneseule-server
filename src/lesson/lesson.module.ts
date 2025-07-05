import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { VertexAIModule } from '../vertexai/vertexai.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [VertexAIModule, UsersModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
