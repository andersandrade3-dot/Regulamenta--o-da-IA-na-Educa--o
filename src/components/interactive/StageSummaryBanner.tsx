import React from 'react';
import { ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { STAGES_META } from '../../data/mecReferences';
import type { StageId } from '../../types/mission';

interface StageSummaryBannerProps {
  stageId: StageId;
  learnings: string[];
  isStageCompleted: boolean;
  canComplete: boolean;
  incompleteHint?: string;
  onCompleteAndContinue: () => void;
  continueLabel?: string;
}

export const StageSummaryBanner: React.FC<StageSummaryBannerProps> = ({
  stageId,
  learnings,
  isStageCompleted,
  canComplete,
  incompleteHint,
  onCompleteAndContinue,
  continueLabel,
}) => {
  const meta = STAGES_META.find((s) => s.id === stageId);
  if (!meta) return null;

  const defaultButtonLabel =
    stageId < 6
      ? isStageCompleted
        ? `Avançar para a Etapa ${stageId + 1}`
        : `Concluir Etapa ${stageId} e avançar`
      : 'Concluir atividade';

  return (
    <div className="mt-8 rounded-2xl border-[1.5px] border-[#183EFF] bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD000] px-3 py-1 text-xs font-extrabold text-[#183EFF]">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Conquista da Etapa {stageId}: {meta.achievementTitle}
            </span>
            {isStageCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F8EE] px-2.5 py-1 text-xs font-bold text-[#057A2E]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Etapa registrada
              </span>
            )}
          </div>

          <div>
            <h4 className="font-editorial text-base font-bold text-[#22252B]">
              Síntese do que você investigou nesta etapa
            </h4>
            <ul className="mt-2 space-y-1.5 font-body text-sm text-[#3C3C3C]">
              {learnings.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#183EFF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
          <button
            type="button"
            disabled={!canComplete}
            onClick={onCompleteAndContinue}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
              canComplete
                ? 'bg-[#183EFF] text-white hover:bg-[#1230CC] shadow-sm cursor-pointer'
                : 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
            }`}
          >
            <span>{continueLabel ?? defaultButtonLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          {!canComplete && incompleteHint && (
            <p className="text-xs font-medium text-[#B45309] max-w-xs sm:text-right">
              {incompleteHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

