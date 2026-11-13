export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export type ViewMode = 'identification' | 'stage' | 'completion';

export type QuestionFormat =
  | 'multiple_choice'
  | 'true_false'
  | 'matching'
  | 'situation_identification'
  | 'best_conduct';

export interface MecCitation {
  source: string;
  chapter: string;
  page: string;
  legalRef?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  detail?: string;
}

export interface MatchingPair {
  id: string;
  leftItem: string;
  correctRightId: string;
}

export interface ObjectiveQuestion {
  id: string;
  stageNumber: StageId;
  topicId: string;
  topicLabel: string;
  format: QuestionFormat;
  formatLabel: string;
  scenario: string;
  prompt: string;
  options?: QuestionOption[];
  correctOptionId?: string;
  matchingPairs?: MatchingPair[];
  matchingChoices?: QuestionOption[];
  explanationMec: string;
  physicsBridgeNote?: string;
  citation: MecCitation;
}

export interface QuizResponseRecord {
  question_id: string;
  stage_number: number;
  topic: string;
  question_format: QuestionFormat;
  selected_answer: string | Record<string, string>;
  is_correct: boolean;
  answered_at: string;
}

export interface EssayRecord {
  question_number: 1 | 2;
  prompt_title: string;
  response_text: string;
  word_count: number;
  updated_at: string;
}

export type DecisionVerdict = 'adequate' | 'attention' | 'inadequate';
export type TrafficColor = 'green' | 'yellow' | 'red';

export interface PromptLabConfig {
  goal: string;
  physicsTopic: string;
  difficulty: string;
  format: string;
  safeguards: string[];
}

export interface InteractionsState {
  stage1DilemmaChoice?: string;
  stage1InspectedClues?: string[];
  stage1SortAnswers?: Record<string, 'sobre' | 'com'>;
  stage1SortChecked?: boolean;
  stage2CompletedSteps?: number[];
  stage2InvestigatorAnswers?: Record<string, string>;
  stage2InvestigatorChecked?: boolean;
  stage3CaseDecisions?: Record<string, DecisionVerdict>;
  stage3TrafficAssignments?: Record<string, TrafficColor>;
  stage3TrafficChecked?: boolean;
  stage4PromptConfig?: PromptLabConfig;
  stage4CopiedPrompt?: boolean;
  stage4AuditFoundIds?: string[];
  stage5CurrentIndex?: number;
}

export interface MissionAttempt {
  id: string;
  resume_code: string;
  session_secret: string;
  student_name: string;
  class_group: string;
  current_stage: number;
  completed_stages: StageId[];
  achievements: string[];
  interactions_state: InteractionsState;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MissionSessionPayload {
  attempt: MissionAttempt;
  quiz_responses: QuizResponseRecord[];
  essays: EssayRecord[];
}

export type SyncStatus = 'synced' | 'saving' | 'local_only' | 'error';

export interface StageMeta {
  id: StageId;
  shortTitle: string;
  title: string;
  subtitle: string;
  achievementId: string;
  achievementTitle: string;
  achievementDescription: string;
  mecScope: string;
}

