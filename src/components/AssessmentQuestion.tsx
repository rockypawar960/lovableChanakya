import React from 'react';
import { Radio } from './ui/Radio';
import { Checkbox } from './ui/Checkbox';

export interface QuestionOption {
  id: string;
  text: string;
  score?: number;
}

export interface AssessmentQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  description?: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  selectedAnswers: string[];
  onAnswerChange: (answerId: string) => void;
  onAnswersChange?: (answerIds: string[]) => void;
}

export const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  questionNumber,
  totalQuestions,
  question,
  description,
  type,
  options,
  selectedAnswers,
  onAnswerChange,
  onAnswersChange,
}) => {
  const handleOptionChange = (optionId: string) => {
    if (type === 'single') {
      onAnswerChange(optionId);
    } else if (onAnswersChange) {
      const updatedAnswers = selectedAnswers.includes(optionId)
        ? selectedAnswers.filter((id) => id !== optionId)
        : [...selectedAnswers, optionId];
      onAnswersChange(updatedAnswers);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-blue-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex-1">
              {type === 'single' ? (
                <Radio
                  name={`question-${questionNumber}`}
                  value={option.id}
                  checked={selectedAnswers.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                  label={option.text}
                />
              ) : (
                <Checkbox
                  value={option.id}
                  checked={selectedAnswers.includes(option.id)}
                  onChange={() => handleOptionChange(option.id)}
                  label={option.text}
                />
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
