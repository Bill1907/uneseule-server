import { Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod/v4';
import { VertexAIService } from '../vertexai/vertexai.service';
import {
  ClassRecommendation,
  ClassRecommendationResponse,
} from '../dto/lesson.dto';
import { OnboardingData } from 'src/types/user.types';
import { UserTrainingDataService } from 'src/user-traning-data/user-training-data.service';

// Zod 4 스키마 정의 (검증용)
const ClassRecommendationSchema = z.object({
  title: z.string().describe('클래스 제목'),
  description: z.string().describe('클래스 설명 (50-100자)'),
  category: z.string().describe('클래스 카테고리'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('난이도'),
  tags: z.array(z.string()).describe('클래스 태그'),
  reason: z.string().describe('추천 이유'),
});

const ClassRecommendationListSchema = z.object({
  recommendations: z
    .array(ClassRecommendationSchema)
    .length(3)
    .describe('정확히 3개의 클래스 추천'),
});

type ClassRecommendationList = z.infer<typeof ClassRecommendationListSchema>;

@Injectable()
export class LessonService {
  private readonly jsonSchema: any;

  constructor(
    private readonly userTrainingDataService: UserTrainingDataService,
    private readonly vertexAIService: VertexAIService,
  ) {
    // Vertex AI 완벽 호환 수동 JSON Schema 사용
    this.jsonSchema = {
      type: 'object',
      properties: {
        recommendations: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              category: {
                type: 'string',
              },
              difficulty: {
                type: 'string',
                enum: ['beginner', 'intermediate', 'advanced'],
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
              },
              reason: {
                type: 'string',
              },
            },
            required: [
              'title',
              'description',
              'category',
              'difficulty',
              'tags',
              'reason',
            ],
          },
        },
      },
      required: ['recommendations'],
    };
  }

  async recommendLessons(userId: string): Promise<ClassRecommendationResponse> {
    try {
      // 사용자 온보딩 데이터 가져오기
      const userTrainingData =
        await this.userTrainingDataService.getUserTrainingDataByUserId(userId);

      if (!userTrainingData) {
        throw new NotFoundException('User not found');
      }

      const onboardingData = userTrainingData;

      // AI 프롬프트 생성
      const prompt = this.generateRecommendationPrompt(onboardingData);

      // structured output으로 클래스 추천 받기
      const structuredResponse =
        await this.vertexAIService.generateStructuredOutput<ClassRecommendationList>(
          prompt,
          this.jsonSchema,
          0.7,
        );

      // Zod 4로 응답 검증
      const validatedResponse =
        ClassRecommendationListSchema.parse(structuredResponse);

      return {
        recommendations: validatedResponse.recommendations,
        userProfile: this.generateUserProfile(onboardingData),
      };
    } catch (error) {
      console.error('Error generating class recommendations:', error);

      // 오류 발생 시 기본 추천 반환
      return {
        recommendations: this.getDefaultRecommendations(),
        userProfile: 'Default profile due to error',
      };
    }
  }

  async createLesson(dto: ClassRecommendation): Promise<ClassRecommendation> {
    return dto;
  }

  private generateRecommendationPrompt(onboardingData: OnboardingData): string {
    const {
      age,
      learningLanguage,
      sex,
      learningGoals,
      languageLevel,
      interests,
      tutorStyle,
      feedbackStyle,
    } = onboardingData;

    return `
        당신은 uneseule.ai의 전문 교육 컨설턴트입니다. 사용자의 온보딩 데이터를 분석하여 최적의 클래스 3개를 추천해주세요.

        사용자 정보:
        - 연령: ${age}
        - 성별: ${sex}
        - 학습 언어: ${learningLanguage}
        - 학습 목표: ${learningGoals}
        - 언어 수준: ${languageLevel}
        - 관심사: ${interests.join(', ')}
        - 원하는 튜터 스타일: ${tutorStyle}
        - 피드백 스타일: ${feedbackStyle}

        사용자의 ${age} 연령대에 적합하고, ${learningGoals} 목표를 달성하는 데 도움이 되는 클래스 3개를 추천해주세요.

        각 클래스는 다음을 포함해야 합니다:
        - 제목: 구체적이고 매력적인 클래스 제목
        - 설명: 클래스에 대한 상세한 설명 (50-100자)
        - 카테고리: 적절한 카테고리명
        - 난이도: beginner, intermediate, advanced 중 하나
        - 태그: 클래스를 잘 설명하는 태그들
        - 추천 이유: 이 클래스를 추천하는 구체적인 이유

        사용자의 관심사와 학습 목표를 고려하여 개인화된 추천을 해주세요.
`;
  }

  private getDefaultRecommendations(): ClassRecommendation[] {
    return [
      {
        title: '기초 사고력 향상 클래스',
        description: '논리적 사고와 비판적 사고를 기르는 기초 클래스입니다.',
        category: '사고력',
        difficulty: 'beginner',
        tags: ['사고력', '논리', '기초'],
        reason: '모든 학습자에게 필수적인 사고력 기초를 다질 수 있습니다.',
      },
      {
        title: '창의적 문제 해결',
        description:
          '다양한 문제 상황에서 창의적인 해결책을 찾는 방법을 배웁니다.',
        category: '문제해결',
        difficulty: 'intermediate',
        tags: ['창의성', '문제해결', '실습'],
        reason: '실생활에서 마주치는 문제들을 효과적으로 해결할 수 있습니다.',
      },
      {
        title: '소통과 표현 클래스',
        description:
          '자신의 생각을 명확하게 표현하고 다른 사람과 소통하는 방법을 배웁니다.',
        category: '소통',
        difficulty: 'beginner',
        tags: ['소통', '표현', '대화'],
        reason: '효과적인 의사소통 능력을 기를 수 있습니다.',
      },
    ];
  }

  private generateUserProfile(onboardingData: OnboardingData): string {
    const {
      age,
      learningGoals,
      languageLevel,
      interests,
      tutorStyle,
      feedbackStyle,
    } = onboardingData;

    return `${age} 연령대의 학습자로, ${learningGoals}을 목표로 하며, ${languageLevel} 수준의 언어 실력을 가지고 있습니다. 주요 관심사는 ${interests.join(', ')}이며, ${tutorStyle} 성격을 가지고 있어 ${feedbackStyle} 피드백을 선호합니다.`;
  }
}
