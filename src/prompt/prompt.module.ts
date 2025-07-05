import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { VertexAIService } from 'src/vertexai/vertexai.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { VertexAIModule } from 'src/vertexai/vertexai.module';

@Module({
  imports: [UsersModule, VertexAIModule],
  providers: [PromptService, VertexAIService, UsersService],
  controllers: [PromptController],
  exports: [PromptService],
})
export class PromptModule {}
