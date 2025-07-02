import { Controller, Post, Body, Get } from '@nestjs/common';
import { VertexAIService } from './vertexai.service';
import { Public } from '../decorator/public.decorator';

interface GenerateTextDto {
  prompt: string;
}

interface AnalyzeContentDto {
  prompt: string;
  content: string;
}

@Controller('vertexai')
export class VertexAIController {
  constructor(private readonly vertexAIService: VertexAIService) {}

  @Get('test')
  @Public()
  async testConnection() {
    return {
      message: 'Vertex AI service is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('generate')
  @Public()
  async generateText(@Body() dto: GenerateTextDto) {
    try {
      const result = await this.vertexAIService.generateText(dto.prompt);
      return {
        success: true,
        result,
        prompt: dto.prompt,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        prompt: dto.prompt,
      };
    }
  }

  @Post('analyze')
  @Public()
  async analyzeContent(@Body() dto: AnalyzeContentDto) {
    try {
      const result = await this.vertexAIService.analyzeContent(
        dto.prompt,
        dto.content,
      );
      return {
        success: true,
        result,
        prompt: dto.prompt,
        content: dto.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        prompt: dto.prompt,
        content: dto.content,
      };
    }
  }
}
