export interface EssayPromptSpec {
  questionNumber: 1 | 2;
  badge: string;
  title: string;
  promptText: string;
  reflectionAxes: string[];
  mecHints: { label: string; ref: string }[];
}

export const ESSAY_PROMPTS: EssayPromptSpec[] = [
  {
    questionNumber: 1,
    badge: 'Questão 1 — Reflexão crítica',
    title: 'Verificação científica e cuidados no estudo das Leis de Newton com IA',
    promptText:
      'Imagine que você utilizou uma ferramenta de inteligência artificial para estudar as Leis de Newton. A ferramenta apresentou explicações, exemplos e até referências bibliográficas. Como você verificaria se as informações estão corretas? Quais cuidados tomaria antes de utilizar esse material em uma atividade escolar? Explique com suas palavras.',
    reflectionAxes: [
      'Conferência de conceitos físicos, fórmulas, natureza vetorial e unidades de medida (SI)',
      'Rastreabilidade de citações e verificação de referências reais (evitar alucinações)',
      'Comparação com livros didáticos, notas de aula e ferramentas ancoradas em fontes',
      'Preservação da autoria, transparência e prevenção do descarregamento cognitivo',
    ],
    mecHints: [
      {
        label: 'LLMs estimam palavras prováveis e não validam fatos espontaneamente',
        ref: 'Cap. 1.1 (p. 9) e Cap. 3.3 (p. 51)',
      },
      {
        label: 'Letramento informacional: buscar, selecionar e checar confiabilidade das fontes',
        ref: 'Cap. 2.3 (p. 29)',
      },
      {
        label: 'Responsabilidade humana e integridade intelectual',
        ref: 'Cap. 3.1 (p. 38) e Cap. 3.3 (p. 51)',
      },
    ],
  },
  {
    questionNumber: 2,
    badge: 'Questão 2 — Responsabilidade e futuro',
    title: 'Produção de materiais de Física com IA mantendo autoria, ética e privacidade',
    promptText:
      'Imagine que você será responsável por desenvolver materiais de apoio ao ensino de Física utilizando inteligência artificial. Como utilizaria essas ferramentas para melhorar a aprendizagem dos estudantes sem comprometer o pensamento crítico, a autoria, a privacidade e a responsabilidade pelo conhecimento produzido?',
    reflectionAxes: [
      'Intencionalidade pedagógica: quando usar IA e quando priorizar atividades sem IA / desplugadas',
      'Estratégias para evitar descarregamento cognitivo e estimular raciocínio crítico dos alunos',
      'Proteção de dados e privacidade em sala (LGPD, ECA Digital, não inserir dados pessoais)',
      'Supervisão humana, transparência sobre uso da IA e responsabilidade científica do educador',
    ],
    mecHints: [
      {
        label: 'Articular ensino COM IA e ensino SOBRE IA',
        ref: 'Introdução (p. 3) e Diretriz 1 (p. 20)',
      },
      {
        label: '10 Princípios fundamentais e conformidade com LGPD / ECA Digital',
        ref: 'Cap. 3.2 e 3.3 (p. 43–44, p. 49–50)',
      },
      {
        label: 'Protagonismo docente e mediação humana no centro do processo',
        ref: 'Cap. 4.1 e 4.2 (p. 64–70)',
      },
    ],
  },
];

