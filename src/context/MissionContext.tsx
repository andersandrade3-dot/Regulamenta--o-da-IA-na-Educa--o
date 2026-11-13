import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { STAGES_META } from '../data/mecReferences';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import {
  clearLocalSession,
  countWords,
  createAttemptSession,
  pushFullLocalSessionToRemote,
  readLocalSession,
  recoverAttemptByCode,
  refreshAttemptFromRemote,
  syncEssayToRemote,
  syncProgressToRemote,
  syncQuizResponseToRemote,
  writeLocalSession,
} from '../lib/persistence';
import type {
  EssayRecord,
  InteractionsState,
  MissionSessionPayload,
  ObjectiveQuestion,
  QuizResponseRecord,
  StageId,
  SyncStatus,
  ViewMode,
} from '../types/mission';

interface MissionContextValue {
  session: MissionSessionPayload | null;
  savedPreview: MissionSessionPayload | null;
  viewMode: ViewMode;
  activeStage: StageId;
  syncStatus: SyncStatus;
  syncError: string | null;
  lastSavedAt: string | null;
  isSupabaseEnabled: boolean;
  isReferenceDrawerOpen: boolean;
  setReferenceDrawerOpen: (open: boolean) => void;
  startNewSession: (studentName: string, classGroup: string) => Promise<void>;
  resumeSavedSession: () => Promise<void>;
  recoverByResumeCode: (code: string) => Promise<{ ok: boolean; error?: string }>;
  resetToIdentification: () => void;
  abandonSavedSession: () => void;
  goToStage: (stage: StageId) => void;
  goToCompletion: () => void;
  updateInteractions: (updater: (prev: InteractionsState) => InteractionsState) => void;
  recordQuizAnswer: (
    question: ObjectiveQuestion,
    selectedAnswer: string | Record<string, string>,
    isCorrect: boolean
  ) => Promise<void>;
  saveEssayDraft: (questionNumber: 1 | 2, promptTitle: string, text: string, immediate?: boolean) => void;
  completeStage: (stageId: StageId, goNext?: boolean) => Promise<void>;
  finalizeMission: () => Promise<void>;
  retrySync: () => Promise<void>;
  getQuizResponse: (questionId: string) => QuizResponseRecord | undefined;
  getEssay: (questionNumber: 1 | 2) => EssayRecord | undefined;
}

const MissionContext = createContext<MissionContextValue | null>(null);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<MissionSessionPayload | null>(null);
  const [savedPreview, setSavedPreview] = useState<MissionSessionPayload | null>(() => readLocalSession());
  const [viewMode, setViewMode] = useState<ViewMode>('identification');
  const [activeStage, setActiveStage] = useState<StageId>(1);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    isSupabaseConfigured() ? 'synced' : 'local_only'
  );
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isReferenceDrawerOpen, setReferenceDrawerOpen] = useState(false);

  const sessionRef = useRef<MissionSessionPayload | null>(null);
  sessionRef.current = session;

  const progressTimerRef = useRef<number | null>(null);
  const essayTimersRef = useRef<Record<number, number>>({});

  const applySessionUpdate = useCallback((next: MissionSessionPayload) => {
    sessionRef.current = next;
    setSession(next);
    setSavedPreview(next);
    writeLocalSession(next);
    setLastSavedAt(new Date().toISOString());
  }, []);

  const scheduleProgressSync = useCallback((nextSession: MissionSessionPayload) => {
    if (!isSupabaseConfigured()) {
      setSyncStatus('local_only');
      return;
    }
    setSyncStatus('saving');
    if (progressTimerRef.current) {
      window.clearTimeout(progressTimerRef.current);
    }
    progressTimerRef.current = window.setTimeout(async () => {
      const latest = sessionRef.current ?? nextSession;
      const res = await syncProgressToRemote(latest.attempt);
      if (res.ok && res.remoteSynced) {
        setSyncStatus('synced');
        setSyncError(null);
      } else if (!res.ok) {
        setSyncStatus('error');
        setSyncError(res.error ?? 'Erro ao salvar progresso.');
      } else {
        setSyncStatus('local_only');
      }
    }, 350);
  }, []);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) window.clearTimeout(progressTimerRef.current);
      Object.values(essayTimersRef.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const startNewSession = useCallback(async (studentName: string, classGroup: string) => {
    setSyncStatus(isSupabaseConfigured() ? 'saving' : 'local_only');
    const result = await createAttemptSession(studentName, classGroup);
    if (result.data) {
      applySessionUpdate(result.data);
      setActiveStage(1);
      setViewMode('stage');
      if (result.remoteSynced) {
        setSyncStatus('synced');
        setSyncError(null);
      } else if (isSupabaseConfigured()) {
        setSyncStatus('error');
        setSyncError(result.error ?? 'Salvo localmente; tentando conectar ao Supabase.');
      } else {
        setSyncStatus('local_only');
        setSyncError(null);
      }
    }
  }, [applySessionUpdate]);

  const resumeSavedSession = useCallback(async () => {
    const local = readLocalSession();
    if (!local) return;
    setSyncStatus(isSupabaseConfigured() ? 'saving' : 'local_only');
    const res = await refreshAttemptFromRemote(local);
    const active = res.data ?? local;
    applySessionUpdate(active);

    const stage = Math.min(6, Math.max(1, active.attempt.current_stage)) as StageId;
    setActiveStage(stage);
    setViewMode(active.attempt.is_completed ? 'completion' : 'stage');

    if (res.remoteSynced) {
      setSyncStatus('synced');
      setSyncError(null);
    } else if (isSupabaseConfigured() && !res.ok) {
      setSyncStatus('error');
      setSyncError(res.error ?? 'Continuando com cópia local.');
    } else {
      setSyncStatus(isSupabaseConfigured() ? 'synced' : 'local_only');
    }
  }, [applySessionUpdate]);

  const recoverByResumeCode = useCallback(
    async (code: string): Promise<{ ok: boolean; error?: string }> => {
      setSyncStatus(isSupabaseConfigured() ? 'saving' : 'local_only');
      const res = await recoverAttemptByCode(code);
      if (!res.ok || !res.data) {
        setSyncStatus(isSupabaseConfigured() ? 'error' : 'local_only');
        return { ok: false, error: res.error ?? 'Código não encontrado.' };
      }

      applySessionUpdate(res.data);
      const stage = Math.min(6, Math.max(1, res.data.attempt.current_stage)) as StageId;
      setActiveStage(stage);
      setViewMode(res.data.attempt.is_completed ? 'completion' : 'stage');
      setSyncStatus(res.remoteSynced ? 'synced' : 'local_only');
      setSyncError(null);
      return { ok: true };
    },
    [applySessionUpdate]
  );

  const resetToIdentification = useCallback(() => {
    setViewMode('identification');
  }, []);

  const abandonSavedSession = useCallback(() => {
    clearLocalSession();
    sessionRef.current = null;
    setSession(null);
    setSavedPreview(null);
    setViewMode('identification');
    setSyncError(null);
  }, []);

  const goToStage = useCallback(
    (stage: StageId) => {
      setActiveStage(stage);
      setViewMode('stage');
      const current = sessionRef.current;
      if (!current) return;
      const next: MissionSessionPayload = {
        ...current,
        attempt: {
          ...current.attempt,
          current_stage: stage,
          updated_at: new Date().toISOString(),
        },
      };
      applySessionUpdate(next);
      scheduleProgressSync(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [applySessionUpdate, scheduleProgressSync]
  );

  const goToCompletion = useCallback(() => {
    setViewMode('completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateInteractions = useCallback(
    (updater: (prev: InteractionsState) => InteractionsState) => {
      const current = sessionRef.current;
      if (!current) return;
      const nextInteractions = updater(current.attempt.interactions_state ?? {});
      const next: MissionSessionPayload = {
        ...current,
        attempt: {
          ...current.attempt,
          interactions_state: nextInteractions,
          updated_at: new Date().toISOString(),
        },
      };
      applySessionUpdate(next);
      scheduleProgressSync(next);
    },
    [applySessionUpdate, scheduleProgressSync]
  );

  const recordQuizAnswer = useCallback(
    async (
      question: ObjectiveQuestion,
      selectedAnswer: string | Record<string, string>,
      isCorrect: boolean
    ) => {
      const current = sessionRef.current;
      if (!current) return;

      const record: QuizResponseRecord = {
        question_id: question.id,
        stage_number: question.stageNumber,
        topic: question.topicLabel,
        question_format: question.format,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        answered_at: new Date().toISOString(),
      };

      const filtered = current.quiz_responses.filter((q) => q.question_id !== question.id);
      const next: MissionSessionPayload = {
        ...current,
        quiz_responses: [...filtered, record],
        attempt: {
          ...current.attempt,
          updated_at: new Date().toISOString(),
        },
      };

      applySessionUpdate(next);

      if (!isSupabaseConfigured()) {
        setSyncStatus('local_only');
        return;
      }

      setSyncStatus('saving');
      const res = await syncQuizResponseToRemote(next.attempt, record);
      if (res.ok && res.remoteSynced) {
        setSyncStatus('synced');
        setSyncError(null);
      } else {
        setSyncStatus('error');
        setSyncError(res.error ?? 'Erro ao salvar resposta.');
      }
    },
    [applySessionUpdate]
  );

  const saveEssayDraft = useCallback(
    (questionNumber: 1 | 2, promptTitle: string, text: string, immediate = false) => {
      const current = sessionRef.current;
      if (!current) return;

      const now = new Date().toISOString();
      const updatedEssay: EssayRecord = {
        question_number: questionNumber,
        prompt_title: promptTitle,
        response_text: text,
        word_count: countWords(text),
        updated_at: now,
      };

      const others = current.essays.filter((e) => e.question_number !== questionNumber);
      const next: MissionSessionPayload = {
        ...current,
        essays: [...others, updatedEssay].sort((a, b) => a.question_number - b.question_number),
        attempt: {
          ...current.attempt,
          updated_at: now,
        },
      };

      applySessionUpdate(next);

      if (!isSupabaseConfigured()) {
        setSyncStatus('local_only');
        return;
      }

      setSyncStatus('saving');
      if (essayTimersRef.current[questionNumber]) {
        window.clearTimeout(essayTimersRef.current[questionNumber]);
      }

      const runSync = async () => {
        const latest = sessionRef.current ?? next;
        const targetEssay =
          latest.essays.find((e) => e.question_number === questionNumber) ?? updatedEssay;
        const res = await syncEssayToRemote(latest.attempt, targetEssay);
        if (res.ok && res.remoteSynced) {
          setSyncStatus('synced');
          setSyncError(null);
        } else {
          setSyncStatus('error');
          setSyncError(res.error ?? 'Erro ao salvar texto discursivo.');
        }
      };

      if (immediate) {
        void runSync();
      } else {
        essayTimersRef.current[questionNumber] = window.setTimeout(() => {
          void runSync();
        }, 850);
      }
    },
    [applySessionUpdate]
  );

  const completeStage = useCallback(
    async (stageId: StageId, goNext = true) => {
      const current = sessionRef.current;
      if (!current) return;

      const stageMeta = STAGES_META.find((s) => s.id === stageId);
      const completedSet = new Set<StageId>(current.attempt.completed_stages);
      completedSet.add(stageId);

      const achSet = new Set<string>(current.attempt.achievements);
      if (stageMeta) achSet.add(stageMeta.achievementId);

      const nextStage = goNext && stageId < 6 ? ((stageId + 1) as StageId) : stageId;
      const now = new Date().toISOString();

      const next: MissionSessionPayload = {
        ...current,
        attempt: {
          ...current.attempt,
          completed_stages: Array.from(completedSet).sort((a, b) => a - b),
          achievements: Array.from(achSet),
          current_stage: nextStage,
          updated_at: now,
        },
      };

      applySessionUpdate(next);
      if (goNext && stageId < 6) {
        setActiveStage(nextStage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (isSupabaseConfigured()) {
        setSyncStatus('saving');
        const res = await syncProgressToRemote(next.attempt);
        if (res.ok && res.remoteSynced) {
          setSyncStatus('synced');
          setSyncError(null);
        } else {
          setSyncStatus('error');
          setSyncError(res.error ?? 'Falha ao sincronizar conclusão da etapa.');
        }
      } else {
        setSyncStatus('local_only');
      }
    },
    [applySessionUpdate]
  );

  const finalizeMission = useCallback(async () => {
    const current = sessionRef.current;
    if (!current) return;

    const stageMeta = STAGES_META.find((s) => s.id === 6);
    const completedSet = new Set<StageId>(current.attempt.completed_stages);
    completedSet.add(6);

    const achSet = new Set<string>(current.attempt.achievements);
    if (stageMeta) achSet.add(stageMeta.achievementId);

    const now = new Date().toISOString();
    const next: MissionSessionPayload = {
      ...current,
      attempt: {
        ...current.attempt,
        completed_stages: Array.from(completedSet).sort((a, b) => a - b),
        achievements: Array.from(achSet),
        current_stage: 6,
        is_completed: true,
        completed_at: current.attempt.completed_at ?? now,
        updated_at: now,
      },
    };

    applySessionUpdate(next);
    setViewMode('completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isSupabaseConfigured()) {
      setSyncStatus('saving');
      const res = await pushFullLocalSessionToRemote(next);
      if (res.ok && res.remoteSynced) {
        if (res.data) applySessionUpdate(res.data);
        setSyncStatus('synced');
        setSyncError(null);
      } else {
        setSyncStatus('error');
        setSyncError(res.error ?? 'Finalizado localmente; erro ao enviar para o Supabase.');
      }
    } else {
      setSyncStatus('local_only');
    }
  }, [applySessionUpdate]);

  const retrySync = useCallback(async () => {
    const current = sessionRef.current;
    if (!current || !isSupabaseConfigured()) return;
    setSyncStatus('saving');
    const res = await pushFullLocalSessionToRemote(current);
    if (res.ok && res.remoteSynced) {
      if (res.data) applySessionUpdate(res.data);
      setSyncStatus('synced');
      setSyncError(null);
    } else {
      setSyncStatus('error');
      setSyncError(res.error ?? 'Não foi possível conectar ao Supabase.');
    }
  }, [applySessionUpdate]);

  const getQuizResponse = useCallback(
    (questionId: string) => session?.quiz_responses.find((q) => q.question_id === questionId),
    [session]
  );

  const getEssay = useCallback(
    (questionNumber: 1 | 2) => session?.essays.find((e) => e.question_number === questionNumber),
    [session]
  );

  return (
    <MissionContext.Provider
      value={{
        session,
        savedPreview,
        viewMode,
        activeStage,
        syncStatus,
        syncError,
        lastSavedAt,
        isSupabaseEnabled: isSupabaseConfigured(),
        isReferenceDrawerOpen,
        setReferenceDrawerOpen,
        startNewSession,
        resumeSavedSession,
        recoverByResumeCode,
        resetToIdentification,
        abandonSavedSession,
        goToStage,
        goToCompletion,
        updateInteractions,
        recordQuizAnswer,
        saveEssayDraft,
        completeStage,
        finalizeMission,
        retrySync,
        getQuizResponse,
        getEssay,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export function useMission(): MissionContextValue {
  const ctx = useContext(MissionContext);
  if (!ctx) throw new Error('useMission deve ser usado dentro de MissionProvider');
  return ctx;
}

