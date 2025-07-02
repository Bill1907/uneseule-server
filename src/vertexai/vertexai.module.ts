import { Module } from '@nestjs/common';
import { VertexAIService } from './vertexai.service';
import { VertexAIController } from './vertexai.controller';

@Module({
  controllers: [VertexAIController],
  providers: [VertexAIService],
  exports: [VertexAIService],
})
export class VertexAIModule {}
