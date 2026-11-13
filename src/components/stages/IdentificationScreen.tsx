import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  History,
  KeyRound,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { BauhausBowls, BauhausTriangles } from '../layout/BauhausDecor';
import { MecWindowCard } from '../layout/MecWindowCard';

export const IdentificationScreen: React.FC = () => {
  const {
    savedPreview,
    startNewSession,
    resumeSavedSession,
    recoverByResumeCode,
    abandonSavedSession,
    setReferenceDrawerOpen,
  } = useMission();

  const [studentName, setStudentName] = useState('');
  const [classGroup, setClassGroup] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showRecoverBox, setShowRecoverBox] = useState(false);
  const [recoverCode, setRecoverCode] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = studentName.trim();
    const cleanGroup = classGroup.trim();

    if (cleanName.length < 3) {
      setFormError('Informe seu nome completo para registrar a atividade.');
      return;
    }
    if (cleanGroup.length < 1) {
      setFormError('Informe sua turma (ex.: Licenciatura em Física 2026.2).');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await startNewSession(cleanName, cleanGroup);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverCode.trim()) {
      setRecoverError('Digite o código de retomada gerado ao iniciar sua atividade.');
      return;
    }
    setRecoverError(null);
    setIsRecovering(true);
    try {
      const res = await recoverByResumeCode(recoverCode);
      if (!res.ok) {
        setRecoverError(res.error ?? 'Não foi possível localizar esse código.');
      }
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 animate-mec-enter">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Coluna editorial inspirada diretamente na capa do PDF do MEC */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative overflow-hidden rounded-3xl border-[1.5px] border-[#183EFF] bg-white p-6 sm:p-8 shadow-sm">
            {/* Faixa geométrica azul superior estilo capa de ia-basica.pdf */}
            <div className="mb-6 flex items-center justify-between rounded-2xl bg-[#183EFF] px-4 py-3">
              <div className="flex items-center gap-2.5" aria-hidden="true">
                <span className="h-6 w-6 rounded-full border-[3px] border-[#FF0000]" />
                <span className="h-6 w-6 rounded-full bg-[#FF0000]" />
                <span className="h-6 w-6 rounded-full overflow-hidden flex flex-col">
                  <span className="h-3 w-6 bg-[#FFD000]" />
                  <span className="h-3 w-6 bg-[#FF0000]" />
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/95">
                IFCE • Ensino de Física
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <BauhausTriangles color="yellow" />
              <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#183EFF]">
                Atividade Pedagógica Interativa
              </span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-[#183EFF] leading-tight">
              <span className="mec-yellow-underline">IA, Educação e Responsabilidade</span>
            </h1>

            <p className="mt-4 font-editorial text-lg sm:text-xl font-bold text-[#22252B] leading-snug">
              Você utiliza inteligência artificial. Mas sabe utilizá-la com responsabilidade?
            </p>

            <p className="mt-4 font-body text-sm sm:text-base leading-relaxed text-[#3C3C3C]">
              Nesta investigação guiada para a disciplina{' '}
              <strong className="text-[#183EFF]">Informática Aplicada ao Ensino de Física</strong>,
              você analisará dilemas reais, aprenderá a investigar fontes com o NotebookLM,
              avaliará situações éticas e legais (LGPD e ECA Digital) e construirá prompts críticos
              para ensinar Física sem abrir mão da autoria nem do rigor científico.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-3.5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#183EFF]">
                  6 Etapas Investigativas
                </p>
                <p className="mt-1 font-body text-xs text-[#3C3C3C]">
                  Dilemas, laboratório de fontes, semáforo ético, prática nas Leis de Newton e
                  reflexão autoral.
                </p>
              </div>
              <div className="rounded-xl border border-[#F3DF7C] bg-[#FFFDF0] p-3.5">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#7A5900]">
                  Base Oficial do MEC (2026)
                </p>
                <p className="mt-1 font-body text-xs text-[#3C3C3C]">
                  Fundamentada no documento orientador <em>Inteligência Artificial na Educação Básica</em>.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#EDF1F7] pt-4">
              <button
                type="button"
                onClick={() => setReferenceDrawerOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#183EFF] hover:underline cursor-pointer"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>Consultar Biblioteca de Referências antes de começar</span>
              </button>
              <BauhausBowls className="hidden sm:block h-10 w-10 shrink-0" />
            </div>
          </div>
        </div>

        {/* Coluna de Identificação do Estudante (somente Nome completo e Turma) */}
        <div className="lg:col-span-6 space-y-5">
          {savedPreview && (
            <MecWindowCard
              title="Progresso salvo encontrado neste navegador"
              variant="callout"
              accent="yellow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-editorial text-base font-bold text-[#22252B]">
                      {savedPreview.attempt.student_name}
                    </p>
                    <p className="text-xs font-semibold text-[#525866]">
                      Turma: {savedPreview.attempt.class_group} • Código:{' '}
                      <span className="font-code font-bold text-[#183EFF]">
                        {savedPreview.attempt.resume_code}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[#3C3C3C]">
                      Etapas concluídas:{' '}
                      <strong>{savedPreview.attempt.completed_stages.length} de 6</strong>
                      {savedPreview.attempt.is_completed
                        ? ' (Atividade finalizada)'
                        : ` • Parou na Etapa ${savedPreview.attempt.current_stage}`}
                    </p>
                  </div>
                  <History className="h-6 w-6 shrink-0 text-[#D99B00]" aria-hidden="true" />
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => void resumeSavedSession()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#183EFF] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1230CC] transition-colors cursor-pointer"
                  >
                    <span>
                      {savedPreview.attempt.is_completed
                        ? 'Visualizar atividade concluída'
                        : 'Continuar de onde parei'}
                    </span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={abandonSavedSession}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    title="Limpar sessão salva localmente para iniciar com outro estudante"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Trocar estudante</span>
                  </button>
                </div>
              </div>
            </MecWindowCard>
          )}

          <MecWindowCard title="Identificação do Estudante" variant="dots">
            <form onSubmit={handleStart} className="space-y-4" noValidate>
              <p className="font-body text-sm text-[#3C3C3C]">
                Para iniciar sua jornada e salvar seu progresso automaticamente, preencha apenas os
                dois campos abaixo:
              </p>

              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
                >
                  Nome completo do estudante <span className="text-[#E11D1D]">*</span>
                </label>
                <input
                  id="student-name"
                  name="studentName"
                  type="text"
                  required
                  autoComplete="name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex.: Maria Clara Oliveira Santos"
                  className="w-full rounded-xl border-[1.5px] border-[#CBD5E1] bg-[#FAFBFD] px-3.5 py-2.5 text-sm text-[#22252B] placeholder:text-[#94A3B8] focus:border-[#183EFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183EFF]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="class-group"
                  className="block text-xs font-extrabold uppercase tracking-wider text-[#22252B] mb-1.5"
                >
                  Turma <span className="text-[#E11D1D]">*</span>
                </label>
                <input
                  id="class-group"
                  name="classGroup"
                  type="text"
                  required
                  value={classGroup}
                  onChange={(e) => setClassGroup(e.target.value)}
                  placeholder="Ex.: Lic. em Física — 2026.2"
                  className="w-full rounded-xl border-[1.5px] border-[#CBD5E1] bg-[#FAFBFD] px-3.5 py-2.5 text-sm text-[#22252B] placeholder:text-[#94A3B8] focus:border-[#183EFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183EFF]/20"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-3.5 py-2.5 text-xs font-semibold text-[#B91C1C]"
                >
                  {formError}
                </div>
              )}

              <div className="rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-3 text-xs text-[#1E2B58] flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#183EFF] mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold">Privacidade e coleta mínima (LGPD, Art. 6º, III)</p>
                  <p className="mt-0.5 text-[#3C4B7B]">
                    Não solicitamos matrícula, CPF, e-mail nem senha. Ao iniciar, você receberá um{' '}
                    <strong>Código de Retomada</strong> único para continuar quando quiser.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#183EFF] px-5 py-3 text-sm font-bold text-white hover:bg-[#1230CC] disabled:opacity-70 transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#FFD000]" aria-hidden="true" />
                <span>{isSubmitting ? 'Iniciando atividade...' : 'Iniciar atividade'}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            {/* Recuperação por código */}
            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <button
                type="button"
                onClick={() => setShowRecoverBox((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183EFF] hover:underline cursor-pointer"
              >
                <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {showRecoverBox
                    ? 'Ocultar recuperação por código'
                    : 'Já iniciou em outro dispositivo? Recuperar com Código de Retomada'}
                </span>
              </button>

              {showRecoverBox && (
                <form onSubmit={handleRecover} className="mt-3 space-y-2.5 animate-mec-enter">
                  <label htmlFor="resume-code-input" className="block text-xs font-semibold text-[#525866]">
                    Informe seu código (formato <span className="font-code">IFCE-XXXX-XX</span>):
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="resume-code-input"
                      type="text"
                      value={recoverCode}
                      onChange={(e) => setRecoverCode(e.target.value.toUpperCase())}
                      placeholder="IFCE-7K4P-9X"
                      className="font-code flex-1 rounded-xl border-[1.5px] border-[#CBD5E1] bg-[#FAFBFD] px-3 py-2 text-sm uppercase text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isRecovering}
                      className="rounded-xl bg-[#FFD000] px-4 py-2 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] transition-colors cursor-pointer shrink-0"
                    >
                      {isRecovering ? 'Buscando...' : 'Recuperar progresso'}
                    </button>
                  </div>
                  {recoverError && (
                    <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
                      {recoverError}
                    </p>
                  )}
                </form>
              )}
            </div>
          </MecWindowCard>
        </div>
      </div>
    </div>
  );
};

