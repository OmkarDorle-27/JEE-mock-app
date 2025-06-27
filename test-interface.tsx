import { useState, useEffect } from "react";
import { TestState, calculateResults, saveTestState, TestResults as TestResultsType } from "@/lib/test-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Timer from "./timer";
import QuestionGrid from "./question-grid";
import AnswerSelection from "./answer-selection";
import TestResultsDisplay from "./test-results";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, TrendingUp } from "lucide-react";
import PdfViewer from "./pdf";


interface TestInterfaceProps {
  testState: TestState;
  updateTestState: (updates: Partial<TestState>) => void;
  onTestComplete: () => void;
}

type TestMode = 'taking' | 'completed' | 'reviewing';

export default function TestInterface({ testState, updateTestState, onTestComplete }: TestInterfaceProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [mode, setMode] = useState<TestMode>('taking');

  const currentQuestion = testState.questions[testState.currentQuestionIndex];

  useEffect(() => {
    // Auto-save when answers change
    saveTestState(testState);
  }, [testState.answers, testState.markedForReview]);

  const switchSubject = (subject: 'physics' | 'chemistry' | 'maths') => {
    const firstQuestionIndex = testState.questions.findIndex(q => q.subject === subject);
    if (firstQuestionIndex !== -1) {
      updateTestState({
        currentSubject: subject,
        currentQuestionIndex: firstQuestionIndex,
      });
    }
  };

  const updateQuestionTime = (questionId: number, timeInSeconds: number) => {
    const newTimeSpent = { ...testState.timeSpentPerQuestion };
    newTimeSpent[questionId] = (newTimeSpent[questionId] || 0) + 1000; // Add 1 second in milliseconds
    updateTestState({ timeSpentPerQuestion: newTimeSpent });
  };

  const navigateQuestion = (direction: number) => {
    const newIndex = testState.currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < testState.questions.length) {
      // Update current question start time
      updateTestState({ 
        currentQuestionIndex: newIndex,
        currentQuestionStartTime: Date.now()
      });
    }
  };

  const saveAnswer = (answer: string | number | string[]) => {
    const newAnswers = { ...testState.answers };
    newAnswers[currentQuestion.id] = answer;
    updateTestState({ answers: newAnswers });
  };

  const markForReview = () => {
    const newMarked = new Set(testState.markedForReview);
    newMarked.add(currentQuestion.id);
    updateTestState({ markedForReview: newMarked });
  };

  const clearResponse = () => {
    const newAnswers = { ...testState.answers };
    delete newAnswers[currentQuestion.id];
    
    const newMarked = new Set(testState.markedForReview);
    newMarked.delete(currentQuestion.id);
    
    updateTestState({ 
      answers: newAnswers,
      markedForReview: newMarked 
    });
  };

  const saveAndNext = () => {
    navigateQuestion(1);
  };

  const saveAndMarkForReview = () => {
    markForReview();
  };

  const handleTimeUp = () => {
    submitTest(true);
  };

  const submitTest = (autoSubmit = false) => {
    const testResults = calculateResults(testState);
    setResults({ ...testResults, autoSubmit });
    setShowSubmitModal(false);
    setMode('completed');
    updateTestState({ testCompleted: true });
  };

  const handleReviewTest = () => {
    setMode('reviewing');
  };

  const handleRetakeTest = () => {
    setMode('taking');
    onTestComplete(); // This will restart the test
  };

  const handleViewSolution = () => {
    const solutionUrl = localStorage.getItem('mockTestSolution');
    if (solutionUrl) {
      window.open(solutionUrl, '_blank');
    }
  };

  const getAnsweredCount = () => Object.keys(testState.answers).length;
  const getMarkedCount = () => testState.markedForReview.size;
  const getNotVisitedCount = () => testState.questions.length - getAnsweredCount() - getMarkedCount() + 
    Object.keys(testState.answers).filter(id => testState.markedForReview.has(parseInt(id))).length;

  // Show test results if completed
  if (mode === 'completed' && results) {
    return (
      <TestResultsDisplay
        results={results}
        onReviewTest={handleReviewTest}
        onRetakeTest={handleRetakeTest}
        onViewSolution={handleViewSolution}
      />
    );
  }

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">JEE Main Mock Test 2024</h1>
              <div className="flex space-x-2">
                {['physics', 'chemistry', 'maths'].map((subject) => (
                  <Button
                    key={subject}
                    variant={testState.currentSubject === subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => switchSubject(subject as any)}
                    className="capitalize"
                  >
                    {subject === 'maths' ? 'Mathematics' : subject}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Timer 
                timeRemaining={testState.timeRemaining}
                onTimeUp={handleTimeUp}
                onTick={(time) => updateTestState({ timeRemaining: time })}
              />
              <Button 
                variant="destructive"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 h-screen-minus-header">
        {/* Left Panel - Answer Selection */}
        <div className="col-span-3 bg-white border-r border-gray-200">
          <AnswerSelection
            question={currentQuestion}
            currentAnswer={testState.answers[currentQuestion.id]}
            onAnswerChange={saveAnswer}
            onMarkForReview={markForReview}
            isMarkedForReview={testState.markedForReview.has(currentQuestion.id)}
            onTimeUpdate={updateQuestionTime}
          />
        </div>

        {/* Center Panel - PDF Viewer (Larger) */}
        <div className="col-span-7 bg-white overflow-hidden">
          <PdfViewer
            currentQuestion={currentQuestion?.number || 1}
            onQuestionNavigate={(questionNumber) => {
              const questionIndex = testState.questions.findIndex(q => q.number === questionNumber);
              if (questionIndex !== -1) {
                updateTestState({ currentQuestionIndex: questionIndex });
              }
            }}
          />
        </div>

        {/* Right Panel - Question Grid */}
        <div className="col-span-2 bg-gray-50 border-l border-gray-200 p-4">
          <QuestionGrid
            questions={testState.questions}
            currentQuestionIndex={testState.currentQuestionIndex}
            answers={testState.answers}
            markedForReview={testState.markedForReview}
            onQuestionClick={(index) => updateTestState({ currentQuestionIndex: index })}
            answeredCount={getAnsweredCount()}
            markedCount={getMarkedCount()}
            notVisitedCount={getNotVisitedCount()}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <span>Submit Test?</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to submit your test? This action cannot be undone.
            </p>
            
            <Card className="p-4 bg-gray-50">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-semibold">{testState.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-semibold text-green-600">{getAnsweredCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered:</span>
                  <span className="font-semibold text-gray-600">
                    {testState.questions.length - getAnsweredCount()}
                  </span>
                </div>
              </div>
            </Card>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => submitTest(false)}
              >
                Submit Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Test Completed!</span>
            </DialogTitle>
          </DialogHeader>
          {results && (
            <div className="space-y-6">
              {results.autoSubmit && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <p className="text-red-800 font-medium">
                    ⏰ Test auto-submitted due to time expiry
                  </p>
                </Card>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50 border-green-200 text-center">
                  <div className="text-2xl font-bold text-green-600">{results.correct}</div>
                  <div className="text-green-800">Correct</div>
                </Card>
                <Card className="p-4 bg-red-50 border-red-200 text-center">
                  <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
                  <div className="text-red-800">Incorrect</div>
                </Card>
                <Card className="p-4 bg-gray-50 border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-600">{results.unanswered}</div>
                  <div className="text-gray-800">Unanswered</div>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-200 text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.totalMarks}</div>
                  <div className="text-blue-800">Total Marks</div>
                </Card>
              </div>
              
              <Card className="p-6 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-semibold">{results.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions Attempted:</span>
                    <span className="font-semibold">
                      {results.totalQuestions - results.unanswered}/{results.totalQuestions}
                    </span>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-center">
                <Button onClick={handleRetakeTest} size="lg">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
