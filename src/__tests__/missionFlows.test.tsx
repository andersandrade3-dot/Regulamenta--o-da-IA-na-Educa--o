import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import App from '../App';
import { ALL_OBJECTIVE_QUESTIONS, MISSION_COMPETENCY_TOPICS } from '../data/allQuestions';
import { buildStructuredPhysicsPrompt, DEFAULT_PROMPT_CONFIG } from '../data/stage4Data';
import { ESSAY_PROMPTS } from '../data/stage6Data';
import * as supabaseClientModule from '../lib/supabaseClient';
import type { MissionSessionPayload, StageId } from '../types/mission';

describe('IA, Educação e Responsabilidade — Fluxos Pedagógicos e Persistência', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('cobre todos os 10 tópicos temáticos e os 5 formatos variados ao longo da jornada', () => {
    const coveredTopicIds = new Set(ALL_OBJECTIVE_QUESTIONS.map((q) => q.topicId));
    for (const topic of MISSION_COMPETENCY_TOPICS) {
      expect(coveredTopicIds.has(topic.id)).toBe(true);
    }

    const formats = new Set(ALL_OBJECTIVE_QUESTIONS.map((q) => q.format));
    expect(formats.has('multiple_choice')).toBe(true);
    expect(formats.has('true_false')).toBe(true);
    expect(formats.has('matching')).toBe(true);
    expect(formats.has('situation_identification')).toBe(true);
    expect(formats.has('best_conduct')).toBe(true);

    expect(ESSAY_PROMPTS).toHaveLength(2);
  });

  it('gera prompts estruturados para Física sem API externa mantendo salvaguardas', () => {
    const result = buildStructuredPhysicsPrompt(DEFAULT_PROMPT_CONFIG);
    expect(result.prompt).toContain('Leis de Newton');
    expect(result.prompt).toContain('Sistema Internacional');
    expect(result.prompt).toContain('descarregamento cognitivo');
    expect(result.anatomy.length).toBeGreaterThanOrEqual(3);
  });

  it('exige somente Nome completo e Turma na identificação e permite recuperar após recarregar', async () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /IA, Educação e Responsabilidade/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Missão IA/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Nome completo do estudante/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Turma/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/CPF/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Matrícula/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/E-mail/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Iniciar atividade/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Informe seu nome completo/i);

    fireEvent.change(screen.getByLabelText(/Nome completo do estudante/i), {
      target: { value: 'Ana Beatriz Costa' },
    });
    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: 'Física IFCE 2026.2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar atividade/i }));

    expect(
      await screen.findByRole('heading', { name: /A IA já faz parte da sua vida\?/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Ana Beatriz Costa/i)).toBeInTheDocument();

    // Simula fechar e reabrir o navegador
    cleanup();
    render(<App />);

    expect(await screen.findByText(/Progresso salvo encontrado neste navegador/i)).toBeInTheDocument();
    expect(screen.getByText(/Ana Beatriz Costa/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Continuar de onde parei/i }));
    expect(
      await screen.findByRole('heading', { name: /A IA já faz parte da sua vida\?/i })
    ).toBeInTheDocument();
  });

  it('percorre o fluxo completo das etapas 1 a 6, salva discursivas e exibe a tela final oficial', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Nome completo do estudante/i), {
      target: { value: 'Lucas Ferreira Lima' },
    });
    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: 'Lic. Física 2026.2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar atividade/i }));

    // ETAPA 1
    expect(await screen.findByText(/Você utiliza uma inteligência artificial para fazer uma atividade escolar/i)).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {
        name: /Usaria como apoio inicial, mas conferiria o conceito, as unidades e as referências/i,
      })
    );
    expect(await screen.findByText(/Postura investigativa e responsável/i)).toBeInTheDocument();

    // Responder às 3 questões objetivas da Etapa 1
    const falseButtons = screen.getAllByRole('button', { name: /^F\s*Falso$/i });
    fireEvent.click(falseButtons[0]);
    fireEvent.click(falseButtons[1]);
    fireEvent.click(
      screen.getByRole('button', {
        name: /Aprender sobre IA trata a tecnologia como objeto de conhecimento crítico/i,
      })
    );

    const nextStage1 = screen.getByRole('button', { name: /Concluir Etapa 1 e avançar/i });
    await waitFor(() => expect(nextStage1).toBeEnabled());
    fireEvent.click(nextStage1);

    // ETAPA 2 — NotebookLM
    expect(
      await screen.findByRole('heading', {
        name: /Laboratório de Investigação: descubra o NotebookLM/i,
      })
    ).toBeInTheDocument();

    // Desafio do Investigador (4 casos)
    const confirmBtns = screen.getAllByRole('button', { name: /Confirmada na fonte/i });
    const partialBtns = screen.getAllByRole('button', { name: /Parcial \/ exige leitura completa/i });
    const hallucBtns = screen.getAllByRole('button', { name: /Incorreta \/ sem respaldo no PDF/i });
    fireEvent.click(confirmBtns[0]);
    fireEvent.click(hallucBtns[1]);
    fireEvent.click(partialBtns[2]);
    fireEvent.click(confirmBtns[3]);
    fireEvent.click(screen.getByRole('button', { name: /Validar investigação/i }));

    // Associação de conceitos Etapa 2
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'grounding' } });
    fireEvent.change(selects[1], { target: { value: 'audit' } });
    fireEvent.change(selects[2], { target: { value: 'authorship' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar associação/i }));

    const nextStage2 = screen.getByRole('button', { name: /Concluir Etapa 2 e avançar/i });
    await waitFor(() => expect(nextStage2).toBeEnabled());
    fireEvent.click(nextStage2);

    // ETAPA 3 — Central de Decisões e Semáforo
    expect(
      await screen.findByRole('heading', {
        name: /Central de Decisões: ética ou irresponsabilidade\?/i,
      })
    ).toBeInTheDocument();

    const adequateBtns = screen.getAllByRole('button', { name: 'Conduta adequada' });
    const attentionBtns = screen.getAllByRole('button', { name: 'Exige atenção' });
    const inadequateBtns = screen.getAllByRole('button', { name: 'Conduta inadequada' });
    fireEvent.click(adequateBtns[0]);
    fireEvent.click(inadequateBtns[1]);
    fireEvent.click(inadequateBtns[2]);
    fireEvent.click(inadequateBtns[3]);
    fireEvent.click(attentionBtns[4]);
    fireEvent.click(adequateBtns[5]);

    // Classificar os 6 cartões no Semáforo por clique acessível
    const cardTexts = [
      /Criar um roteiro de revisão sobre Leis de Newton/i,
      /Subir uma planilha com nomes, notas e laudos/i,
      /Gerar uma lista de questões de Mecânica com IA/i,
      /Adotar na escola um aplicativo com IA que exige cadastro infantil/i,
      /Comparar duas explicações geradas por ferramentas diferentes/i,
      /Traduzir um texto de Física com IA para adaptar/i,
    ];
    const targetZones = [
      /VERDE — Prática responsável/i,
      /VERMELHO — Prática inadequada/i,
      /AMARELO — Exige atenção/i,
      /VERMELHO — Prática inadequada/i,
      /VERDE — Prática responsável/i,
      /AMARELO — Exige atenção/i,
    ];
    for (let i = 0; i < cardTexts.length; i += 1) {
      fireEvent.click(screen.getByText(cardTexts[i]));
      fireEvent.click(screen.getByText(targetZones[i]));
    }
    fireEvent.click(screen.getByRole('button', { name: /Verificar Semáforo/i }));

    // 2 questões normativas da Etapa 3
    fireEvent.click(
      screen.getByRole('button', {
        name: /Violação dos princípios da finalidade, necessidade/i,
      })
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /Adotar por padrão a configuração mais protetiva de privacidade/i,
      })
    );

    const nextStage3 = screen.getByRole('button', { name: /Concluir Etapa 3 e avançar/i });
    await waitFor(() => expect(nextStage3).toBeEnabled());
    fireEvent.click(nextStage3);

    // ETAPA 4 — Física + IA
    expect(
      await screen.findByRole('heading', {
        name: /Física \+ Inteligência Artificial: coloque em prática/i,
      })
    ).toBeInTheDocument();

    // Configura o Laboratório de Prompts e verifica persistência no estado salvo
    fireEvent.change(screen.getByLabelText(/2\. Conteúdo de Física/i), {
      target: { value: '2lei' },
    });
    fireEvent.change(screen.getByLabelText(/3\. Nível de dificuldade/i), {
      target: { value: 'aprofundado' },
    });
    const promptPreview = document.querySelector('pre');
    expect(promptPreview).toHaveTextContent(/Princípio Fundamental da Dinâmica/i);
    expect(promptPreview).toHaveTextContent(/Aprofundamento \(análise vetorial e diagramas de corpo livre\)/i);

    fireEvent.click(screen.getByText(/72 km\/h em 4 s/i));
    fireEvent.click(screen.getByText(/peso e a força normal sobre o livro formam/i));
    fireEvent.click(screen.getByText(/NEWTON, I\.; EINSTEIN, A\./i));

    fireEvent.click(
      screen.getByRole('button', {
        name: /Corrigir manualmente a conversão para m\/s²/i,
      })
    );

    const savedAfterStage4 = localStorage.getItem('missao_ia_active_session_v1');
    expect(savedAfterStage4).toContain('"physicsTopic":"2lei"');
    expect(savedAfterStage4).toContain('"stage3TrafficChecked":true');

    const nextStage4 = screen.getByRole('button', { name: /Concluir Etapa 4 e avançar/i });
    await waitFor(() => expect(nextStage4).toBeEnabled());
    fireEvent.click(nextStage4);

    // ETAPA 5 — Desafio Final (um cenário por vez!)
    expect(
      await screen.findByRole('heading', { name: /Desafio final: você decide!/i })
    ).toBeInTheDocument();

    // Cenário 1
    fireEvent.click(screen.getByRole('button', { name: /Viés algorítmico e padronização avaliativa/i }));
    fireEvent.click(screen.getByRole('button', { name: /Próximo cenário/i }));

    // Cenário 2
    fireEvent.click(screen.getByRole('button', { name: /Usar o alerta apenas como sinal inicial/i }));
    fireEvent.click(screen.getByRole('button', { name: /Próximo cenário/i }));

    // Cenário 3 (associação)
    const stage5Selects = screen.getAllByRole('combobox');
    fireEvent.change(stage5Selects[0], { target: { value: 'superior_to_analog' } });
    fireEvent.change(stage5Selects[1], { target: { value: 'avoid_offloading' } });
    fireEvent.change(stage5Selects[2], { target: { value: 'keep_alternatives' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar associação/i }));
    fireEvent.click(screen.getByRole('button', { name: /Próximo cenário/i }));

    // Cenário 4 (V/F)
    fireEvent.click(screen.getByRole('button', { name: /^F\s*Falso$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Próximo cenário/i }));

    // Cenário 5 (Múltipla escolha)
    fireEvent.click(
      screen.getByRole('button', {
        name: /Inadequada, pois viola a autonomia didático-pedagógica docente/i,
      })
    );

    const nextStage5 = screen.getByRole('button', { name: /Concluir Etapa 5 e avançar/i });
    await waitFor(() => expect(nextStage5).toBeEnabled());
    fireEvent.click(nextStage5);

    // ETAPA 6 — Duas questões discursivas obrigatórias
    expect(
      await screen.findByRole('heading', { name: /Sua opinião importa: questões discursivas/i })
    ).toBeInTheDocument();
    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(2);

    fireEvent.change(textareas[0], {
      target: {
        value:
          'Eu conferiria as fórmulas das Leis de Newton, as unidades no Sistema Internacional e buscaria as referências citadas em livros didáticos reais.',
      },
    });
    fireEvent.change(textareas[1], {
      target: {
        value:
          'Utilizaria a IA como ferramenta de apoio sob minha mediação docente, protegendo a privacidade conforme a LGPD e estimulando o pensamento crítico.',
      },
    });

    const finalizeBtn = screen.getByRole('button', {
      name: /Registrar respostas e concluir atividade/i,
    });
    await waitFor(() => expect(finalizeBtn).toBeEnabled());
    fireEvent.click(finalizeBtn);

    // Tela de conclusão oficial
    expect(
      await screen.findByText(/Utilizar inteligência artificial não significa deixar de pensar/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Atividade Concluída/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/12/i)).toBeInTheDocument();
    expect(screen.getByText(/12 de 12 questões respondidas/i)).toBeInTheDocument();
    expect(screen.getByText(/2\/2 registradas/i)).toBeInTheDocument();

    // Abrir Biblioteca de Referências e verificar estrutura rolável integral + fechamento por Escape
    fireEvent.click(screen.getAllByRole('button', { name: /Biblioteca de Referências/i })[0]);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    const scrollArea = screen.getByTestId('reference-drawer-scroll');
    expect(scrollArea.className).toContain('overflow-y-auto');
    expect(scrollArea.className).toContain('min-h-0');
    expect(scrollArea).toContainElement(screen.getByText(/Fonte Primária da Atividade/i));
    expect(scrollArea).toContainElement(screen.getByText(/Lei nº 15\.211\/2025/i));
    expect(scrollArea).toContainElement(
      screen.getByRole('button', { name: /Voltar ao topo da Biblioteca/i })
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  }, 20000);

  it('sincroniza via RPCs do Supabase, trata falha de conexão com retry e recupera por código de retomada', async () => {
    let failNextQuizRpc = true;
    const now = '2026-11-13T15:00:00.000Z';
    let remoteAttempt: MissionSessionPayload['attempt'] | null = null;

    const rpcMock = vi.fn(async (fnName: string, params: Record<string, unknown>) => {
      if (fnName === 'create_mission_attempt') {
        remoteAttempt = {
          id: 'attempt-uuid-1',
          student_name: String(params.p_student_name),
          class_group: String(params.p_class_group),
          resume_code: String(params.p_resume_code),
          session_secret: String(params.p_session_secret),
          current_stage: 1,
          completed_stages: [],
          achievements: [],
          interactions_state: {},
          is_completed: false,
          completed_at: null,
          created_at: now,
          updated_at: now,
        };
        return {
          data: { attempt: remoteAttempt, quiz_responses: [], essays: [] },
          error: null,
        };
      }

      if (fnName === 'upsert_quiz_response') {
        if (failNextQuizRpc) {
          failNextQuizRpc = false;
          return { data: null, error: { message: 'Falha temporária de rede' } };
        }
        return { data: null, error: null };
      }

      if (fnName === 'save_mission_progress') {
        if (remoteAttempt) {
          remoteAttempt = {
            ...remoteAttempt,
            current_stage: Number(params.p_current_stage ?? remoteAttempt.current_stage) as StageId,
            completed_stages: (params.p_completed_stages as StageId[]) ?? remoteAttempt.completed_stages,
            updated_at: '2026-11-13T15:05:00.000Z',
          };
        }
        return { data: null, error: null };
      }

      if (fnName === 'upsert_essay_response') {
        return { data: null, error: null };
      }

      if (fnName === 'recover_mission_attempt') {
        const requestedCode = String(params.p_resume_code ?? '').toUpperCase();
        if (requestedCode !== 'MIA-9Z9Z-99') {
          return { data: null, error: null };
        }
        const recoveredPayload: MissionSessionPayload = {
          attempt: {
            id: 'attempt-uuid-recovered',
            student_name: 'Maria Clara IFCE',
            class_group: 'Física 2026.2',
            resume_code: 'MIA-9Z9Z-99',
            session_secret: 'secret-recovered-xyz',
            current_stage: 6,
            completed_stages: [1, 2, 3, 4, 5],
            achievements: ['investigador_fonte', 'guardiao_etica', 'arquiteto_prompts'],
            interactions_state: {},
            is_completed: false,
            completed_at: null,
            created_at: now,
            updated_at: now,
          },
          quiz_responses: [],
          essays: [
            {
              question_number: 1,
              prompt_title: 'Questão 1 — Reflexão crítica',
              response_text: 'Rascunho recuperado automaticamente pela nuvem para revisão contínua.',
              word_count: 10,
              updated_at: now,
            },
          ],
        };
        return { data: recoveredPayload, error: null };
      }

      return { data: null, error: null };
    });

    vi.spyOn(supabaseClientModule, 'isSupabaseConfigured').mockReturnValue(true);
    vi.spyOn(supabaseClientModule, 'getSupabaseClient').mockReturnValue({
      rpc: rpcMock,
    } as unknown as SupabaseClient);

    // 1. Inicia sessão e valida create_mission_attempt + status na nuvem
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Nome completo do estudante/i), {
      target: { value: 'Carlos Eduardo Sousa' },
    });
    fireEvent.change(screen.getByLabelText(/Turma/i), {
      target: { value: 'IFCE Física 2026.2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar atividade/i }));

    expect(
      await screen.findByRole('heading', { name: /A IA já faz parte da sua vida\?/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Salvo na nuvem/i)).toBeInTheDocument();

    // 2. Dispara erro no primeiro envio de questão e valida recuperação via botão de retry
    const falseButtons = screen.getAllByRole('button', { name: /^F\s*Falso$/i });
    fireEvent.click(falseButtons[0]);

    const retryBtn = await screen.findByRole('button', { name: /Erro ao sincronizar/i });
    fireEvent.click(retryBtn);

    expect(await screen.findByText(/Salvo na nuvem/i)).toBeInTheDocument();
    expect(rpcMock).toHaveBeenCalledWith(
      'create_mission_attempt',
      expect.objectContaining({ p_student_name: 'Carlos Eduardo Sousa' })
    );
    expect(rpcMock).toHaveBeenCalledWith('save_mission_progress', expect.any(Object));
    expect(rpcMock).toHaveBeenCalledWith('upsert_quiz_response', expect.any(Object));

    // 3. Limpa localStorage (outro navegador) e recupera via Código de Retomada -> Etapa 6
    cleanup();
    localStorage.clear();
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /Já iniciou em outro dispositivo\? Recuperar com Código de Retomada/i,
      })
    );
    fireEvent.change(screen.getByLabelText(/Informe seu código/i), {
      target: { value: 'MIA-0000-00' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Recuperar progresso/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Nenhuma tentativa encontrada com esse código/i
    );

    fireEvent.change(screen.getByLabelText(/Informe seu código/i), {
      target: { value: 'MIA-9Z9Z-99' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Recuperar progresso/i }));

    expect(
      await screen.findByRole('heading', { name: /Sua opinião importa: questões discursivas/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Maria Clara IFCE/i)).toBeInTheDocument();

    const essayAreas = screen.getAllByRole('textbox');
    expect(essayAreas[0]).toHaveValue(
      'Rascunho recuperado automaticamente pela nuvem para revisão contínua.'
    );

    // Edita a 2ª discursiva e salva imediatamente via blur -> verifica RPC upsert_essay_response
    fireEvent.change(essayAreas[1], {
      target: {
        value:
          'Aplicarei curadoria docente rigorosa, transparência de uso da IA e respeito integral à LGPD e ao ECA Digital.',
      },
    });
    fireEvent.blur(essayAreas[1]);

    await waitFor(() => {
      expect(rpcMock).toHaveBeenCalledWith(
        'upsert_essay_response',
        expect.objectContaining({
          p_attempt_id: 'attempt-uuid-recovered',
          p_question_number: 2,
        })
      );
    });
  });
});
