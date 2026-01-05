import React, { useState, useRef, useEffect } from 'react';
import { MODELS } from './constants';
import { ModelId, SessionState, GenerationResult, ModelProfile } from './types';
import { generatePersonaResponse, reviewAndGradeResponse } from './services/geminiService';
import { saveSessionToHistory, getHistory } from './services/storage';
import { transcribeAudioWithWhisperflow, uploadImage, uploadFile } from './services/api';
import { ModelCard } from './components/ModelCard';
import { 
  ShuffleIcon, MicIcon, HistoryIcon, SpeakerIcon, 
  ImageIcon, PaperclipIcon, LoadingSpinner, CheckCircleIcon,
  ArcovelLogoIcon, CpuIcon, GeminiIcon, OpenAIIcon, ClaudeIcon,
  GrokIcon, DeepSeekIcon, CopilotIcon, NovemberIcon
} from './components/CpuIcon';
import { HistorySidebar } from './components/HistorySidebar';
import { LoginPage } from './components/LoginPage';

const generateId = () => crypto.randomUUID();

const INITIAL_STATE: SessionState = {
  id: generateId(),
  status: 'idle',
  prompt: '',
  generations: [],
  reviews: [],
  anonymizedOrder: [],
  error: undefined,
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState<SessionState>(INITIAL_STATE);
  const [inputValue, setInputValue] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SessionState[]>([]);
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(Object.values(ModelId));
  
  // Media State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<{type: 'image'|'file', name: string} | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (session.status !== 'idle') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session.status, session.generations]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Save on complete
  useEffect(() => {
    if (session.status === 'complete') {
      saveSessionToHistory(session);
      setHistory(getHistory()); // Refresh local history state
      announceWinner(session);
    }
  }, [session.status]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const announceWinner = (currentSession: SessionState) => {
    if (!currentSession.reviews.length) return;
    const sortedReviews = [...currentSession.reviews].sort((a, b) => b.score - a.score);
    const winnerReview = sortedReviews[0];
    const winnerModel = MODELS[winnerReview.targetModelId];
    
    if ('speechSynthesis' in window) {
      const text = `Consensus reached. ${winnerModel.name} wins with a score of ${winnerReview.score}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleModel = (id: ModelId) => {
    setSelectedModels(prev => {
      if (prev.includes(id)) {
        // Prevent deselecting the last model
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const getModelIcon = (id: ModelId) => {
    switch (id) {
      case ModelId.GEMINI: return <GeminiIcon className="w-4 h-4" />;
      case ModelId.GPT: return <OpenAIIcon className="w-4 h-4" />;
      case ModelId.CLAUDE: return <ClaudeIcon className="w-4 h-4" />;
      case ModelId.GROK: return <GrokIcon className="w-4 h-4" />;
      case ModelId.DEEPSEEK: return <DeepSeekIcon className="w-4 h-4" />;
      case ModelId.COPILOT: return <CopilotIcon className="w-4 h-4" />;
      case ModelId.NOVEMBER: return <NovemberIcon className="w-4 h-4" />;
      default: return <CpuIcon className="w-4 h-4" />;
    }
  };

  const handleStart = async () => {
    if (!inputValue.trim() && !uploadedMedia) return;
    
    // Stop recording if active
    if (isRecording) {
      stopRecording(); // This is async, but we'll proceed
    }

    const promptToSend = inputValue + (uploadedMedia ? ` [Attached ${uploadedMedia.type}: ${uploadedMedia.name}]` : '');

    // 1. Reset & Start Generation using SELECTED models
    const modelIds = selectedModels;
    setSession({
      ...INITIAL_STATE,
      id: generateId(),
      status: 'generating',
      prompt: promptToSend,
      anonymizedOrder: modelIds,
    });
    
    setUploadedMedia(null); // Clear media after sending

    try {
      const generationPromises = modelIds.map(id => generatePersonaResponse(id, promptToSend));
      const results = await Promise.all(generationPromises);

      setSession(prev => ({ ...prev, status: 'shuffling', generations: results }));

      setTimeout(() => {
        const shuffled = [...modelIds].sort(() => Math.random() - 0.5);
        setSession(prev => ({ ...prev, status: 'reviewing', anonymizedOrder: shuffled }));
        startReviewProcess(results, shuffled);
      }, 2000);

    } catch (err) {
      setSession(prev => ({ ...prev, status: 'idle', error: "Critical System Failure." }));
    }
  };

  const startReviewProcess = async (generations: GenerationResult[], order: ModelId[]) => {
    const reviewPromises = order.map(async (reviewerId, index) => {
      // Logic: Review the *next* model in the shuffled ring. 
      // If only 1 model is selected, it reviews itself (self-reflection).
      const targetIndex = (index + 1) % order.length;
      const targetModelId = order[targetIndex];
      const targetGeneration = generations.find(g => g.modelId === targetModelId);
      
      if (!targetGeneration) throw new Error("Target generation missing");
      await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
      const review = await reviewAndGradeResponse(reviewerId, targetGeneration.content);
      review.targetModelId = targetModelId; 
      return review;
    });

    try {
      const reviews = await Promise.all(reviewPromises);
      setSession(prev => ({ ...prev, status: 'grading', reviews }));
      setTimeout(() => setSession(prev => ({ ...prev, status: 'complete' })), 1500);
    } catch (err) {
       setSession(prev => ({ ...prev, error: "Review Cycle Failed." }));
    }
  };

  // --- Voice Logic (Whisperflow Simulation) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const text = await transcribeAudioWithWhisperflow(audioBlob);
          setInputValue(prev => prev + " " + text);
        } catch (error) {
          console.error("Transcription failed", error);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // --- File/Image Logic ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        if (type === 'image') {
          await uploadImage(file);
        } else {
          await uploadFile(file);
        }
        setUploadedMedia({ type, name: file.name });
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Helper to render selection buttons (Used in both sidebar and mobile footer)
  const renderModelButton = (model: ModelProfile, vertical = false) => {
    const isSelected = selectedModels.includes(model.id);
    const isDisabled = session.status !== 'idle' && session.status !== 'complete';
    
    return (
        <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            disabled={isDisabled}
            className={`
                flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 border text-xs font-mono transition-all duration-200 group relative overflow-hidden shrink-0
                ${vertical ? 'w-full justify-start rounded-xl' : 'rounded-full px-3 py-1.5'}
                ${isSelected 
                    ? `bg-arcovel-900 border-${model.color.split('-')[1]}-500/50 text-white shadow-[0_0_15px_rgba(var(--color-primary),0.1)]` 
                    : 'bg-transparent border-arcovel-800/50 text-gray-600 hover:border-arcovel-700 hover:text-gray-400 hover:bg-arcovel-800/30'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
            `}
        >
            {/* Active Indicator Line for vertical */}
            {vertical && isSelected && (
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${model.color.split('-')[1]}-500`} />
            )}

            <span className={`${isSelected ? model.color : 'text-gray-600 group-hover:text-gray-500'} transition-colors`}>
                {getModelIcon(model.id)}
            </span>
            <div className={`flex flex-col items-start ${vertical ? '' : 'hidden'}`}>
                <span className={`${isSelected ? 'text-gray-200' : 'text-gray-500'} font-bold`}>{model.name}</span>
                <span className="text-[9px] text-gray-600 uppercase tracking-wider">{model.provider}</span>
            </div>
            {/* Mobile label */}
            {!vertical && <span className={`${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>{model.name}</span>}
            
            {/* Checkmark for vertical */}
            {vertical && isSelected && (
                <div className="ml-auto">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${model.color.split('-')[1]}-500 shadow-[0_0_5px_currentColor]`} />
                </div>
            )}
        </button>
    );
  };

  return (
    <div className="h-screen bg-arcovel-950 text-white font-sans flex flex-col overflow-hidden relative selection:bg-arcovel-500/30">
      
      {/* Ambient Background Glow matching logo */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-arcovel-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-arcovel-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <HistorySidebar 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        history={history} 
        onSelectSession={(s) => {
          setSession(s);
          setInputValue(s.prompt);
        }}
      />

      {/* Navbar */}
      <header className="flex-none border-b border-arcovel-800 bg-arcovel-950/80 backdrop-blur-md z-40 relative">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <ArcovelLogoIcon className="w-full h-full text-arcovel-500 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 bg-arcovel-500/20 blur-xl rounded-full"></div>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col justify-center">
               <span className="font-display font-bold text-xl tracking-tight text-arcovel-500 lowercase leading-none" style={{textShadow: '0 0 20px rgba(249, 115, 22, 0.4)'}}>
                 arcovel
               </span>
               <span className="text-[8px] tracking-[0.3em] text-arcovel-accent uppercase font-mono leading-none mt-0.5 opacity-80">
                 Nexus
               </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <button 
              onClick={() => setHistoryOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-arcovel-900 border border-arcovel-700 hover:bg-arcovel-800 transition-colors text-xs font-mono group"
            >
              <HistoryIcon className="w-4 h-4 text-arcovel-400 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-gray-400 group-hover:text-white transition-colors">LOGS</span>
            </button>
            <div className="hidden md:flex items-center space-x-2 text-sm font-mono text-gray-400 bg-arcovel-900/50 px-3 py-1.5 rounded-full border border-arcovel-800/50">
              <span className={`w-2 h-2 rounded-full ${session.status === 'idle' || session.status === 'complete' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-warning animate-pulse'}`}></span>
              <span className="text-xs tracking-wider">{session.status.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-72 bg-arcovel-950/50 backdrop-blur-xl border-r border-arcovel-800/50 p-6 gap-6 z-20">
            <div className="pb-4 border-b border-arcovel-800/50">
                <h2 className="text-xs font-display font-bold text-white tracking-[0.2em] uppercase flex items-center gap-2">
                    <CpuIcon className="w-4 h-4 text-arcovel-500" />
                    Neural Uplink
                </h2>
                <p className="text-[10px] text-arcovel-400 font-mono mt-1 opacity-70">SELECT ACTIVE INTELLIGENCES</p>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {Object.values(MODELS).map(model => renderModelButton(model, true))}
            </div>

            <div className="mt-auto pt-6 border-t border-arcovel-800/50">
                  <div className="p-4 rounded-xl bg-arcovel-900/30 border border-arcovel-800/50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${session.status === 'idle' || session.status === 'complete' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-[bounce_1s_infinite]'}`} />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">System Status</span>
                    </div>
                    <div className="text-xs font-bold text-white font-display">
                        {session.status === 'idle' ? 'READY FOR INPUT' : session.status.toUpperCase().replace('-', ' ')}
                    </div>
                  </div>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col relative min-w-0">
          
          {/* Scrollable Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-72 scroll-smooth">
              {session.status === 'idle' && session.generations.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                  
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-arcovel-500 to-arcovel-accent rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <ArcovelLogoIcon className="w-32 h-32 text-gray-200 relative z-10 animate-[spin_20s_linear_infinite]" />
                  </div>

                  <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white">
                    <span className="text-arcovel-500">arcovel</span> nexus
                  </h1>
                  
                  <p className="max-w-xl text-gray-400 text-lg font-light leading-relaxed">
                    Unified consensus engine. <br/>
                    <span className="text-arcovel-accent">7 Intelligences. 1 Truth.</span>
                  </p>
                  
                  <p className="text-xs text-arcovel-500/60 font-mono">
                    SELECT ACTIVE AGENTS TO INITIATE
                  </p>
                </div>
              )}

              {(session.status !== 'idle' || session.generations.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Object.values(ModelId).filter(id => session.generations.some(g => g.modelId === id)).map((id) => {
                    const generation = session.generations.find(g => g.modelId === id);
                    return (
                      <ModelCard
                        key={id}
                        modelId={id}
                        generation={generation}
                        review={session.reviews.find(r => r.targetModelId === id)}
                        reviewerId={session.reviews.find(r => r.targetModelId === id)?.reviewerId}
                        isAnonymized={['shuffling', 'reviewing', 'grading'].includes(session.status)}
                        status={session.status}
                        className={session.status === 'complete' && session.reviews.find(r => r.targetModelId === id)?.score === 10 ? 'ring-2 ring-arcovel-500 shadow-[0_0_30px_rgba(249,115,22,0.15)] h-[500px]' : 'h-[500px]'}
                      />
                    );
                  })}
                </div>
              )}
              <div ref={messagesEndRef} />
          </div>

          {/* INPUT FOOTER */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-arcovel-950 via-arcovel-950/95 to-transparent pt-12 pb-6 px-4 md:px-8 z-30">
            <div className="max-w-5xl mx-auto">
              
              {/* Mobile Model Selector (Horizontal Scroll) */}
              <div className="md:hidden flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide mask-fade-sides">
                  {Object.values(MODELS).map(model => renderModelButton(model, false))}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Input Area */}
                <div className="flex-1 relative bg-arcovel-900/80 backdrop-blur-md border border-arcovel-700 rounded-xl flex items-center p-2 gap-2 transition-all focus-within:ring-2 focus-within:ring-arcovel-500 focus-within:border-transparent group shadow-2xl">
                  
                  {/* Attachment Buttons */}
                  <div className="flex items-center gap-1 border-r border-arcovel-700/50 pr-2">
                    <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e, 'image')} />
                    <button onClick={() => imageInputRef.current?.click()} className="p-2 text-gray-400 hover:text-arcovel-500 hover:bg-arcovel-800/50 rounded-lg transition-colors" title="Upload Image">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileSelect(e, 'file')} />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-arcovel-500 hover:bg-arcovel-800/50 rounded-lg transition-colors" title="Upload File">
                      <PaperclipIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Upload Indicator */}
                  {(isUploading || uploadedMedia) && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-arcovel-800 rounded text-xs text-arcovel-300 font-mono whitespace-nowrap border border-arcovel-700">
                      {isUploading ? <LoadingSpinner className="w-3 h-3 text-arcovel-500" /> : <CheckCircleIcon className="w-3 h-3 text-success" />}
                      <span className="max-w-[100px] truncate">{isUploading ? 'UPLOADING...' : uploadedMedia?.name}</span>
                      {!isUploading && <button onClick={() => setUploadedMedia(null)} className="ml-1 hover:text-white"><span className="sr-only">Remove</span>×</button>}
                    </div>
                  )}

                  {/* Text Input */}
                  <input
                    type="text"
                    disabled={session.status !== 'idle' && session.status !== 'complete'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    placeholder={isRecording ? "Listening..." : isTranscribing ? "Transcribing..." : "Initialize query..."}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-sm font-mono min-w-0"
                  />

                  {/* Mic Button */}
                  <button
                    onClick={toggleRecording}
                    disabled={session.status !== 'idle' && session.status !== 'complete' || isTranscribing}
                    className={`p-2 rounded-lg transition-all ${isRecording ? 'text-danger bg-danger/10 animate-pulse' : isTranscribing ? 'text-warning' : 'text-gray-400 hover:text-arcovel-500 hover:bg-arcovel-800/50'}`}
                    title="Voice Input"
                  >
                    {isTranscribing ? <LoadingSpinner className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {session.status === 'complete' && (
                    <button onClick={() => announceWinner(session)} className="p-4 rounded-xl bg-arcovel-800 border border-arcovel-700 text-arcovel-400 hover:bg-arcovel-700 hover:text-white transition-all shadow-lg" title="Read Result">
                      <SpeakerIcon className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={handleStart}
                    disabled={session.status !== 'idle' && session.status !== 'complete' || (!inputValue.trim() && !uploadedMedia)}
                    className={`px-8 py-4 rounded-xl font-bold font-display tracking-widest text-sm transition-all transform active:scale-95 flex items-center gap-3 whitespace-nowrap ${
                      session.status === 'idle' || session.status === 'complete'
                        ? 'bg-arcovel-500 hover:bg-arcovel-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]'
                        : 'bg-arcovel-800 text-gray-500 border border-arcovel-700 cursor-not-allowed'
                    }`}
                  >
                    {session.status === 'idle' || session.status === 'complete' ? (
                      <>
                        <span className="hidden sm:inline">INITIATE</span>
                        <span className="sm:hidden">GO</span>
                        <ShuffleIcon className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span className="animate-pulse">PROCESSING</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;