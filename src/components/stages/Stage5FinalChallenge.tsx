import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { ALL_OBJECTIVE_QUESTIONS, MISSION_COMPETENCY_TOPICS } from '../../data/allQuestions';
import { STAGE5_QUESTIONS } from '../../data/stage5Data';
import { QuizQuestionCard } from '../interactive/QuizQuestionCard';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const Stage5FinalChallenge: React.FC = () => {
  const { session, updateInteractions, completeStage, getQuizResponse } = useMission();
  const currentIdx = Math.min(
    STAGE5_QUESTIONS.length - 1,
    Math.max(0, session?.attempt.interactions_state.stage5CurrentIndex ?? 0)
  );

  const setStepIndex = (idx: number) => {
    updateInteractions((prev) => ({
      ...prev,
      stage5CurrentIndex: idx,
    }));
  };

  const currentQuestion = STAGE5_QUESTIONS[currentIdx];
  const stage5AnsweredCount = STAGE5_QUESTIONS.filter((q) => Boolean(getQuizResponse(q.id))).length;
  const allStage5Answered = stage5AnsweredCount === STAGE5_QUESTIONS.length;
  const isStageCompleted = session?.attempt.completed_stages.includes(5) ?? false;

  // Mapa de cobertura dos 10 temas ao longo de toda a experiência (Etapas 1 a 5)
  const topicStatusList = MISSION_COMPETENCY_TOPICS.map((topic) => {
    const related = ALL_OBJECTIVE_QUESTIONS.filter((q) => q.topicId === topic.id);
    const answered = related.filter((q) => Boolean(getQuizResponse(q.id)));
    const allDone = related.length > 0 && answered.length === related.length;
    const anyCorrect = answered.some((q) => getQuizResponse(q.id)?.is_correct);
    return {
      ...topic,
      allDone,
      anyCorrect,
      stages: Array.from(new Set(related.map((q) => `Etapa ${q.stageNumber}`))).join(', '),
    };
  });

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa 5 */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-6 text-white shadow-sm">
        <ChapterPillBadge label="ETAPA" number={5} inverted />
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          Desafio final: você decide!
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Ao longo das Etapas 1 a 4 você já enfrentou situações sobre funcionamento da IAGen,
          verificação de fontes, privacidade, LGPD, ECA Digital e alucinações na Física. Agora,
          resolva <strong>um cenário por vez</strong> os 5 desafios integradores finais.
        </p>
      </div>

      {/* Painel de rastreio das 10 competências distribuídas na jornada */}
      <MecWindowCard
        title="Mapa de Competências Distribuídas nas Etapas 1 a 5 (10 eixos)"
        variant="callout"
        accent="blue"
        headerRight={<Compass className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />}
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {topicStatusList.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl border p-2.5 text-xs ${t.allDone
                ? 'border-[#86EFAC] bg-[#F0FDF4] text-[#064E23]'
                : 'border-[#E2E8F0] bg-[#FAFBFD] text-[#475569]'
                }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75">
                  {t.stages}
                </span>
                {t.allDone && <CheckCircle2 className="h-3.5 w-3.5 text-[#00A63E]" aria-hidden="true" />}
              </div>
              <p className="mt-1 font-bold leading-snug">{t.label}</p>
            </div>
          ))}
        </div>
      </MecWindowCard>

      {/* Navegação passo-a-passo (um cenário por vez — nunca tudo de uma vez) */}
      <div className="rounded-2xl border border-[#D7DCE6] bg-white p-4 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
              Cenário Decisório {currentIdx + 1} de {STAGE5_QUESTIONS.length}
            </p>
            <p className="text-xs text-[#525866]">
              {stage5AnsweredCount} de {STAGE5_QUESTIONS.length} decisões finais registradas
            </p>
          </div>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Cenários da Etapa 5">
            {STAGE5_QUESTIONS.map((q, idx) => {
              const answered = Boolean(getQuizResponse(q.id));
              const active = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`Ir para cenário ${idx + 1}`}
                  className={`font-badge h-10 w-10 rounded-full text-xs font-extrabold transition-all cursor-pointer ${active
                    ? 'bg-[#183EFF] text-white ring-2 ring-[#FFD000]'
                    : answered
                      ? 'bg-[#00A63E] text-white'
                      : 'bg-[#EEF2FF] text-[#183EFF] hover:bg-[#D7E0FF]'
                    }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questão atual isolada */}
        <QuizQuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionIndexLabel={`Decisão Final ${currentIdx + 1}/${STAGE5_QUESTIONS.length}`}
        />

        {/* Botões Anterior / Próximo cenário */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setStepIndex(currentIdx - 1)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-bold text-[#3C3C3C] hover:bg-[#F8FAFC] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Cenário anterior</span>
          </button>

          <button
            type="button"
            disabled={currentIdx >= STAGE5_QUESTIONS.length - 1}
            onClick={() => setStepIndex(currentIdx + 1)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#FFD000] px-4 py-2 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Próximo cenário</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <StageSummaryBanner
        stageId={5}
        learnings={[
          'Sistemas automatizados podem reproduzir vieses algorítmicos regionais, linguísticos ou sociais e requerem monitoramento humano contínuo (p. 23, 40 e 50).',
          'Alertas preditivos nunca devem substituir o diálogo com professores, estudantes e famílias nem justificar vigilância biométrica (p. 41 e 50).',
          'A autonomia docente e a responsabilidade final do ser humano são inegociáveis em qualquer uso pedagógico da IA (p. 51 e 68–70).',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={allStage5Answered}
        incompleteHint={`Responda a todos os ${STAGE5_QUESTIONS.length} cenários decisórios desta etapa para avançar às questões discursivas.`}
        onCompleteAndContinue={() => void completeStage(5, true)}
      />
    </div>
  );
};

