import type { StageMeta } from '../types/mission';

export type ReferenceCategory =
  | 'base_mec'
  | 'legislacao_br'
  | 'normativos_mec'
  | 'unesco_internacional';

export interface ReferenceItem {
  id: string;
  category: ReferenceCategory;
  categoryLabel: string;
  title: string;
  citation: string;
  summary: string;
  pagesInMecPdf: string;
  url?: string;
}

export const STAGES_META: StageMeta[] = [
  {
    id: 1,
    shortTitle: 'Etapa 1',
    title: 'A IA já faz parte da sua vida?',
    subtitle: 'Dilema inicial, dados brasileiros e a diferença entre aprender SOBRE IA e COM IA',
    achievementId: 'ach_stage_1',
    achievementTitle: 'Olhar Investigativo',
    achievementDescription: 'Analisou dados do cenário brasileiro e diferenciou ensino SOBRE IA e COM IA.',
    mecScope: 'Introdução e Capítulo 1 (p. 3, 8–15, 20)',
  },
  {
    id: 2,
    shortTitle: 'Etapa 2',
    title: 'Laboratório de Investigação: NotebookLM',
    subtitle: 'Pesquisa fundamentada em fontes documentais e verificação de citações',
    achievementId: 'ach_stage_2',
    achievementTitle: 'Investigador de Fontes',
    achievementDescription: 'Dominou o fluxo de pesquisa ancorada em fontes e confrontou afirmações de IA com o PDF do MEC.',
    mecScope: 'Capítulos 1.1, 2.3 e 3.3 (p. 9, 29, 51)',
  },
  {
    id: 3,
    shortTitle: 'Etapa 3',
    title: 'Central de Decisões: ética ou irresponsabilidade?',
    subtitle: 'Condutas escolares, Semáforo da Ética Digital, LGPD e ECA Digital',
    achievementId: 'ach_stage_3',
    achievementTitle: 'Guardião da Ética Digital',
    achievementDescription: 'Avaliou situações escolares reais à luz dos princípios do MEC, da LGPD e do ECA Digital.',
    mecScope: 'Capítulos 3.1 a 3.4 (p. 37–56, 85)',
  },
  {
    id: 4,
    shortTitle: 'Etapa 4',
    title: 'Física + Inteligência Artificial',
    subtitle: 'Laboratório de prompts para as Leis de Newton e auditoria científica',
    achievementId: 'ach_stage_4',
    achievementTitle: 'Engenheiro de Prompts Crítico',
    achievementDescription: 'Construiu prompts estruturados para o ensino de Física e auditou erros conceituais gerados por IA.',
    mecScope: 'Capítulos 2.2, 3.1, 3.3 e 4.2 (p. 24, 39, 49–51, 70)',
  },
  {
    id: 5,
    shortTitle: 'Etapa 5',
    title: 'Desafio Final: você decide!',
    subtitle: 'Decisões práticas sobre vieses, supervisão humana, LGPD, autoria e intencionalidade',
    achievementId: 'ach_stage_5',
    achievementTitle: 'Critério e Supervisão Humana',
    achievementDescription: 'Completou todos os cenários decisórios integradores fundamentados no documento do MEC.',
    mecScope: 'Capítulos 1, 2, 3 e 4 (síntese normativa)',
  },
  {
    id: 6,
    shortTitle: 'Etapa 6',
    title: 'Sua opinião importa',
    subtitle: 'Duas questões discursivas obrigatórias sobre reflexão crítica, autoria e futuro docente',
    achievementId: 'ach_stage_6',
    achievementTitle: 'Autoria Responsável',
    achievementDescription: 'Registrou suas reflexões autorais sobre verificação científica e ensino responsável de Física.',
    mecScope: 'Capítulos 2, 3 e 4 (autoria, ética e formação docente)',
  },
];

export const MEC_DOCUMENT_INFO = {
  title:
    'Inteligência Artificial na Educação Básica: Documento orientador sobre caminhos curriculares e práticas éticas de uso de IA nas escolas',
  institution:
    'Ministério da Educação (MEC) — Secretaria de Educação Básica (SEB) / Diretoria de Apoio à Gestão Educacional (DAGE)',
  cooperation:
    'Cooperação UNESCO — Projeto 914BRZ1157 (Futuros da Educação no Brasil)',
  year: '2026',
  authors: 'Elaboração de conteúdo: Paula Menezes e Flora Ariza • Design e Diagramação: Patrícia Jatobá',
  chapters: [
    {
      number: 'Cap. 1',
      title: 'Orientações de base sobre IA na educação',
      pages: 'p. 7–17',
      highlights: 'Definição de IA, IAGen e LLMs; aprender com/sobre IA; TIC Educação 2024; panorama normativo.',
    },
    {
      number: 'Cap. 2',
      title: 'Como construir currículos para a aprendizagem sobre a Inteligência Artificial?',
      pages: 'p. 18–35',
      highlights: '7 diretrizes; 12 aprendizagens fundamentais; BNCC Computação e Resolução CNE/CEB nº 2/2025; IA desplugada.',
    },
    {
      number: 'Cap. 3',
      title: 'Como orientar ações sobre o uso de IA na educação?',
      pages: 'p. 36–58',
      highlights: '10 usos (oportunidades e riscos); LGPD e ECA Digital; 4 critérios de avaliação; 10 princípios fundamentais; boas práticas.',
    },
    {
      number: 'Cap. 4',
      title: 'Como organizar a formação de professores?',
      pages: 'p. 59–70',
      highlights: 'Marco da UNESCO para professores; Referencial de Saberes Digitais Docentes (RSDD); 4 domínios formativos; autonomia docente.',
    },
    {
      number: 'Cap. 5',
      title: 'Por onde começar? Integrando ensino sobre e ensino com IA',
      pages: 'p. 71–76',
      highlights: 'Iniciativas estaduais (PI, CE, SE); 10 recomendações aos gestores; mapa síntese das dimensões.',
    },
  ],
};

export const REFERENCE_LIBRARY: ReferenceItem[] = [
  {
    id: 'ref-mec-2026',
    category: 'base_mec',
    categoryLabel: 'Documento Base',
    title: 'Inteligência Artificial na Educação Básica (Documento Orientador MEC)',
    citation:
      'BRASIL. Ministério da Educação. Secretaria de Educação Básica (SEB). Inteligência Artificial na Educação Básica: documento orientador sobre caminhos curriculares e práticas éticas de uso de IA nas escolas. Brasília: MEC / UNESCO, 2026.',
    summary:
      'Documento orientador principal desta atividade. Estabelece a articulação entre o ensino SOBRE IA e o ensino COM IA, diretrizes curriculares, princípios éticos, conformidade legal (LGPD e ECA Digital) e formação docente.',
    pagesInMecPdf: 'p. 1–88 (documento completo)',
  },
  {
    id: 'ref-mec-referencial-2026',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Referencial para o Uso e Desenvolvimento Responsáveis de IA na Educação (MEC/SEGAPE)',
    citation:
      'BRASIL. Ministério da Educação. SEGAPE. Referencial para o Uso e Desenvolvimento Responsáveis de Inteligência Artificial na Educação. Brasília: MEC, 2026.',
    summary:
      'Referencial geral do MEC ao qual o documento da Educação Básica se alinha e complementa, definindo bases para integração ética da IA no ensino e na pesquisa.',
    pagesInMecPdf: 'p. 3 e p. 77',
    url: 'https://www.gov.br/mec/pt-br/media/segape/referencial-oficial-pt.pdf',
  },
  {
    id: 'ref-lgpd',
    category: 'legislacao_br',
    categoryLabel: 'Legislação Brasileira',
    title: 'LGPD — Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)',
    citation:
      'BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.',
    summary:
      'Determina princípios de finalidade, necessidade (minimização da coleta de dados — Art. 6º, III) e transparência. Exige consentimento específico de pais ou responsáveis para dados de crianças (Art. 14), protege dados sensíveis (Art. 11) e proíbe tratamento discriminatório.',
    pagesInMecPdf: 'p. 4, 17, 42–44, 47, 50, 56, 85',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
  },
  {
    id: 'ref-eca-digital',
    category: 'legislacao_br',
    categoryLabel: 'Legislação Brasileira',
    title: 'ECA Digital — Estatuto Digital da Criança e do Adolescente (Lei nº 15.211/2025)',
    citation:
      'BRASIL. Lei nº 15.211, de 17 de setembro de 2025. Dispõe sobre a proteção de crianças e de adolescentes em ambientes digitais (Estatuto Digital da Criança e do Adolescente). Brasília, DF, 2025.',
    summary:
      'Adota o melhor interesse da criança como parâmetro de design. Exige configuração mais protetiva de privacidade por padrão (Art. 7º), avaliação de riscos à segurança e saúde (Art. 8º), proíbe perfilamento publicitário de menores (Art. 22) e impõe verificação confiável de idade e supervisão parental.',
    pagesInMecPdf: 'p. 4, 17, 42–44, 47, 50, 56–57, 85',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15211.htm',
  },
  {
    id: 'ref-cne-2-2025',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Resolução CNE/CEB nº 2/2025 — Educação Digital e Midiática',
    citation:
      'CONSELHO NACIONAL DE EDUCAÇÃO. Resolução CNE/CEB nº 2, de 21 de março de 2025. Diretrizes Operacionais Nacionais sobre o uso de dispositivos digitais em espaços escolares e integração curricular de educação digital e midiática.',
    summary:
      'Define Educação Digital e Midiática como área interdisciplinar articulada à BNCC Computação e à Lei nº 14.533/2023 (PNED), integrando cultura digital, mundo digital e pensamento computacional.',
    pagesInMecPdf: 'p. 17, 19, 21–22, 28, 77–78, 84',
    url: 'https://www.gov.br/mec/pt-br/cne/2025/marco/rceb002_25.pdf',
  },
  {
    id: 'ref-pned',
    category: 'legislacao_br',
    categoryLabel: 'Legislação Brasileira',
    title: 'Lei nº 14.533/2023 — Política Nacional de Educação Digital (PNED)',
    citation:
      'BRASIL. Lei nº 14.533, de 11 de janeiro de 2023. Institui a Política Nacional de Educação Digital (PNED).',
    summary:
      'Estrutura a educação digital escolar em eixos de inclusão digital, capacitação e cidadania digital por meio de competências em cultura digital, mundo digital e pensamento computacional.',
    pagesInMecPdf: 'p. 22, 84',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14533.htm',
  },
  {
    id: 'ref-lei-15100',
    category: 'legislacao_br',
    categoryLabel: 'Legislação Brasileira',
    title: 'Lei nº 15.100/2025 — Aparelhos Eletrônicos Portáteis nas Escolas',
    citation:
      'BRASIL. Lei nº 15.100, de 2025. Dispõe sobre a utilização, por estudantes, de aparelhos eletrônicos portáteis pessoais nos estabelecimentos públicos e privados de ensino da educação básica.',
    summary:
      'Veda o uso de aparelhos portáteis pessoais para fins não pedagógicos na rotina escolar, preservando exceções para fins pedagógicos, acessibilidade (tecnologia assistiva) e saúde.',
    pagesInMecPdf: 'p. 84',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15100.htm',
  },
  {
    id: 'ref-classind-2025',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Guia de Classificação Indicativa — Interatividade e IA (MJSP, 2025)',
    citation:
      'BRASIL. Ministério da Justiça e Segurança Pública. Classificação Indicativa: guia prático de audiovisual, aplicativos e RPG. Brasília: MJSP, 2025.',
    summary:
      'Seu capítulo sobre Interatividade traz diretrizes claras de adequação por faixa etária para o uso de IA por crianças e adolescentes, inclusive em contextos educacionais.',
    pagesInMecPdf: 'p. 42–43, 77, 85',
    url: 'https://www.gov.br/mj/pt-br/assuntos/seus-direitos/classificacao-1/paginas-classificacao-indicativa/guia-de-classificacao',
  },
  {
    id: 'ref-rsdd-2024',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Referencial de Saberes Digitais Docentes — RSDD (MEC, 2024)',
    citation:
      'BRASIL. Ministério da Educação. Referencial de Saberes Digitais Docentes. Brasília: MEC, 2024.',
    summary:
      'Estrutura 3 dimensões (Ensino e Aprendizagem com Tecnologias Digitais, Cidadania Digital, Desenvolvimento Profissional) e 10 Saberes Docentes (SD 1.1 a 3.3), apoiados pelo autodiagnóstico no AVAMEC.',
    pagesInMecPdf: 'p. 4, 62–63, 77, 84',
    url: 'https://www.gov.br/mec/pt-br/escolas-conectadas/20240822MatrizSaberesDigitais.pdf',
  },
  {
    id: 'ref-tic-educacao',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Pesquisa TIC Educação 2024 e Estudo IA na Educação (CGI.br / Cetic.br, 2025)',
    citation:
      'COMITÊ GESTOR DA INTERNET NO BRASIL (CGI.br). Pesquisa TIC Educação 2024 (2025a) e Inteligência Artificial na Educação: usos, oportunidades e riscos no cenário brasileiro (2025b). São Paulo: CGI.br, 2025.',
    summary:
      'Fonte dos dados nacionais citados no Capítulo 1.2: 37% dos estudantes usuários de internet (e 70% no Ensino Médio) já usam IA generativa para atividades escolares; 43% dos professores já utilizam, mas apenas 19% dos alunos conversaram com docentes sobre como usá-la.',
    pagesInMecPdf: 'p. 14–15, 68, 78',
  },
  {
    id: 'ref-unesco-beijing',
    category: 'unesco_internacional',
    categoryLabel: 'UNESCO e Documentos Internacionais',
    title: 'Consenso de Beijing sobre Inteligência Artificial e Educação (UNESCO, 2019)',
    citation:
      'UNESCO. Beijing Consensus on Artificial Intelligence and Education. Paris: UNESCO, 2019.',
    summary:
      'Marco fundador que defende uma IA centrada no ser humano, sob controle humano, alinhada ao ODS 4, protegendo ética, privacidade, não discriminação e valorização docente.',
    pagesInMecPdf: 'p. 16, 80, 82',
    url: 'https://unesdoc.unesco.org/ark:/48223/pf0000368303',
  },
  {
    id: 'ref-unesco-genai-2023',
    category: 'unesco_internacional',
    categoryLabel: 'UNESCO e Documentos Internacionais',
    title: 'Orientação da UNESCO sobre IA Generativa na Educação e Pesquisa (2023)',
    citation:
      'UNESCO. UNESCO’s guidance on generative AI in education and research. Paris: UNESCO, 2023.',
    summary:
      'Define o funcionamento estatístico da IAGen (adaptado na p. 9 do documento do MEC), alerta para dependência tecnológica externa e recomenda governança ética e verificação crítica.',
    pagesInMecPdf: 'p. 9, 13, 37, 48, 81',
    url: 'https://unesdoc.unesco.org/ark:/48223/pf0000390241',
  },
  {
    id: 'ref-unesco-frameworks-2024',
    category: 'unesco_internacional',
    categoryLabel: 'UNESCO e Documentos Internacionais',
    title: 'Marcos de Competências em IA para Estudantes e Professores (UNESCO, 2024)',
    citation:
      'UNESCO. Marco referencial de competências em inteligência artificial para estudantes (2024a) e para professores (2024b). Paris; Brasília: UNESCO, 2024.',
    summary:
      'Estrutura as competências estudantis e os 5 aspectos da formação docente (Mentalidade centrada no ser humano; Ética; Fundamentos e aplicações; Pedagogia; Desenvolvimento profissional) em 3 níveis (Adquirir, Aprofundar, Criar).',
    pagesInMecPdf: 'p. 4, 19, 61, 63–66, 81, 83',
  },
  {
    id: 'ref-unicef-2025',
    category: 'unesco_internacional',
    categoryLabel: 'UNESCO e Documentos Internacionais',
    title: 'Guia sobre IA para Crianças 3.0 (UNICEF, 2025) e Child Rights by Design (5Rights)',
    citation:
      'UNICEF. Guidance on AI and Children 3.0. Florence: UNICEF, 2025; 5RIGHTS FOUNDATION. Child Rights by Design (2023) & Children & AI Design Code (2025).',
    summary:
      'Baseiam a centralidade do melhor interesse da criança, proteção contra vigilância abusiva, dark patterns e vieses algorítmicos, com 11 princípios de direitos desde a concepção.',
    pagesInMecPdf: 'p. 8, 42, 48, 79, 81, 82, 83, 86–87',
    url: 'https://www.unicef.org/innocenti/reports/policy-guidance-ai-children',
  },
  {
    id: 'ref-ceara-2024',
    category: 'normativos_mec',
    categoryLabel: 'MEC e Normativos Nacionais',
    title: 'Iniciativa IA na Escola — Ceará (FormaCE / Seduc-CE)',
    citation:
      'BRASIL. Ministério da Educação. Por onde começar: alguns exemplos de avanços curriculares nas redes brasileiras — Iniciativa IA na Escola: Ceará (CE). In: Inteligência Artificial na Educação Básica, p. 73, 2026.',
    summary:
      'Destacada pelo MEC no Capítulo 5: formação presencial de 40h promovida pela FormaCE/Seduc-CE, iniciada em 2024 com 81 docentes de Ciências da Natureza e expandida em 2025 para 40 escolas, cobrindo ética da IA, engenharia de prompt e avaliação.',
    pagesInMecPdf: 'p. 17 e p. 73',
  },
];

