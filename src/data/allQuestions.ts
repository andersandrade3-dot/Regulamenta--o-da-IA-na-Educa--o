import type { ObjectiveQuestion } from '../types/mission';
import { STAGE1_QUESTIONS } from './stage1Data';
import { STAGE2_QUESTION } from './stage2Data';
import { STAGE3_QUESTIONS } from './stage3Data';
import { STAGE4_QUESTION } from './stage4Data';
import { STAGE5_QUESTIONS } from './stage5Data';

export const ALL_OBJECTIVE_QUESTIONS: ObjectiveQuestion[] = [
  ...STAGE1_QUESTIONS,
  STAGE2_QUESTION,
  ...STAGE3_QUESTIONS,
  STAGE4_QUESTION,
  ...STAGE5_QUESTIONS,
];

export const MISSION_COMPETENCY_TOPICS = [
  { id: 'sobre_vs_com_ia', label: 'Aprender sobre IA vs. aprender com IA' },
  { id: 'generative_ai_limits', label: 'Funcionamento e limitações da IA generativa' },
  { id: 'hallucinations_accuracy', label: 'Alucinações e informações incorretas' },
  { id: 'source_verification', label: 'Verificação de fontes e referências' },
  { id: 'privacy_data_protection', label: 'Privacidade e proteção de dados' },
  { id: 'lgpd_eca_digital', label: 'LGPD e ECA Digital' },
  { id: 'algorithmic_bias', label: 'Vieses algorítmicos e discriminação' },
  { id: 'authorship_responsibility', label: 'Autoria e responsabilidade pelo conteúdo' },
  { id: 'human_oversight', label: 'Supervisão humana' },
  { id: 'intentional_pedagogical_use', label: 'Uso pedagógico intencional da IA' },
];

