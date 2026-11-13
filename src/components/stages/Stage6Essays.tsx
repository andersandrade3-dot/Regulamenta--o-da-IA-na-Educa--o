import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PenLine,
  Save,
  Sparkles,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { ESSAY_PROMPTS } from '../../data/stage6Data';
import { countWords } from '../../lib/persistence';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

const MIN_CHARS_REQUIRED = 40;

export const Stage6Essays: React.FC = () => {
  const {
    session,
    getEssay,
    saveEssayDraft,
    finalizeMission,
    syncStatus,
    lastSavedAt,
    setReferenceDrawerOpen,
  } = useMission();

  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  const essay1Text = getEssay(1)?.response_text ?? '';
  const essay2Text = getEssay(2)?.response_text ?? '';

  const e1Ready = essay1Text.trim().length >= MIN_CHARS_REQUIRED;
  const e2Ready = essay2Text.trim().length >= MIN_CHARS_REQUIRED;
  const canFinalize = e1Ready && e2Ready;
  const isStageCompleted = session?.attempt.completed_stages.includes(6) ?? false;

  const formattedLastSave = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa 6 */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-6 text-white shadow-sm">
        <ChapterPillBadge label="ETAPA" number={6} inverted />
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          Sua opinião importa: questões discursivas
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Esta etapa contém <strong>duas questões discursivas obrigatórias</strong> para você
          sintetizar sua posição crítica com autoria. Seus textos são salvos automaticamente conforme
          você digita e podem ser retomados ou editados a qualquer momento.
        </p>
      </div>

      {/* Status explícito de salvamento automático */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] px-4 py-2.5 text-xs text-[#1E2B58]">
        <div className="flex items-center gap-2">
          <Save className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />
          <span>
            <strong>Salvamento automático ativo:</strong> você pode sair e continuar depois usando seu
            código{' '}
            <span className="font-code font-bold text-[#183EFF]">
              {session?.attempt.resume_code}
            </span>
            .
          </span>
        </div>
        <span className="font-semibold">
          {syncStatus === 'saving'
            ? 'Salvando rascunho...'
            : formattedLastSave
              ? `Último salvamento às ${formattedLastSave}`
              : 'Pronto para escrever'}
        </span>
      </div>

      {/* As exatamente 2 questões discursivas */}
      <div className="space-y-6">
        {ESSAY_PROMPTS.map((spec) => {
          const text = spec.questionNumber === 1 ? essay1Text : essay2Text;
          const words = countWords(text);
          const chars = text.trim().length;
          const ready = chars >= MIN_CHARS_REQUIRED;
          const hintsVisible = Boolean(openHints[spec.questionNumber]);

          return (
            <MecWindowCard
              key={spec.questionNumber}
              title={spec.badge}
              variant="dots"
              headerRight={
                ready ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#00A63E] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Registrada
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FFD000] px-2.5 py-0.5 text-[11px] font-extrabold text-[#183EFF]">
                    Obrigatória
                  </span>
                )
              }
            >
              <div className="space-y-4">
                <div className="rounded-xl border-l-4 border-[#183EFF] bg-[#F7F9FE] p-4 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                    {spec.title}
                  </p>
                  <p className="font-editorial text-sm sm:text-base font-bold text-[#22252B] leading-relaxed">
                    “{spec.promptText}”
                  </p>
                </div>

                {/* Eixos orientadores sem resposta pronta */}
                <div className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFD] p-3.5">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#525866] mb-2">
                    Pontos para articular em sua resposta autoral:
                  </p>
                  <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-xs text-[#3C3C3C]">
                    {spec.reflectionAxes.map((axis) => (
                      <li key={axis} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD000]" />
                        <span>{axis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lembretes colapsáveis do documento do MEC */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenHints((prev) => ({
                        ...prev,
                        [spec.questionNumber]: !prev[spec.questionNumber],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183EFF] hover:underline cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Consultar referências do MEC para apoiar sua reflexão</span>
                    {hintsVisible ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>

                  {hintsVisible && (
                    <div className="mt-2 rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-3.5 space-y-2 animate-mec-enter">
                      {spec.mecHints.map((hint) => (
                        <div key={hint.label} className="text-xs text-[#1E2B58]">
                          <strong>{hint.ref}:</strong> {hint.label}.
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setReferenceDrawerOpen(true)}
                        className="text-xs font-bold text-[#183EFF] hover:underline cursor-pointer"
                      >
                        Abrir Biblioteca de Referências completa →
                      </button>
                    </div>
                  )}
                </div>

                {/* Área de escrita livre */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label
                      htmlFor={`essay-${spec.questionNumber}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#22252B]"
                    >
                      <PenLine className="h-3.5 w-3.5 text-[#183EFF]" aria-hidden="true" />
                      <span>Sua resposta com suas palavras</span>
                    </label>
                    <span className="text-xs font-semibold text-[#525866]">
                      {words} {words === 1 ? 'palavra' : 'palavras'} • {chars} caracteres
                    </span>
                  </div>

                  <textarea
                    id={`essay-${spec.questionNumber}`}
                    rows={7}
                    value={text}
                    onChange={(e) =>
                      saveEssayDraft(spec.questionNumber, spec.badge, e.target.value, false)
                    }
                    onBlur={(e) =>
                      saveEssayDraft(spec.questionNumber, spec.badge, e.target.value, true)
                    }
                    placeholder="Escreva aqui sua reflexão crítica com suas próprias palavras. Não há resposta única decorada — o professor avaliará sua argumentação..."
                    className="w-full rounded-xl border-[1.5px] border-[#CBD5E1] bg-white p-4 font-body text-sm sm:text-base leading-relaxed text-[#22252B] placeholder:text-[#94A3B8] focus:border-[#183EFF] focus:outline-none focus:ring-2 focus:ring-[#183EFF]/20"
                  />

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-[#525866]">
                      {ready ? (
                        <span className="font-semibold text-[#057A2E]">
                          Resposta registrada. Você pode continuar editando livremente quando quiser.
                        </span>
                      ) : (
                        <span>
                          Desenvolva sua argumentação (mínimo de {MIN_CHARS_REQUIRED} caracteres
                          para habilitar a conclusão).
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => saveEssayDraft(spec.questionNumber, spec.badge, text, true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#183EFF]/30 bg-[#EEF2FF] px-3 py-1.5 text-xs font-bold text-[#183EFF] hover:bg-[#183EFF] hover:text-white transition-colors cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Salvar agora</span>
                    </button>
                  </div>
                </div>
              </div>
            </MecWindowCard>
          );
        })}
      </div>

      {/* Nota sobre avaliação docente */}
      <div className="rounded-xl border border-[#D7DCE6] bg-white p-4 text-xs text-[#475569] flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 shrink-0 text-[#183EFF] mt-0.5" aria-hidden="true" />
        <p>
          <strong>Sobre estas respostas:</strong> não aplicamos correção automática simplista. Suas
          duas produções ficam registradas integralmente para leitura e discussão pedagógica com o
          professor da disciplina.
        </p>
      </div>

      <StageSummaryBanner
        stageId={6}
        learnings={[
          'Você articulou critérios científicos para verificar explicações, fórmulas e referências em Física antes de utilizar conteúdos de IA.',
          'Você projetou práticas responsáveis para produção de materiais didáticos preservando autoria, pensamento crítico, privacidade e supervisão humana.',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={canFinalize}
        incompleteHint="Preencha as duas questões discursivas obrigatórias para registrar e concluir a atividade."
        onCompleteAndContinue={() => void finalizeMission()}
        continueLabel="Registrar respostas e concluir atividade"
      />
    </div>
 