import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import type {
  EssayRecord,
  InteractionsState,
  MissionAttempt,
  MissionSessionPayload,
  QuizResponseRecord,
  StageId,
} from '../types/mission';

const STORAGE_KEY = 'missao_ia_active_session_v1';
const PENDING_CREATE_KEY = 'missao_ia_pending_create_v1';
const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomChars(length: number): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export function generateResumeCode(): string {
  return `IFCE-${randomChars(4)}-${randomChars(2)}`;
}

export function generateSessionSecret(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${crypto.randomUUID()}-${randomChars(8)}`;
  }
  return `sec-${Date.now().toString(36)}-${randomChars(20)}`;
}

export function generateLocalUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function readLocalSession(): MissionSessionPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MissionSessionPayload;
    if (!parsed?.attempt?.id || !parsed?.attempt?.student_name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLocalSession(payload: MissionSessionPayload): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignora falha de cota em modo privado restrito
  }
}

export function clearLocalSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_CREATE_KEY);
  } catch {
    // ignore
  }
}

function setPendingRemoteCreate(pending: boolean): void {
  try {
    if (pending) {
      localStorage.setItem(PENDING_CREATE_KEY, '1');
    } else {
      localStorage.removeItem(PENDING_CREATE_KEY);
    }
  } catch {
    // ignore
  }
}

function hasPendingRemoteCreate(): boolean {
  try {
    return localStorage.getItem(PENDING_CREATE_KEY) === '1';
  } catch {
    return false;
  }
}

function normalizePayload(raw: unknown): MissionSessionPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as {
    attempt?: MissionAttempt;
    quiz_responses?: QuizResponseRecord[];
    essays?: EssayRecord[];
  };
  if (!data.attempt) return null;
  return {
    attempt: {
      ...data.attempt,
      completed_stages: (data.attempt.completed_stages ?? []) as StageId[],
      achievements: data.attempt.achievements ?? [],
      interactions_state: (data.attempt.interactions_state ?? {}) as InteractionsState,
    },
    quiz_responses: data.quiz_responses ?? [],
    essays: data.essays ?? [],
  };
}

export interface PersistenceResult<T = void> {
  ok: boolean;
  remoteSynced: boolean;
  data?: T;
  error?: string;
}

export async function createAttemptSession(
  studentName: string,
  classGroup: string
): Promise<PersistenceResult<MissionSessionPayload>> {
  const cleanName = studentName.trim();
  const cleanGroup = classGroup.trim();
  const resumeCode = generateResumeCode();
  const sessionSecret = generateSessionSecret();
  const now = new Date().toISOString();

  const localFallback: MissionSessionPayload = {
    attempt: {
      id: generateLocalUuid(),
      resume_code: resumeCode,
      session_secret: sessionSecret,
      student_name: cleanName,
      class_group: cleanGroup,
      current_stage: 1,
      completed_stages: [],
      achievements: [],
      interactions_state: {},
      is_completed: false,
      completed_at: null,
      created_at: now,
      updated_at: now,
    },
    quiz_responses: [],
    essays: [],
  };

  const client = getSupabaseClient();
  if (!client) {
    writeLocalSession(localFallback);
    setPendingRemoteCreate(false);
    return { ok: true, remoteSynced: false, data: localFallback };
  }

  try {
    const { data, error } = await client.rpc('create_mission_attempt', {
      p_student_name: cleanName,
      p_class_group: cleanGroup,
      p_resume_code: resumeCode,
      p_session_secret: sessionSecret,
    });

    if (error) throw new Error(error.message);
    const normalized = normalizePayload(data);
    if (!normalized) throw new Error('Resposta inválida ao criar tentativa.');

    writeLocalSession(normalized);
    setPendingRemoteCreate(false);
    return { ok: true, remoteSynced: true, data: normalized };
  } catch (err) {
    writeLocalSession(localFallback);
    setPendingRemoteCreate(true);
    return {
      ok: true,
      remoteSynced: false,
      data: localFallback,
      error: err instanceof Error ? err.message : 'Falha de conexão com Supabase.',
    };
  }
}

export async function refreshAttemptFromRemote(
  local: MissionSessionPayload
): Promise<PersistenceResult<MissionSessionPayload>> {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: true, remoteSynced: false, data: local };
  }

  if (hasPendingRemoteCreate()) {
    return pushFullLocalSessionToRemote(local);
  }

  try {
    const { data, error } = await client.rpc('get_mission_attempt_by_secret', {
      p_attempt_id: local.attempt.id,
      p_session_secret: local.attempt.session_secret,
    });

    if (error) throw new Error(error.message);
    const remote = normalizePayload(data);
    if (!remote) {
      return { ok: true, remoteSynced: false, data: local };
    }

    // Preserva o estado mais recente comparando timestamps updated_at
    const remoteTime = new Date(remote.attempt.updated_at).getTime();
    const localTime = new Date(local.attempt.updated_at).getTime();
    if (localTime > remoteTime + 1500) {
      return pushFullLocalSessionToRemote(local);
    }

    writeLocalSession(remote);
    return { ok: true, remoteSynced: true, data: remote };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      data: local,
      error: err instanceof Error ? err.message : 'Erro ao sincronizar sessão.',
    };
  }
}

export async function recoverAttemptByCode(
  resumeCode: string
): Promise<PersistenceResult<MissionSessionPayload>> {
  const cleanCode = resumeCode.trim().toUpperCase();
  const local = readLocalSession();

  if (local && local.attempt.resume_code.toUpperCase() === cleanCode && !isSupabaseConfigured()) {
    return { ok: true, remoteSynced: false, data: local };
  }

  const client = getSupabaseClient();
  if (!client) {
    if (local && local.attempt.resume_code.toUpperCase() === cleanCode) {
      return { ok: true, remoteSynced: false, data: local };
    }
    return {
      ok: false,
      remoteSynced: false,
      error:
        'Código não encontrado neste navegador. O Supabase não está configurado neste ambiente para busca em nuvem.',
    };
  }

  try {
    const { data, error } = await client.rpc('recover_mission_attempt', {
      p_resume_code: cleanCode,
    });
    if (error) throw new Error(error.message);
    const normalized = normalizePayload(data);
    if (!normalized) {
      return {
        ok: false,
        remoteSynced: true,
        error: 'Nenhuma tentativa encontrada com esse código de retomada. Confira as letras e os números.',
      };
    }

    writeLocalSession(normalized);
    setPendingRemoteCreate(false);
    return { ok: true, remoteSynced: true, data: normalized };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      error: err instanceof Error ? err.message : 'Erro ao recuperar tentativa.',
    };
  }
}

async function pushPendingLocalSessionIfNeeded(): Promise<PersistenceResult | null> {
  if (!hasPendingRemoteCreate()) return null;
  const local = readLocalSession();
  if (!local) return null;
  const pushed = await pushFullLocalSessionToRemote(local);
  return { ok: pushed.ok, remoteSynced: pushed.remoteSynced, error: pushed.error };
}

export async function syncProgressToRemote(attempt: MissionAttempt): Promise<PersistenceResult> {
  const client = getSupabaseClient();
  if (!client) return { ok: true, remoteSynced: false };

  const pendingResult = await pushPendingLocalSessionIfNeeded();
  if (pendingResult) return pendingResult;

  try {
    const { error } = await client.rpc('save_mission_progress', {
      p_attempt_id: attempt.id,
      p_session_secret: attempt.session_secret,
      p_current_stage: attempt.current_stage,
      p_completed_stages: attempt.completed_stages,
      p_achievements: attempt.achievements,
      p_interactions_state: attempt.interactions_state,
      p_is_completed: attempt.is_completed,
    });
    if (error) throw new Error(error.message);
    return { ok: true, remoteSynced: true };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      error: err instanceof Error ? err.message : 'Erro ao salvar progresso na nuvem.',
    };
  }
}

export async function syncQuizResponseToRemote(
  attempt: MissionAttempt,
  record: QuizResponseRecord
): Promise<PersistenceResult> {
  const client = getSupabaseClient();
  if (!client) return { ok: true, remoteSynced: false };

  const pendingResult = await pushPendingLocalSessionIfNeeded();
  if (pendingResult) return pendingResult;

  try {
    const { error } = await client.rpc('upsert_quiz_response', {
      p_attempt_id: attempt.id,
      p_session_secret: attempt.session_secret,
      p_question_id: record.question_id,
      p_stage_number: record.stage_number,
      p_topic: record.topic,
      p_question_format: record.question_format,
      p_selected_answer: record.selected_answer,
      p_is_correct: record.is_correct,
    });
    if (error) throw new Error(error.message);
    return { ok: true, remoteSynced: true };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      error: err instanceof Error ? err.message : 'Erro ao registrar resposta no Supabase.',
    };
  }
}

export async function syncEssayToRemote(
  attempt: MissionAttempt,
  essay: EssayRecord
): Promise<PersistenceResult> {
  const client = getSupabaseClient();
  if (!client) return { ok: true, remoteSynced: false };

  const pendingResult = await pushPendingLocalSessionIfNeeded();
  if (pendingResult) return pendingResult;

  try {
    const { error } = await client.rpc('upsert_essay_response', {
      p_attempt_id: attempt.id,
      p_session_secret: attempt.session_secret,
      p_question_number: essay.question_number,
      p_prompt_title: essay.prompt_title,
      p_response_text: essay.response_text,
      p_word_count: essay.word_count,
    });
    if (error) throw new Error(error.message);
    return { ok: true, remoteSynced: true };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      error: err instanceof Error ? err.message : 'Erro ao salvar texto discursivo na nuvem.',
    };
  }
}

export async function pushFullLocalSessionToRemote(
  session: MissionSessionPayload
): Promise<PersistenceResult<MissionSessionPayload>> {
  const client = getSupabaseClient();
  if (!client) return { ok: true, remoteSynced: false, data: session };

  try {
    let activeSession = session;

    if (hasPendingRemoteCreate()) {
      const { data, error } = await client.rpc('create_mission_attempt', {
        p_student_name: session.attempt.student_name,
        p_class_group: session.attempt.class_group,
        p_resume_code: session.attempt.resume_code,
        p_session_secret: session.attempt.session_secret,
      });
      if (error) throw new Error(error.message);
      const created = normalizePayload(data);
      if (created) {
        activeSession = {
          ...session,
          attempt: {
            ...session.attempt,
            id: created.attempt.id,
          },
        };
        writeLocalSession(activeSession);
        setPendingRemoteCreate(false);
      }
    }

    const { error: progErr } = await client.rpc('save_mission_progress', {
      p_attempt_id: activeSession.attempt.id,
      p_session_secret: activeSession.attempt.session_secret,
      p_current_stage: activeSession.attempt.current_stage,
      p_completed_stages: activeSession.attempt.completed_stages,
      p_achievements: activeSession.attempt.achievements,
      p_interactions_state: activeSession.attempt.interactions_state,
      p_is_completed: activeSession.attempt.is_completed,
    });
    if (progErr) throw new Error(progErr.message);

    for (const q of activeSession.quiz_responses) {
      const { error: qErr } = await client.rpc('upsert_quiz_response', {
        p_attempt_id: activeSession.attempt.id,
        p_session_secret: activeSession.attempt.session_secret,
        p_question_id: q.question_id,
        p_stage_number: q.stage_number,
        p_topic: q.topic,
        p_question_format: q.question_format,
        p_selected_answer: q.selected_answer,
        p_is_correct: q.is_correct,
      });
      if (qErr) throw new Error(qErr.message);
    }

    for (const essay of activeSession.essays) {
      const { error: eErr } = await client.rpc('upsert_essay_response', {
        p_attempt_id: activeSession.attempt.id,
        p_session_secret: activeSession.attempt.session_secret,
        p_question_number: essay.question_number,
        p_prompt_title: essay.prompt_title,
        p_response_text: essay.response_text,
        p_word_count: essay.word_count,
      });
      if (eErr) throw new Error(eErr.message);
    }

    return { ok: true, remoteSynced: true, data: activeSession };
  } catch (err) {
    return {
      ok: false,
      remoteSynced: false,
      data: session,
      error: err instanceof Error ? err.message : 'Falha na sincronização com o Supabase.',
    };
  }
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
