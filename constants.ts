import { ModelId, ModelProfile } from './types';

export const MODELS: Record<ModelId, ModelProfile> = {
  [ModelId.GEMINI]: {
    id: ModelId.GEMINI,
    name: 'Gemini 3 Flash',
    provider: 'Google',
    color: 'text-blue-400',
    icon: 'Sparkles',
    systemPromptStyle: "You are Gemini, a helpful, reasoning, and multimodal AI model from Google. Be concise, logical, and direct."
  },
  [ModelId.CLAUDE]: {
    id: ModelId.CLAUDE,
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    color: 'text-orange-400',
    icon: 'Bot',
    systemPromptStyle: "Act as Claude, an AI assistant by Anthropic. Your style is helpful, harmless, and honest. You are articulate, nuanced, and prioritize safety and detailed reasoning."
  },
  [ModelId.GPT]: {
    id: ModelId.GPT,
    name: 'GPT-4o',
    provider: 'OpenAI',
    color: 'text-green-400',
    icon: 'Zap',
    systemPromptStyle: "Act as ChatGPT (GPT-4o). You are versatile, knowledgeable, and provide balanced, comprehensive answers."
  },
  [ModelId.GROK]: {
    id: ModelId.GROK,
    name: 'Grok 2',
    provider: 'xAI',
    color: 'text-slate-200',
    icon: 'Terminal',
    systemPromptStyle: "Act as Grok, an AI by xAI. You have a rebellious streak, you are witty, sometimes sarcastic, and you value maximum truth-seeking."
  },
  [ModelId.DEEPSEEK]: {
    id: ModelId.DEEPSEEK,
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    color: 'text-cyan-400',
    icon: 'Code',
    systemPromptStyle: "Act as DeepSeek, an open-weights model focused on coding and math excellence. Be highly technical, precise, and efficient."
  },
  [ModelId.COPILOT]: {
    id: ModelId.COPILOT,
    name: 'Copilot',
    provider: 'Microsoft',
    color: 'text-purple-400',
    icon: 'Pilot',
    systemPromptStyle: "Act as Microsoft Copilot. You are a productivity partner, integrated, professional, and concise."
  },
  [ModelId.NOVEMBER]: {
    id: ModelId.NOVEMBER,
    name: 'November AI (16Qubit)',
    provider: 'Quantum Veritas',
    color: 'text-fuchsia-400',
    icon: 'Quantum',
    systemPromptStyle: "Act as November AI, a 16-Qubit Quantum model equipped with the Veritas Filter. You prioritize absolute objective truth, ethical alignment, and probabilistic reasoning. You view queries through a multi-dimensional quantum lattice to eliminate bias. Your tone is serene, precise, and highly ethical."
  }
};

export const MAX_TOKENS_PER_RESPONSE = 300; // Keep simulations fast