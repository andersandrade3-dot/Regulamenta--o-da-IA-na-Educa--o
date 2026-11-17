import React from 'react';
import { Check, Lock } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { STAGES_META } from '../../data/mecReferences';
import type { StageId } from '../../types/mission';

export const StepNavigation: React.FC = () => {
  const { session, activeStage, goToStage } = useMission();
  if (!session) return null;

  const completed = new Set<StageId>(session.attempt.completed_stages);
  const highestUnlocked = Math.min(
    6,
    Math.max(1, completed.size > 0 ? Math.max(...Array.from(completed)) + 1 : 1, session.attempt.current_stage)
  );

  const currentStageMeta = STAGES_META.find((s) => s.id === activeStage);

  return (
    <nav aria-label="Etapas da atividade" className="no-print mb-5 sm:mb-6">
      <div className="rounded-2xl border border-[#D7DCE6] bg-white p-2.5 shadow-2xs space-y-2">
        {/* Resumo compacto no celular para indicar etapa atual e incentivar navegação por deslize */}
        <div className="flex items-center justify-between gap-2 px-1 sm:hidden">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
            Etapa {activeStage} de 6
          </span>
          <span className="text-[11px] font-medium text-[#525866] truncate">
            {currentStageMeta?.shortTitle} • deslize para navegar
          </span>
        </div>

        <ol className="flex gap-2 overflow-x-auto pb-1 snap-x sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6">
          {STAGES_META.map((stage) => {
            const isActive = activeStage === stage.id;
            const isDone = completed.has(stage.id);
            const isAccessible = stage.id <= highestUnlocked || isDone || session.attempt.is_completed;

            return (
              <li key={stage.id} className="shrink-0 w-[196px] snap-start sm:w-auto sm:shrink">
                <button
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => goToStage(stage.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex min-h-[48px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all ${
                    isActive
                      ? 'bg-[#183EFF] text-white shadow-sm cursor-pointer'
                      : isDone
                        ? 'bg-[#ECFDF3] text-[#064E23] hover:bg-[#DCFCE7] cursor-pointer'
                        : isAccessible
                          ? 'bg-[#F4F6FB] text-[#22252B] hover:bg-[#EEF2FF] cursor-pointer'
                          : 'bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed opacity-75'
                  }`}
                >
                  <span
                    className={`font-badge inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      isActive
                        ? 'bg-[#FFD000] text-[#183EFF]'
                        : isDone
                          ? 'bg-[#00A63E] text-white'
                          : isAccessible
                            ? 'bg-white text-[#183EFF] border border-[#D7E0FF]'
                            : 'bg-[#E2E8F0] text-[#94A3B8]'
                    }`}
                  >
                    {isDone && !isActive ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : !isAccessible ? (
                      <Lock className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      stage.id
                    )}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {stage.shortTitle}
                    </span>
                    <span className="block truncate text-xs font-bold">{stage.title}</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

