import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@shared/schema";
import QuestionTimer from "./question-timer";
import CalculatorKeypad from "./calculator-keypad";

interface AnswerSelectionProps {
  question: Question;
  currentAnswer: string | number | string[] | undefined;
  onAnswerChange: (answer: string | number | string[]) => void;
  onMarkForReview: () => void;
  isMarkedForReview: boolean;
  onTimeUpdate: (questionId: number, timeInSeconds: number) => void;
}

export default function AnswerSelection({
  question,
  currentAnswer,
  onAnswerChange,
  onMarkForReview,
  isMarkedForReview,
  onTimeUpdate
}: AnswerSelectionProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleMultiCorrectChange = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
    
    if (checked) {
      const newAnswers = [...currentAnswers, option];
      onAnswerChange(newAnswers);
    } else {
      const newAnswers = currentAnswers.filter(ans => ans !== option);
      onAnswerChange(newAnswers);
    }
  };

  const handleSingleCorrectChange = (value: string) => {
    onAnswerChange(value);
  };

  const handleNumericalChange = (value: string | number) => {
    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
    if (!isNaN(numValue)) {
      onAnswerChange(numValue);
    }
  };

  const clearAnswer = () => {
    if (question.type === 'multi-correct') {
      onAnswerChange([]);
    } else if (question.type === 'numerical') {
      onAnswerChange(0);
    } else {
      onAnswerChange('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Question Timer */}
      <div className="flex justify-between items-center">
        <QuestionTimer
          isActive={true}
          onTimeUpdate={(timeInSeconds) => onTimeUpdate(question.id, timeInSeconds)}
          className="text-sm"
        />
        <div className="text-sm text-gray-500">
          Question {question.number || question.id} • {question.type} • {question.marks || 4} marks
        </div>
      </div>

      {/* Answer Options */}
      <Card className="p-4">
        <div className="space-y-4">
          {question.type === 'numerical' ? (
            // Numerical Answer Input
            <div className="space-y-4">
              <Label className="text-base font-medium">Enter your numerical answer:</Label>
              <div className="flex space-x-4">
                <Input
                  type="number"
                  step="0.01"
                  value={currentAnswer || ''}
                  onChange={(e) => handleNumericalChange(e.target.value)}
                  placeholder="Enter numerical value"
                  className="w-48"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowCalculator(!showCalculator)}
                >
                  Calculator
                </Button>
              </div>
              
              {showCalculator && (
                <div className="mt-4">
                  <CalculatorKeypad
                    value={currentAnswer?.toString() || ''}
                    onChange={handleNumericalChange}
                  />
                </div>
              )}
            </div>
          ) : question.type === 'multi-correct' ? (
            // Multi-Correct Questions
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Select all correct options: 
                <span className="text-sm text-gray-600 ml-2">
                  (Partial marking: +1 per correct option, -2 for any wrong option)
                </span>
              </Label>
              <div className="space-y-3">
                {question.options && Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Checkbox
                      id={`option-${key}`}
                      checked={Array.isArray(currentAnswer) && currentAnswer.includes(key)}
                      onCheckedChange={(checked) => handleMultiCorrectChange(key, checked as boolean)}
                    />
                    <Label htmlFor={`option-${key}`} className="cursor-pointer">
                      <span className="font-medium">({key})</span> {value}
                    </Label>
                  </div>
                ))}
              </div>
              {Array.isArray(currentAnswer) && currentAnswer.length > 0 && (
                <div className="text-sm text-blue-600">
                  Selected: {currentAnswer.join(', ')}
                </div>
              )}
            </div>
          ) : (
            // Single Correct Questions
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Select the correct option:
                <span className="text-sm text-gray-600 ml-2">
                  (+4 for correct, -1 for wrong)
                </span>
              </Label>
              <RadioGroup
                value={currentAnswer as string || ''}
                onValueChange={handleSingleCorrectChange}
              >
                {question.options && Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <RadioGroupItem value={key} id={`option-${key}`} />
                    <Label htmlFor={`option-${key}`} className="cursor-pointer">
                      <span className="font-medium">({key})</span> {value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button variant="outline" onClick={clearAnswer}>
            Clear Answer
          </Button>
          <Button
            variant={isMarkedForReview ? "destructive" : "outline"}
            onClick={onMarkForReview}
          >
            {isMarkedForReview ? "Remove Review Mark" : "Mark for Review"}
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          {currentAnswer && (
            <span className="text-green-600 font-medium">
              Answer saved: {Array.isArray(currentAnswer) ? currentAnswer.join(', ') : currentAnswer}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}