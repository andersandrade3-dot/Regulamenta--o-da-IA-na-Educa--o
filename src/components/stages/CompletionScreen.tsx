import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Printer,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { ALL_OBJECTIVE_QUESTIONS } from '../../data/allQuestions';
import { STAGES_META } from '../../data/mecReferences';
import { ESSAY_PROMPTS } from '../../data/stage6Data';
import { BauhausBowls, BauhausTriangles } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const CompletionScreen: React.FC = () => {
  const {
    session,
    goToStage,
    getQuizResponse,
    getEssay,
    setReferenceDrawerOpen,
    syncStatus,
    resetToIdentification,
  } = useMission();

  const [showAllAnswers, setShowAllAnswers] = useState(false);

  if (!session) return null;

  const totalQuestions = ALL_OBJECTIVE_QUESTIONS.length;
  const answeredResponses = ALL_OBJECTIVE_QUESTIONS.map((q) => ({
    question: q,
    response: getQuizResponse(q.id),
  }));
  const answeredCount = answeredResponses.filter((x) => Boolean(x.response)).length;
  const correctCount = answeredResponses.filter((x) => x.response?.is_correct).length;
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const essay1 = getEssay(1);
  const essay2 = getEssay(2);
  const completedSet = new Set(session.attempt.completed_stages);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8 space-y-6 animate-mec-enter">
      {/* Banner oficial de encerramento */}
      <section className="relative overflow-hidden rounded-3xl bg-[#183EFF] mec-blue-grid-bg p-6 sm:p-10 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD000] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>Atividade Concluída</span>
          </div>
          <BauhausTriangles color="yellow" />
        </div>

        <h1 className="font-editorial text-2xl sm:text-4xl font-extrabold leading-tight">
          Parabéns pela investigação, {session.attempt.student_name}!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-white/85">
          Turma: <strong>{session.attempt.class_group}</strong> • Código de registro:{' '}
          <span className="font-code font-bold text-[#FFD000]">
            {session.attempt.resume_code}
          </span>
        </p>

        <blockquote className="mt-6 rounded-2xl border-2 border-[#FFD000] bg-white/10 backdrop-blur-xs p-5 sm:p-6 font-editorial text-base sm:text-xl font-bold leading-relaxed text-white">
          “Utilizar inteligência artificial não significa deixar de pensar. Significa aprender a
          fazer melhores perguntas, investigar respostas, verificar informações e assumir a
          responsabilidade pelo conhecimento que produzimos.”
        </blockquote>

        <div className="no-print mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FFD000] px-4 py-2.5 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Imprimir / Salvar em PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setReferenceDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Biblioteca de Referências</span>
          </button>
          <button
            type="button"
            onClick={() => goToStage(6)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <Edit3 className="h-4 w-4" aria-hidden="true" />
            <span>Revisar / editar respostas discursivas</span>
          </button>
        </div>

        <BauhausBowls className="hidden sm:block absolute bottom-4 right-6 h-12 w-12 opacity-90" />
      </section>

      {/* Indicadores de desempenho e registro */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-[1.5px] border-[#183EFF] bg-white p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">
            Questões objetivas distribuídas
          </p>
          <p className="mt-2 font-badge text-3xl font-extrabold text-[#183EFF]">
            {correctCount}/{totalQuestions}{' '}
            <span className="text-base font-bold text-[#525866]">({scorePct}%)</span>
          </p>
          <p className="mt-1 text-xs text-[#3C3C3C]">
            {answeredCount} de {totalQuestions} questões respondidas ao longo das Etapas 1 a 5.
          </p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-[#00A63E] bg-[#F0FDF4] p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#064E23]">
            Etapas e conquistas
          </p>
          <p className="mt-2 font-badge text-3xl font-extrabold text-[#00A63E]">
            {completedSet.size}/6 etapas
          </p>
          <p className="mt-1 text-xs text-[#064E23]">
            {session.attempt.achievements.length} conquistas registradas no seu percurso.
          </p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-[#E6B800] bg-[#FFFDF0] p-5">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#7A5900]">
            Questões discursivas (Etapa 6)
          </p>
          <div className="mt-2 flex items-center gap-2 text-[#057A2E]">
            <ShieldCheck className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="font-editorial text-lg font-extrabold">
              {essay1?.response_text && essay2?.response_text
                ? '2/2 registradas'
                : 'Registro parcial'}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#5B4300]">
            {syncStatus === 'synced'
              ? 'Sincronizadas no Supabase e salvas neste navegador.'
              : 'Salvas localmente neste navegador (configure o Supabase para nuvem).'}
          </p>
        </div>
      </div>

      {/* Etapas concluídas + Conquistas */}
      <MecWindowCard title="Percurso Concluído e Conquistas por Etapa" variant="dots">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES_META.map((stage) => {
            const done = completedSet.has(stage.id);
            return (
              <div
                key={stage.id}
                className={`rounded-xl border p-4 flex flex-col justify-between space-y-2 ${
                  done ? 'border-[#86EFAC] bg-[#F0FDF4]' : 'border-[#E2E8F0] bg-[#FAFBFD]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#183EFF]">
                      {stage.shortTitle}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#00A63E] px-2 py-0.5 text-[10px] font-bold text-white">
                        <Award className="h-3 w-3" aria-hidden="true" />
                        {stage.achievementTitle}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 font-editorial text-sm font-bold text-[#22252B]">
                    {stage.title}
                  </h4>
                  <p className="mt-1 text-xs text-[#525866]">{stage.achievementDescription}</p>
                </div>

                <button
                  type="button"
                  onClick={() => goToStage(stage.id)}
                  className="no-print self-start text-xs font-bold text-[#183EFF] hover:underline cursor-pointer"
                >
                  Rever esta etapa →
                </button>
              </div>
            );
          })}
        </div>
      </MecWindowCard>

      {/* Consulta das respostas discursivas */}
      <MecWindowCard
        title="Suas Respostas Discursivas Registradas (Etapa 6)"
        variant="controls"
      >
        <div className="space-y-4">
          {ESSAY_PROMPTS.map((spec) => {
            const rec = spec.questionNumber === 1 ? essay1 : essay2;
            return (
              <div
                key={spec.questionNumber}
                className="rounded-xl border border-[#D7DCE6] bg-[#FAFBFD] p-4 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#183EFF] px-3 py-0.5 text-xs font-bold text-white">
                    {spec.badge}
                  </span>
                  <span className="text-xs font-semibold text-[#525866]">
                    {rec?.word_count ?? 0} palavras registradas
                  </span>
                </div>
                <p className="text-xs font-bold text-[#3C3C3C]">{spec.promptText}</p>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 font-body text-sm text-[#22252B] whitespace-pre-wrap leading-relaxed">
                  {rec?.response_text?.trim()
                    ? rec.response_text
                    : 'Nenhuma resposta registrada ainda.'}
                </div>
              </div>
            );
          })}
        </div>
      </MecWindowCard>

      {/* Revisão das questões objetivas */}
      <MecWindowCard
        title="Consulta do Desempenho e Aprendizados nas Questões Objetivas"
        variant="search-pill"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-body text-sm text-[#3C3C3C]">
              Revise cada situação-problema respondida e sua fundamentação no documento do MEC.
            </p>
            <button
              type="button"
              onClick={() => setShowAllAnswers((prev) => !prev)}
              className="no-print inline-flex items-center gap-1.5 rounded-xl bg-[#EEF2FF] px-3.5 py-2 text-xs font-bold text-[#183EFF] hover:bg-[#D7E0FF] transition-colors cursor-pointer"
            >
              <span>{showAllAnswers ? 'Ocultar detalhamento' : 'Expandir todas as questões'}</span>
              {showAllAnswers ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {showAllAnswers && (
            <div className="space-y-3 pt-2">
              {answeredResponses.map(({ question, response }, idx) => {
                const isOk = response?.is_correct ?? false;
                return (
                  <div
                    key={question.id}
                    className={`rounded-xl border p-4 text-xs sm:text-sm space-y-1.5 ${
                      response
                        ? isOk
                          ? 'border-[#86EFAC] bg-[#F0FDF4]'
                          : 'border-[#FCA5A5] bg-[#FEF2F2]'
                        : 'border-[#E2E8F0] bg-[#FAFBFD]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-[#183EFF]">
                        Q{idx + 1} (Etapa {question.stageNumber}) — {question.topicLabel}
                      </span>
                      {response ? (
                        <span className="inline-flex items-center gap-1 font-bold">
                          {isOk ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-[#00A63E]" aria-hidden="true" />
                              <span className="text-[#064E23]">Acertou</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-[#E11D1D]" aria-hidden="true" />
                              <span className="text-[#7F1D1D]">Revisar conceito</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#64748B]">Não respondida</span>
                      )}
                    </div>
                    <p className="font-semibold text-[#22252B]">{question.prompt}</p>
                    <p className="font-body text-[#3C3C3C] leading-relaxed">
                      {question.explanationMec}
                    </p>
                    <p className="text-[11px] font-bold text-[#183EFF]">
                      Referência: {question.citation.chapter} ({question.citation.page})
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </MecWindowCard>

      <div className="no-print flex justify-center pt-2">
        <button
          type="button"
          onClick={resetToIdentification}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Voltar à tela inicial de identificação</span>
        </button>
      </div>
    </div>
  );
};

