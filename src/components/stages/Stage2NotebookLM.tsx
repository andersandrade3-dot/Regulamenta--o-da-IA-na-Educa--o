import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSearch,
  ShieldAlert,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import {
  INVESTIGATOR_ACTIONS,
  INVESTIGATOR_CASES,
  NOTEBOOKLM_PROMPTS,
  NOTEBOOKLM_STEPS,
  STAGE2_QUESTION,
} from '../../data/stage2Data';
import { QuizQuestionCard } from '../interactive/QuizQuestionCard';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge, NumberedYellowDot } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const Stage2NotebookLM: React.FC = () => {
  const { session, updateInteractions, completeStage, getQuizResponse } = useMission();
  const interactions = session?.attempt.interactions_state ?? {};

  const completedSteps = interactions.stage2CompletedSteps ?? [];
  const investigatorAnswers = interactions.stage2InvestigatorAnswers ?? {};
  const investigatorChecked = interactions.stage2InvestigatorChecked ?? false;

  const [activeTutorialStep, setActiveTutorialStep] = useState<number>(1);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const toggleTutorialStep = (stepNumber: number) => {
    setActiveTutorialStep(stepNumber);
    updateInteractions((prev) => {
      const current = new Set(prev.stage2CompletedSteps ?? []);
      current.add(stepNumber);
      return {
        ...prev,
        stage2CompletedSteps: Array.from(current).sort((a, b) => a - b),
      };
    });
  };

  const handleCopyPrompt = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPromptId(id);
      window.setTimeout(() => setCopiedPromptId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleInvestigatorPick = (caseId: string, actionId: string) => {
    updateInteractions((prev) => ({
      ...prev,
      stage2InvestigatorAnswers: {
        ...(prev.stage2InvestigatorAnswers ?? {}),
        [caseId]: actionId,
      },
    }));
  };

  const handleCheckInvestigator = () => {
    updateInteractions((prev) => ({
      ...prev,
      stage2InvestigatorChecked: true,
    }));
  };

  const currentStepData =
    NOTEBOOKLM_STEPS.find((s) => s.step === activeTutorialStep) ?? NOTEBOOKLM_STEPS[0];

  const allCasesAnswered = INVESTIGATOR_CASES.every((c) => Boolean(investigatorAnswers[c.id]));
  const matchingAnswered = Boolean(getQuizResponse(STAGE2_QUESTION.id));
  const isStageCompleted = session?.attempt.completed_stages.includes(2) ?? false;
  const canComplete = investigatorChecked && allCasesAnswered && matchingAnswered;

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa 2 */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-6 text-white shadow-sm">
        <ChapterPillBadge label="ETAPA" number={2} inverted />
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          Laboratório de Investigação: descubra o NotebookLM
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Aprenda a usar o <strong>NotebookLM</strong> como ferramenta de pesquisa fundamentada em
          fontes oficiais — trabalhando diretamente sobre o documento do MEC (
          <code className="font-code text-[#FFD000]">ia-basica.pdf</code>) para rastrear citações e
          evitar respostas sem lastro.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/ia-basica.pdf"
            download="ia-basica.pdf"
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFD000] px-4 py-2 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] transition-colors"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Baixar documento oficial do MEC (ia-basica.pdf)</span>
          </a>
          <a
            href="https://notebooklm.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-xs font-bold text-white hover:bg-white/25 transition-colors"
          >
            <span>Abrir NotebookLM oficial</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* 1. Tutorial visual em 7 passos */}
      <MecWindowCard
        title="Tutorial Visual em 7 Passos — Pesquisa Ancorada em Fontes"
        variant="dots"
        headerRight={
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
            {completedSteps.length}/7 passos explorados
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Lista de passos */}
          <div className="lg:col-span-5 space-y-2">
            {NOTEBOOKLM_STEPS.map((item) => {
              const isSelected = activeTutorialStep === item.step;
              const isExplored = completedSteps.includes(item.step);
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => toggleTutorialStep(item.step)}
                  className={`flex w-full items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                      : isExplored
                        ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#064E23]'
                        : 'border-[#D7DCE6] bg-white hover:border-[#183EFF] text-[#22252B]'
                  }`}
                >
                  <span
                    className={`font-badge inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      isSelected
                        ? 'bg-[#183EFF] text-white'
                        : isExplored
                          ? 'bg-[#00A63E] text-white'
                          : 'bg-[#FFD000] text-[#183EFF]'
                    }`}
                  >
                    {isExplored && !isSelected ? (
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      item.step
                    )}
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-snug">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Detalhe visual do passo ativo */}
          <div className="lg:col-span-7">
            <div className="h-full rounded-2xl border-[1.5px] border-[#183EFF]/30 bg-[#F7F9FE] p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#183EFF] px-3 py-1 text-xs font-extrabold text-white">
                    Passo {currentStepData.step} de 7
                  </span>
                  <span className="text-xs font-semibold text-[#525866]">
                    Fluxo real no ambiente externo
                  </span>
                </div>

                <h4 className="font-editorial text-lg font-extrabold text-[#183EFF]">
                  {currentStepData.title}
                </h4>

                <div className="rounded-xl border border-[#D7E0FF] bg-white p-4 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">
                    O que fazer
                  </p>
                  <p className="font-body text-sm text-[#22252B] leading-relaxed">
                    {currentStepData.action}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                    Por que esse passo importa
                  </p>
                  <p className="font-body text-sm text-[#3C3C3C] leading-relaxed">
                    {currentStepData.whyItMatters}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#F3DF7C] bg-[#FFFDF0] p-3.5 text-xs text-[#5B4300]">
                <strong>Dica de investigação: </strong>
                {currentStepData.tip}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={activeTutorialStep <= 1}
                  onClick={() => toggleTutorialStep(activeTutorialStep - 1)}
                  className="rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-bold text-[#3C3C3C] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Passo anterior
                </button>
                <button
                  type="button"
                  disabled={activeTutorialStep >= 7}
                  onClick={() => toggleTutorialStep(activeTutorialStep + 1)}
                  className="rounded-lg bg-[#183EFF] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#1230CC] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Próximo passo →
                </button>
              </div>
            </div>
          </div>
        </div>
      </MecWindowCard>

      {/* 2. Exemplos de prompts para testar no NotebookLM */}
      <MecWindowCard
        title="Prompts para testar no NotebookLM com o PDF do MEC"
        variant="search-pill"
      >
        <div className="space-y-4">
          <p className="font-body text-sm text-[#3C3C3C]">
            Copie os comandos abaixo e experimente no seu notebook após carregar o arquivo{' '}
            <code className="font-code rounded bg-[#EEF2FF] px-1.5 py-0.5 text-xs font-bold text-[#183EFF]">
              ia-basica.pdf
            </code>
            . Observe como cada prompt exige fundamentação na fonte oficial e evita invenções:
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {NOTEBOOKLM_PROMPTS.map((p) => {
              const copied = copiedPromptId === p.id;
              return (
                <article
                  key={p.id}
                  className="rounded-2xl border-[1.5px] border-[#D7DCE6] bg-[#FAFBFD] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#FFD000] px-3 py-1 text-xs font-extrabold text-[#183EFF]">
                        {p.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleCopyPrompt(p.id, p.text)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#183EFF]/30 bg-white px-2.5 py-1 text-xs font-bold text-[#183EFF] hover:bg-[#183EFF] hover:text-white transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#00A63E]" aria-hidden="true" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Copiar prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-[#525866]">{p.objective}</p>
                    <blockquote className="rounded-xl border border-[#D7E0FF] bg-white p-3 font-body text-sm text-[#22252B] leading-relaxed">
                      “{p.text}”
                    </blockquote>
                  </div>

                  <p className="text-[11px] font-semibold text-[#183EFF]">
                    Onde conferir no PDF: {p.whereToCheck}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </MecWindowCard>

      {/* 3. Aviso obrigatório sobre o papel humano vs ferramenta */}
      <div className="rounded-2xl border-[1.5px] border-[#E6B800] bg-[#FFFDF0] p-4 sm:p-5 flex items-start gap-3">
        <ShieldAlert className="h-6 w-6 shrink-0 text-[#B45309] mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h4 className="font-editorial text-sm sm:text-base font-extrabold text-[#22252B]">
            Importante: ferramenta de apoio, não substituta do pensamento
          </h4>
          <p className="font-body text-sm text-[#3C3C3C] leading-relaxed">
            O NotebookLM auxilia na investigação, localização de trechos e organização inicial,{' '}
            <strong>mas não substitui a leitura integral, a interpretação e o julgamento humano</strong>.
            Mesmo ferramentas baseadas em fontes podem resumir fora de contexto ou omitir ressalvas
            importantes — e a responsabilidade pelo conteúdo final é sempre humana (MEC, 2026, Cap.
            3.3, p. 51).
          </p>
        </div>
      </div>

      {/* 4. Desafio do Investigador */}
      <MecWindowCard
        title="Desafio do Investigador — Confronte a IA com a Fonte Real"
        variant="controls"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 text-sm font-body text-[#3C3C3C]">
            <FileSearch className="h-5 w-5 shrink-0 text-[#183EFF] mt-0.5" aria-hidden="true" />
            <p>
              Abaixo estão 4 respostas geradas por uma IA sobre o guia do MEC. Compare cada
              afirmação com o <strong>trecho real extraído do PDF</strong> e classifique qual nível
              de verificação é necessário:
            </p>
          </div>

          <div className="space-y-4">
            {INVESTIGATOR_CASES.map((item, idx) => {
              const selected = investigatorAnswers[item.id] ?? '';
              const isCorrect = selected === item.correctActionId;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border-[1.5px] border-[#D7DCE6] bg-[#FAFBFD] p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <NumberedYellowDot number={idx + 1} size="sm" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                      Caso Investigativo #{idx + 1}
                    </span>
                    <span className="ml-auto rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-bold text-[#183EFF]">
                      {item.aiCitedPage}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="rounded-xl border border-[#CBD5E1] bg-white p-3.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#525866] mb-1">
                        Resposta gerada pela IA
                      </p>
                      <p className="font-body text-sm text-[#22252B] leading-relaxed">
                        “{item.aiClaim}”
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-3.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#183EFF]">
                          {item.evidenceTitle}
                        </p>
                        <BookOpenCheck className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#1E2B58] leading-relaxed">
                        {item.evidenceExcerpt}
                      </p>
                      <p className="mt-1.5 text-[11px] font-bold text-[#183EFF]">
                        Localização verificada: {item.evidenceRealPage}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {INVESTIGATOR_ACTIONS.map((act) => {
                      const active = selected === act.id;
                      return (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => handleInvestigatorPick(item.id, act.id)}
                          className={`rounded-xl border-[1.5px] p-2.5 text-left transition-all cursor-pointer ${
                            active
                              ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                              : 'border-[#CBD5E1] bg-white hover:border-[#183EFF] text-[#22252B]'
                          }`}
                        >
                          <span className="block text-xs font-extrabold">{act.label}</span>
                          <span className="block mt-0.5 text-[11px] text-[#525866] leading-snug">
                            {act.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {investigatorChecked && selected && (
                    <div
                      className={`rounded-xl border p-3 text-xs flex items-start gap-2 ${
                        isCorrect
                          ? 'border-[#86EFAC] bg-[#F0FDF4] text-[#064E23]'
                          : 'border-[#FCA5A5] bg-[#FEF2F2] text-[#7F1D1D]'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <p className="leading-relaxed">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xs text-[#525866]">
              Relacione todos os 4 casos antes de validar a investigação.
            </span>
            <button
              type="button"
              disabled={!allCasesAnswered}
              onClick={handleCheckInvestigator}
              className="rounded-xl bg-[#183EFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1230CC] disabled:bg-[#E5E7EB] disabled:text-[#6B7280] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {investigatorChecked ? 'Revalidar Desafio do Investigador' : 'Validar investigação'}
            </button>
          </div>
        </div>
      </MecWindowCard>

      {/* 5. Questão distribuída da Etapa 2 */}
      <QuizQuestionCard question={STAGE2_QUESTION} questionIndexLabel="Checagem 2.1" />

      <StageSummaryBanner
        stageId={2}
        learnings={[
          'O NotebookLM permite restringir consultas ao documento oficial do MEC (ia-basica.pdf) e inspecionar citações com rastreabilidade.',
          'Mesmo citando páginas reais, resumos automáticos podem inverter o sentido do documento ou omitir ressalvas essenciais.',
          'Ferramentas de investigação não substituem leitura integral, interpretação crítica e julgamento humano (p. 51).',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={canComplete}
        incompleteHint="Valide os 4 casos do Desafio do Investigador e responda à associação de conceitos (Checagem 2.1) para concluir esta etapa."
        onCompleteAndContinue={() => void completeStage(2, true)}
      />
    </div>
  );
};

