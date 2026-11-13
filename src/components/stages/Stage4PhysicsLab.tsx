import React, { useMemo, useState } from 'react';
import {
  Atom,
  Check,
  CheckCircle2,
  Copy,
  FlaskConical,
  SearchCheck,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import {
  buildStructuredPhysicsPrompt,
  DEFAULT_PROMPT_CONFIG,
  PHYSICS_AUDIT_SAMPLE,
  PROMPT_LAB_OPTIONS,
  STAGE4_QUESTION,
  STAGE4_SCENARIO,
} from '../../data/stage4Data';
import type { PromptLabConfig } from '../../types/mission';
import { QuizQuestionCard } from '../interactive/QuizQuestionCard';
import { StageSummaryBanner } from '../interactive/StageSummaryBanner';
import { ChapterPillBadge, NumberedYellowDot } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const Stage4PhysicsLab: React.FC = () => {
  const { session, updateInteractions, completeStage, getQuizResponse } = useMission();
  const interactions = session?.attempt.interactions_state ?? {};

  const config: PromptLabConfig = interactions.stage4PromptConfig ?? DEFAULT_PROMPT_CONFIG;
  const auditFoundIds = interactions.stage4AuditFoundIds ?? [];

  const [selectedPossibility, setSelectedPossibility] = useState<string>(
    STAGE4_SCENARIO.possibilities[0].id
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const { prompt: generatedPrompt, anatomy } = useMemo(
    () => buildStructuredPhysicsPrompt(config),
    [config]
  );

  const updateConfig = (patch: Partial<PromptLabConfig>) => {
    updateInteractions((prev) => ({
      ...prev,
      stage4PromptConfig: {
        ...(prev.stage4PromptConfig ?? DEFAULT_PROMPT_CONFIG),
        ...patch,
      },
    }));
  };

  const toggleSafeguard = (id: string) => {
    const exists = config.safeguards.includes(id);
    const next = exists
      ? config.safeguards.filter((s) => s !== id)
      : [...config.safeguards, id];
    updateConfig({ safeguards: next });
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedPrompt(true);
      updateInteractions((prev) => ({ ...prev, stage4CopiedPrompt: true }));
      window.setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSelectAuditSegment = (issueId: string | null) => {
    if (!issueId) return;
    updateInteractions((prev) => {
      const current = new Set(prev.stage4AuditFoundIds ?? []);
      current.add(issueId);
      return {
        ...prev,
        stage4AuditFoundIds: Array.from(current),
      };
    });
  };

  const activePossibilityObj =
    STAGE4_SCENARIO.possibilities.find((p) => p.id === selectedPossibility) ??
    STAGE4_SCENARIO.possibilities[0];

  const allAuditIssuesFound =
    auditFoundIds.length >= PHYSICS_AUDIT_SAMPLE.issues.length;
  const questionAnswered = Boolean(getQuizResponse(STAGE4_QUESTION.id));
  const isStageCompleted = session?.attempt.completed_stages.includes(4) ?? false;
  const canComplete = allAuditIssuesFound && questionAnswered;

  return (
    <div className="space-y-6 animate-mec-enter">
      {/* Cabeçalho da Etapa 4 */}
      <div className="rounded-2xl bg-[#183EFF] mec-blue-grid-bg p-6 text-white shadow-sm">
        <ChapterPillBadge label="ETAPA" number={4} inverted />
        <h2 className="mt-4 font-editorial text-2xl sm:text-3xl font-extrabold">
          Física + Inteligência Artificial: coloque em prática
        </h2>
        <p className="mt-2 font-body text-sm sm:text-base text-white/90 max-w-3xl">
          Contextualize o uso responsável da IA na disciplina{' '}
          <strong>Informática Aplicada ao Ensino de Física</strong>: planeje comandos pedagógicos
          estruturados sobre as Leis de Newton e pratique a auditoria científica de erros antes de
          aplicar qualquer material em sala.
        </p>
      </div>

      {/* 1. Situação didática + Possibilidades pedagógicas */}
      <MecWindowCard
        title="Situação de Ensino de Física — Apoiando estudantes nas Leis de Newton"
        variant="dots"
      >
        <div className="space-y-5">
          <blockquote className="rounded-xl border-l-4 border-[#FFD000] bg-[#FFFDF0] p-4 font-editorial text-base font-bold text-[#22252B] leading-snug">
            “{STAGE4_SCENARIO.promptText}”
          </blockquote>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">
                Explore 7 possibilidades de apoio didático (clique para inspecionar cuidados):
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {STAGE4_SCENARIO.possibilities.map((pos, idx) => {
                  const active = pos.id === selectedPossibility;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setSelectedPossibility(pos.id)}
                      className={`flex items-center gap-2.5 rounded-xl border-[1.5px] px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                          : 'border-[#D7DCE6] bg-white hover:border-[#183EFF] text-[#22252B]'
                      }`}
                    >
                      <NumberedYellowDot number={idx + 1} size="sm" />
                      <span className="text-xs sm:text-sm font-bold leading-snug">{pos.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full rounded-2xl border-[1.5px] border-[#183EFF]/30 bg-[#F7F9FE] p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#183EFF]">
                  <Atom className="h-5 w-5" aria-hidden="true" />
                  <h4 className="font-editorial text-base font-extrabold">
                    {activePossibilityObj.title}
                  </h4>
                </div>

                <div className="rounded-xl bg-white p-3.5 border border-[#D7E0FF] space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#057A2E]">
                    Como a IA pode apoiar
                  </p>
                  <p className="font-body text-sm text-[#22252B] leading-relaxed">
                    {activePossibilityObj.howAiHelps}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFFDF0] p-3.5 border border-[#F3DF7C] space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#B45309]">
                    Cuidado científico na Física
                  </p>
                  <p className="font-body text-sm text-[#22252B] leading-relaxed">
                    {activePossibilityObj.physicsCaution}
                  </p>
                </div>

                <p className="text-xs font-semibold text-[#183EFF]">
                  Base no documento do MEC: {activePossibilityObj.mecGround}
                </p>
              </div>
            </div>
          </div>
        </div>
      </MecWindowCard>

      {/* 2. Laboratório de Prompts (sem API externa — ensina engenharia pedagógica de comandos) */}
      <MecWindowCard
        title="Laboratório de Prompts para o Ensino de Física"
        variant="search-pill"
        headerRight={<SlidersHorizontal className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />}
      >
        <div className="space-y-5">
          <p className="font-body text-sm text-[#3C3C3C]">
            Configure os parâmetros pedagógicos abaixo para montar um{' '}
            <strong>prompt estruturado</strong> pronto para ser testado em uma ferramenta de IA
            externa. Não há chamada automática a API: o foco aqui é aprender a formular comandos
            precisos e incluir critérios de segurança e revisão científica.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="lab-goal"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
              >
                1. Objetivo pedagógico
              </label>
              <select
                id="lab-goal"
                value={config.goal}
                onChange={(e) => updateConfig({ goal: e.target.value })}
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] px-3 py-2.5 text-sm text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none"
              >
                {PROMPT_LAB_OPTIONS.goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lab-topic"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
              >
                2. Conteúdo de Física
              </label>
              <select
                id="lab-topic"
                value={config.physicsTopic}
                onChange={(e) => updateConfig({ physicsTopic: e.target.value })}
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] px-3 py-2.5 text-sm text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none"
              >
                {PROMPT_LAB_OPTIONS.physicsTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lab-difficulty"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
              >
                3. Nível de dificuldade
              </label>
              <select
                id="lab-difficulty"
                value={config.difficulty}
                onChange={(e) => updateConfig({ difficulty: e.target.value })}
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] px-3 py-2.5 text-sm text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none"
              >
                {PROMPT_LAB_OPTIONS.difficulties.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lab-format"
                className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
              >
                4. Formato desejado
              </label>
              <select
                id="lab-format"
                value={config.format}
                onChange={(e) => updateConfig({ format: e.target.value })}
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] px-3 py-2.5 text-sm text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none"
              >
                {PROMPT_LAB_OPTIONS.formats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salvaguardas pedagógicas e éticas */}
          <div className="rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-4 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
              5. Salvaguardas científicas e éticas incorporadas ao comando:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {PROMPT_LAB_OPTIONS.safeguards.map((sg) => {
                const checked = config.safeguards.includes(sg.id);
                return (
                  <label
                    key={sg.id}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs cursor-pointer transition-colors ${
                      checked
                        ? 'border-[#183EFF] bg-white text-[#22252B]'
                        : 'border-[#CBD5E1] bg-white/60 text-[#525866]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSafeguard(sg.id)}
                      className="mt-0.5 h-4 w-4 accent-[#183EFF] rounded"
                    />
                    <span className="font-medium leading-snug">{sg.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Prompt estruturado gerado */}
          <div className="rounded-2xl border-[1.5px] border-[#183EFF] bg-[#0F172A] text-white p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFD000]">
                Prompt Estruturado Gerado
              </span>
              <button
                type="button"
                onClick={() => void handleCopyPrompt()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFD000] px-3 py-1.5 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] transition-colors cursor-pointer"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Prompt copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Copiar prompt para testar fora</span>
                  </>
                )}
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-code text-xs sm:text-[13px] leading-relaxed text-[#E2E8F0]">
              {generatedPrompt}
            </pre>
          </div>

          {/* Anatomia do prompt */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {anatomy.map((a) => (
              <div
                key={a.part}
                className="rounded-xl border border-[#D7DCE6] bg-[#FAFBFD] p-3.5 text-xs"
              >
                <p className="font-extrabold text-[#183EFF]">{a.part}</p>
                <p className="mt-1 font-body text-[#3C3C3C] leading-relaxed">{a.why}</p>
              </div>
            ))}
          </div>
        </div>
      </MecWindowCard>

      {/* 3. Bancada de Auditoria Científica (Reflexão prática sobre fórmulas, unidades, cálculos e referências) */}
      <MecWindowCard
        title="Bancada de Auditoria Científica — Encontre os 3 erros no material gerado pela IA"
        variant="controls"
        headerRight={
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold">
            {auditFoundIds.length}/{PHYSICS_AUDIT_SAMPLE.issues.length} erros auditados
          </span>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 text-sm font-body text-[#3C3C3C]">
            <FlaskConical className="h-5 w-5 shrink-0 text-[#183EFF] mt-0.5" aria-hidden="true" />
            <p>
              Antes de entregar ou aplicar qualquer texto produzido por IA em Física, é indispensável
              verificar <strong>fórmulas, unidades de medida, cálculos, explicações e referências</strong>.
              Leia o rascunho simulado abaixo e <strong>clique nos 3 trechos problemáticos</strong>{' '}
              para auditá-los:
            </p>
          </div>

          <div className="rounded-2xl border border-[#CBD5E1] bg-[#FAFBFD] p-4 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#525866]">
              {PHYSICS_AUDIT_SAMPLE.title}
            </p>
            <div className="space-y-2">
              {PHYSICS_AUDIT_SAMPLE.segments.map((seg) => {
                const isIssue = Boolean(seg.issueId);
                const isFound = seg.issueId ? auditFoundIds.includes(seg.issueId) : false;

                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => handleSelectAuditSegment(seg.issueId)}
                    className={`block w-full rounded-xl border p-3 text-left font-body text-sm leading-relaxed transition-all ${
                      isFound
                        ? 'border-[#E11D1D] bg-[#FEF2F2] text-[#7F1D1D]'
                        : isIssue
                          ? 'border-[#CBD5E1] bg-white hover:border-[#183EFF] hover:bg-[#F5F8FF] text-[#22252B] cursor-pointer'
                          : 'border-transparent bg-white text-[#22252B] cursor-default'
                    }`}
                  >
                    <span>{seg.text}</span>
                    {isFound && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#E11D1D] px-2.5 py-0.5 text-[11px] font-bold text-white">
                        <SearchCheck className="h-3 w-3" aria-hidden="true" />
                        Falha identificada!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diagnósticos descobertos */}
          {auditFoundIds.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                Relatório de Auditoria ({auditFoundIds.length}/3):
              </h4>
              {PHYSICS_AUDIT_SAMPLE.issues
                .filter((issue) => auditFoundIds.includes(issue.id))
                .map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-xl border border-[#86EFAC] bg-[#F0FDF4] p-3.5 text-xs sm:text-sm animate-mec-enter"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-[#00A63E] mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-bold text-[#064E23]">
                          {issue.category}: “{issue.snippet}”
                        </p>
                        <p className="mt-1 font-body text-[#22252B] leading-relaxed">
                          {issue.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="rounded-xl border border-[#F3DF7C] bg-[#FFFDF0] p-3.5 flex items-start gap-2.5 text-xs text-[#5B4300]">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#B45309] mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Lembrete essencial (MEC, 2026, p. 39, 49 e 51):</strong> Materiais didáticos
              gerados por IA podem conter erros factuais e falta de transparência nas fontes. Na
              Física, cada grandeza, conversão de unidade no SI, diagrama de forças e cálculo
              precisa passar por revisão rigorosa antes de chegar aos estudantes.
            </p>
          </div>
        </div>
      </MecWindowCard>

      {/* 4. Questão prática distribuída da Etapa 4 */}
      <QuizQuestionCard question={STAGE4_QUESTION} questionIndexLabel="Checagem 4.1" />

      <StageSummaryBanner
        stageId={4}
        learnings={[
          'Um bom prompt para o ensino de Física especifica objetivo, conceito, nível, formato e salvaguardas (SI, pistas socráticas, zero dados pessoais).',
          'Fórmulas, conversões de unidade (ex.: km/h para m/s), concepções de ação e reação e citações bibliográficas geradas por IA exigem auditoria humana.',
          'O papel da IA no planejamento didático é apoiar o educador — nunca substituir o rigor científico nem a mediação docente (p. 49–51 e p. 70).',
        ]}
        isStageCompleted={isStageCompleted}
        canComplete={canComplete}
        incompleteHint="Encontre os 3 erros científicos/bibliográficos na Bancada de Auditoria e responda à Checagem 4.1 para concluir esta etapa."
        onCompleteAndContinue={() => void completeStage(4, true)}
      />
    </div>
  );
};

