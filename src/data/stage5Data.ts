import type { ObjectiveQuestion } from '../types/mission';

export const STAGE5_QUESTIONS: ObjectiveQuestion[] = [
  {
    id: 'q5_sit_algorithmic_bias',
    stageNumber: 5,
    topicId: 'algorithmic_bias',
    topicLabel: 'Vieses algorítmicos e discriminação',
    format: 'situation_identification',
    formatLabel: 'Identificação de Situação',
    scenario:
      'Uma escola testa um sistema automatizado de pré-correção de redações e respostas abertas de Ciências. Os docentes percebem que o sistema atribui notas sistematicamente menores a textos com variações linguísticas regionais nordestinas e privilegia respostas padronizadas em detrimento de explicações criativas.',
    prompt: 'Qual fenômeno apontado no documento do MEC está ocorrendo nesse caso?',
    options: [
      {
        id: 'a',
        label: 'Apenas erro de digitação dos estudantes, pois sistemas algorítmicos são matematicamente neutros e imparciais.',
      },
      {
        id: 'b',
        label: 'Viés algorítmico e padronização avaliativa, que podem reproduzir preconceitos de linguagem/origem e penalizar a criatividade.',
      },
      {
        id: 'c',
        label: 'Cumprimento adequado da BNCC, já que a padronização elimina a subjetividade docente.',
      },
      {
        id: 'd',
        label: 'Falta de coleta biométrica dos estudantes durante a realização da prova.',
      },
    ],
    correctOptionId: 'b',
    explanationMec:
      'Na Tabela 5 (item 7, p. 40), o MEC exemplifica exatamente que sistemas automatizados podem penalizar variações linguísticas regionais e estruturas criativas enquanto atribuem notas altas a textos genéricos. Além disso, o documento destaca a importância de identificar e neutralizar vieses algorítmicos (Aprendizagem 6, p. 23; Princípio 7 — Equidade, p. 50 e 56).',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 2.2, 3.1 (Tabela 5) e 3.3',
      page: 'p. 23, p. 40, p. 50 e p. 56',
    },
  },
  {
    id: 'q5_cond_human_oversight',
    stageNumber: 5,
    topicId: 'human_oversight',
    topicLabel: 'Supervisão humana',
    format: 'best_conduct',
    formatLabel: 'Escolha da Melhor Conduta',
    scenario:
      'Um sistema preditivo de gestão escolar emite alertas de "alto risco de reprovação e evasão" para alguns alunos de Física com base apenas em frequência e notas antigas, sugerindo separá-los em turmas diferenciadas sem ouvir a equipe docente.',
    prompt: 'Qual conduta respeita as orientações do MEC sobre supervisão humana e prevenção de estigmatização?',
    options: [
      {
        id: 'a',
        label: 'Executar automaticamente a enturmação sugerida pelo algoritmo para economizar tempo da coordenação.',
      },
      {
        id: 'b',
        label: 'Usar o alerta apenas como sinal inicial para acionar busca ativa e diálogo qualitativo com professores, estudantes e famílias, mantendo a decisão humana.',
      },
      {
        id: 'c',
        label: 'Divulgar o ranking de risco dos alunos no mural digital da turma para estimular competição.',
      },
      {
        id: 'd',
        label: 'Instalar câmeras com reconhecimento emocional em sala para confirmar o desinteresse dos estudantes.',
      },
    ],
    correctOptionId: 'b',
    explanationMec:
      'Na Tabela 5 (item 10, p. 41), o MEC contrasta oportunidade e risco: alertas precoces podem apoiar busca ativa e suporte social, mas decisões baseadas apenas em algoritmos sem contexto qualitativo e sem consultar professores e famílias reforçam estigmatização. O Princípio 6 (p. 50) também rejeita vigilância biométrica/emocional massiva.',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 3.1 (Tabela 5), 3.3 e 4.2',
      page: 'p. 41, p. 50–51 e p. 68–70',
    },
  },
  {
    id: 'q5_match_intentional_use',
    stageNumber: 5,
    topicId: 'intentional_pedagogical_use',
    topicLabel: 'Uso pedagógico intencional da IA',
    format: 'matching',
    formatLabel: 'Associação de Conceitos',
    scenario:
      'Para implementar soluções com IA em uma escola alinhadas ao Capítulo 3.3 e ao Capítulo 2.1 do documento do MEC, relacione cada princípio orientador à sua aplicação prática.',
    prompt: 'Associe cada princípio do MEC à decisão pedagógica correspondente:',
    matchingPairs: [
      {
        id: 'p1',
        leftItem: 'Intencionalidade pedagógica e centralidade humana (Princípio 1)',
        correctRightId: 'superior_to_analog',
      },
      {
        id: 'p2',
        leftItem: 'Salvaguardas de aprendizagem e pensamento crítico (Princípio 2)',
        correctRightId: 'avoid_offloading',
      },
      {
        id: 'p3',
        leftItem: 'Proporcionalidade e não-dependência (Princípio 9 e Cap. 3.2)',
        correctRightId: 'keep_alternatives',
      },
    ],
    matchingChoices: [
      {
        id: 'superior_to_analog',
        label: 'Adotar IA somente quando houver ganho educativo claro frente a soluções sem IA, preservando a autonomia docente.',
      },
      {
        id: 'avoid_offloading',
        label: 'Mediar atividades para evitar "descarregamento cognitivo" e estimular raciocínio próprio dos alunos.',
      },
      {
        id: 'keep_alternatives',
        label: 'Avaliar se o risco/custo compensa e garantir continuidade pedagógica caso a plataforma falhe ou seja descontinuada.',
      },
    ],
    explanationMec:
      'Os Princípios 1, 2 e 9 (p. 49–50) e o critério de proporcionalidade (p. 42 e 44) reforçam que IA não deve ser usada por modismo: exige ganho pedagógico real, prevenção da atrofia cognitiva e autonomia frente a fornecedores proprietários.',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 3.2 e 3.3',
      page: 'p. 42, p. 44 e p. 49–50',
    },
  },
  {
    id: 'q5_tf_authorship_responsibility',
    stageNumber: 5,
    topicId: 'authorship_responsibility',
    topicLabel: 'Autoria e responsabilidade pelo conteúdo produzido',
    format: 'true_false',
    formatLabel: 'Verdadeiro ou Falso',
    scenario:
      'Ao publicar um guia didático sobre Física Térmica coproduzido com apoio de uma IA generativa, um futuro professor argumenta que, caso haja erro científico ou plágio de obra protegida no texto, a responsabilidade legal e ética é exclusivamente da empresa criadora da IA.',
    prompt:
      'Julgue a afirmação: Quando uma ferramenta de IA produz um conteúdo didático com erro factual ou trecho sem citação de autoria, a responsabilidade final recai apenas sobre o sistema de IA, eximindo o usuário humano.',
    options: [
      { id: 'true', label: 'Verdadeiro' },
      { id: 'false', label: 'Falso' },
    ],
    correctOptionId: 'false',
    explanationMec:
      'Falso! No quadro "O que a IA faz e o que só o ser humano pode fazer" (p. 51), o documento do MEC afirma categoricamente: a IA "não tem moralidade, não tem julgamento ético próprio. A responsabilidade final é sempre humana". Além disso, a Tabela 5 (item 6, p. 39) alerta sobre riscos de direitos autorais e transparência nas fontes.',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 3.1 (Tabela 5) e 3.3',
      page: 'p. 39 e p. 51',
    },
  },
  {
    id: 'q5_mc_teacher_autonomy',
    stageNumber: 5,
    topicId: 'intentional_pedagogical_use',
    topicLabel: 'Uso pedagógico intencional da IA',
    format: 'multiple_choice',
    formatLabel: 'Múltipla Escolha',
    scenario:
      'Uma rede de ensino adquire uma plataforma comercial com IA e passa a exigir que todos os professores de Ciências da Natureza adotem exclusivamente os roteiros automáticos gerados pelo sistema, monitorando quantos minutos cada docente passa usando o app.',
    prompt:
      'À luz do Capítulo 4.2 e do Princípio 3/5 do documento do MEC, como essa política deve ser avaliada?',
    options: [
      {
        id: 'a',
        label: 'Adequada, pois garante padronização absoluta das aulas de Física em todas as escolas da rede.',
      },
      {
        id: 'b',
        label: 'Inadequada, pois viola a autonomia didático-pedagógica docente e transforma dados de uso da plataforma em vigilância e pressão institucional.',
      },
      {
        id: 'c',
        label: 'Adequada, desde que os alunos também utilizem a plataforma por pelo menos 4 horas extras em casa.',
      },
      {
        id: 'd',
        label: 'Indiferente ao documento do MEC, que trata apenas de softwares administrativos sem relação com o trabalho docente.',
      },
    ],
    correctOptionId: 'b',
    explanationMec:
      'O Capítulo 4.2 (p. 68–70) e a Tabela 5 (item 4, p. 39) defendem o professor no centro das decisões pedagógicas, com autoridade epistêmica para avaliar, adaptar ou recusar ferramentas sem sofrer penalizações, além de proibir o uso de métricas de plataformas para monitoramento ou ranqueamento docente.',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 3.1 (Tabela 5) e 4.2',
      page: 'p. 39 e p. 68–70',
    },
  },
];

