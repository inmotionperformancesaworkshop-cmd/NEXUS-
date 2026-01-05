export enum ModelId {
  GEMINI = 'gemini',
  GPT = 'gpt',
  CLAUDE = 'claude',
  GROK = 'grok',
  DEEPSEEK = 'deepseek',
  COPILOT = 'copilot',
  NOVEMBER = 'november'
}

export interface ModelProfile {
  id: ModelId;
  name: string;
  provider: string;
  color: string;
  icon: string; // Brief icon descriptor or component key
  systemPromptStyle: string;
}

export interface GenerationResult {
  modelId: ModelId;
  content: string;
  timestamp: number;
}

export interface Review {
  reviewerId: ModelId;
  targetModelId: ModelId;
  critique: string;
  score: number; // 0-10
}

export interface SessionState {
  id: string; // Unique session ID
  savedAt?: number; // Timestamp for history
  status: 'idle' | 'generating' | 'shuffling' | 'reviewing' | 'grading' | 'complete';
  prompt: string;
  generations: GenerationResult[];
  reviews: Review[];
  error?: string;
  // Used for the "blind" shuffling logic
  anonymizedOrder: ModelId[]; 
}