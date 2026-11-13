import type { ObjectiveQuestion, PromptLabConfig } from '../types/mission';

export const STAGE4_SCENARIO = {
  promptText:
    'Você precisa preparar um material educativo sobre as Leis de Newton para auxiliar estudantes que estão com dificuldades de aprendizagem. Como poderia utilizar a inteligência artificial nesse processo?',
  possibilities: [
    {
      id: 'pos-simplified',
      title: 'Explicação simplificada sobre as três leis',
      howAiHelps:
        'Gerar versões em linguagem acessível com foco conceitual antes do formalismo algébrico.',
      physicsCaution:
        'Verifique se a simplificação não introduz concepções alternativas erradas (como associar força à velocidade em vez de variação de movimento).',
      mecGround: 'Cap. 1.1 (p. 11 — ampliação da acessibilidade) e Princípio 3 (p. 49).',
    },
    {
      id: 'pos-everyday',
      title: 'Exemplos relacionados ao cotidiano',
      howAiHelps:
        'Propor situações próximas da realidade local dos estudantes (ônibus freando, bicicleta, esportes, rampas).',
      physicsCaution:
        'Confira referenciais inerciais e identifique todas as forças reais (evite misturar "força centrífuga" fictícia sem explicar o referencial).',
      mecGround: 'Diretriz 4 (p. 20 — aprendizagens centradas na sociedade/comunidade local).',
    },
    {
      id: 'pos-questions',
      title: 'Perguntas para revisar o conteúdo',
      howAiHelps:
        'Criar questões diagnósticas graduais com pistas formativas para identificar dificuldades conceituais.',
      physicsCaution:
        'Resolva integralmente cada questão antes de aplicar: IAs erram contas intermediárias, sinais vetoriais e unidades.',
      mecGround: 'Cap. 1.1 (p. 10–11) e Princípio 2 (p. 49 — evitar descarregamento cognitivo).',
    },
    {
      id: 'pos-lesson-plan',
      title: 'Organizar um roteiro de aula',
      howAiHelps:
        'Estruturar sequência didática com problematização inicial, discussão coletiva, experimentação e síntese.',
      physicsCaution:
        'Garanta momentos sem tela e trabalho em grupo: a autoria pedagógica e a mediação docente são insubstituíveis.',
      mecGround: 'Cap. 3.3 (Princípio 8, p. 50) e Cap. 4.2 (p. 68–70).',
    },
    {
      id: 'pos-experiments',
      title: 'Sugerir experimentos simples',
      howAiHelps:
        'Listar montagens de baixo custo (cartão e moeda para inércia, carrinhos/balões para ação e reação) com materiais da escola.',
      physicsCaution:
        'Teste previamente o roteiro experimental para assegurar segurança física e coerência das grandezas observadas.',
      mecGround: 'Cap. 2.4 / Quadro de IA desplugada (p. 35 — experiências concretas e colaborativas).',
    },
    {
      id: 'pos-analogies',
      title: 'Produzir analogias e situações-problema',
      howAiHelps:
        'Construir situações investigativas que convidem o estudante a formular hipóteses antes de calcular.',
      physicsCaution:
        'Toda analogia tem limites; explicite onde a comparação funciona e onde ela deixa de representar o modelo físico.',
      mecGround: 'Cap. 2.2 (Aprendizagem 7, p. 24 — aprendizagem autorregulada e analítica).',
    },
    {
      id: 'pos-formats',
      title: 'Materiais em diferentes formatos e níveis de complexidade',
      howAiHelps:
        'Adaptar roteiros visuais, resumos passo a passo e descrições textuais para estudantes com necessidades educacionais específicas.',
      physicsCaution:
        'Valide acessibilidade real com o docente e o AEE e jamais insira dados pessoais ou laudos dos alunos no prompt.',
      mecGround: 'Cap. 1.1 (p. 11), Tabela 5, item 9 (p. 40) e LGPD (p. 43).',
    },
  ],
};

export const PROMPT_LAB_OPTIONS = {
  goals: [
    { id: 'explicacao', label: 'Explicação simplificada das três leis' },
    { id: 'cotidiano', label: 'Exemplos e situações-problema do cotidiano' },
    { id: 'revisao', label: 'Perguntas de revisão com pistas formativas' },
    { id: 'roteiro', label: 'Roteiro de aula com momentos sem IA' },
    { id: 'experimento', label: 'Sugestão de experimento simples de baixo custo' },
    { id: 'inclusivo', label: 'Material adaptado em níveis de complexidade' },
  ],
  physicsTopics: [
    { id: 'todas', label: 'As três Leis de Newton integradas' },
    { id: '1lei', label: '1ª Lei de Newton — Princípio da Inércia' },
    { id: '2lei', label: '2ª Lei de Newton — Princípio Fundamental da Dinâmica (F_R = m·a)' },
    { id: '3lei', label: '3ª Lei de Newton — Ação e Reação (corpos distintos)' },
  ],
  difficulties: [
    { id: 'iniciante', label: 'Recomposição / Dificuldade inicial (linguagem acessível, passo a passo)' },
    { id: 'intermediario', label: 'Ensino Médio regular (conceitual + aplicações no SI)' },
    { id: 'aprofundado', label: 'Aprofundamento (análise vetorial e diagramas de corpo livre)' },
  ],
  formats: [
    { id: 'guia_passos', label: 'Guia visual estruturado em tópicos e exemplos' },
    { id: 'analogias_problemas', label: '3 analogias comentadas + 2 situações-problema' },
    { id: 'roteiro_experimento', label: 'Roteiro experimental com materiais acessíveis' },
    { id: 'quiz_socratico', label: 'Roteiro de perguntas orientadoras (sem entregar resposta pronta)' },
  ],
  safeguards: [
    {
      id: 'si_units',
      label: 'Exigir todas as grandezas e cálculos no Sistema Internacional (SI: N, kg, m/s²)',
    },
    {
      id: 'no_direct_answer',
      label: 'Solicitar dicas graduais para evitar "descarregamento cognitivo" (não dar resposta pronta)',
    },
    {
      id: 'flag_limits',
      label: 'Pedir alerta explícito sobre erros comuns e não inventar referências bibliográficas',
    },
    {
      id: 'no_pii',
      label: 'Não informar nomes, turmas ou dados pessoais dos estudantes no comando (LGPD)',
    },
  ],
};

export const DEFAULT_PROMPT_CONFIG: PromptLabConfig = {
  goal: 'explicacao',
  physicsTopic: 'todas',
  difficulty: 'iniciante',
  format: 'guia_passos',
  safeguards: ['si_units', 'no_direct_answer', 'flag_limits', 'no_pii'],
};

export function buildStructuredPhysicsPrompt(config: PromptLabConfig): {
  prompt: string;
  anatomy: { part: string; why: string }[];
} {
  const goalLabel = PROMPT_LAB_OPTIONS.goals.find((g) => g.id === config.goal)?.label ?? '';
  const topicLabel = PROMPT_LAB_OPTIONS.physicsTopics.find((t) => t.id === config.physicsTopic)?.label ?? '';
  const diffLabel = PROMPT_LAB_OPTIONS.difficulties.find((d) => d.id === config.difficulty)?.label ?? '';
  const formatLabel = PROMPT_LAB_OPTIONS.formats.find((f) => f.id === config.format)?.label ?? '';

  const safeguardLines = config.safeguards
    .map((id) => PROMPT_LAB_OPTIONS.safeguards.find((s) => s.id === id)?.label)
    .filter(Boolean)
    .map((text) => `- ${text}`)
    .join('\n');

  const prompt = `Atue como um auxiliar de planejamento didático em Ensino de Física (sem substituir a mediação do professor).

OBJETIVO PEDAGÓGICO:
Preparar um rascunho de material educativo focado em: ${goalLabel}.

CONTEÚDO DE FÍSICA:
${topicLabel}.

NÍVEL E PERFIL DA ATIVIDADE (sem dados pessoais):
${diffLabel}.

FORMATO DESEJADO:
${formatLabel}.

CRITÉRIOS DE RIGOR CIENTÍFICO E USO RESPONSÁVEL:
- Diferencie claramente força resultante de forças individuais e explique o caráter vetorial quando pertinente.
- Indique explicitamente eventuais limites das analogias utilizadas.
${safeguardLines || '- Estruture o conteúdo de forma clara para posterior revisão técnica do professor.'}
- Ao final, apresente um checklist do que precisa ser conferido em livro didático de Física antes da aplicação em sala.`;

  const anatomy = [
    {
      part: 'Papel e limite da IA',
      why: 'Delimita a ferramenta como apoio ao planejamento sob revisão docente, alinhado ao Princípio 1 do MEC (p. 49).',
    },
    {
      part: 'Objetivo + Conteúdo + Nível + Formato',
      why: 'Reduz respostas genéricas e alinha o rascunho às necessidades reais de aprendizagem (Tabela 5, item 6, p. 39).',
    },
    {
      part: 'Critérios científicos e salvaguardas',
      why: 'Previne erros no SI, evita respostas prontas ("descarregamento cognitivo", p. 24 e 49), protege dados pessoais (LGPD, p. 43) e coíbe referências inventadas.',
    },
  ];

  return { prompt, anatomy };
}

export interface PhysicsAuditIssue {
  id: string;
  snippet: string;
  category: string;
  explanation: string;
}

export const PHYSICS_AUDIT_SAMPLE = {
  title: 'Rascunho gerado por IA externa — "Resumo rápido: 2ª e 3ª Leis de Newton"',
  segments: [
    {
      id: 'seg-intro',
      text: 'As Leis de Newton descrevem a relação entre forças e movimento na Mecânica Clássica.',
      issueId: null,
    },
    {
      id: 'seg-err-1',
      text: 'Por exemplo, se um carro de massa 1.000 kg recebe uma aceleração equivalente a atingir 72 km/h em 4 s, basta multiplicar 1.000 × (72 / 4) = 18.000 N de força resultante.',
      issueId: 'err-units',
    },
    {
      id: 'seg-mid',
      text: 'Na aplicação prática, é sempre necessário construir o diagrama de corpo livre considerando todas as interações.',
      issueId: null,
    },
    {
      id: 'seg-err-2',
      text: 'Já pela Terceira Lei de Newton, quando um livro repousa sobre uma mesa, a força peso e a força normal sobre o livro formam um par ação e reação, pois têm o mesmo módulo e sentidos opostos.',
      issueId: 'err-concept',
    },
    {
      id: 'seg-err-3',
      text: 'Fonte obrigatória citada: NEWTON, I.; EINSTEIN, A. Dinâmica Escolar Brasileira: Manual do MEC para Física, 4ª ed., p. 312, 2024.',
      issueId: 'err-citation',
    },
  ],
  issues: [
    {
      id: 'err-units',
      snippet: '1.000 × (72 / 4) = 18.000 N',
      category: 'Erro de unidade de medida e cálculo',
      explanation:
        'A IA dividiu 72 km/h por 4 s sem converter para m/s! 72 km/h = 20 m/s. Logo, a = 20 / 4 = 5 m/s², e F_R = 1.000 kg × 5 m/s² = 5.000 N (e não 18.000 N).',
    },
    {
      id: 'err-concept',
      snippet: 'peso e normal sobre o livro formam um par ação e reação',
      category: 'Erro conceitual clássico em Física',
      explanation:
        'Peso (atração da Terra sobre o livro) e Normal (empurrão da mesa sobre o livro) atuam no MESMO corpo e não são um par ação-reação! Pares da 3ª Lei atuam sempre em corpos distintos e têm a mesma natureza física.',
    },
    {
      id: 'err-citation',
      snippet: 'NEWTON, I.; EINSTEIN, A. Dinâmica Escolar Brasileira... 2024',
      category: 'Alucinação bibliográfica',
      explanation:
        'Referência totalmente fabricada pela IA combinando nomes famosos e termos educacionais. Sempre verifique fontes em livros didáticos e bases confiáveis (MEC, 2026, p. 9 e 29).',
    },
  ] as PhysicsAuditIssue[],
};

export const STAGE4_QUESTION: ObjectiveQuestion = {
  id: 'q4_cond_physics_hallucination',
  stageNumber: 4,
  topicId: 'hallucinations_accuracy',
  topicLabel: 'Alucinações e informações incorretas',
  format: 'best_conduct',
  formatLabel: 'Escolha da Melhor Conduta',
  scenario:
    'Ao preparar uma lista de exercícios sobre a 2ª Lei de Newton para alunos com dificuldade, você usou um prompt bem estruturado em uma ferramenta de IA, mas notou que em uma das questões a ferramenta misturou km/h com kg para obter Newtons e citou um artigo inexistente.',
  prompt: 'Qual é a melhor conduta pedagógica e científica diante desse resultado?',
  options: [
    {
      id: 'a',
      label: 'Manter a questão e apenas pedir aos alunos que ignorem a referência, já que o texto explicativo parecia claro.',
    },
    {
      id: 'b',
      label: 'Desistir de qualquer material de revisão e copiar um gabarito pronto de outro site sem analisar.',
    },
    {
      id: 'c',
      label: 'Corrigir manualmente a conversão para m/s², recalcular em N, substituir a referência por uma fonte real consultada e revisar todos os demais itens.',
    },
    {
      id: 'd',
      label: 'Pedir à mesma IA para "não errar da próxima vez" e publicar imediatamente o novo texto gerado sem conferir novamente.',
    },
  ],
  correctOptionId: 'c',
  explanationMec:
    'Conforme os Princípios 2, 3 e 10 do MEC (p. 49–50) e o quadro "O que a IA faz e o que só o ser humano pode fazer" (p. 51), sistemas de IA não realizam autocrítica espontânea e podem produzir erros factuais e alucinações. Cabe ao estudante e ao professor exercer supervisão humana, validar cálculos, unidades e referências reais antes de qualquer uso pedagógico.',
  citation: {
    source: 'MEC — Inteligência Artificial na Educação Básica',
    chapter: 'Capítulos 3.1 (Tabela 5) e 3.3',
    page: 'p. 39, p. 49 e p. 51',
  },
};

