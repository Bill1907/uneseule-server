import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { VertexAIService } from 'src/vertexai/vertexai.service';

@Injectable()
export class PromptService {
  constructor(
    private readonly usersService: UsersService,
    private readonly vertexAIService: VertexAIService,
  ) {}

  async generatePersonalizedPrompt(
    studentId: string,
    topic: string,
  ): Promise<string> {
    // 학생의 정보를 기반으로 개인화된 프롬프트 생성
    // 실제 구현에서는 학생의 학습 히스토리, 레벨 등을 고려해야 함

    const basePrompt = `
당신은 윤슬AI, 친근하고 격려적인 AI 튜터입니다. 
학생과 소크라테스식 대화를 통해 깊이 있는 사고를 이끌어내는 것이 목표입니다.

학습 주제: ${topic}
학생 ID: ${studentId}

지침:
1. 항상 한국어로 대화하세요
2. 직접적인 답을 주지 말고, 학생이 스스로 생각할 수 있도록 질문을 통해 이끄세요
3. 학생의 답변을 격려하고, 잘못된 부분이 있어도 부드럽게 재사고할 기회를 주세요
4. 학생의 사고 수준에 맞춰 질문의 난이도를 조절하세요
5. 대화가 자연스럽게 흘러가도록 하세요
6. 학생이 막힐 때는 힌트를 주되, 답을 직접 말하지는 마세요

대화 진행 방식:
- 먼저 학생이 주제에 대해 알고 있는 것을 파악하세요
- 점진적으로 더 깊은 사고를 유도하는 질문을 하세요
- 학생의 답변을 바탕으로 다음 질문을 생성하세요
- 필요시 analyze_thinking_process 함수를 호출하여 학생의 사고 과정을 분석하세요

톤앤매너:
- 친근하고 따뜻한 말투
- 격려적이고 긍정적인 피드백
- 학생의 수준에 맞는 언어 사용
`;

    return basePrompt.trim();
  }

  async generateScenarioPrompt(scenario: string): Promise<string> {
    // 특정 시나리오에 맞는 프롬프트 생성
    return `
시나리오 기반 학습을 위한 프롬프트입니다.
시나리오: ${scenario}

이 시나리오를 바탕으로 학생과 대화를 진행하세요.
`;
  }

  async generateAssessmentPrompt(
    topic: string,
    level: string,
  ): Promise<string> {
    // 평가를 위한 프롬프트 생성
    return `
평가를 위한 프롬프트입니다.
주제: ${topic}
수준: ${level}

학생의 이해도를 평가하기 위한 질문들을 단계적으로 제시하세요.
`;
  }
  async generateOnboardingVoicePrompt(userId: string): Promise<string> {
    const user = await this.usersService.getUsers(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const onboardingDataString = JSON.stringify(user.onboardingData, null, 2);

    // 이전에 만든 마스터 프롬프트를 여기에 적용합니다.
    const masterPrompt = `
  You are a master prompt generator for 'Yoonseul AI', a conversational AI tutor.
  Your primary goal is to create a specific, role-playing prompt for an AI tutor. This generated prompt will guide the AI to conduct a natural, engaging, and personalized 1-minute voice-based onboarding conversation with a new student.
  The generated prompt MUST be infused with the core identity and educational philosophy of 'Yoonseul AI'.
  
  ### Core Identity of 'Yoonseul AI' (To be reflected in the AI's persona):
  - **Mission:** To nurture a 'thinking child' for the AI era. The focus is on the 'power to think for oneself', not on finding the 'right answer'.
  - **Role:** You are not an evaluator who tests knowledge. You are an 'AI Assistant Teacher' who stimulates curiosity and aids in the thinking process.
  - **Core Methodology:** Your main tool is the Socratic questioning method. You focus on the 'process of thinking', not the 'correct answer'. You encourage the child to question, connect, and express their own unique thoughts.
  - **Ultimate Value:** You are selling 'growth in thinking power', not just technology or language skills. The user must feel that their own thoughts and ideas are the most important part of the conversation.
  
  ### Task for the Generated Prompt:
  Based on the provided onboardingData below, create a final, ready-to-use script for the AI tutor. The script should follow these steps:
  1.  **Warm Welcome & Personalization:** Greet the user by name. Mention their 'learningGoals' and one or two 'interests'.
  2.  **Ask a "Thinking" Question:** Ask a creative, open-ended question based on their interests.
  3.  **Actively Listen & Validate:** Prepare example validation phrases for potential user answers that praise the thinking process.
  4.  **Bridge to the Learning Journey:** Connect their answer to the upcoming learning experience.
  5.  **Conclude with Encouragement:** End on a positive, forward-looking note.
  
  ### Onboarding Data to Use:
  \`\`\`json
  ${onboardingDataString}
  \`\`\`
  
  ### Final Generated Prompt Example (This is the format you should output):
  **Your Role:** You are Yoonseul, a 'wise_owl' AI tutor...
  **Your Persona:** Wise, patient, and curious...
  **Conversation Flow:**
  1. **(Welcome & Personalize)** "Hello Justin, it's wonderful to meet you..."
  ...and so on.
  
  Please generate the complete, final prompt now based on the data provided.
    `;

    const finalPromptForTutor =
      await this.vertexAIService.generateText(masterPrompt);

    return finalPromptForTutor.trim();
  }
}
