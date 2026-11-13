import type { ObjectiveQuestion } from '../types/mission';

export const STAGE1_DILEMMA = {
  promptText:
    'Você utiliza uma inteligência artificial para fazer uma atividade escolar. Ela apresenta uma explicação convincente sobre uma lei da Física, inclui uma fórmula e até apresenta referências. Você entregaria essa resposta sem conferir?',
  simulatedAiResponse: {
    questionAsked: 'Explique a Segunda Lei de Newton e dê um exemplo aplicado.',
    generatedText:
      'A Segunda Lei de Newton (Princípio Fundamental da Dinâmica) afirma que a aceleração de um corpo é diretamente proporcional à força resultante aplicada sobre ele e inversamente proporcional à sua massa, expressa por F = m · a. Por exemplo, se um bloco de 4 kg recebe uma força resultante de 12 N, sua aceleração será de 3 m/s². Como referência, consulte HALLIDAY, D.; RESNICK, R. Fundamentos de Física, v. 1, cap. 5, p. 112 (Editora LTC, 2021) e SILVA, M. Dinâmica Clássica no Ensino Médio, Revista Brasileira de Física Aplicada, v. 18, p. 44-52, 2022.',
    clues: [
      {
        id: 'clue-tone',
        label: 'Tom confiante e fluido',
        excerpt: '"afirma que a aceleração de um corpo é diretamente proporcional..."',
        analysis:
          'Modelos de linguagem (LLMs) produzem textos gramaticalmente corretos e persuasivos estimando a sequência de palavras mais provável a partir de padrões estatísticos — não porque "compreendem" ou validam cientificamente o conteúdo (MEC, 2026, Cap. 1.1, p. 9).',
      },
      {
        id: 'clue-formula',
        label: 'Fórmula e cálculo aparentemente corretos',
        excerpt: '"F = m · a ... bloco de 4 kg recebe 12 N, aceleração de 3 m/s²"',
        analysis:
          'Embora esse cálculo simples esteja correto, a IA também omite cuidados vetoriais (força resultante é vetorial) e frequentemente comete erros de unidades ou sinais em problemas com várias forças. A conferência humana é indispensável (MEC, 2026, Cap. 3.3, p. 51).',
      },
      {
        id: 'clue-citation',
        label: 'Referências com aparência acadêmica',
        excerpt: '"SILVA, M. Dinâmica Clássica no Ensino Médio, Revista Brasileira de Física Aplicada, 2022"',
        analysis:
          'Atenção: LLMs podem gerar citações, títulos de periódicos, autores e números de página inexistentes ("alucinações") apenas combinando padrões comuns de referências bibliográficas. Nunca cite uma fonte gerada por IA sem localizá-la e lê-la (MEC, 2026, Cap. 1.1, p. 9; Cap. 4.1, p. 64).',
      },
    ],
  },
  choices: [
    {
      id: 'deliver-as-is',
      label: 'Entregaria imediatamente sem alterações, pois já traz fórmula, exemplo e referências.',
      verdict: 'Risco elevado de erro e perda de autoria',
      feedback:
        'A aparência convincente não garante veracidade. Segundo o MEC (2026, Cap. 1.1, p. 9), Grandes Modelos de Linguagem (LLMs) não "sabem" fatos no sentido convencional: eles estimam palavras prováveis e não checam espontaneamente o que produzem (Cap. 3.3, p. 51). Entregar sem conferir também compromete a integridade intelectual e provoca "descarregamento cognitivo" (Cap. 2.2, p. 24).',
    },
    {
      id: 'paraphrase-only',
      label: 'Apenas trocaria algumas palavras para não parecer cópia e entregaria assim mesmo.',
      verdict: 'Ainda vulnerável a alucinações e dependência',
      feedback:
        'Parafrasear sem verificar não corrige erros conceituais nem referências inventadas — apenas disfarça uma resposta não auditada. O documento do MEC enfatiza que o estudante precisa assumir autoria crítica, verificar fontes e evitar delegar o raciocínio à máquina (MEC, 2026, Cap. 2.2, p. 24 e 29; Cap. 3.3, p. 51).',
    },
    {
      id: 'ask-second-ai',
      label: 'Perguntaria para outra ferramenta de IA se a resposta está certa e, se concordar, entregaria.',
      verdict: 'Insuficiente: uma IA não valida cientificamente a outra',
      feedback:
        'Duas IAs podem reproduzir o mesmo erro estatístico ou viés presente nos dados de treinamento (MEC, 2026, Cap. 2.2, p. 23; Cap. 3.1, p. 38). A conferência exige fontes primárias confiáveis (livro didático, artigo real, orientação do professor) e julgamento humano (Cap. 3.3, p. 51).',
    },
    {
      id: 'verify-and-build',
      label: 'Usaria como apoio inicial, mas conferiria o conceito, as unidades e as referências no material da disciplina.',
      verdict: 'Postura investigativa e responsável',
      feedback:
        'Exato! Essa postura articula o uso da IA como recurso educativo ("aprender COM IA") com compreensão crítica ("aprender SOBRE IA"). Você evita o descarregamento cognitivo, checa possíveis alucinações nas referências e assume a responsabilidade humana pelo conteúdo (MEC, 2026, Introdução, p. 3; Cap. 1.1, p. 9; Cap. 3.3, p. 51).',
    },
  ],
};

export const BRAZIL_STATS = [
  {
    id: 'stat-37',
    value: '37%',
    label: 'dos estudantes brasileiros usuários de internet já usaram IA generativa em pesquisas e atividades escolares.',
    source: 'TIC Educação 2024 (CGI.br, 2025a) — citado em MEC, 2026, Cap. 1.2, p. 14–15.',
    accent: 'blue' as const,
  },
  {
    id: 'stat-70',
    value: '70%',
    label: 'dos estudantes do Ensino Médio afirmam já utilizar plataformas de IA generativa.',
    source: 'TIC Educação 2024 (CGI.br, 2025a) — citado em MEC, 2026, Cap. 1.2, p. 14–15.',
    accent: 'blue' as const,
  },
  {
    id: 'stat-43',
    value: '43%',
    label: 'dos professores do Ensino Fundamental e Médio relataram usar IA generativa para preparar conteúdos didáticos.',
    source: 'TIC Educação 2024 (CGI.br, 2025a) — citado em MEC, 2026, Cap. 1.2, p. 14–15.',
    accent: 'yellow' as const,
  },
];

export const MEDIATION_GAPS = [
  {
    id: 'gap-19',
    stat: '19%',
    title: 'Conversaram com professores sobre como usar IA',
    detail:
      'Apenas 19% dos alunos disseram ter conversado com docentes sobre como usar IA generativa em atividades escolares (CGI.br, 2025a — MEC, 2026, p. 14).',
  },
  {
    id: 'gap-33',
    stat: '33%',
    title: 'Receberam orientação para identificar erros e vieses',
    detail:
      'Só 33% relataram ter recebido orientações sobre como identificar conteúdos incorretos, falsos ou preconceituosos gerados por IA (CGI.br, 2025a — MEC, 2026, p. 14).',
  },
  {
    id: 'gap-49',
    stat: '49%',
    title: 'Jovens com dificuldade para avaliar falhas da IA',
    detail:
      'Estudo divulgado pela UE/OCDE mostra que 49% dos jovens de 17 a 27 anos têm dificuldade em avaliar criticamente a IA, inclusive saber se ela inventa fatos (MEC, 2026, p. 14).',
  },
  {
    id: 'gap-55-15',
    stat: '55% vs 15%',
    title: 'Aprendem nas redes sociais, não na escola',
    detail:
      'Enquanto 55% das crianças e jovens da geração Z aprendem sobre IA nas mídias sociais, apenas 15% aprendem na escola com professores (MEC, 2026, p. 14).',
  },
];

export const DUAL_NATURE_CARDS = [
  {
    id: 'dual-learning',
    title: 'Personalizar a aprendizagem',
    page: 'p. 38 (Tabela 5, item 1)',
    opportunity:
      'Adapta explicações às necessidades individuais, ajuda a identificar lacunas conceituais e permite tirar dúvidas no ritmo de estudo do aluno.',
    risk:
      'Individualização excessiva pode fragmentar a experiência coletiva em sala, trazer linguagem inadequada à etapa escolar e reforçar vieses ou erros não corrigidos.',
  },
  {
    id: 'dual-creativity',
    title: 'Estimular criatividade e autoria',
    page: 'p. 38 (Tabela 5, item 2)',
    opportunity:
      'Pode oferecer repertório inicial, analogias visuais e ideias para projetos interdisciplinares quando há mediação crítica.',
    risk:
      'Uso substitutivo reduz o trabalho a digitar prompts e entregar resultados prontos, comprometendo a integridade intelectual e expondo dados pessoais se fotos ou textos de colegas forem enviados.',
  },
  {
    id: 'dual-critical',
    title: 'Desenvolver pensamento crítico',
    page: 'p. 38 (Tabela 5, item 3)',
    opportunity:
      'Comparar respostas de diferentes fontes com a IA e verificar divergências ajuda estudantes a analisar argumentos e limitações tecnológicas.',
    risk:
      'Sem mediação pedagógica, gera confiança excessiva na primeira resposta do chatbot, aceitação acrítica de erros factuais e reprodução de vieses ideológicos ou culturais.',
  },
  {
    id: 'dual-materials',
    title: 'Elaborar materiais didáticos',
    page: 'p. 39 (Tabela 5, item 6)',
    opportunity:
      'Auxilia na produção de materiais diversificados, contextualizados à realidade local e adaptados a diferentes níveis de complexidade.',
    risk:
      'Materiais gerados podem conter erros científicos/factuais, linguagem inadequada, falta de transparência sobre fontes consultadas e violação de direitos autorais.',
  },
];

export const SOBRE_VS_COM_EXAMPLES = [
  {
    id: 'ex-1',
    text: 'Investigar como um Grande Modelo de Linguagem (LLM) estima palavras estatisticamente e por que pode gerar "alucinações".',
    correct: 'sobre' as const,
    feedback:
      'Correto: trata a IA como objeto de conhecimento para compreender seu funcionamento técnico e suas limitações (MEC, 2026, p. 3, 9 e 13).',
  },
  {
    id: 'ex-2',
    text: 'Utilizar um assistente de IA com roteiro orientado pelo professor para gerar analogias do cotidiano sobre a 1ª Lei de Newton e depois validá-las.',
    correct: 'com' as const,
    feedback:
      'Correto: aqui a IA atua como recurso educativo de apoio escolar, com intencionalidade pedagógica e validação (MEC, 2026, p. 3 e 13).',
  },
  {
    id: 'ex-3',
    text: 'Analisar como dados históricos de treinamento podem gerar vieses discriminatórios e impactos socioambientais em datacenters.',
    correct: 'sobre' as const,
    feedback:
      'Correto: integra o letramento em IA para compreender implicações éticas, sociais e ambientais do ciclo de vida da IA (MEC, 2026, p. 23–25).',
  },
  {
    id: 'ex-4',
    text: 'Usar uma ferramenta com IA para simplificar o enunciado de um exercício de Física e criar versões acessíveis revisadas pelo docente.',
    correct: 'com' as const,
    feedback:
      'Correto: utiliza a IA como ferramenta de apoio pedagógico e acessibilidade, sempre sob supervisão humana (MEC, 2026, p. 11, 13 e 40).',
  },
];

export const STAGE1_QUESTIONS: ObjectiveQuestion[] = [
  {
    id: 'q1_tf_llm_knowledge',
    stageNumber: 1,
    topicId: 'generative_ai_limits',
    topicLabel: 'Funcionamento e limitações da IA generativa',
    format: 'true_false',
    formatLabel: 'Verdadeiro ou Falso',
    scenario:
      'Durante uma roda de conversa em Informática Aplicada ao Ensino de Física, um colega afirma que modelos como o ChatGPT "sabem Física porque compreendem as causas dos fenômenos naturais e checam os fatos antes de responder".',
    prompt:
      'Julgue a afirmação: Grandes Modelos de Linguagem (LLMs) compreendem causalidade científica e verificam espontaneamente a veracidade de suas respostas antes de escrevê-las.',
    options: [
      { id: 'true', label: 'Verdadeiro' },
      { id: 'false', label: 'Falso' },
    ],
    correctOptionId: 'false',
    explanationMec:
      'Falso. O documento do MEC explica que LLMs não "sabem" coisas no sentido convencional: eles estimam a sequência de palavras mais provável a partir de padrões estatísticos em um contexto (p. 9). Além disso, a IA identifica correlações estatísticas, não compreende causalidade e não checa espontaneamente o que produz, podendo gerar informações falsas (p. 51).',
    physicsBridgeNote:
      'Na Física, confundir correlação textual com compreensão causal leva a fórmulas aplicadas fora de validade ou explicações fisicamente inconsistentes.',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 1.1 e 3.3',
      page: 'p. 9 e p. 51',
    },
  },
  {
    id: 'q1_tf_sobre_com',
    stageNumber: 1,
    topicId: 'sobre_vs_com_ia',
    topicLabel: 'Diferença entre aprender sobre IA e aprender com IA',
    format: 'true_false',
    formatLabel: 'Verdadeiro ou Falso',
    scenario:
      'Uma escola decide adotar uma plataforma de IA para apoiar tarefas de casa em Ciências da Natureza, mas decide não explicar aos estudantes como a IA funciona nem quais são seus riscos.',
    prompt:
      'Julgue a afirmação: De acordo com as diretrizes do MEC, basta treinar estudantes para operar ferramentas com IA no apoio escolar, sendo dispensável incluir o ensino SOBRE IA no currículo.',
    options: [
      { id: 'true', label: 'Verdadeiro' },
      { id: 'false', label: 'Falso' },
    ],
    correctOptionId: 'false',
    explanationMec:
      'Falso. A Diretriz 1 do documento estabelece explicitamente que "todo ensino com IA deve ser acompanhado do ensino sobre IA", assegurando de forma obrigatória a aprendizagem intencional e significativa sobre o funcionamento, limites e impactos desses sistemas (p. 20; ver também p. 3 e p. 12–13).',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Introdução e Capítulo 2.1 (Diretriz 1)',
      page: 'p. 3, p. 12–13 e p. 20',
    },
  },
  {
    id: 'q1_mc_neutrality',
    stageNumber: 1,
    topicId: 'sobre_vs_com_ia',
    topicLabel: 'Diferença entre aprender sobre IA e aprender com IA',
    format: 'multiple_choice',
    formatLabel: 'Múltipla Escolha',
    scenario:
      'Ao analisar os dados da pesquisa TIC Educação 2024 (70% dos alunos do Ensino Médio já usaram IAGen, mas só 19% conversaram com professores sobre como usá-la), uma equipe escolar debate qual abordagem adotar.',
    prompt:
      'Qual alternativa expressa corretamente a articulação proposta pelo documento do MEC entre "aprender sobre IA" e "aprender com IA"?',
    options: [
      {
        id: 'a',
        label: 'Aprender com IA significa estudar história da computação; aprender sobre IA significa delegar correções automáticas ao sistema.',
      },
      {
        id: 'b',
        label: 'Aprender sobre IA trata a tecnologia como objeto de conhecimento crítico (funcionamento, limites e ética); aprender com IA trata do uso pedagógico intencional como recurso educativo.',
      },
      {
        id: 'c',
        label: 'Como as tecnologias são neutras, o uso da IA na escola gera automaticamente melhora na aprendizagem sem necessidade de mediação docente.',
      },
      {
        id: 'd',
        label: 'O ensino sobre IA deve substituir as disciplinas tradicionais como Física e Matemática em todo o Ensino Médio.',
      },
    ],
    correctOptionId: 'b',
    explanationMec:
      'O documento define que o ensino/aprendizagem SOBRE IA aborda a IA como objeto de conhecimento (funcionamento, limites e implicações sociais), enquanto o ensino/aprendizagem COM IA envolve decisões intencionais sobre se, quando e como usá-la como recurso educativo (p. 3, p. 8 e p. 13). Além disso, o MEC destaca que não existe neutralidade tecnológica (p. 37).',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Introdução, Cap. 1.1 e Cap. 3.1',
      page: 'p. 3, p. 8, p. 13 e p. 37',
    },
  },
];

