-- =============================================================================
-- IA, Educação e Responsabilidade — Schema do Supabase (PostgreSQL + RLS + RPCs seguras)
-- Disciplina: Informática Aplicada ao Ensino de Física (IFCE)
-- Base normativa: Documento Orientador "Inteligência Artificial na Educação Básica" (MEC, 2026)
-- =============================================================================
-- Privacidade e LGPD (Lei nº 13.709/2018, Art. 6º, III - Minimização):
-- Armazena exclusivamente Nome completo e Turma do estudante, além do registro
-- pedagógico da atividade. Não solicita matrícula, CPF ou e-mail.
-- =============================================================================

-- 1. Tabela principal de tentativas / sessões dos estudantes
create table if not exists public.mission_attempts (
  id uuid primary key default gen_random_uuid(),
  resume_code text not null unique,
  session_secret text not null unique,
  student_name text not null check (char_length(trim(student_name)) between 2 and 160),
  class_group text not null check (char_length(trim(class_group)) between 1 and 80),
  current_stage integer not null default 1 check (current_stage between 1 and 7),
  completed_stages integer[] not null default '{}',
  achievements text[] not null default '{}',
  interactions_state jsonb not null default '{}'::jsonb,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Tabela de respostas às questões objetivas distribuídas ao longo da atividade
create table if not exists public.mission_quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mission_attempts(id) on delete cascade,
  question_id text not null,
  stage_number integer not null check (stage_number between 1 and 6),
  topic text not null,
  question_format text not null,
  selected_answer jsonb not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  constraint uq_attempt_question unique (attempt_id, question_id)
);

-- 3. Tabela das duas respostas discursivas obrigatórias (Etapa 6)
create table if not exists public.mission_essays (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mission_attempts(id) on delete cascade,
  question_number smallint not null check (question_number in (1, 2)),
  prompt_title text not null,
  response_text text not null default '',
  word_count integer not null default 0 check (word_count >= 0),
  updated_at timestamptz not null default now(),
  constraint uq_attempt_essay unique (attempt_id, question_number)
);

-- Índices para performance em consultas por tentativa e turma
create index if not exists idx_mission_attempts_resume_code on public.mission_attempts (upper(resume_code));
create index if not exists idx_mission_attempts_class_group on public.mission_attempts (class_group);
create index if not exists idx_mission_quiz_attempt on public.mission_quiz_responses (attempt_id);
create index if not exists idx_mission_essays_attempt on public.mission_essays (attempt_id);

-- Trigger de atualização automática de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_mission_attempts_updated_at on public.mission_attempts;
create trigger trg_mission_attempts_updated_at
  before update on public.mission_attempts
  for each row execute function public.set_updated_at();

drop trigger if exists trg_mission_essays_updated_at on public.mission_essays;
create trigger trg_mission_essays_updated_at
  before update on public.mission_essays
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Segurança: Row Level Security (RLS)
-- Bloqueia acesso direto de leitura/escrita anônima às tabelas para proteger a
-- privacidade dos estudantes. Toda interação do frontend passa pelas funções RPC
-- validadas por (attempt_id + session_secret) ou código exato de retomada.
-- =============================================================================
alter table public.mission_attempts enable row level security;
alter table public.mission_quiz_responses enable row level security;
alter table public.mission_essays enable row level security;

revoke all on table public.mission_attempts from anon, authenticated;
revoke all on table public.mission_quiz_responses from anon, authenticated;
revoke all on table public.mission_essays from anon, authenticated;

drop policy if exists deny_direct_attempts on public.mission_attempts;
create policy deny_direct_attempts on public.mission_attempts
  for all to anon, authenticated using (false) with check (false);

drop policy if exists deny_direct_quizzes on public.mission_quiz_responses;
create policy deny_direct_quizzes on public.mission_quiz_responses
  for all to anon, authenticated using (false) with check (false);

drop policy if exists deny_direct_essays on public.mission_essays;
create policy deny_direct_essays on public.mission_essays
  for all to anon, authenticated using (false) with check (false);

-- =============================================================================
-- Funções RPC (SECURITY DEFINER) para operação segura no frontend com anon key
-- =============================================================================

-- Helper interno para montar o payload completo da tentativa
create or replace function public._build_attempt_payload(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_attempt public.mission_attempts%rowtype;
  v_quizzes jsonb;
  v_essays jsonb;
begin
  select * into v_attempt from public.mission_attempts where id = p_attempt_id;
  if not found then
    return null;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'question_id', q.question_id,
        'stage_number', q.stage_number,
        'topic', q.topic,
        'question_format', q.question_format,
        'selected_answer', q.selected_answer,
        'is_correct', q.is_correct,
        'answered_at', q.answered_at
      ) order by q.stage_number, q.answered_at
    ),
    '[]'::jsonb
  )
  into v_quizzes
  from public.mission_quiz_responses q
  where q.attempt_id = p_attempt_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'question_number', e.question_number,
        'prompt_title', e.prompt_title,
        'response_text', e.response_text,
        'word_count', e.word_count,
        'updated_at', e.updated_at
      ) order by e.question_number
    ),
    '[]'::jsonb
  )
  into v_essays
  from public.mission_essays e
  where e.attempt_id = p_attempt_id;

  return jsonb_build_object(
    'attempt', jsonb_build_object(
      'id', v_attempt.id,
      'resume_code', v_attempt.resume_code,
      'session_secret', v_attempt.session_secret,
      'student_name', v_attempt.student_name,
      'class_group', v_attempt.class_group,
      'current_stage', v_attempt.current_stage,
      'completed_stages', v_attempt.completed_stages,
      'achievements', v_attempt.achievements,
      'interactions_state', v_attempt.interactions_state,
      'is_completed', v_attempt.is_completed,
      'completed_at', v_attempt.completed_at,
      'created_at', v_attempt.created_at,
      'updated_at', v_attempt.updated_at
    ),
    'quiz_responses', v_quizzes,
    'essays', v_essays
  );
end;
$$;

-- 1) Criar nova tentativa de estudante
create or replace function public.create_mission_attempt(
  p_student_name text,
  p_class_group text,
  p_resume_code text,
  p_session_secret text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_name text := trim(coalesce(p_student_name, ''));
  v_group text := trim(coalesce(p_class_group, ''));
  v_code text := upper(trim(coalesce(p_resume_code, '')));
  v_secret text := trim(coalesce(p_session_secret, ''));
begin
  if char_length(v_name) < 2 or char_length(v_name) > 160 then
    raise exception 'Nome do estudante deve ter entre 2 e 160 caracteres.';
  end if;
  if char_length(v_group) < 1 or char_length(v_group) > 80 then
    raise exception 'Turma deve ser informada.';
  end if;
  if char_length(v_code) < 8 then
    raise exception 'Código de retomada inválido.';
  end if;
  if char_length(v_secret) < 16 then
    raise exception 'Token de sessão inválido.';
  end if;

  insert into public.mission_attempts (
    student_name,
    class_group,
    resume_code,
    session_secret
  )
  values (v_name, v_group, v_code, v_secret)
  returning id into v_id;

  return public._build_attempt_payload(v_id);
end;
$$;

-- 2) Recuperar tentativa usando (id + session_secret) salvos no navegador
create or replace function public.get_mission_attempt_by_secret(
  p_attempt_id uuid,
  p_session_secret text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  select id into v_id
  from public.mission_attempts
  where id = p_attempt_id
    and session_secret = trim(coalesce(p_session_secret, ''));

  if not found then
    return null;
  end if;

  return public._build_attempt_payload(v_id);
end;
$$;

-- 3) Recuperar tentativa em outro navegador/dispositivo usando Código de Retomada
create or replace function public.recover_mission_attempt(
  p_resume_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_code text := upper(trim(coalesce(p_resume_code, '')));
begin
  if char_length(v_code) < 8 then
    return null;
  end if;

  select id into v_id
  from public.mission_attempts
  where upper(resume_code) = v_code;

  if not found then
    return null;
  end if;

  return public._build_attempt_payload(v_id);
end;
$$;

-- 4) Salvar progresso geral (etapa atual, etapas concluídas, conquistas, interações)
create or replace function public.save_mission_progress(
  p_attempt_id uuid,
  p_session_secret text,
  p_current_stage integer,
  p_completed_stages integer[],
  p_achievements text[],
  p_interactions_state jsonb,
  p_is_completed boolean
)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_updated timestamptz;
begin
  update public.mission_attempts
  set
    current_stage = greatest(1, least(7, coalesce(p_current_stage, 1))),
    completed_stages = coalesce(p_completed_stages, '{}'),
    achievements = coalesce(p_achievements, '{}'),
    interactions_state = coalesce(p_interactions_state, '{}'::jsonb),
    is_completed = coalesce(p_is_completed, false),
    completed_at = case
      when coalesce(p_is_completed, false) and completed_at is null then now()
      else completed_at
    end
  where id = p_attempt_id
    and session_secret = trim(coalesce(p_session_secret, ''))
  returning updated_at into v_updated;

  if not found then
    raise exception 'Sessão não autorizada ou não encontrada.';
  end if;

  return v_updated;
end;
$$;

-- 5) Salvar/atualizar resposta de questão objetiva
create or replace function public.upsert_quiz_response(
  p_attempt_id uuid,
  p_session_secret text,
  p_question_id text,
  p_stage_number integer,
  p_topic text,
  p_question_format text,
  p_selected_answer jsonb,
  p_is_correct boolean
)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner uuid;
  v_answered timestamptz;
begin
  select id into v_owner
  from public.mission_attempts
  where id = p_attempt_id
    and session_secret = trim(coalesce(p_session_secret, ''));

  if not found then
    raise exception 'Sessão não autorizada ou não encontrada.';
  end if;

  insert into public.mission_quiz_responses (
    attempt_id,
    question_id,
    stage_number,
    topic,
    question_format,
    selected_answer,
    is_correct,
    answered_at
  )
  values (
    p_attempt_id,
    p_question_id,
    p_stage_number,
    p_topic,
    p_question_format,
    p_selected_answer,
    p_is_correct,
    now()
  )
  on conflict (attempt_id, question_id) do update set
    selected_answer = excluded.selected_answer,
    is_correct = excluded.is_correct,
    answered_at = now()
  returning answered_at into v_answered;

  update public.mission_attempts set updated_at = now() where id = p_attempt_id;

  return v_answered;
end;
$$;

-- 6) Salvar/atualizar resposta discursiva (Questão 1 ou 2)
create or replace function public.upsert_essay_response(
  p_attempt_id uuid,
  p_session_secret text,
  p_question_number smallint,
  p_prompt_title text,
  p_response_text text,
  p_word_count integer
)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_owner uuid;
  v_updated timestamptz;
begin
  select id into v_owner
  from public.mission_attempts
  where id = p_attempt_id
    and session_secret = trim(coalesce(p_session_secret, ''));

  if not found then
    raise exception 'Sessão não autorizada ou não encontrada.';
  end if;

  insert into public.mission_essays (
    attempt_id,
    question_number,
    prompt_title,
    response_text,
    word_count
  )
  values (
    p_attempt_id,
    p_question_number,
    p_prompt_title,
    coalesce(p_response_text, ''),
    greatest(0, coalesce(p_word_count, 0))
  )
  on conflict (attempt_id, question_number) do update set
    prompt_title = excluded.prompt_title,
    response_text = excluded.response_text,
    word_count = excluded.word_count,
    updated_at = now()
  returning updated_at into v_updated;

  update public.mission_attempts set updated_at = now() where id = p_attempt_id;

  return v_updated;
end;
$$;

-- Permissões de execução das RPCs para o cliente web (anon key)
revoke all on function public._build_attempt_payload(uuid) from public, anon, authenticated;
grant execute on function public.create_mission_attempt(text, text, text, text) to anon, authenticated;
grant execute on function public.get_mission_attempt_by_secret(uuid, text) to anon, authenticated;
grant execute on function public.recover_mission_attempt(text) to anon, authenticated;
grant execute on function public.save_mission_progress(uuid, text, integer, integer[], text[], jsonb, boolean) to anon, authenticated;
grant execute on function public.upsert_quiz_response(uuid, text, text, integer, text, text, jsonb, boolean) to anon, authenticated;
grant execute on function public.upsert_essay_response(uuid, text, smallint, text, text, integer) to anon, authenticated;

-- =============================================================================
-- View para acompanhamento pelo professor no painel do Supabase (SQL / Table Editor)
-- =============================================================================
create or replace view public.v_professor_resumo as
select
  a.id as attempt_id,
  a.resume_code,
  a.student_name,
  a.class_group,
  a.current_stage,
  cardinality(a.completed_stages) as stages_completed_count,
  a.completed_stages,
  a.is_completed,
  count(q.id) as quiz_answered_count,
  count(q.id) filter (where q.is_correct) as quiz_correct_count,
  max(case when e.question_number = 1 then e.word_count end) as essay_1_words,
  max(case when e.question_number = 1 then e.response_text end) as essay_1_text,
  max(case when e.question_number = 2 then e.word_count end) as essay_2_words,
  max(case when e.question_number = 2 then e.response_text end) as essay_2_text,
  a.created_at,
  a.updated_at,
  a.completed_at
from public.mission_attempts a
left join public.mission_quiz_responses q on q.attempt_id = a.id
left join public.mission_essays e on e.attempt_id = a.id
group by a.id;

revoke all on public.v_professor_resumo from anon, authenticated;

