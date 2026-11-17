import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import type { ObjectiveQuestion } from '../../types/mission';
import { CitationBadge } from './CitationBadge';
import { SpeakButton } from './SpeakButton';

interface QuizQuestionCardProps {
  question: ObjectiveQuestion;
  questionIndexLabel?: string;
  onAnswered?: () => void;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  questionIndexLabel,
  onAnswered,
}) => {
  const { getQuizResponse, recordQuizAnswer } = useMission();
  const existing = getQuizResponse(question.id);

  const [selectedOption, setSelectedOption] = useState<string>(() =>
    typeof existing?.selected_answer === 'string' ? existing.selected_answer : ''
  );

  const [matchingMap, setMatchingMap] = useState<Record<string, string>>(() =>
    existing?.selected_answer && typeof existing.selected_answer === 'object'
      ? (existing.selected_answer as Record<string, string>)
      : {}
  );

  useEffect(() => {
    if (existing) {
      if (typeof existing.selected_answer === 'string') {
        setSelectedOption(existing.selected_answer);
      } else if (existing.selected_answer && typeof existing.selected_answer === 'object') {
        setMatchingMap(existing.selected_answer);
      }
    }
  }, [existing]);

  const handleSelectSingle = async (optionId: string) => {
    setSelectedOption(optionId);
    const isCorrect = optionId === question.correctOptionId;
    await recordQuizAnswer(question, optionId, isCorrect);
    onAnswered?.();
  };

  const handleMatchingChange = (pairId: string, rightId: string) => {
    setMatchingMap((prev) => ({ ...prev, [pairId]: rightId }));
  };

  const handleSubmitMatching = async () => {
    if (!question.matchingPairs) return;
    const allFilled = question.matchingPairs.every((p) => Boolean(matchingMap[p.id]));
    if (!allFilled) return;
    const allCorrect = question.matchingPairs.every((p) => matchingMap[p.id] === p.correctRightId);
    await recordQuizAnswer(question, matchingMap, allCorrect);
    onAnswered?.();
  };

  const isAnswered = Boolean(existing);
  const isCorrect = existing?.is_correct ?? false;

  return (
    <article className="rounded-2xl border-[1.5px] border-[#D7DCE6] bg-white p-4 sm:p-6 shadow-xs transition-all">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {questionIndexLabel && (
            <span className="font-badge rounded-full bg-[#183EFF] px-2.5 py-0.5 text-xs font-extrabold text-white">
              {questionIndexLabel}
            </span>
          )}
          <span className="rounded-full bg-[#EEF2FF] px-3 py-0.5 text-xs font-bold text-[#183EFF]">
            {question.formatLabel}
          </span>
          <span className="rounded-full bg-[#FFF8D6] px-3 py-0.5 text-xs font-semibold text-[#7A5900]">
            {question.topicLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SpeakButton
            id={`q-${question.id}`}
            label="Ouvir questão"
            text={`${question.scenario}. ${question.prompt}`}
          />
          {isAnswered && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isCorrect
                ? 'bg-[#E8F8EE] text-[#057A2E]'
                : 'bg-[#FEE2E2] text-[#B91C1C]'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Resposta alinhada ao MEC
              </>
            ) : (
              <>
                <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Revise o feedback fundamentado
              </>
            )}
          </span>
          )}
        </div>
      </div>

      {/* Situação prática */}
      <div className="mb-4 rounded-xl border border-[#E5E8F0] bg-[#F7F9FC] p-3.5 font-body text-sm text-[#3C3C3C]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#525866] mb-1">
          Situação-problema
        </p>
        <p className="leading-relaxed">{question.scenario}</p>
      </div>

      <h4 className="font-editorial text-base sm:text-lg font-bold text-[#22252B] mb-4">
        {question.prompt}
      </h4>

      {/* Formato padrão: múltipla escolha / V ou F / situação / melhor conduta */}
      {question.format !== 'matching' && question.options && (
        <div
          className={`grid gap-2.5 ${
            question.format === 'true_false' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isRightOption = opt.id === question.correctOptionId;

            let cardStyle =
              'border-[#D7DCE6] bg-white hover:border-[#183EFF] hover:bg-[#F5F8FF] text-[#22252B]';
            if (isAnswered) {
              if (isRightOption) {
                cardStyle = 'border-[#00A63E] bg-[#ECFDF3] text-[#064E23]';
              } else if (isSelected && !isRightOption) {
                cardStyle = 'border-[#E11D1D] bg-[#FEF2F2] text-[#7F1D1D]';
              } else {
                cardStyle = 'border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]';
              }
            } else if (isSelected) {
              cardStyle = 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]';
            }

            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => void handleSelectSingle(opt.id)}
                className={`flex min-h-[48px] items-start gap-3 rounded-xl border-[1.5px] p-3.5 text-left text-sm transition-all cursor-pointer ${cardStyle}`}
              >
                <span
                  className={`font-badge mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                    isAnswered && isRightOption
                      ? 'bg-[#00A63E] text-white'
                      : isAnswered && isSelected && !isRightOption
                        ? 'bg-[#E11D1D] text-white'
                        : isSelected
                          ? 'bg-[#183EFF] text-white'
                          : 'bg-[#EEF2FF] text-[#183EFF]'
                  }`}
                >
                  {question.format === 'true_false'
                    ? opt.id === 'true'
                      ? 'V'
                      : 'F'
                    : opt.id.toUpperCase()}
                </span>
                <span className="font-body leading-snug font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Formato Associação de conceitos */}
      {question.format === 'matching' && question.matchingPairs && question.matchingChoices && (
        <div className="space-y-3">
          {question.matchingPairs.map((pair, idx) => {
            const chosenId = matchingMap[pair.id] ?? '';
            const pairRight = chosenId === pair.correctRightId;
            return (
              <div
                key={pair.id}
                className={`rounded-xl border-[1.5px] p-3.5 transition-colors ${
                  isAnswered
                    ? pairRight
                      ? 'border-[#00A63E] bg-[#ECFDF3]'
                      : 'border-[#E11D1D] bg-[#FEF2F2]'
                    : 'border-[#D7DCE6] bg-[#FAFBFD]'
                }`}
              >
                <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-2.5 md:w-1/2">
                    <span className="font-badge inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFD000] text-xs font-extrabold text-[#183EFF]">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-[#22252B]">{pair.leftItem}</p>
                  </div>
                  <div className="md:w-1/2">
                    <label className="sr-only" htmlFor={`match-${question.id}-${pair.id}`}>
                      Associar {pair.leftItem}
                    </label>
                    <select
                      id={`match-${question.id}-${pair.id}`}
                      value={chosenId}
                      onChange={(e) => handleMatchingChange(pair.id, e.target.value)}
                      className="min-h-[44px] w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-base sm:text-sm text-[#22252B] focus:border-[#183EFF] focus:outline-none focus:ring-2 focus:ring-[#183EFF]/20"
                    >
                      <option value="">Selecione o conceito correspondente...</option>
                      {question.matchingChoices?.map((choice) => (
                        <option key={choice.id} value={choice.id}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {isAnswered && !pairRight && (
                  <p className="mt-2 text-xs font-semibold text-[#B91C1C]">
                    Associação esperada:{' '}
                    {question.matchingChoices?.find((c) => c.id === pair.correctRightId)?.label}
                  </p>
                )}
              </div>
            );
          })}

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-[#525866]">
              Associe todos os itens e clique em verificar para registrar sua resposta.
            </p>
            <button
              type="button"
              disabled={!question.matchingPairs.every((p) => Boolean(matchingMap[p.id]))}
              onClick={() => void handleSubmitMatching()}
              className="min-h-[44px] rounded-xl bg-[#183EFF] px-4 py-2 text-xs font-bold text-white hover:bg-[#1230CC] disabled:bg-[#E5E7EB] disabled:text-[#6B7280] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isAnswered ? 'Reverificar associação' : 'Verificar associação'}
            </button>
          </div>
        </div>
      )}

      {/* Feedback imediato */}
      {isAnswered && (
        <div
          className={`mt-4 rounded-xl border p-4 animate-mec-enter ${
            isCorrect
              ? 'border-[#86EFAC] bg-[#F0FDF4]'
              : 'border-[#FCA5A5] bg-[#FFF5F5]'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00A63E]" aria-hidden="true" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#E11D1D]" aria-hidden="true" />
            )}
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-[#22252B]">
                  {isCorrect ? 'Análise correta!' : 'Atenção à fundamentação:'}
                </p>
                <SpeakButton
                  id={`fb-${question.id}`}
                  label="Ouvir feedback"
                  text={question.explanationMec}
                />
              </div>
              <p className="font-body leading-relaxed text-[#2F3540]">{question.explanationMec}</p>
              {question.physicsBridgeNote && (
                <p className="rounded-lg bg-white/80 px-3 py-2 text-xs text-[#3C3C3C] border border-[#E5E7EB]">
                  <strong className="text-[#183EFF]">Conexão didática com a Física: </strong>
                  {question.physicsBridgeNote}
                </p>
              )}
              <CitationBadge citation={question.citation} />
            </div>
          </div>
        </div>
      )}

      {!isAnswered && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-[#525866]">
          <HelpCircle className="h-3.5 w-3.5 text-[#183EFF]" aria-hidden="true" />
          <span>Selecione uma resposta para receber feedback fundamentado no documento do MEC.</span>
        </p>
      )}
    </article>
  );
};

