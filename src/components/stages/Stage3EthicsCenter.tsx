import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  GripVertical,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import {
  DECISION_CASES,
  STAGE3_QUESTIONS,
  TRAFFIC_LIGHT_CARDS,
} from '../../data/stage3Data';
import type { DecisionVerdict, TrafficColor } from '../../types/mission';
import { QuizQuestionCard } from '../interactive/QuizQuestionCard';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge, NumberedYellowDot } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

const VERDICT_OPTIONS: {
  id: DecisionVerdict;
  label: string;
  activeClass: string;
}[] = [
  {
    id: 'adequate',
    label: 'Conduta adequada',
    activeClass: 'border-[#00A63E] bg-[#ECFDF3] text-[#064E23]',
  },
  {
    id: 'attention',
    label: 'Exige atenção',
    activeClass: 'border-[#D99B00] bg-[#FFF8D6] text-[#7A5900]',
  },
  {
    id: 'inadequate',
    label: 'Conduta inadequada',
    activeClass: 'border-[#E11D1D] bg-[#FEF2F2] text-[#7F1D1D]',
  },
];

const TRAFFIC_ZONES: {
  id: TrafficColor;
  title: string;
  subtitle: string;
  dotColor: string;
  boxClass: string;
  badgeClass: string;
}[] = [
  {
    id: 'green',
    title: 'VERDE — Prática responsável',
    subtitle: 'Uso ético, crítico, transparente e com verificação humana.',
    dotColor: 'bg-[#00A63E]',
    boxClass: 'border-[#86EFAC] bg-[#F0FDF4]',
    badgeClass: 'bg-[#00A63E] text-white',
  },
  {
    id: 'yellow',
    title: 'AMARELO — Exige atenção e verificação',
    subtitle: 'Potencial positivo, mas requer revisão científica, pedagógica ou inclusiva antes do uso.',
    dotColor: 'bg-[#FFD000]',
    boxClass: 'border-[#FDE047] bg-[#FFFDF0]',
    badgeClass: 'bg-[#FFD000] text-[#183EFF]',
  },
  {
    id: 'red',
    title: 'VERMELHO — Prática inadequada ou com riscos',
    subtitle: 'Viola privacidade, LGPD, ECA Digital, integridade acadêmica ou segurança.',
    dotColor: 'bg-[#FF0000]',
    boxClass: 'border-[#FCA5A5] bg-[#FEF2F2]',
    badgeClass: 'bg-[#E11D1D] text-white',
  },
];

export const Stage3EthicsCenter: React.FC = () => {
  const { session, updateInteractions, completeStage, getQuizResponse } = useMission();
  const interactions = session?.attempt.interactions_state ?? {};

  const caseDecisions = interactions.stage3CaseDecisions ?? {};
  const trafficAssignments = interactions.stage3TrafficAssignments ?? {};
  const trafficChecked = interactions.stage3TrafficChecked ?? false;

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);

  const handleDecision = (caseId: string, verdict: DecisionVerdict) => {
    updateInteractions((prev) => ({
      ...prev,
      stage3CaseDecisions: {
        ...(prev.stage3CaseDecisions ?? {}),
        [caseId]: verdict,
      },
    }));
  };

  const assignCardToZone = (cardId: string, zone: TrafficColor) => {
    updateInteractions((prev) => ({
      ...prev,
      stage3TrafficAssignments: {
        ...(prev.stage3TrafficAssignments ?? {}),
        [cardId]: zone,
      },
      stage3TrafficChecked: false,
    }));
    setSelectedCardId(null);
    setDraggingCardId(null);
  };

  const unassignCard = (cardId: string) => {
    updateInteractions((prev) => {
      const next = { ...(prev.stage3TrafficAssignments ?? {}) };
      delete next[cardId];
      return {
        ...prev,
        stage3TrafficAssignments: next,
        stage3TrafficChecked: false,
      };
    });
  };

  const handleCheckTraffic = () => {
    updateInteractions((prev) => ({
      ...prev,
      stage3TrafficChecked: true,
    }));
  };

  const decidedCount = DECISION_CASES.filter((c) => Boolean(caseDecisions[c.id])).length;
  const unassignedCards = TRAFFIC_LIGHT_CARDS.filter((c) => !trafficAssignments[c.id]);
  const allTrafficAssigned = unassignedCards.length === 0;
  const allQuestionsAnswered = STAGE3_QUESTIONS.every((q) => Boolean(getQuizResponse(q.id)));

  const isStageCompleted = session?.attempt.completed_stages.includes(3) ?? false;
  const canComplete =
    decidedCount === DECISION_CASES.length &&
    allTrafficAssigned &&
    trafficChecked &&
    allQuestionsAnswered;

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa 3 */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-6 text-white shadow-sm">
        <ChapterPillBadge label="ETAPA" number={3} inverted />
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          Central de Decisões: ética ou irresponsabilidade?
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Analise situações reais do cotidiano escolar e classifique decisões à luz dos 10
          Princípios Fundamentais do MEC, da <strong>LGPD (Lei nº 13.709/2018)</strong> e do{' '}
          <strong>ECA Digital (Lei nº 15.211/2025)</strong>.
        </p>
      </div>

      {/* 1. Central de Decisões — 6 situações escolares */}
      <MecWindowCard
        title="Central de Decisões — Analise cada situação do cotidiano escolar"
        variant="dots"
        headerRight={
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
            {decidedCount}/{DECISION_CASES.length} analisadas
          </span>
        }
      >
        <div className="space-y-4">
          {DECISION_CASES.map((item, idx) => {
            const chosen = caseDecisions[item.id];
            const isRight = chosen === item.correctVerdict;
            const expectedLabel =
              VERDICT_OPTIONS.find((v) => v.id === item.correctVerdict)?.label ?? '';

            return (
              <article
                key={item.id}
                className="rounded-2xl border-[1.5px] border-[#D7DCE6] bg-[#FAFBFD] p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <NumberedYellowDot number={idx + 1} size="sm" />
                  <p className="font-editorial text-sm sm:text-base font-bold text-[#22252B] leading-snug">
                    {item.situation}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {VERDICT_OPTIONS.map((opt) => {
                    const active = chosen === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleDecision(item.id, opt.id)}
                        className={`rounded-xl border-[1.5px] px-3 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                          active
                            ? opt.activeClass
                            : 'border-[#CBD5E1] bg-white text-[#3C3C3C] hover:border-[#183EFF]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {chosen && (
                  <div
                    role="status"
                    className={`rounded-xl border p-3.5 text-xs sm:text-sm animate-mec-enter ${
                      isRight
                        ? 'border-[#86EFAC] bg-[#F0FDF4] text-[#064E23]'
                        : 'border-[#FCA5A5] bg-[#FEF2F2] text-[#7F1D1D]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isRight ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                      <div className="space-y-1">
                        <p className="font-bold">
                          {isRight
                            ? `Classificação coerente: ${expectedLabel}.`
                            : `A classificação indicada pelas orientações do MEC é: ${expectedLabel}.`}
                        </p>
                        <p className="font-body leading-relaxed text-[#22252B]">
                          {item.feedbackMec}
                        </p>
                        <p className="text-[11px] font-bold text-[#183EFF]">{item.citation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </MecWindowCard>

      {/* 2. Semáforo da Ética Digital (Drag-and-drop + Clique acessível) */}
      <MecWindowCard
        title="Semáforo da Ética Digital — Arraste ou clique para classificar os cartões"
        variant="search-pill"
      >
        <div className="space-y-5">
          <p className="font-body text-sm text-[#3C3C3C]">
            Classifique os 6 cartões de prática digital abaixo nas categorias do Semáforo:{' '}
            <strong>arraste</strong> um cartão até a zona desejada ou{' '}
            <strong>toque para selecioná-lo</strong> e depois clique no sinal correspondente.
          </p>

          {/* Bandeja de cartões pendentes */}
          <div className="rounded-2xl border border-dashed border-[#94A3B8] bg-[#F8FAFC] p-4">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">
                Cartões para classificar ({unassignedCards.length} restantes)
              </span>
              {selectedCardId && (
                <span className="rounded-full bg-[#183EFF] px-2.5 py-0.5 text-[11px] font-bold text-white">
                  Cartão selecionado — clique em Verde, Amarelo ou Vermelho abaixo
                </span>
              )}
            </div>

            {unassignedCards.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                {unassignedCards.map((card) => {
                  const isSelected = selectedCardId === card.id;
                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => setDraggingCardId(card.id)}
                      onDragEnd={() => setDraggingCardId(null)}
                      onClick={() =>
                        setSelectedCardId((prev) => (prev === card.id ? null : card.id))
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedCardId((prev) => (prev === card.id ? null : card.id));
                        }
                      }}
                      className={`flex items-start gap-2.5 rounded-xl border-[1.5px] p-3 text-left text-xs sm:text-sm transition-all cursor-grab active:cursor-grabbing ${
                        isSelected
                          ? 'border-[#183EFF] bg-[#EEF2FF] ring-2 ring-[#183EFF]/25'
                          : 'border-[#CBD5E1] bg-white hover:border-[#183EFF]'
                      }`}
                    >
                      <GripVertical
                        className="h-4 w-4 shrink-0 text-[#94A3B8] mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="font-body text-[#22252B] leading-snug">{card.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-xs font-semibold text-[#057A2E] py-2">
                Todos os cartões foram posicionados no semáforo! Confira suas escolhas abaixo.
              </p>
            )}
          </div>

          {/* As três zonas do Semáforo */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {TRAFFIC_ZONES.map((zone) => {
              const cardsInZone = TRAFFIC_LIGHT_CARDS.filter(
                (c) => trafficAssignments[c.id] === zone.id
              );

              return (
                <div
                  key={zone.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggingCardId) assignCardToZone(draggingCardId, zone.id);
                  }}
                  onClick={() => {
                    if (selectedCardId) assignCardToZone(selectedCardId, zone.id);
                  }}
                  className={`rounded-2xl border-[1.5px] p-4 flex flex-col justify-between transition-all min-h-[210px] ${
                    zone.boxClass
                  } ${
                    selectedCardId || draggingCardId
                      ? 'ring-2 ring-[#183EFF]/30 cursor-pointer'
                      : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`h-4 w-4 rounded-full shrink-0 ${zone.dotColor}`} />
                      <h4 className="font-editorial text-sm font-extrabold text-[#22252B]">
                        {zone.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#475569] mb-3">{zone.subtitle}</p>

                    <div className="space-y-2">
                      {cardsInZone.map((card) => {
                        const isCorrect = card.correctZone === zone.id;
                        return (
                          <div
                            key={card.id}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-xl border border-[#CBD5E1] bg-white p-3 text-xs space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-body text-[#22252B] leading-snug">{card.text}</p>
                              <button
                                type="button"
                                onClick={() => unassignCard(card.id)}
                                className="shrink-0 text-[11px] font-bold text-[#64748B] hover:text-[#E11D1D] cursor-pointer"
                                title="Mover de volta para a bandeja"
                              >
                                Remover
                              </button>
                            </div>

                            {trafficChecked && (
                              <div
                                className={`rounded-lg p-2 text-[11px] leading-snug ${
                                  isCorrect
                                    ? 'bg-[#ECFDF3] text-[#064E23]'
                                    : 'bg-[#FEF2F2] text-[#7F1D1D]'
                                }`}
                              >
                                <p className="font-bold">
                                  {isCorrect
                                    ? 'Classificação correta!'
                                    : `Categoria mais adequada: ${card.correctZone === 'green' ? 'VERDE' : card.correctZone === 'yellow' ? 'AMARELO' : 'VERMELHO'}`}
                                </p>
                                <p className="mt-0.5">{card.feedback}</p>
                                <p className="mt-0.5 font-semibold text-[#183EFF]">
                                  {card.citation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedCardId && (
                    <div className="mt-3 text-center">
                      <span className={`inline-block rounded-lg px-3 py-1 text-[11px] font-bold ${zone.badgeClass}`}>
                        Colocar cartão selecionado aqui
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[#525866]">
              Classifique todos os 6 cartões para verificar o Semáforo da Ética Digital.
            </span>
            <button
              type="button"
              disabled={!allTrafficAssigned}
              onClick={handleCheckTraffic}
              className="rounded-xl bg-[#183EFF] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1230CC] disabled:bg-[#E5E7EB] disabled:text-[#6B7280] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {trafficChecked ? 'Reverificar Semáforo' : 'Verificar Semáforo'}
            </button>
          </div>
        </div>
      </MecWindowCard>

      {/* Síntese legal LGPD + ECA Digital (p. 43-44) */}
      <MecWindowCard
        title="Quadro Normativo do MEC — LGPD e ECA Digital na Escola (p. 43–44)"
        variant="callout"
        accent="blue"
        headerRight={<ShieldCheck className="h-5 w-5 text-[#183EFF]" aria-hidden="true" />}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs sm:text-sm">
          <div className="rounded-xl bg-[#F5F8FF] p-4 border border-[#D7E0FF] space-y-1.5">
            <h4 className="font-editorial font-extrabold text-[#183EFF]">
              LGPD — Lei nº 13.709/2018
            </h4>
            <p className="font-body text-[#22252B] leading-relaxed">
              Exige finalidade clara, necessidade/coleta mínima (Art. 6º, III) e transparência.
              Dados de crianças exigem consentimento específico de pais ou responsáveis (Art. 14).
              Dados sensíveis como saúde ou biometria têm proteção reforçada (Art. 11).
            </p>
          </div>
          <div className="rounded-xl bg-[#FFFDF0] p-4 border border-[#F3DF7C] space-y-1.5">
            <h4 className="font-editorial font-extrabold text-[#7A5900]">
              ECA Digital — Lei nº 15.211/2025
            </h4>
            <p className="font-body text-[#22252B] leading-relaxed">
              Impõe o melhor interesse da criança como critério de design: privacidade mais protetiva
              por padrão (Art. 7º), avaliação de riscos à segurança e saúde (Art. 8º), proibição de
              perfilamento publicitário de menores (Art. 22) e verificação etária confiável.
            </p>
          </div>
        </div>
      </MecWindowCard>

      {/* 3. Questões distribuídas da Etapa 3 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-5 w-5 text-[#183EFF]" aria-hidden="true" />
          <h3 className="font-editorial text-lg font-extrabold text-[#183EFF]">
            Verificação Normativa — Privacidade, LGPD e ECA Digital
          </h3>
        </div>
        {STAGE3_QUESTIONS.map((q, idx) => (
          <QuizQuestionCard
            key={q.id}
            question={q}
            questionIndexLabel={`Checagem 3.${idx + 1}`}
          />
        ))}
      </div>

      <StageSummaryBanner
        stageId={3}
        learnings={[
          'Usar IA para estudar exige transparência sobre o auxílio recebido e validação em fontes confiáveis (p. 49–51, p. 65).',
          'Copiar integralmente respostas ou enviar dados pessoais de colegas a ferramentas comerciais viola a ética acadêmica e a LGPD (p. 38, 43–44).',
          'O ECA Digital (Lei nº 15.211/2025) e a LGPD (Lei nº 13.709/2018) tornam obrigatórios o melhor interesse da criança, a coleta mínima e a privacidade por padrão (p. 42–44).',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={canComplete}
        incompleteHint="Analise todas as 6 situações da Central de Decisões, classifique e verifique os 6 cartões do Semáforo e responda às 2 questões normativas."
        onCompleteAndContinue={() => void completeStage(3, true)}
      />
    </div>
  );
};

