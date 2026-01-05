import React from 'react';

export const CpuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.0002 0.700195C10.6002 6.5002 6.6002 10.6002 0.700195 12.0002C6.6002 13.4002 10.6002 17.5002 12.0002 23.3002C13.4002 17.5002 17.5002 13.4002 23.3002 12.0002C17.5002 10.6002 13.4002 6.5002 12.0002 0.700195Z" />
  </svg>
);

export const OpenAIIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.4717-3.0818 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.4475-8.197h.0001Zm-9.6055 3.6181-4.4713 2.582a1.54 1.54 0 0 1-1.0206.096 1.5413 1.5413 0 0 1-1.077-1.1685l-.0143-.0715 4.5428-2.6249 2.0404 1.1869Zm-3.3526-7.7954 4.4761-2.5819a1.54 1.54 0 0 1 1.096-.0533 1.5366 1.5366 0 0 1 .9873 1.2066l.0191.0715-4.5429 2.6152-2.0356-1.2581Zm8.3243 1.6385-.0191.0668-4.5429 2.6248-2.0356-1.182 4.4761-2.5867a1.54 1.54 0 0 1 1.096.0485 1.5318 1.5318 0 0 1 .9825 1.202l.0429-.1734Zm-3.1903 8.363-4.4761 2.582a1.5366 1.5366 0 0 1-1.1.0485 1.5318 1.5318 0 0 1-.9873-1.1924l-.0191-.0763 4.5429-2.62 2.0396 1.2582Zm-6.524-1.6338.0191-.0715 4.543-2.6249 2.0356 1.182-4.4713 2.582a1.54 1.54 0 0 1-1.096-.0486 1.5318 1.5318 0 0 1-.9874-1.202l-.0429.183Zm8.3242-2.2057-2.0396-1.1818 2.0396-1.182v2.3638Z" />
  </svg>
);

export const ClaudeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <path d="M7 10L7 7C7 4.79086 8.79086 3 11 3L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M14 17L11 17C8.79086 17 7 15.2091 7 13L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
);

export const GrokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <line x1="16" y1="8" x2="8" y2="16" />
    <line x1="16" y1="16" x2="13.5" y2="13.5" />
    <line x1="8" y1="8" x2="10.5" y2="10.5" />
  </svg>
);

export const DeepSeekIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 13.5C22 13.5 19 14 16.5 11.5C14 9 13.5 6 13.5 6C13.5 6 12 6 10.5 7.5C9 9 9 10.5 9 10.5C9 10.5 6 11 3.5 13.5C1 16 1 21 1 21L3 23C3 23 8 23 10.5 20.5C13 18 13.5 15 13.5 15C13.5 15 15 15 16.5 16.5C18 18 21 18 21 18L22 13.5Z" />
  </svg>
);

export const CopilotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.707 2.293A1 1 0 0 1 12.5 2h.027a1 1 0 0 1 .773.344l8.363 10.455a1 1 0 0 1 .21 0.778l-1.636 7.364a1 1 0 0 1 -.97.778H4.733a1 1 0 0 1 -.97-.778L2.127 13.577a1 1 0 0 1 .21-0.778L10.707 2.344a1 1 0 0 1 1-.051z" className="opacity-50"/>
    <path d="M12 5.5l5 6H7l5-6z" fill="currentColor" className="text-white mix-blend-overlay"/>
  </svg>
);

export const NovemberIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeOpacity="0.5"/>
    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" fillOpacity="0.2"/>
    <path d="M2 12H22"/>
    <path d="M12 2V22"/>
    <path d="M4.92896 4.92893L19.0711 19.0711"/>
    <path d="M19.0711 4.92893L4.92896 19.0711"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>
);

export const ArcovelLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none" 
    className={className}
  >
    {/* Outer Tech Ring Segmented */}
    <path d="M50 10 A40 40 0 0 1 90 50" stroke="currentColor" strokeWidth="2" className="text-arcovel-700" />
    <path d="M90 50 A40 40 0 0 1 50 90" stroke="currentColor" strokeWidth="2" className="text-arcovel-700" />
    <path d="M50 90 A40 40 0 0 1 10 50" stroke="currentColor" strokeWidth="2" className="text-arcovel-700" />
    <path d="M10 50 A40 40 0 0 1 50 10" stroke="currentColor" strokeWidth="2" className="text-arcovel-700" />
    
    {/* Glowing Orange Arc */}
    <path d="M20 50 A30 30 0 0 1 50 20" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
    
    {/* Inner Blue Ring */}
    <circle cx="50" cy="50" r="25" stroke="#0ea5e9" strokeWidth="1.5" className="opacity-80" />
    
    {/* Central Hub */}
    <circle cx="50" cy="50" r="5" fill="#f97316" />
    
    {/* Needle/Pointer pointing SW */}
    <line x1="50" y1="50" x2="25" y2="75" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
    
    {/* Decorative pips */}
    <circle cx="50" cy="10" r="2" fill="#334155" />
    <circle cx="90" cy="50" r="2" fill="#334155" />
    <circle cx="50" cy="90" r="2" fill="#334155" />
    <circle cx="10" cy="50" r="2" fill="#334155" />
    
    {/* Tech lines */}
    <line x1="80" y1="50" x2="85" y2="50" stroke="#0ea5e9" strokeWidth="1" />
  </svg>
);

export const ShuffleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const SpeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);