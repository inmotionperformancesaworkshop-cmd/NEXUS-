import React from 'react';
import { SessionState, ModelId } from '../types';
import { MODELS } from '../constants';
import { XIcon, CheckCircleIcon } from './CpuIcon';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionState[];
  onSelectSession: (session: SessionState) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelectSession 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-arcovel-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-arcovel-900 border-l border-arcovel-800 shadow-2xl h-full flex flex-col animate-[slideIn_0.3s_ease-out]">
        <div className="flex items-center justify-between p-6 border-b border-arcovel-800 bg-arcovel-950">
          <h2 className="text-xl font-bold font-mono tracking-wide text-white">MISSION LOGS</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-arcovel-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500 font-mono text-sm">
              NO RECORDS FOUND
            </div>
          ) : (
            history.map((session) => {
              // Find winner
              const highestScore = Math.max(...session.reviews.map(r => r.score));
              const winnerReview = session.reviews.find(r => r.score === highestScore);
              const winnerModel = winnerReview ? MODELS[winnerReview.targetModelId] : null;

              return (
                <button
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-xl bg-arcovel-950/50 border border-arcovel-800 hover:border-arcovel-500 hover:bg-arcovel-900 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-500">
                      {session.savedAt ? new Date(session.savedAt).toLocaleDateString() : 'Unknown Date'}
                    </span>
                    {winnerModel && (
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-arcovel-950 border border-gray-800 ${winnerModel.color}`}>
                         Winner: {winnerModel.name}
                       </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-arcovel-400 mb-2">
                    {session.prompt}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                    <CheckCircleIcon className="w-3 h-3 text-green-500" />
                    <span>{session.generations.length} Models</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
