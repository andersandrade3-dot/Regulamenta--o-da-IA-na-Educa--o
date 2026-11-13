import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  Cloud,
  CloudOff,
  Copy,
  HardDrive,
  Loader2,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export const AppHeader: React.FC = () => {
  const {
    session,
    viewMode,
    syncStatus,
    syncError,
    isSupabaseEnabled,
    setReferenceDrawerOpen,
    retrySync,
    goToCompletion,
    resetToIdentification,
  } = useMission();

  const [copiedCode, setCopiedCode] = useState(false);

  const completedCount = session?.attempt.completed_stages.length ?? 0;
  const progressPct = Math.round((completedCount / 6) * 100);

  const handleCopyCode = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.attempt.resume_code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback silencioso
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 border-b border-[#D7DCE6] bg-white/95 backdrop-blur-md">
      {/* Faixa superior institucional azul MEC */}
      <div className="bg-[#183EFF] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD000] font-badge text-[10px] font-extrabold text-[#183EFF]">
              IA
            </span>
            <span className="font-semibold tracking-wide">
              IFCE • Informática Aplicada ao Ensino de Física
            </span>
            <span className="hidden md:inline text-white/75">|</span>
            <span className="hidden md:inline text-white/90">
              Base: Documento Orientador do MEC (2026)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReferenceDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#FFD000]" aria-hidden="true" />
              <span>Biblioteca de Referências</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra principal de identidade da atividade, sessão e salvamento */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetToIdentification}
            className="text-left group cursor-pointer"
            title="Voltar à tela de identificação / troca de sessão"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-lg sm:text-xl font-extrabold tracking-tight text-[#183EFF] mec-yellow-underline">
                IA, Educação e Responsabilidade
              </span>
              {session && (
                <span className="hidden sm:inline-block text-xs font-semibold text-[#525866]">
                  — Investigação Ética e Pedagógica
                </span>
              )}
            </div>
          </button>
        </div>

        {session && viewMode !== 'identification' && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Estudante e turma */}
            <div className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs">
              <UserCheck className="h-3.5 w-3.5 text-[#183EFF]" aria-hidden="true" />
              <div className="max-w-[160px] sm:max-w-[240px] truncate">
                <span className="font-bold text-[#22252B]">{session.attempt.student_name}</span>
                <span className="text-[#525866]"> • {session.attempt.class_group}</span>
              </div>
            </div>

            {/* Código de retomada */}
            <button
              type="button"
              onClick={() => void handleCopyCode()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D7E0FF] bg-[#EEF2FF] px-2.5 py-1.5 text-xs font-bold text-[#183EFF] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
              title="Guarde este código para retomar seu progresso em qualquer navegador"
            >
              <span className="font-code">{session.attempt.resume_code}</span>
              {copiedCode ? (
                <Check className="h-3.5 w-3.5 text-[#00A63E]" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            {/* Conquistas e status final */}
            <div className="hidden md:flex items-center gap-1.5 rounded-xl bg-[#FFF8D6] px-2.5 py-1.5 text-xs font-bold text-[#7A5900]">
              <Award className="h-3.5 w-3.5 text-[#D99B00]" aria-hidden="true" />
              <span>{session.attempt.achievements.length}/6 conquistas</span>
            </div>

            {session.attempt.is_completed && viewMode !== 'completion' && (
              <button
                type="button"
                onClick={goToCompletion}
                className="rounded-xl bg-[#00A63E] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#008C34] transition-colors cursor-pointer"
              >
                Ver conclusão
              </button>
            )}

            {/* Indicador de sincronização */}
            <div className="flex items-center gap-1.5 text-xs">
              {syncStatus === 'saving' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF2FF] px-2.5 py-1 font-semibold text-[#183EFF]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Salvando...
                </span>
              )}
              {syncStatus === 'synced' && isSupabaseEnabled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-2.5 py-1 font-semibold text-[#057A2E]">
                  <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
                  Salvo na nuvem
                </span>
              )}
              {(syncStatus === 'local_only' || (!isSupabaseEnabled && syncStatus === 'synced')) && (
                <span
                  className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2.5 py-1 font-semibold text-[#475569]"
                  title="Progresso salvo neste navegador. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para persistência em nuvem."
                >
                  <HardDrive className="h-3.5 w-3.5" aria-hidden="true" />
                  Salvo localmente
                </span>
              )}
              {syncStatus === 'error' && (
                <button
                  type="button"
                  onClick={() => void retrySync()}
                  title={syncError ?? 'Erro de conexão. Clique para tentar novamente.'}
                  className="inline-flex items-center gap-1 rounded-full bg-[#FEF2F2] px-2.5 py-1 font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] cursor-pointer"
                >
                  <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Erro ao sincronizar</span>
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barra de progresso global */}
      {session && viewMode !== 'identification' && (
        <div className="border-t border-[#EDF1F7] bg-[#FAFBFD] px-4 py-1.5">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <span className="text-[11px] font-bold text-[#525866] shrink-0">
              Progresso da atividade: {completedCount}/6 etapas ({progressPct}%)
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E2E8F0]" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full bg-[#183EFF] transition-all duration-500"
                style={{ width: `${Math.max(4, progressPct)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

