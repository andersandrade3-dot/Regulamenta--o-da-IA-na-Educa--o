import React from 'react';
import { BookOpen } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import type { MecCitation } from '../../types/mission';

interface CitationBadgeProps {
  citation: MecCitation;
  compact?: boolean;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation, compact = false }) => {
  const { setReferenceDrawerOpen } = useMission();

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] px-3 py-2 text-xs text-[#1E2B58]">
      <div className="flex items-start gap-2">
        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#183EFF]" aria-hidden="true" />
        <div>
          <span className="font-bold text-[#183EFF]">Fundamentação no documento: </span>
          <span>
            {citation.source} — {citation.chapter} ({citation.page})
          </span>
          {citation.legalRef && !compact && (
            <span className="block text-[11px] font-semibold text-[#3C4B7B] mt-0.5">
              Norma relacionada: {citation.legalRef}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setReferenceDrawerOpen(true)}
        className="shrink-0 rounded-lg border border-[#183EFF]/30 bg-white px-2.5 py-1 text-[11px] font-bold text-[#183EFF] hover:bg-[#183EFF] hover:text-white transition-colors cursor-pointer"
      >
        Ver Biblioteca
      </button>
    </div>
  );
};

