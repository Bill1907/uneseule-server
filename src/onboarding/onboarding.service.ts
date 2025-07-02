import { Injectable } from '@nestjs/common';
import { OnboardingRepository } from './onboarding.repository';
import { CreateOnboardingDto } from '../dto/onboarding.dto';

export interface QuestionOption {
  value: string;
  title: string;
  description: string;
}

export interface OnboardingStep {
  step: number;
  question: string;
  options: QuestionOption[];
}

@Injectable()
export class OnboardingService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  getOnboardingQuestion(age: number) {
    const ageGroup = this.getAgeGroup(age);

    const questions = this.getQuestionsByAgeGroup(ageGroup);

    return {
      ageGroup,
      questions,
    };
  }

  async saveOnboardingResponse(dto: CreateOnboardingDto): Promise<string> {
    return await this.onboardingRepository.create({
      id: dto.id,
      userId: dto.userId,
      ageGroup: dto.ageGroup,
      goal: dto.goal,
      languageLevel: dto.languageLevel,
      interests: dto.interests,
      personality: dto.personality,
      feedbackStyle: dto.feedbackStyle,
      completedAt: new Date(),
    });
  }

  async getUserOnboarding(userId: string) {
    return await this.onboardingRepository.findByUserId(userId);
  }

  async updateUserInterests(
    userId: string,
    interests: string[],
  ): Promise<void> {
    const onboarding = await this.onboardingRepository.findByUserId(userId);
    if (onboarding) {
      await this.onboardingRepository.updateInterests(onboarding.id, interests);
    }
  }

  async getOnboardingStats() {
    return await this.onboardingRepository.getCompletionStats();
  }

  private getAgeGroup(age: number): string {
    if (age <= 13) return 'junior';
    if (age <= 19) return 'teens';
    return 'adult';
  }

  private getQuestionsByAgeGroup(ageGroup: string): OnboardingStep[] {
    switch (ageGroup) {
      case 'junior':
        return this.getJuniorQuestions();
      case 'teens':
        return this.getTeensQuestions();
      case 'adult':
        return this.getAdultQuestions();
      default:
        return this.getAdultQuestions();
    }
  }

  private getJuniorQuestions(): OnboardingStep[] {
    return [
      {
        step: 1,
        question: "AI 친구 '유니'와 함께 무엇을 하고 싶어요? 🌟",
        options: [
          {
            value: 'adventure',
            title: '신나는 모험을 떠날래요! 🚀',
            description: '이야기 속 주인공이 되어 재미있는 세상을 탐험해요',
          },
          {
            value: 'creativity',
            title: '기발한 상상을 하고 싶어요! 💡',
            description: '아무도 생각 못 한 아이디어로 나만의 세상을 만들어요',
          },
          {
            value: 'discovery',
            title: "모든 '왜?'를 알고 싶어요! ❓",
            description: '세상의 궁금한 것들을 찾는 꼬마 탐정이 되어봐요',
          },
        ],
      },
      {
        step: 2,
        question: '지금 언어 실력은 어느 정도예요? 📚',
        options: [
          {
            value: 'beginner',
            title: '아직 배우는 중이에요 🌱',
            description: '쉬운 단어와 간단한 문장으로 대화해요',
          },
          {
            value: 'elementary',
            title: '조금씩 알아가고 있어요 📖',
            description: '기본적인 대화는 할 수 있어요',
          },
          {
            value: 'intermediate',
            title: '꽤 잘해요! 😊',
            description: '재미있는 이야기도 나눌 수 있어요',
          },
          {
            value: 'advanced',
            title: '정말 잘해요! 🌟',
            description: '어려운 주제도 자신 있게 말할 수 있어요',
          },
        ],
      },
      {
        step: 3,
        question:
          '어떤 이야기를 나누면 가장 신나요? 좋아하는 걸 모두 골라봐요! ✨',
        options: [
          {
            value: 'animals',
            title: '동물 친구들 🐶',
            description: '강아지, 고양이, 토끼, 햄스터',
          },
          {
            value: 'dinosaurs',
            title: '공룡 세계 🦕',
            description: '티라노사우루스, 트리케라톱스, 브라키오사우루스',
          },
          {
            value: 'space',
            title: '우주 모험 🚀',
            description: '우주선, 별, 행성, 우주인',
          },
          {
            value: 'ocean',
            title: '바다 탐험 🌊',
            description: '고래, 상어, 문어, 바닷속 세상',
          },
          {
            value: 'magic',
            title: '마법의 세계 ✨',
            description: '마법사, 요정, 마법 지팡이, 성',
          },
          {
            value: 'superheroes',
            title: '슈퍼히어로 🦸',
            description: '특별한 힘, 악당과 싸우기, 세상 구하기',
          },
          {
            value: 'princess',
            title: '공주와 왕자 👑',
            description: '아름다운 드레스, 왕궁, 무도회',
          },
          {
            value: 'cars',
            title: '자동차와 기차 🚗',
            description: '레이싱카, 기차, 비행기, 배',
          },
          {
            value: 'cooking',
            title: '요리하기 👩‍🍳',
            description: '케이크 만들기, 맛있는 음식, 파티',
          },
          {
            value: 'drawing',
            title: '그림 그리기 🎨',
            description: '색칠하기, 만들기, 예쁜 그림',
          },
          {
            value: 'music',
            title: '노래와 춤 🎵',
            description: '신나는 노래, 춤추기, 악기',
          },
          {
            value: 'nature',
            title: '자연 탐험 🌳',
            description: '숲, 꽃, 나무, 곤충',
          },
          {
            value: 'toys',
            title: '장난감 놀이 🧸',
            description: '인형, 블록, 로봇, 퍼즐',
          },
          {
            value: 'sports',
            title: '운동과 놀이 ⚽',
            description: '축구, 농구, 수영, 달리기',
          },
          {
            value: 'family',
            title: '가족과 친구 👨‍👩‍👧‍👦',
            description: '엄마, 아빠, 형제자매, 친구들',
          },
          {
            value: 'school',
            title: '학교 생활 🏫',
            description: '선생님, 친구들, 공부, 놀이시간',
          },
          {
            value: 'holidays',
            title: '특별한 날 🎉',
            description: '생일, 크리스마스, 여행, 파티',
          },
          {
            value: 'robots',
            title: '로봇과 기계 🤖',
            description: '멋진 로봇, 기계, 발명품',
          },
          {
            value: 'fairytales',
            title: '동화 이야기 📚',
            description: '백설공주, 신데렐라, 옛날이야기',
          },
          {
            value: 'adventure',
            title: '모험과 탐험 🗺️',
            description: '보물찾기, 신비한 곳, 탐험',
          },
        ],
      },
      {
        step: 4,
        question: 'AI 친구 유니는 어떤 성격이면 좋을까요? 🤖',
        options: [
          {
            value: 'wise_owl',
            title: '척척박사 유니 🦉',
            description: '뭐든지 알고 있는 똑똑한 친구',
          },
          {
            value: 'playful_monkey',
            title: '장난꾸러기 유니 🐒',
            description: '재미있는 농담과 아이디어로 가득한 친구',
          },
          {
            value: 'caring_bear',
            title: '다정한 유니 🐻',
            description: '언제나 응원하고 칭찬해주는 따뜻한 친구',
          },
        ],
      },
      {
        step: 5,
        question: '유니가 어떻게 도와주면 좋을까요? 💝',
        options: [
          {
            value: 'story_inventor',
            title: '이야기 발명가 📖',
            description:
              "'만약에 코끼리가 날 수 있다면?'처럼 재미있는 질문으로 함께 이야기를 만들어요",
          },
          {
            value: 'detective',
            title: '뭐든지 탐정 🔍',
            description:
              "'사과가 왜 아래로 떨어질까?'처럼 궁금한 것들을 함께 파헤쳐요",
          },
          {
            value: 'roleplay',
            title: '신나는 롤플레잉 🎭',
            description: '공주님, 소방관, 과학자가 되어서 상황극을 해봐요',
          },
        ],
      },
    ];
  }

  private getTeensQuestions(): OnboardingStep[] {
    return [
      {
        step: 1,
        question: 'uneseule.ai와 함께 어떤 목표를 달성하고 싶으세요? 🎯',
        options: [
          {
            value: 'debate_skills',
            title: '논리적 발표와 토론 🏆',
            description: '발표나 토론에서 내 주장을 논리적으로 펼치고 싶어요',
          },
          {
            value: 'critical_thinking',
            title: '사회 이슈 분석 🌍',
            description: '사회 이슈나 뉴스에 대해 나만의 관점을 갖고 싶어요',
          },
          {
            value: 'creative_writing',
            title: '창의적 콘텐츠 제작 ✍️',
            description:
              '창의적인 글쓰기나 영상 스토리를 만드는 능력을 키우고 싶어요',
          },
          {
            value: 'problem_solving',
            title: '문제 해결 능력 🤔',
            description:
              '복잡한 문제를 만났을 때 해결책을 찾는 생각의 힘을 기르고 싶어요',
          },
        ],
      },
      {
        step: 2,
        question: '현재 언어 실력은 어느 수준인가요? 📊',
        options: [
          {
            value: 'beginner',
            title: '기초 수준 🌱',
            description: '기본 단어와 간단한 문장으로 대화할 수 있어요',
          },
          {
            value: 'intermediate',
            title: '중급 수준 📚',
            description: '일상 대화와 기본적인 토론이 가능해요',
          },
          {
            value: 'upper_intermediate',
            title: '중상급 수준 🎯',
            description: '복잡한 주제도 자연스럽게 표현할 수 있어요',
          },
          {
            value: 'advanced',
            title: '고급 수준 🌟',
            description: '유창하고 정확한 표현으로 깊이 있는 토론이 가능해요',
          },
        ],
      },
      {
        step: 3,
        question:
          '요즘 무엇에 가장 관심이 많으세요? 대화하고 싶은 주제를 골라주세요! 💭',
        options: [
          {
            value: 'career',
            title: '진로와 직업 💼',
            description: '미래 진로, 대학 선택, 직업 탐색',
          },
          {
            value: 'study_methods',
            title: '효과적인 공부법 📚',
            description: '학습 전략, 시험 준비, 성적 향상',
          },
          {
            value: 'social_issues',
            title: '사회 정의와 환경 🌱',
            description: '사회 문제, 환경 보호, 정의와 평등',
          },
          {
            value: 'pop_culture',
            title: 'K-POP과 엔터테인먼트 🎵',
            description: '음악, 영화, 드라마, 연예계 이슈',
          },
          {
            value: 'technology',
            title: '최신 기술과 게임 💻',
            description: 'IT 기술, 게임, 앱, 디지털 트렌드',
          },
          {
            value: 'creativity',
            title: '웹툰과 창작 활동 🎨',
            description: '웹툰, 애니메이션, 창작, 예술',
          },
          {
            value: 'sports',
            title: '스포츠와 건강 ⚽',
            description: '축구, 농구, 운동, 피트니스',
          },
          {
            value: 'relationships',
            title: '인간관계와 소통 💬',
            description: '친구 관계, 연애, 소통 스킬',
          },
          {
            value: 'psychology',
            title: '심리학과 자기계발 🧠',
            description: '성격 분석, 감정 관리, 멘탈 헬스',
          },
          {
            value: 'travel',
            title: '여행과 문화 ✈️',
            description: '해외 여행, 다른 나라 문화, 언어',
          },
          {
            value: 'fashion',
            title: '패션과 뷰티 👗',
            description: '스타일링, 메이크업, 트렌드',
          },
          {
            value: 'economics',
            title: '경제와 투자 💰',
            description: '용돈 관리, 주식, 경제 뉴스',
          },
          {
            value: 'science',
            title: '과학과 실험 🔬',
            description: '물리, 화학, 생물, 실험',
          },
          {
            value: 'philosophy',
            title: '철학과 인생 🤔',
            description: '인생의 의미, 가치관, 철학적 사고',
          },
          {
            value: 'history',
            title: '역사와 인물 📜',
            description: '한국사, 세계사, 역사적 인물',
          },
          {
            value: 'literature',
            title: '문학과 글쓰기 📝',
            description: '시, 소설, 에세이, 창작',
          },
          {
            value: 'volunteer',
            title: '봉사와 사회참여 🤝',
            description: '자원봉사, 사회 기여, 리더십',
          },
          {
            value: 'entrepreneurship',
            title: '창업과 비즈니스 🚀',
            description: '아이디어 개발, 창업, 사업',
          },
          {
            value: 'language',
            title: '외국어 학습 🌍',
            description: '영어, 일본어, 중국어, 언어 교환',
          },
          {
            value: 'future',
            title: '미래와 꿈 🌟',
            description: '꿈과 목표, 미래 계획, 비전',
          },
        ],
      },
      {
        step: 4,
        question: '함께 성장할 AI 튜터의 스타일을 선택해주세요! 🤝',
        options: [
          {
            value: 'smart_senior',
            title: '똑똑한 선배 🎓',
            description: '핵심을 짚어주며 논리적인 조언을 해주는 스타일',
          },
          {
            value: 'passionate_peer',
            title: '열정적인 동료 🔥',
            description: '같은 눈높이에서 함께 고민하고 아이디어를 내는 스타일',
          },
          {
            value: 'humorous_coach',
            title: '유머러스한 코치 😄',
            description: '재치있는 질문으로 긴장을 풀고 즐겁게 대화하는 스타일',
          },
        ],
      },
      {
        step: 5,
        question: 'AI 튜터와 어떤 방식으로 티키타카하고 싶나요? 💬',
        options: [
          {
            value: 'debate_partner',
            title: '찬반 디베이트 ⚡',
            description:
              '제 의견에 대해 반대 입장에서 질문하며 생각의 폭을 넓혀주세요',
          },
          {
            value: 'life_simulation',
            title: '인생 시뮬레이션 🎮',
            description:
              '특정 상황(예: 동아리 회장 선거)을 주고 어떻게 해결할지 함께 이야기해요',
          },
          {
            value: 'idea_buildup',
            title: '아이디어 빌드업 💡',
            description:
              '제가 던진 작은 아이디어를 더 크고 멋지게 발전시켜 주세요',
          },
        ],
      },
    ];
  }

  private getAdultQuestions(): OnboardingStep[] {
    return [
      {
        step: 1,
        question: 'uneseule.ai를 통해 어떤 지적 성장을 원하십니까? 🎯',
        options: [
          {
            value: 'business_persuasion',
            title: '비즈니스 설득력 강화 💼',
            description:
              '비즈니스 협상 및 프레젠테이션에서 상대를 설득하는 논리를 갖추고 싶습니다',
          },
          {
            value: 'academic_analysis',
            title: '학술적 비판 분석 🎓',
            description:
              '특정 분야에 대한 깊이 있는 토론과 비판적 분석 능력을 기르고 싶습니다',
          },
          {
            value: 'innovation_partner',
            title: '혁신적 사고 파트너 💡',
            description:
              '혁신적인 아이디어를 도출하고 발전시키는 창의적 사고 파트너가 필요합니다',
          },
          {
            value: 'strategic_insight',
            title: '전략적 통찰력 개발 🧠',
            description:
              '복잡한 이슈의 본질을 꿰뚫는 통찰력과 추론 능력을 훈련하고 싶습니다',
          },
        ],
      },
      {
        step: 2,
        question: '현재 언어 실력은 어느 수준이십니까? 🎯',
        options: [
          {
            value: 'intermediate',
            title: '중급 수준 📚',
            description: '기본적인 업무나 학술 토론이 가능한 수준입니다',
          },
          {
            value: 'upper_intermediate',
            title: '중상급 수준 🎓',
            description: '복잡한 주제도 명확하게 표현하고 이해할 수 있습니다',
          },
          {
            value: 'advanced',
            title: '고급 수준 ⭐',
            description:
              '전문적이고 정교한 표현으로 심도 있는 논의가 가능합니다',
          },
          {
            value: 'native_proficient',
            title: '모국어 수준 🌟',
            description:
              '유창하고 자연스러운 표현으로 모든 상황에서 완벽한 소통이 가능합니다',
          },
        ],
      },
      {
        step: 3,
        question: '주로 관심 있는 전문 분야나 토론 주제를 선택해 주세요 💼',
        options: [
          {
            value: 'business_strategy',
            title: '비즈니스 전략 📈',
            description: '경영 전략, 마케팅, 리더십, 조직 관리',
          },
          {
            value: 'technology_innovation',
            title: '기술 혁신 💻',
            description: 'AI, 블록체인, 스타트업, 디지털 트랜스포메이션',
          },
          {
            value: 'social_policy',
            title: '사회 정책 🏛️',
            description: '정치, 경제 정책, 사회 이슈, 공공 정책',
          },
          {
            value: 'academia_research',
            title: '학술 연구 🔬',
            description: '연구 방법론, 학술 논문, 이론적 분석',
          },
          {
            value: 'creative_industry',
            title: '창작 산업 🎨',
            description: '콘텐츠 제작, 문화 산업, 창의적 기획',
          },
          {
            value: 'global_affairs',
            title: '국제 정세 🌍',
            description: '국제 관계, 글로벌 경제, 문화 교류',
          },
          {
            value: 'finance_investment',
            title: '금융과 투자 💰',
            description: '투자 전략, 자산 관리, 금융 시장 분석',
          },
          {
            value: 'healthcare_medicine',
            title: '의료와 헬스케어 🏥',
            description: '의학 발전, 건강 관리, 바이오 기술',
          },
          {
            value: 'education_learning',
            title: '교육과 학습 🎓',
            description: '교육 혁신, 평생 학습, 인재 개발',
          },
          {
            value: 'environment_sustainability',
            title: '환경과 지속가능성 🌱',
            description: '기후 변화, 친환경 기술, ESG 경영',
          },
          {
            value: 'law_ethics',
            title: '법률과 윤리 ⚖️',
            description: '법적 이슈, 윤리적 딜레마, 규제와 컴플라이언스',
          },
          {
            value: 'psychology_behavior',
            title: '심리학과 행동과학 🧠',
            description: '소비자 심리, 조직 심리, 인간 행동 분석',
          },
          {
            value: 'data_analytics',
            title: '데이터와 분석 📊',
            description: '빅데이터, 머신러닝, 통계 분석',
          },
          {
            value: 'entrepreneurship',
            title: '창업과 혁신 🚀',
            description: '창업 생태계, 벤처 투자, 혁신 경영',
          },
          {
            value: 'media_communication',
            title: '미디어와 커뮤니케이션 📺',
            description: '디지털 미디어, 브랜딩, 소셜 미디어 전략',
          },
          {
            value: 'philosophy_ethics',
            title: '철학과 사회윤리 🤔',
            description: '현대 철학, 사회적 가치, 윤리적 리더십',
          },
          {
            value: 'real_estate',
            title: '부동산과 도시계획 🏢',
            description: '부동산 시장, 도시 개발, 건축과 공간',
          },
          {
            value: 'culture_arts',
            title: '문화와 예술 🎭',
            description: '문화 산업, 예술 경영, 크리에이티브 비즈니스',
          },
          {
            value: 'personal_development',
            title: '자기계발과 리더십 💪',
            description: '개인 성장, 리더십 개발, 워라밸',
          },
          {
            value: 'future_trends',
            title: '미래 트렌드 🔮',
            description: '미래 예측, 메가트렌드, 사회 변화',
          },
        ],
      },
      {
        step: 4,
        question: 'AI 튜터의 전문적 성향을 설정해 주세요 🤖',
        options: [
          {
            value: 'analytical_advisor',
            title: '분석적 어드바이저 📊',
            description:
              '데이터와 논리를 바탕으로 체계적이고 객관적인 분석을 제공합니다',
          },
          {
            value: 'strategic_consultant',
            title: '전략적 컨설턴트 🎯',
            description:
              '실무적 관점에서 구체적이고 실행 가능한 솔루션을 제시합니다',
          },
          {
            value: 'creative_collaborator',
            title: '창의적 협력자 💭',
            description:
              '기존 틀을 벗어난 혁신적 아이디어와 다양한 관점을 제공합니다',
          },
          {
            value: 'socratic_mentor',
            title: '소크라테스식 멘토 🤔',
            description:
              '질문을 통해 스스로 답을 찾도록 이끌며 깊이 있는 사고를 촉진합니다',
          },
        ],
      },
      {
        step: 5,
        question: '선호하시는 피드백 및 상호작용 방식을 선택해 주세요 💬',
        options: [
          {
            value: 'critical_challenge',
            title: '비판적 도전 ⚡',
            description:
              '논리의 허점을 지적하고 반박하여 더 강력한 논증을 만들도록 도와드립니다',
          },
          {
            value: 'structured_analysis',
            title: '구조화된 분석 📋',
            description:
              '체계적인 프레임워크로 문제를 분해하고 단계별 해결책을 제시합니다',
          },
          {
            value: 'alternative_perspective',
            title: '대안적 관점 제시 🔄',
            description:
              '다양한 각도에서 문제를 바라보며 새로운 시각을 제공합니다',
          },
          {
            value: 'practical_application',
            title: '실용적 적용 🎯',
            description:
              '이론을 실제 상황에 어떻게 적용할지 구체적인 예시와 함께 안내합니다',
          },
        ],
      },
    ];
  }
}
