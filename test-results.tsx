import { useState } from "react";
import { TestResults as TestResultsType } from "@/lib/test-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Target, TrendingUp, Eye, BookOpen } from "lucide-react";

interface TestResultsProps {
  results: TestResultsType;
  onReviewTest: () => void;
  onRetakeTest: () => void;
  onViewSolution?: () => void;
}

export default function TestResultsDisplay({ results, onReviewTest, onRetakeTest, onViewSolution }: TestResultsProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const getMarksBadgeColor = (marks: number) => {
    if (marks >= 3) return "bg-green-100 text-green-800";
    if (marks >= 1) return "bg-yellow-100 text-yellow-800";
    if (marks === 0) return "bg-gray-100 text-gray-800";
    return "bg-red-100 text-red-800";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
          <p className="text-gray-600">Here's your detailed performance analysis</p>
        </div>

        {/* Overall Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{results.overall.totalMarks}</div>
              <div className="text-sm text-gray-600">Total Marks</div>
              <div className="text-xs text-gray-500">out of {results.overall.maxPossibleMarks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{results.overall.percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{results.overall.attempted}</div>
              <div className="text-sm text-gray-600">Attempted</div>
              <div className="text-xs text-gray-500">out of {results.overall.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{results.overall.totalTimeSpent}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Question Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Question Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Correct
                  </span>
                  <Badge className="bg-green-100 text-green-800">{results.overall.correct}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="h-4 w-4 bg-yellow-500 rounded mr-2" />
                    Partial
                  </span>
                  <Badge className="bg-yellow-100 text-yellow-800">{results.overall.partialCorrect}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    Incorrect
                  </span>
                  <Badge className="bg-red-100 text-red-800">{results.overall.incorrect}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <div className="h-4 w-4 bg-gray-400 rounded mr-2" />
                    Unanswered
                  </span>
                  <Badge className="bg-gray-100 text-gray-800">{results.overall.unanswered}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.subjectWise.map((subject) => (
                  <div key={subject.subject} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium capitalize">{subject.subject}</h3>
                      <Badge className={getMarksBadgeColor(subject.totalMarks)}>
                        {subject.totalMarks}/{subject.maxPossibleMarks}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-green-600">{subject.correct}</div>
                        <div className="text-gray-600">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-yellow-600">{subject.partialCorrect}</div>
                        <div className="text-gray-600">Partial</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-red-600">{subject.incorrect}</div>
                        <div className="text-gray-600">Wrong</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-600">
                          {subject.totalQuestions - subject.attempted}
                        </div>
                        <div className="text-gray-600">Unattempted</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question-wise Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Questions</TabsTrigger>
                <TabsTrigger value="physics">Physics</TabsTrigger>
                <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                <TabsTrigger value="maths">Mathematics</TabsTrigger>
              </TabsList>

              {['all', 'physics', 'chemistry', 'maths'].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {results.questionWise
                      .filter(q => tab === 'all' || q.subject === tab)
                      .map((question) => (
                        <div
                          key={question.questionId}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                              {question.questionNumber}
                            </div>
                            <div>
                              <div className="text-sm font-medium capitalize">{question.subject}</div>
                              <div className="text-xs text-gray-500 capitalize">{question.type}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {question.attempted ? (
                                  <Badge className={getMarksBadgeColor(question.partialMarks)}>
                                    {question.partialMarks > 0 ? '+' : ''}{question.partialMarks}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Not attempted</Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTime(question.timeSpent)}
                              </div>
                            </div>
                            
                            {question.correct && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {question.attempted && !question.correct && question.partialMarks > 0 && (
                              <div className="h-4 w-4 bg-yellow-500 rounded" />
                            )}
                            {question.attempted && question.partialMarks <= 0 && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button onClick={onReviewTest} size="lg" className="px-8">
            <Eye className="mr-2 h-4 w-4" />
            Review Test
          </Button>
          {onViewSolution && localStorage.getItem('mockTestSolution') && (
            <Button onClick={onViewSolution} size="lg" className="px-8 bg-green-600 hover:bg-green-700">
              <BookOpen className="mr-2 h-4 w-4" />
              View Solutions
            </Button>
          )}
          <Button onClick={onRetakeTest} variant="outline" size="lg" className="px-8">
            Retake Test
          </Button>
        </div>
      </div>
    </div>
  );
}