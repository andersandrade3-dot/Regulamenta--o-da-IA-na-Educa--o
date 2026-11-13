import type { DecisionVerdict, ObjectiveQuestion, TrafficColor } from '../types/mission';

export interface EthicsCase {
  id: string;
  situation: string;
  correctVerdict: DecisionVerdict;
  feedbackMec: string;
  citation: string;
}

export const DECISION_CASES: EthicsCase[] = [
  {
    id: 'case-1',
    situation:
      'Um estudante utiliza IA para explicar um conceito de Física e depois confere a explicação no material didático.',
    correctVerdict: 'adequate',
    feedbackMec:
      'Conduta adequada ("aprender COM IA" com verificação). A IA atua como apoio inicial ao estudo, mas o estudante mantém a mediação humana, consulta fontes confiáveis e valida o rigor conceitual em material didático.',
    citation: 'MEC, 2026 — Introdução (p. 3); Cap. 2.3 (Letramento informacional, p. 29); Princípios 2 e 3 (p. 49).',
  },
  {
    id: 'case-2',
    situation:
      'Um aluno copia integralmente uma resposta gerada por IA e apresenta como produção própria.',
    correctVerdict: 'inadequate',
    feedbackMec:
      'Conduta inadequada. Substitui o processo de aprendizagem e criação genuína, compromete a integridade intelectual e provoca "descarregamento cognitivo" — prejudicando memória, raciocínio e autonomia do estudante.',
    citation: 'MEC, 2026 — Cap. 2.2 (Aprendizagem 8, p. 24); Cap. 3.1 (Tabela 5, item 2, p. 38); Princípio 2 (p. 49).',
  },
  {
    id: 'case-3',
    situation:
      'Um estudante utiliza informações pessoais de colegas em uma ferramenta de IA sem autorização.',
    correctVerdict: 'inadequate',
    feedbackMec:
      'Conduta inadequada com risco legal e ético grave. A LGPD (Lei nº 13.709/2018) exige finalidade, transparência, minimização de dados e proteção reforçada (inclusive consentimento de responsáveis para crianças — Art. 14). O MEC alerta explicitamente contra inserir dados e fotos pessoais/de colegas em plataformas comerciais que podem usá-los para treinamento.',
    citation: 'MEC, 2026 — Cap. 3.1 (Tabela 5, p. 38); Cap. 3.2 (p. 43–44); Princípio 6 (p. 50 e p. 56).',
  },
  {
    id: 'case-4',
    situation:
      'Uma IA apresenta uma referência bibliográfica que não existe e o estudante a utiliza sem verificar.',
    correctVerdict: 'inadequate',
    feedbackMec:
      'Conduta inadequada. LLMs estimam palavras prováveis e não checam espontaneamente o que produzem, podendo inventar referências e fatos. Utilizar citação inexistente sem conferência viola o letramento informacional e a responsabilidade humana pelo conteúdo entregue.',
    citation: 'MEC, 2026 — Cap. 1.1 (p. 9); Cap. 2.3 (p. 29); Cap. 3.3 ("Autocrítica" e "Responsabilidade", p. 51).',
  },
  {
    id: 'case-5',
    situation:
      'Um aluno utiliza IA para elaborar uma atividade acessível, mas não verifica se o material realmente atende às necessidades dos estudantes.',
    correctVerdict: 'attention',
    feedbackMec:
      'Exige atenção e verificação! Ampliar acessibilidade é uma oportunidade legítima da IA (Cap. 1.1, p. 11; Tabela 5, item 9, p. 40), mas o documento alerta que materiais gerados podem conter inadequações técnicas, linguagem imprópria ou ampliar exclusões se não houver revisão humana e acompanhamento pedagógico especializado.',
    citation: 'MEC, 2026 — Cap. 3.1 (Tabela 5, itens 6 e 9, p. 39–40); Critério 4 (Equidade, p. 46); Princípio 7 (p. 50).',
  },
  {
    id: 'case-6',
    situation:
      'Um estudante informa que utilizou inteligência artificial na elaboração de seu trabalho e identifica as partes em que recebeu auxílio.',
    correctVerdict: 'adequate',
    feedbackMec:
      'Conduta adequada e ética! Alinha-se aos princípios de transparência, coautoria crítica e responsabilização humana sobre o conhecimento produzido, permitindo distinguir a contribuição autoral do estudante do apoio tecnológico.',
    citation: 'MEC, 2026 — Cap. 3.3 (Princípio 10 e p. 51); Cap. 4.1 (Práticas de coautoria crítica, p. 65).',
  },
];

export interface TrafficCard {
  id: string;
  text: string;
  correctZone: TrafficColor;
  feedback: string;
  citation: string;
}

export const TRAFFIC_LIGHT_CARDS: TrafficCard[] = [
  {
    id: 'tl-1',
    text: 'Criar um roteiro de revisão sobre Leis de Newton com apoio de IA, resolver os exercícios à mão e validar fórmulas no livro didático.',
    correctZone: 'green',
    feedback:
      'VERDE (Prática responsável): Usa a IA com intencionalidade pedagógica ("aprender COM IA") preservando esforço cognitivo, checagem científica e supervisão humana.',
    citation: 'MEC, 2026 — p. 13, p. 49 (Princípios 1 e 2) e p. 51.',
  },
  {
    id: 'tl-2',
    text: 'Subir uma planilha com nomes, notas e laudos médicos de colegas em um chatbot público para pedir um plano de estudos.',
    correctZone: 'red',
    feedback:
      'VERMELHO (Prática inadequada / risco grave): Viola a LGPD (dados pessoais e dados sensíveis de saúde — Art. 11) e o princípio de coleta mínima e não exposição em plataformas externas.',
    citation: 'MEC, 2026 — Cap. 3.2 (p. 43–44) e Princípio 6 (p. 50 e p. 56).',
  },
  {
    id: 'tl-3',
    text: 'Gerar uma lista de questões de Mecânica com IA para aplicar na monitoria, mas ainda sem conferir os gabaritos nem as unidades de medida.',
    correctZone: 'yellow',
    feedback:
      'AMARELO (Exige atenção e verificação): Antes de usar com estudantes, é obrigatório revisar consistência científica, unidades no SI, clareza pedagógica e ausência de erros.',
    citation: 'MEC, 2026 — Tabela 5, item 6 (p. 39); Critério 1 (p. 45); Princípio 3 (p. 49).',
  },
  {
    id: 'tl-4',
    text: 'Adotar na escola um aplicativo com IA que exige cadastro infantil sem supervisão parental, usa perfilamento para anúncios e coleta biometria sem justificativa.',
    correctZone: 'red',
    feedback:
      'VERMELHO (Ilegal / incompatível com o MEC): Afronta frontalmente o ECA Digital (Lei nº 15.211/2025, Arts. 7º e 22), a LGPD (Arts. 11 e 14) e o Princípio 6 (proteção de dados e não-vigilância).',
    citation: 'MEC, 2026 — Cap. 3.2 (p. 43–44, 47); Princípios 6 e 8 (p. 50); p. 85.',
  },
  {
    id: 'tl-5',
    text: 'Comparar duas explicações geradas por ferramentas diferentes de IA sobre energia cinética e debater em grupo onde há imprecisões.',
    correctZone: 'green',
    feedback:
      'VERDE (Prática responsável): Exemplo próximo ao descrito na Tabela 5 (item 3, p. 38) — usa o confronto entre respostas para desenvolver análise crítica e letramento em IA.',
    citation: 'MEC, 2026 — Cap. 3.1 (Tabela 5, item 3, p. 38).',
  },
  {
    id: 'tl-6',
    text: 'Traduzir um texto de Física com IA para adaptar a leitura a um colega com dificuldade, planejando validar o texto final com o professor e o AEE.',
    correctZone: 'yellow',
    feedback:
      'AMARELO (Exige atenção e verificação): Embora a intenção seja inclusiva e promissora, precisa da revisão docente e do atendimento educacional especializado antes da entrega final.',
    citation: 'MEC, 2026 — Tabela 5, item 9 (p. 40); Princípio 7 (p. 56).',
  },
];

export const STAGE3_QUESTIONS: ObjectiveQuestion[] = [
  {
    id: 'q3_sit_privacy',
    stageNumber: 3,
    topicId: 'privacy_data_protection',
    topicLabel: 'Privacidade e proteção de dados',
    format: 'situation_identification',
    formatLabel: 'Identificação de Situação',
    scenario:
      'Um estudante de licenciatura está montando um banco de problemas contextualizados com IA e pensa em colar no prompt uma lista contendo nomes completos, turmas, e-mails e dificuldades de aprendizagem reais dos alunos da turma observada.',
    prompt: 'Qual falha normativa e ética está presente nessa prática?',
    options: [
      {
        id: 'a',
        label: 'Apenas um problema estético, pois plataformas gratuitas de IA apagam automaticamente dados escolares.',
      },
      {
        id: 'b',
        label: 'Violação dos princípios da finalidade, necessidade (minimização de dados) e confidencialidade previstos na LGPD e nas orientações do MEC.',
      },
      {
        id: 'c',
        label: 'Problema exclusivo de direitos autorais sobre os problemas de Física gerados.',
      },
      {
        id: 'd',
        label: 'Nenhuma falha, desde que o estudante peça no prompt que a IA "não salve a conversa".',
      },
    ],
    correctOptionId: 'b',
    explanationMec:
      'Na LGPD (Lei nº 13.709/2018, Art. 6º, III), a coleta e o tratamento devem limitar-se ao mínimo indispensável para a finalidade pedagógica (princípio da proporcionalidade e necessidade). Inserir dados identificáveis de estudantes em ferramentas externas sem base legal e consentimento viola a proteção de dados e o Princípio 6 (p. 43–44, 50 e 56).',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulos 3.2, 3.3 e 3.4',
      page: 'p. 43–44, p. 50 e p. 56',
      legalRef: 'LGPD — Lei nº 13.709/2018, Art. 6º, III',
    },
  },
  {
    id: 'q3_mc_eca_lgpd',
    stageNumber: 3,
    topicId: 'lgpd_eca_digital',
    topicLabel: 'LGPD e ECA Digital conforme o documento',
    format: 'multiple_choice',
    formatLabel: 'Múltipla Escolha',
    scenario:
      'Uma escola analisa duas plataformas digitais com IA para uso em projetos escolares com adolescentes do Ensino Médio.',
    prompt:
      'Conforme o arcabouço regulatório detalhado no Capítulo 3 do documento do MEC (LGPD e ECA Digital), qual requisito é obrigatório em soluções acessadas por crianças e adolescentes?',
    options: [
      {
        id: 'a',
        label: 'Permitir perfilamento comportamental para financiar o serviço gratuito com publicidade direcionada aos estudantes.',
      },
      {
        id: 'b',
        label: 'Adotar autodeclaração simples de idade ("tenho mais de 18 anos") como única barreira de segurança.',
      },
      {
        id: 'c',
        label: 'Adotar por padrão a configuração mais protetiva de privacidade, proibir perfilamento publicitário de menores e priorizar o melhor interesse da criança.',
      },
      {
        id: 'd',
        label: 'Instalar reconhecimento facial contínuo em sala para gerar notas de engajamento sem consentimento.',
      },
    ],
    correctOptionId: 'c',
    explanationMec:
      'O ECA Digital (Lei nº 15.211/2025) exige configuração mais protetiva de privacidade por padrão (Art. 7º), avaliação de riscos à segurança e saúde (Art. 8º), verificação confiável de idade (vedada autodeclaração), supervisão parental e proíbe perfilamento para publicidade comercial voltada a menores (Art. 22), sempre guiado pelo melhor interesse da criança em conjunto com a LGPD (p. 43–44 e p. 85).',
    citation: {
      source: 'MEC — Inteligência Artificial na Educação Básica',
      chapter: 'Capítulo 3.2 e Anexo 1',
      page: 'p. 43–44 e p. 85',
      legalRef: 'ECA Digital (Lei nº 15.211/2025) e LGPD (Lei nº 13.709/2018)',
    },
  },
];

