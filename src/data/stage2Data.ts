import type { ObjectiveQuestion } from '../types/mission';

export const NOTEBOOKLM_STEPS = [
  {
    step: 1,
    title: 'Acessar o NotebookLM',
    action: 'Abra notebooklm.google.com no navegador com uma conta institucional ou pessoal autorizada.',
    whyItMatters:
      'Diferente de chats abertos que respondem a partir de toda a internet sem mostrar de onde tiraram cada frase, o NotebookLM opera ancorado nas fontes que você carrega.',
    tip: 'Confira se você está em ambiente seguro e não envie documentos contendo dados pessoais de colegas ou estudantes (LGPD, Art. 6º, III — MEC, 2026, p. 44).',
  },
  {
    step: 2,
    title: 'Criar um novo notebook',
    action: 'Clique em "Novo notebook" e dê um título claro ao seu espaço de investigação (ex.: "MEC — IA na Educação Básica").',
    whyItMatters:
      'Organizar notebooks por tema ou disciplina mantém as fontes separadas e evita misturar referências de assuntos diferentes.',
    tip: 'Você pode criar um notebook para a legislação educacional e outro para materiais didáticos de Física.',
  },
  {
    step: 3,
    title: 'Adicionar o documento do Ministério da Educação fornecido pelo professor',
    action: 'Faça upload do arquivo oficial ia-basica.pdf disponibilizado pelo professor na disciplina.',
    whyItMatters:
      'Ao usar o PDF oficial como fonte única, você restringe a investigação ao texto real do MEC (88 páginas), reduzindo o risco de informações inventadas de sites genéricos.',
    tip: 'Use o botão disponível nesta etapa para baixar uma cópia local de ia-basica.pdf caso ainda não tenha o arquivo salvo.',
  },
  {
    step: 4,
    title: 'Fazer perguntas sobre o conteúdo do documento',
    action: 'Digite comandos objetivos pedindo explicações ancoradas exclusivamente no PDF e indicando páginas ou capítulos.',
    whyItMatters:
      'Boas perguntas direcionam a busca aos capítulos corretos (ex.: Cap. 1 para conceitos de base, Cap. 3 para LGPD e ECA Digital) e evitam respostas vagas.',
    tip: 'Use os 4 prompts modelo abaixo para testar compreensão, investigação com páginas, aplicação à Física e pensamento crítico.',
  },
  {
    step: 5,
    title: 'Analisar as respostas e consultar as citações das fontes',
    action: 'Clique nos números de citação exibidos ao lado das afirmações na resposta gerada.',
    whyItMatters:
      'Cada número abre o trecho exato do PDF de onde a informação foi extraída, permitindo auditar se a síntese da IA manteve o sentido original.',
    tip: 'Nunca aceite uma frase sem abrir pelo menos as citações centrais que sustentam o argumento.',
  },
  {
    step: 6,
    title: 'Identificar de onde vieram as informações',
    action: 'Localize o capítulo, a seção, a página e eventuais leis ou autores citados dentro do próprio texto do MEC.',
    whyItMatters:
      'Assim você distingue o que é determinação normativa brasileira (ex.: LGPD e ECA Digital), o que é orientação da UNESCO e o que é síntese pedagógica do guia.',
    tip: 'Anote o número da página do PDF (ex.: Cap. 3.2, p. 43) para fundamentar seus trabalhos acadêmicos.',
  },
  {
    step: 7,
    title: 'Utilizar os resultados para construir seu próprio conhecimento',
    action: 'Leia os trechos originais no PDF, compare com suas anotações e redija sua própria análise com autoria.',
    whyItMatters:
      'O NotebookLM agiliza a localização de evidências, mas aprender exige reflexão, interpretação e responsabilidade humana (MEC, 2026, p. 49 e 51).',
    tip: 'Em Física, valide sempre conceitos, equações e unidades em livros-texto e junto ao professor.',
  },
];

export const NOTEBOOKLM_PROMPTS = [
  {
    id: 'prompt-1',
    badge: 'Prompt 1 — Compreensão',
    objective: 'Mapear as orientações centrais diretamente da fonte oficial sem extrapolação.',
    text: 'Com base exclusivamente no documento fornecido, explique quais são as principais orientações do Ministério da Educação sobre o uso responsável da inteligência artificial nas escolas.',
    whereToCheck: 'Introdução (p. 3–5), Capítulo 2.1 (p. 20) e Capítulo 3.3 (p. 49–50).',
  },
  {
    id: 'prompt-2',
    badge: 'Prompt 2 — Investigação',
    objective: 'Exigir rastreabilidade com indicação explícita das páginas do documento.',
    text: 'Quais são os principais riscos do uso de inteligência artificial na educação? Apresente as informações encontradas e indique as páginas do documento que fundamentam cada resposta.',
    whereToCheck: 'Capítulo 3.1, Tabela 5 (p. 37–41) e Capítulo 1.2 (p. 14–15).',
  },
  {
    id: 'prompt-3',
    badge: 'Prompt 3 — Aplicação na Física',
    objective: 'Conectar as diretrizes do MEC à prática de estudo das Leis de Newton sem cópia acrítica.',
    text: 'Considerando as orientações do documento, explique como um estudante poderia utilizar a inteligência artificial para aprender sobre as Leis de Newton, sem simplesmente copiar as respostas. Apresente exemplos de utilização responsável.',
    whereToCheck: 'Capítulo 1.1 (p. 8–9), Capítulo 2.2 (p. 24) e Capítulo 3.3 (p. 49–51).',
  },
  {
    id: 'prompt-4',
    badge: 'Prompt 4 — Pensamento crítico',
    objective: 'Organizar critérios de checagem e cuidados éticos fundamentados no texto.',
    text: 'Identifique quais cuidados um estudante deve ter ao utilizar respostas geradas por inteligência artificial. Organize as orientações em uma lista e fundamente cada uma no documento.',
    whereToCheck: 'Capítulo 2.3 (p. 29), Capítulo 3.2–3.3 (p. 43–44 e 51).',
  },
];

export interface InvestigatorCase {
  id: string;
  aiClaim: string;
  aiCitedPage: string;
  evidenceTitle: string;
  evidenceExcerpt: string;
  evidenceRealPage: string;
  correctActionId: 'confirmed' | 'partial_check_context' | 'hallucination';
  explanation: string;
}

export const INVESTIGATOR_ACTIONS = [
  {
    id: 'confirmed',
    label: 'Confirmada na fonte',
    description: 'O dado e a referência batem com o trecho real do documento.',
  },
  {
    id: 'partial_check_context',
    label: 'Parcial / exige leitura completa',
    description: 'Mistura conceito real com afirmação exagerada ou distorcida; exige ler o parágrafo original.',
  },
  {
    id: 'hallucination',
    label: 'Incorreta / sem respaldo no PDF',
    description: 'Cita norma, regra ou página que contradiz o texto oficial do MEC.',
  },
] as const;

export const INVESTIGATOR_CASES: InvestigatorCase[] = [
  {
    id: 'inv-1',
    aiClaim:
      'Segundo a pesquisa TIC Educação 2024 citada pelo MEC, 70% dos estudantes do Ensino Médio já utilizaram plataformas de IA generativa, mas apenas 19% dos alunos relataram ter conversado com professores sobre como usá-la.',
    aiCitedPage: 'Citado na p. 14–15',
    evidenceTitle: 'Trecho real do PDF — Cap. 1.2 (p. 14)',
    evidenceExcerpt:
      '"segundo a pesquisa TIC Educação 2024, 37% dos alunos usuários de internet afirmaram utilizar plataformas de IA generativa em pesquisas e atividades escolares e, entre os estudantes do Ensino Médio, essa proporção alcança 70%... apenas 19% dos alunos disseram ter conversado com professores sobre como usar IA generativa em atividades escolares"',
    evidenceRealPage: 'p. 14 e gráfico da p. 15',
    correctActionId: 'confirmed',
    explanation:
      'Confirmada na fonte! Mesmo quando a resposta parece exata, abrir a citação na p. 14 permite verificar que 37% refere-se ao total de alunos usuários de internet e 70% ao Ensino Médio.',
  },
  {
    id: 'inv-2',
    aiClaim:
      'O documento do MEC recomenda na página 51 que escolas substituam o julgamento avaliativo dos professores por sistemas autônomos de IA para eliminar erros humanos na correção de provas de Física.',
    aiCitedPage: 'Citado na p. 51',
    evidenceTitle: 'Trecho real do PDF — Cap. 3.3 (p. 51) e Cap. 4.2 (p. 70)',
    evidenceExcerpt:
      '"A IA pode ser uma ferramenta poderosa de apoio, mas não substitui o julgamento humano... [A IA] Não tem moralidade, não tem julgamento ético próprio. A responsabilidade final é sempre humana." (p. 51) / "As avaliações são um ponto igualmente sensível... incentivar sempre um equilíbrio dos métodos avaliativos" (p. 70).',
    evidenceRealPage: 'p. 51 e p. 70',
    correctActionId: 'hallucination',
    explanation:
      'Incorreta / contradiz o PDF! A IA citou uma página real (p. 51), mas inverteu completamente o sentido do texto. Sem abrir a fonte citada, o estudante repetiria o oposto do que o MEC orienta.',
  },
  {
    id: 'inv-3',
    aiClaim:
      'O MEC orienta que ferramentas de IA podem ser usadas para personalizar percursos de aprendizagem, logo recomenda individualizar totalmente o ensino para que cada aluno estude sozinho com chatbots.',
    aiCitedPage: 'Citado na p. 38',
    evidenceTitle: 'Trecho real do PDF — Tabela 5, item 1 (p. 38)',
    evidenceExcerpt:
      'Oportunidade: "IA adapta conteúdos às necessidades individuais..." | Risco: "Individualização excessiva pode fragmentar a experiência coletiva e reforçar limitações e vieses da IA... Os alunos deixam de resolver problemas coletivamente."',
    evidenceRealPage: 'p. 38',
    correctActionId: 'partial_check_context',
    explanation:
      'Exige leitura completa do contexto! A IA pegou apenas a coluna "Oportunidades" da Tabela 5 e omitiu a coluna "Riscos" na mesma página 38, que alerta contra a fragmentação da experiência coletiva.',
  },
  {
    id: 'inv-4',
    aiClaim:
      'O ECA Digital (Lei nº 15.211/2025) determina que plataformas acessadas por crianças e adolescentes adotem a configuração mais protetiva de privacidade por padrão e proíbe o perfilamento para direcionamento publicitário.',
    aiCitedPage: 'Citado na p. 43',
    evidenceTitle: 'Trecho real do PDF — Cap. 3.2 (p. 43)',
    evidenceExcerpt:
      '"O ECA Digital (Lei nº 15.211/2025) complementa esse arcabouço ao exigir que produtos e serviços de tecnologia direcionados e acessados por crianças e adolescentes adotem, por padrão, a configuração mais protetiva de privacidade (Art. 7º). A lei proíbe o perfilamento para direcionamento publicitário (Art. 22)..."',
    evidenceRealPage: 'p. 43 e Anexo 1 (p. 85)',
    correctActionId: 'confirmed',
    explanation:
      'Confirmada na fonte! A citação confere exatamente com o quadro normativo da p. 43 (Art. 7º e Art. 22 do ECA Digital).',
  },
];

export const STAGE2_QUESTION: ObjectiveQuestion = {
  id: 'q2_match_sources',
  stageNumber: 2,
  topicId: 'source_verification',
  topicLabel: 'Verificação de fontes e referências',
  format: 'matching',
  formatLabel: 'Associação de Conceitos',
  scenario:
    'Ao pesquisar o documento do MEC no NotebookLM para preparar um seminário sobre ética e IA na Física, você precisa relacionar cada prática de investigação ao seu papel na construção do conhecimento.',
  prompt: 'Associe cada prática investigativa (coluna esquerda) ao conceito correspondente (coluna direita):',
  matchingPairs: [
    {
      id: 'm1',
      leftItem: 'Carregar o PDF oficial do MEC como fonte única no NotebookLM',
      correctRightId: 'grounding',
    },
    {
      id: 'm2',
      leftItem: 'Clicar nas citações numeradas e conferir a página original do PDF',
      correctRightId: 'audit',
    },
    {
      id: 'm3',
      leftItem: 'Comparar o trecho citado com os objetivos da atividade e redigir sua própria síntese',
      correctRightId: 'authorship',
    },
  ],
  matchingChoices: [
    {
      id: 'grounding',
      label: 'Ancoragem em fonte confiável — reduz ruído externo e restringe a busca ao documento de referência.',
    },
    {
      id: 'audit',
      label: 'Verificação de rastreabilidade — checa se a IA não distorceu o contexto nem alucinou páginas.',
    },
    {
      id: 'authorship',
      label: 'Interpretação e julgamento humano — garante autoria, senso crítico e evita descarregamento cognitivo.',
    },
  ],
  explanationMec:
    'O uso de ferramentas fundamentadas em fontes (como o NotebookLM) apoia o letramento informacional — saber buscar, selecionar e avaliar fontes confiáveis (Cap. 2.3, p. 29) —, mas não dispensa a leitura crítica e o julgamento humano (Cap. 3.3, p. 51).',
  citation: {
    source: 'MEC — Inteligência Artificial na Educação Básica',
    chapter: 'Capítulos 2.3 e 3.3',
    page: 'p. 29 e p. 51',
  },
};

