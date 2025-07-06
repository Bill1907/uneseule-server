import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { VertexAIModule } from '../vertexai/vertexai.module';
import { UserTrainingDataModule } from '../user-traning-data/user-training-data.module';

@Module({
  imports: [VertexAIModule, UserTrainingDataModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
