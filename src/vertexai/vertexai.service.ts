import { Injectable, Logger } from '@nestjs/common';
import { GenerativeModel } from '@google-cloud/vertexai';
import { getGeminiModel } from '../config/vertexai.config';

@Injectable()
export class VertexAIService {
  private readonly logger = new Logger(VertexAIService.name);
  private model: GenerativeModel;

  constructor() {
    this.model = getGeminiModel('gemini-2.5-flash');
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      this.logger.error('Vertex AI text generation failed:', error);
      throw new Error('Failed to generate text with Vertex AI');
    }
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    temperature: number = 0.7,
  ): Promise<T> {
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature,
        },
      });

      const response = result.response;
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error('No response text received from Vertex AI');
      }

      return JSON.parse(responseText) as T;
    } catch (error) {
      this.logger.error(
        'Vertex AI structured output generation failed:',
        error,
      );
      throw new Error('Failed to generate structured output with Vertex AI');
    }
  }

  async generateStreamingText(prompt: string): Promise<AsyncIterable<string>> {
    try {
      const result = await this.model.generateContentStream(prompt);

      return (async function* () {
        for await (const chunk of result.stream) {
          const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunkText) {
            yield chunkText;
          }
        }
      })();
    } catch (error) {
      this.logger.error('Vertex AI streaming text generation failed:', error);
      throw new Error('Failed to generate streaming text with Vertex AI');
    }
  }

  async analyzeContent(prompt: string, content: string): Promise<string> {
    try {
      const fullPrompt = `${prompt}\n\nContent to analyze:\n${content}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      this.logger.error('Vertex AI content analysis failed:', error);
      throw new Error('Failed to analyze content with Vertex AI');
    }
  }

  // 기본 텍스트 생성 (멀티모달은 별도 구현 필요)
  async generateBasicContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      this.logger.error('Vertex AI basic content generation failed:', error);
      throw new Error('Failed to generate basic content with Vertex AI');
    }
  }
}
