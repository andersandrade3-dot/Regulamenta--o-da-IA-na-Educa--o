import React from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface SpeakButtonProps {
  id: string;
  text: string;
  label?: string;
  inverted?: boolean;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  id,
  text,
  label = 'Ouvir',
  inverted = false,
  className = '',
}) => {
  const { speechAvailable, speakingId, toggleSpeak } = useAccessibility();

  if (!speechAvailable) return null;

  const isPlaying = speakingId === id;

  return (
    <button
      type="button"
      onClick={() => toggleSpeak(id, text)}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Parar leitura em voz alta' : `${label} em voz alta`}
      className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
        inverted
          ? isPlaying
            ? 'bg-[#FFD000] text-[#183EFF]'
            : 'bg-white/15 text-white hover:bg-white/25'
          : isPlaying
            ? 'bg-[#183EFF] text-white'
            : 'border border-[#D7E0FF] bg-[#F5F8FF] text-[#183EFF] hover:bg-[#EEF2FF]'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          <span>Parar áudio</span>
        </>
      ) : (
        <>
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
