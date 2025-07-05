export interface VapiAssistant {
  id: string;
  name: string;
  model: VapiModel;
  voice: VapiVoice;
  firstMessage: string;
  serverUrl?: string;
  serverUrlSecret?: string;
  clientMessages?: string[];
  serverMessages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VapiModel {
  provider: 'openai' | 'azure';
  model: string;
  messages: VapiMessage[];
  functions?: VapiFunction[];
  temperature?: number;
  maxTokens?: number;
}

export interface VapiVoice {
  provider: 'openai' | 'azure' | 'cartesia' | '11labs' | 'elevenlabs';
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface VapiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface VapiFunction {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface VapiCall {
  id: string;
  assistantId: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended';
  startedAt?: string;
  endedAt?: string;
  customer?: {
    number?: string;
  };
  transcript?: string;
  summary?: string;
}

export interface VapiWebhookEvent {
  type:
    | 'function-call'
    | 'end-of-call-report'
    | 'conversation-update'
    | 'transcript';
  call: VapiCall;
  message?: any;
  transcript?: {
    text: string;
    role: 'user' | 'assistant';
    timestamp: string;
  };
  functionCall?: {
    name: string;
    parameters: any;
  };
  timestamp: string;
}

export interface ThinkingProcessAnalysis {
  studentResponse: string;
  thinkingLevel: 'beginner' | 'intermediate' | 'advanced';
  nextQuestion?: string;
  concepts?: string[];
  understanding?: number; // 0-100
  suggestions?: string[];
}
