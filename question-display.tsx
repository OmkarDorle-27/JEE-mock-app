import { Question } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function QuestionDisplay({
  question,
  questionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: QuestionDisplayProps) {
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'physics': return 'bg-blue-100 text-blue-800';
      case 'chemistry': return 'bg-green-100 text-green-800';
      case 'maths': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={getSubjectColor(question.subject)}>
              {question.subject.charAt(0).toUpperCase() + question.subject.slice(1)}
            </Badge>
            <span className="text-gray-500">
              Question {question.number} of {totalQuestions}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Marks: <span className="font-semibold">+{question.marks}</span> | 
            Negative: <span className="font-semibold">{question.negativeMark}</span>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <div className="text-lg leading-relaxed text-gray-900 mb-4">
            {question.text}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-auto">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-sm text-gray-500">
          Use keyboard: ← → for navigation
        </div>
        
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
