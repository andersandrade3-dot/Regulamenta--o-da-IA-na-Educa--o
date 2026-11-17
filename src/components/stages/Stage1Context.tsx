import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Eye,
  Lightbulb,
  Scale,
  Search,
  Sparkles,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import {
  BRAZIL_STATS,
  DUAL_NATURE_CARDS,
  MEDIATION_GAPS,
  SOBRE_VS_COM_EXAMPLES,
  STAGE1_DILEMMA,
  STAGE1_QUESTIONS,
} from '../../data/stage1Data';
import { CitationBadge } from '../interactive/CitationBadge';
import { QuizQuestionCard } from '../interactive/QuizQuestionCard';
import { SpeakButton } from '../interactive/SpeakButton';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge, NumberedYellowDot } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const Stage1Context: React.FC = () => {
  const { session, updateInteractions, completeStage, getQuizResponse } = useMission();
  const interactions = session?.attempt.interactions_state ?? {};

  const selectedChoiceId = interactions.stage1DilemmaChoice ?? '';
  const inspectedClues = interactions.stage1InspectedClues ?? [];
  const sortAnswers = interactions.stage1SortAnswers ?? {};
  const sortChecked = interactions.stage1SortChecked ?? false;

  const [dualMode, setDualMode] = useState<'opportunity' | 'risk'>('opportunity');
  const [revealedGaps, setRevealedGaps] = useState<Record<string, boolean>>({});

  const chosenDilemmaObj = STAGE1_DILEMMA.choices.find((c) => c.id === selectedChoiceId);

  const handleSelectDilemma = (choiceId: string) => {
    updateInteractions((prev) => ({
      ...prev,
      stage1DilemmaChoice: choiceId,
    }));
  };

  const handleToggleClue = (clueId: string) => {
    updateInteractions((prev) => {
      const current = prev.stage1InspectedClues ?? [];
      if (current.includes(clueId)) return prev;
      return {
        ...prev,
        stage1InspectedClues: [...current, clueId],
      };
    });
  };

  const handleSortSobreCom = (exampleId: string, category: 'sobre' | 'com') => {
    updateInteractions((prev) => ({
      ...prev,
      stage1SortAnswers: {
        ...(prev.stage1SortAnswers ?? {}),
        [exampleId]: category,
      },
    }));
  };

  const handleCheckSort = () => {
    updateInteractions((prev) => ({
      ...prev,
      stage1SortChecked: true,
    }));
  };

  const allSortAnswered = SOBRE_VS_COM_EXAMPLES.every((ex) => Boolean(sortAnswers[ex.id]));
  const allQuestionsAnswered = STAGE1_QUESTIONS.every((q) => Boolean(getQuizResponse(q.id)));
  const isStageCompleted = session?.attempt.completed_stages.includes(1) ?? false;
  const canComplete = Boolean(selectedChoiceId) && allQuestionsAnswered;

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-5 sm:p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ChapterPillBadge label="ETAPA" number={1} inverted />
          <SpeakButton
            id="stage1-dilemma-audio"
            label="Ouvir situação inicial"
            inverted
            text={`Etapa 1: A IA já faz parte da sua vida? Situação inicial: ${STAGE1_DILEMMA.promptText}`}
          />
        </div>
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          A IA já faz parte da sua vida?
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Antes de discutir regras, vamos partir de uma cena real do estudo de Física e olhar para
          os dados brasileiros sobre como estudantes e professores têm usado a Inteligência
          Artificial.
        </p>
      </div>

      {/* 1. Situação provocativa inicial + Simulação inspecionável */}
      <MecWindowCard title="Situação-Problema Inicial — Você entregaria sem conferir?" variant="dots">
        <div className="space-y-5">
          <blockquote className="rounded-xl border-l-4 border-[#FFD000] bg-[#FFFDF0] p-4 font-editorial text-base sm:text-lg font-bold text-[#22252B] leading-snug">
            “{STAGE1_DILEMMA.promptText}”
          </blockquote>

          {/* Prévia da resposta simulada com pistas clicáveis */}
          <div className="rounded-2xl border-[1.5px] border-[#D7E0FF] bg-[#F7F9FE] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D7E0FF] pb-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Resposta gerada por IA (simulação didática)</span>
              </div>
              <span className="text-xs font-semibold text-[#525866]">
                Clique nas pistas abaixo para inspecionar ({inspectedClues.length}/
                {STAGE1_DILEMMA.simulatedAiResponse.clues.length})
              </span>
            </div>

            <p className="text-xs font-bold text-[#525866]">
              Pergunta feita: “{STAGE1_DILEMMA.simulatedAiResponse.questionAsked}”
            </p>
            <p className="rounded-xl bg-white p-3.5 font-body text-sm leading-relaxed text-[#22252B] border border-[#E2E8F0]">
              {STAGE1_DILEMMA.simulatedAiResponse.generatedText}
            </p>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
              {STAGE1_DILEMMA.simulatedAiResponse.clues.map((clue) => {
                const opened = inspectedClues.includes(clue.id);
                return (
                  <button
                    key={clue.id}
                    type="button"
                    aria-expanded={opened}
                    onClick={() => handleToggleClue(clue.id)}
                    className={`min-h-[48px] rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      opened
                        ? 'border-[#183EFF] bg-white shadow-xs'
                        : 'border-[#CBD5E1] bg-white/70 hover:border-[#183EFF]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#183EFF]">{clue.label}</span>
                      <Eye className="h-3.5 w-3.5 text-[#183EFF]" aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-[11px] italic text-[#525866]">{clue.excerpt}</p>
                    {opened ? (
                      <p className="mt-2 border-t border-[#EDF1F7] pt-2 font-body text-xs text-[#22252B] leading-relaxed">
                        {clue.analysis}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] font-bold text-[#183EFF]">
                        Clique para investigar esta pista →
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Escolha de atitude */}
          <div>
            <h4 className="font-editorial text-sm sm:text-base font-bold text-[#22252B] mb-3">
              Como você agiria diante dessa resposta? Escolha uma opção:
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {STAGE1_DILEMMA.choices.map((choice) => {
                const active = selectedChoiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => handleSelectDilemma(choice.id)}
                    className={`min-h-[48px] rounded-xl border-[1.5px] p-3.5 text-left text-sm transition-all cursor-pointer ${
                      active
                        ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF] shadow-2xs'
                        : 'border-[#D7DCE6] bg-white hover:border-[#183EFF] text-[#22252B]'
                    }`}
                  >
                    <span className="font-body font-semibold leading-snug block">{choice.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {chosenDilemmaObj && (
            <div
              role="status"
              className={`rounded-xl border p-4 animate-mec-enter ${
                chosenDilemmaObj.id === 'verify-and-build'
                  ? 'border-[#86EFAC] bg-[#F0FDF4]'
                  : 'border-[#FCD34D] bg-[#FFFDF0]'
              }`}
            >
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                Diagnóstico: {chosenDilemmaObj.verdict}
              </p>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-[#22252B]">
                {chosenDilemmaObj.feedback}
              </p>
              <CitationBadge
                citation={{
                  source: 'MEC — Inteligência Artificial na Educação Básica',
                  chapter: 'Capítulos 1.1, 2.2 e 3.3',
                  page: 'p. 9, p. 24 e p. 51',
                }}
                compact
              />
            </div>
          )}
        </div>
      </MecWindowCard>

      {/* 2. Panorama brasileiro com dados reais do documento do MEC (p. 14-15) */}
      <MecWindowCard
        title="Como professores e estudantes estão usando IA no Brasil?"
        variant="search-pill"
      >
        <div className="space-y-5">
          <p className="font-body text-sm leading-relaxed text-[#3C3C3C]">
            O documento do MEC (Cap. 1.2, p. 14–15) mostra que a presença da IA generativa nas
            escolas brasileiras cresceu de maneira <strong>acelerada, desigual e pouco mediada</strong>.
            Observe os indicadores da pesquisa <strong>TIC Educação 2024 (CGI.br, 2025a)</strong>:
          </p>

          {/* Gráfico de barras estilizado inspirado na p. 15 do PDF */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {BRAZIL_STATS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#D7E0FF] bg-[#FAFBFD] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-badge text-3xl font-extrabold text-[#183EFF]">
                      {item.value}
                    </span>
                    <BarChart3 className="h-5 w-5 text-[#183EFF]/70" aria-hidden="true" />
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.accent === 'yellow' ? 'bg-[#FFD000]' : 'bg-[#183EFF]'
                      }`}
                      style={{ width: item.value }}
                    />
                  </div>
                  <p className="mt-3 font-body text-sm font-semibold text-[#22252B] leading-snug">
                    {item.label}
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-[#525866]">{item.source}</p>
              </div>
            ))}
          </div>

          {/* Lacunas de mediação crítica */}
          <div>
            <h4 className="font-editorial text-sm font-bold text-[#22252B] mb-2.5 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
              <span>O contraste preocupante (clique nos cartões para revelar os dados de mediação):</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {MEDIATION_GAPS.map((gap) => {
                const open = Boolean(revealedGaps[gap.id]);
                return (
                  <button
                    key={gap.id}
                    type="button"
                    onClick={() =>
                      setRevealedGaps((prev) => ({ ...prev, [gap.id]: !prev[gap.id] }))
                    }
                    className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      open
                        ? 'border-[#183EFF] bg-[#EEF2FF]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#183EFF]'
                    }`}
                  >
                    <span className="font-badge text-xl font-extrabold text-[#183EFF]">
                      {gap.stat}
                    </span>
                    <p className="mt-1 text-xs font-bold text-[#22252B]">{gap.title}</p>
                    {open ? (
                      <p className="mt-2 font-body text-xs text-[#3C3C3C] leading-relaxed">
                        {gap.detail}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] font-bold text-[#183EFF]">
                        Toque para ler a evidência →
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </MecWindowCard>

      {/* 3. Oportunidades vs. Riscos (Caráter dual) */}
      <MecWindowCard title="Oportunidades e riscos da IA na educação (não há neutralidade)" variant="controls">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm text-[#3C3C3C]">
              Segundo o MEC (Cap. 3.1, p. 37), <strong>não existe neutralidade tecnológica</strong>:
              as ferramentas podem gerar benefícios ou prejuízos conforme a intencionalidade pedagógica.
            </p>
            <div className="inline-flex rounded-xl bg-[#F1F5F9] p-1 shrink-0">
              <button
                type="button"
                onClick={() => setDualMode('opportunity')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  dualMode === 'opportunity'
                    ? 'bg-[#00A63E] text-white'
                    : 'text-[#475569] hover:text-[#22252B]'
                }`}
              >
                Ver Oportunidades
              </button>
              <button
                type="button"
                onClick={() => setDualMode('risk')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  dualMode === 'risk'
                    ? 'bg-[#E11D1D] text-white'
                    : 'text-[#475569] hover:text-[#22252B]'
                }`}
              >
                Ver Riscos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {DUAL_NATURE_CARDS.map((card, i) => (
              <div
                key={card.id}
                className={`rounded-xl border p-4 transition-all ${
                  dualMode === 'opportunity'
                    ? 'border-[#BBF7D0] bg-[#F0FDF4]'
                    : 'border-[#FECACA] bg-[#FEF2F2]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <NumberedYellowDot number={i + 1} size="sm" />
                    <h4 className="font-editorial text-sm font-bold text-[#22252B]">{card.title}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#525866]">{card.page}</span>
                </div>
                <p className="font-body text-xs sm:text-sm leading-relaxed text-[#22252B]">
                  {dualMode === 'opportunity' ? card.opportunity : card.risk}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MecWindowCard>

      {/* 4. Aprender SOBRE IA vs Aprender COM IA (p. 13 e Diretriz 1 p. 20) */}
      <MecWindowCard title="Como abordar a IA na educação: aprender SOBRE IA vs. aprender COM IA" variant="dots">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#183EFF] p-5 text-white">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD000] text-[#183EFF]">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </span>
                <h4 className="font-editorial text-base font-extrabold">
                  Ensino e aprendizagem SOBRE IA
                </h4>
              </div>
              <p className="font-body text-sm leading-relaxed text-white/95">
                A inteligência artificial como <strong>objeto de conhecimento</strong>: compreender
                como algoritmos e modelos funcionam, suas limitações técnicas, vieses, privacidade e
                implicações sociais e ambientais (MEC, 2026, p. 3, 12–13).
              </p>
            </div>

            <div className="rounded-2xl border-[1.5px] border-[#183EFF] bg-[#F5F8FF] p-5">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD000] text-[#183EFF]">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                </span>
                <h4 className="font-editorial text-base font-extrabold text-[#183EFF]">
                  Ensino e aprendizagem COM IA
                </h4>
              </div>
              <p className="font-body text-sm leading-relaxed text-[#22252B]">
                A inteligência artificial como <strong>recurso educativo</strong>: decidir de forma
                intencional <em>se, quando e como</em> usar ferramentas de IA para apoiar o ensino e
                a aprendizagem, sem abrir mão da mediação humana (MEC, 2026, p. 3, 12–13).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#F3DF7C] bg-[#FFFDF0] px-4 py-3 text-xs sm:text-sm text-[#3C3C3C] flex items-start gap-2.5">
            <Scale className="h-4 w-4 shrink-0 text-[#B45309] mt-0.5" aria-hidden="true" />
            <p>
              <strong>Diretriz 1 do MEC (Cap. 2.1, p. 20):</strong> “Todo ensino com IA deve ser
              acompanhado do ensino sobre IA, garantindo que o uso ou não uso de sistemas de IA seja
              uma decisão das comunidades escolares, porém assegurando, de forma obrigatória, a
              aprendizagem intencional e significativa sobre estes sistemas nos currículos
              escolares.”
            </p>
          </div>

          {/* Mini-prática de classificação */}
          <div className="space-y-3">
            <h4 className="font-editorial text-sm font-bold text-[#22252B]">
              Prática rápida: classifique cada situação abaixo em SOBRE IA ou COM IA
            </h4>
            <div className="space-y-2.5">
              {SOBRE_VS_COM_EXAMPLES.map((ex) => {
                const chosen = sortAnswers[ex.id];
                const isRight = chosen === ex.correct;
                return (
                  <div
                    key={ex.id}
                    className="rounded-xl border border-[#D7DCE6] bg-[#FAFBFD] p-3.5 space-y-2"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-body text-sm text-[#22252B] sm:pr-4">{ex.text}</p>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          aria-pressed={chosen === 'sobre'}
                          onClick={() => handleSortSobreCom(ex.id, 'sobre')}
                          className={`min-h-[42px] rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                            chosen === 'sobre'
                              ? 'bg-[#183EFF] text-white'
                              : 'border border-[#CBD5E1] bg-white text-[#22252B] hover:border-[#183EFF]'
                          }`}
                        >
                          SOBRE IA
                        </button>
                        <button
                          type="button"
                          aria-pressed={chosen === 'com'}
                          onClick={() => handleSortSobreCom(ex.id, 'com')}
                          className={`min-h-[42px] rounded-lg px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                            chosen === 'com'
                              ? 'bg-[#FFD000] text-[#183EFF]'
                              : 'border border-[#CBD5E1] bg-white text-[#22252B] hover:border-[#183EFF]'
                          }`}
                        >
                          COM IA
                        </button>
                      </div>
                    </div>

                    {sortChecked && chosen && (
                      <p
                        className={`text-xs font-semibold flex items-center gap-1.5 ${
                          isRight ? 'text-[#057A2E]' : 'text-[#B91C1C]'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {isRight ? ex.feedback : `Atenção: o foco aqui é "${ex.correct.toUpperCase()} IA". ${ex.feedback}`}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!allSortAnswered}
                onClick={handleCheckSort}
                className="min-h-[44px] w-full sm:w-auto rounded-xl bg-[#183EFF] px-4 py-2 text-xs font-bold text-white hover:bg-[#1230CC] disabled:bg-[#E5E7EB] disabled:text-[#6B7280] transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Conferir classificação
              </button>
            </div>
          </div>
        </div>
      </MecWindowCard>

      {/* 5. Checagem rápida (Verdadeiro ou Falso + Múltipla Escolha distribuídos) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <NumberedYellowDot number={1} />
          <div>
            <h3 className="font-editorial text-lg font-extrabold text-[#183EFF]">
              Verificação de Conceitos — Etapa 1
            </h3>
            <p className="text-xs text-[#525866]">
              Responda às questões contextualizadas abaixo para consolidar os fundamentos do Capítulo 1.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {STAGE1_QUESTIONS.map((q, idx) => (
            <QuizQuestionCard
              key={q.id}
              question={q}
              questionIndexLabel={`Checagem 1.${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Resumo e avanço */}
      <StageSummaryBanner
        stageId={1}
        learnings={[
          'LLMs estimam palavras estatisticamente: respostas convincentes podem conter erros e referências inventadas (p. 9 e p. 51).',
          'No Brasil (TIC Educação 2024), 70% dos alunos do Ensino Médio já usam IA generativa, mas apenas 19% conversaram com professores sobre como utilizá-la (p. 14–15).',
          'Não existe neutralidade tecnológica: todo ensino COM IA precisa ser acompanhado do ensino SOBRE IA (p. 20 e p. 37).',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={canComplete}
        incompleteHint="Para concluir a Etapa 1, escolha sua reação ao dilema inicial e responda às 3 questões de verificação."
        onCompleteAndContinue={() => void completeStage(1, true)}
      />
    </div>
  );
};

