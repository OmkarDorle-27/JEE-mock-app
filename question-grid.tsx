import { Question } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface QuestionGridProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string | number | string[]>;
  markedForReview: Set<number>;
  onQuestionClick: (index: number) => void;
  answeredCount: number;
  markedCount: number;
  notVisitedCount: number;
}

export default function QuestionGrid({
  questions,
  currentQuestionIndex,
  answers,
  markedForReview,
  onQuestionClick,
  answeredCount,
  markedCount,
  notVisitedCount,
}: QuestionGridProps) {
  const testState = { answers, markedForReview, questions, currentQuestionIndex, currentSubject: 'physics' as const, timeRemaining: 0, testStarted: true, testCompleted: false };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Palette</h3>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 question-answered rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 question-unanswered rounded"></div>
            <span>Not Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 question-marked rounded"></div>
            <span>Marked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 question-marked-answered rounded"></div>
            <span>Marked + Answered</span>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((question, index) => {
          const answer = answers[question.id];
          const isAnswered = answer !== undefined && answer !== '' && answer !== null && 
                           !(Array.isArray(answer) && answer.length === 0);
          const isMarked = markedForReview.has(question.id);
          const isCurrent = index === currentQuestionIndex;
          
          let statusClass = '';
          if (isCurrent) {
            statusClass = 'bg-blue-500 text-white border-blue-600';
          } else if (isAnswered && isMarked) {
            statusClass = 'bg-purple-500 text-white border-purple-600';
          } else if (isAnswered) {
            statusClass = 'bg-green-500 text-white border-green-600';
          } else if (isMarked) {
            statusClass = 'bg-yellow-500 text-white border-yellow-600';
          } else {
            statusClass = 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300';
          }
          
          return (
            <button
              key={question.id}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${statusClass} ${
                isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              onClick={() => onQuestionClick(index)}
            >
              {question.number}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Answered:</span>
            <span className="font-semibold" style={{ color: 'var(--answered)' }}>
              {answeredCount}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Not Visited:</span>
            <span className="font-semibold" style={{ color: 'var(--unanswered)' }}>
              {Math.max(0, notVisitedCount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Marked for Review:</span>
            <span className="font-semibold" style={{ color: 'var(--marked)' }}>
              {markedCount}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
