import React, { useState } from 'react';
import { ModelId, GenerationResult, Review } from '../types';
import { MODELS } from '../constants';
import { 
  CpuIcon, GeminiIcon, OpenAIIcon, ClaudeIcon, 
  GrokIcon, DeepSeekIcon, CopilotIcon, NovemberIcon, ChevronDownIcon, ChevronUpIcon
} from './CpuIcon';

interface ModelCardProps {
  modelId: ModelId;
  generation?: GenerationResult;
  review?: Review; // The review THIS model received
  reviewerId?: ModelId; // Who reviewed THIS model
  isAnonymized: boolean;
  status: 'generating' | 'shuffling' | 'reviewing' | 'grading' | 'complete' | 'idle';
  className?: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  modelId,
  generation,
  review,
  reviewerId,
  isAnonymized,
  status,
  className,
}) => {
  const model = MODELS[modelId];
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  
  // Determine display identity
  const displayName = isAnonymized ? 'Subject ???' : model.name;
  const displayColor = isAnonymized ? 'text-gray-500' : model.color;
  const displayProvider = isAnonymized ? 'Encrypted' : model.provider;

  const isLoading = status === 'generating';
  
  // Icon Selection
  const getIcon = () => {
    if (isAnonymized) return <CpuIcon className="w-5 h-5" />;
    
    switch (modelId) {
      case ModelId.GEMINI: return <GeminiIcon className="w-5 h-5" />;
      case ModelId.GPT: return <OpenAIIcon className="w-5 h-5" />;
      case ModelId.CLAUDE: return <ClaudeIcon className="w-5 h-5" />;
      case ModelId.GROK: return <GrokIcon className="w-5 h-5" />;
      case ModelId.DEEPSEEK: return <DeepSeekIcon className="w-5 h-5" />;
      case ModelId.COPILOT: return <CopilotIcon className="w-5 h-5" />;
      case ModelId.NOVEMBER: return <NovemberIcon className="w-5 h-5" />;
      default: return <CpuIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className={`relative flex flex-col bg-arcovel-900 border border-arcovel-800 rounded-xl overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header - Fixed */}
      <div className="flex-none flex items-center justify-between p-4 bg-arcovel-950/50 border-b border-arcovel-800">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-arcovel-800 ${displayColor}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className={`font-mono text-sm font-bold tracking-wider ${displayColor}`}>
              {displayName}
            </h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{displayProvider}</p>
          </div>
        </div>
        {generation && !isAnonymized && (
           <div className="text-xs font-mono text-gray-600">
             {(generation.content.length / 4).toFixed(0)} tokens
           </div>
        )}
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 p-4 overflow-y-auto relative min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-arcovel-500 rounded-full"></div>
            <div className="w-2 h-2 bg-arcovel-500 rounded-full delay-75"></div>
            <div className="w-2 h-2 bg-arcovel-500 rounded-full delay-150"></div>
          </div>
        ) : generation ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {generation.content}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-700 text-sm font-mono">
            Awaiting Input...
          </div>
        )}

        {/* Status Overlay for Blind Phases */}
        {isAnonymized && status !== 'complete' && generation && (
           <div className="absolute inset-0 bg-arcovel-950/90 backdrop-blur-sm flex items-center justify-center flex-col z-10">
             <div className="text-arcovel-500 font-mono text-sm mb-2 animate-pulse">
               {status === 'shuffling' ? 'ENCRYPTING IDENTITY...' : 
                status === 'reviewing' ? 'PEER REVIEW IN PROGRESS...' : 
                status === 'grading' ? 'CALCULATING GRADES...' : 'WAITING'}
             </div>
           </div>
        )}
      </div>

      {/* Footer / Review Section - Pinned to bottom if active */}
      {(review && reviewerId && status === 'complete') && (
        <div className="flex-none bg-arcovel-950/30 border-t border-dashed border-gray-700 p-2 z-20 max-h-48 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setIsReviewExpanded(!isReviewExpanded)}
            className="w-full flex items-center justify-between p-2 rounded hover:bg-arcovel-800/50 transition-colors group sticky top-0 bg-arcovel-950/0 z-10"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase text-gray-500 font-bold">Grade</span>
              <span className={`text-sm font-bold font-mono ${review.score >= 8 ? 'text-green-400' : review.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {review.score}/10
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-arcovel-400 group-hover:text-arcovel-300">
              <span>{isReviewExpanded ? 'Hide Review' : 'View Critique'}</span>
              {isReviewExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
            </div>
          </button>

          {/* Collapsible Content */}
          {isReviewExpanded && (
            <div className="mt-2 bg-arcovel-900/80 p-3 rounded border border-arcovel-800 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-800">
                <span className="text-xs font-bold text-arcovel-400 uppercase">Reviewer</span>
                <span className="text-xs text-gray-400 font-mono">
                  {MODELS[reviewerId].name}
                </span>
              </div>
              <p className="text-xs text-gray-400 italic">"{review.critique}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
