import { useState } from "react";
import { Upload, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface SubjectConfiguration {
  singleCorrect: { start: number; end: number; marks: number; negativeMark: number; enabled: boolean };
  multiCorrect: { start: number; end: number; marks: number; negativeMark: number; enabled: boolean };
  numerical: { start: number; end: number; marks: number; negativeMark: number; enabled: boolean };
}

interface TestConfiguration {
  testName: string;
  duration: number;
  subjects: {
    physics: SubjectConfiguration;
    chemistry: SubjectConfiguration;
    mathematics: SubjectConfiguration;
  };
}

interface PdfUploadProps {
  onTestStart: (file: File, solutionFile: File | null, answerKeyFile: File | null, config: TestConfiguration) => void;
}

export default function PdfUpload({ onTestStart }: PdfUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [testNameStep, setTestNameStep] = useState(true);
  const [config, setConfig] = useState<TestConfiguration>({
    testName: '',
    duration: 180,
    subjects: {
      physics: {
        singleCorrect: { start: 1, end: 20, marks: 4, negativeMark: -1, enabled: true },
        multiCorrect: { start: 21, end: 25, marks: 4, negativeMark: -2, enabled: true },
        numerical: { start: 26, end: 30, marks: 4, negativeMark: 0, enabled: true }
      },
      chemistry: {
        singleCorrect: { start: 31, end: 50, marks: 4, negativeMark: -1, enabled: true },
        multiCorrect: { start: 51, end: 55, marks: 4, negativeMark: -2, enabled: true },
        numerical: { start: 56, end: 60, marks: 4, negativeMark: 0, enabled: true }
      },
      mathematics: {
        singleCorrect: { start: 61, end: 80, marks: 4, negativeMark: -1, enabled: true },
        multiCorrect: { start: 81, end: 85, marks: 4, negativeMark: -2, enabled: true },
        numerical: { start: 86, end: 90, marks: 4, negativeMark: 0, enabled: true }
      }
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleSolutionFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSolutionFile(file);
    }
  };

  const handleAnswerKeyFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel' || 
                 file.name.endsWith('.xlsx') || 
                 file.name.endsWith('.xls'))) {
      setAnswerKeyFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const startTest = () => {
    if (!selectedFile) return;
    onTestStart(selectedFile, solutionFile, answerKeyFile, config);
  };

  const updateSubjectRange = (
    subject: 'physics' | 'chemistry' | 'mathematics',
    questionType: 'singleCorrect' | 'multiCorrect' | 'numerical',
    field: string,
    value: string | number | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: {
          ...prev.subjects[subject],
          [questionType]: {
            ...prev.subjects[subject][questionType],
            [field]: field === 'enabled' ? value : (typeof value === 'string' ? parseInt(value) || 0 : value)
          }
        }
      }
    }));
  };

  const renderSubjectConfig = (subjectName: 'physics' | 'chemistry' | 'mathematics', displayName: string, color: string) => (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold ${color}`}>{displayName}</h3>
      
      {/* Single Correct */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-blue-600 font-medium">Single Correct Questions</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.subjects[subjectName].singleCorrect.enabled}
                onCheckedChange={(checked) => updateSubjectRange(subjectName, 'singleCorrect', 'enabled', checked)}
              />
              <Label className="text-xs text-gray-500">
                {config.subjects[subjectName].singleCorrect.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-sc-start`} className="text-xs">Start Q#</Label>
              <Input
                id={`${subjectName}-sc-start`}
                type="number"
                value={config.subjects[subjectName].singleCorrect.start}
                onChange={(e) => updateSubjectRange(subjectName, 'singleCorrect', 'start', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].singleCorrect.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-sc-end`} className="text-xs">End Q#</Label>
              <Input
                id={`${subjectName}-sc-end`}
                type="number"
                value={config.subjects[subjectName].singleCorrect.end}
                onChange={(e) => updateSubjectRange(subjectName, 'singleCorrect', 'end', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].singleCorrect.enabled}
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs">Marking Scheme</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-sc-marks`} className="text-xs">+Marks</Label>
              <Input
                id={`${subjectName}-sc-marks`}
                type="number"
                value={config.subjects[subjectName].singleCorrect.marks}
                onChange={(e) => updateSubjectRange(subjectName, 'singleCorrect', 'marks', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].singleCorrect.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-sc-negative`} className="text-xs">-Marks</Label>
              <Input
                id={`${subjectName}-sc-negative`}
                type="number"
                value={config.subjects[subjectName].singleCorrect.negativeMark}
                onChange={(e) => updateSubjectRange(subjectName, 'singleCorrect', 'negativeMark', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].singleCorrect.enabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi Correct */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-purple-600 font-medium">Multi Correct Questions</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.subjects[subjectName].multiCorrect.enabled}
                onCheckedChange={(checked) => updateSubjectRange(subjectName, 'multiCorrect', 'enabled', checked)}
              />
              <Label className="text-xs text-gray-500">
                {config.subjects[subjectName].multiCorrect.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-mc-start`} className="text-xs">Start Q#</Label>
              <Input
                id={`${subjectName}-mc-start`}
                type="number"
                value={config.subjects[subjectName].multiCorrect.start}
                onChange={(e) => updateSubjectRange(subjectName, 'multiCorrect', 'start', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].multiCorrect.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-mc-end`} className="text-xs">End Q#</Label>
              <Input
                id={`${subjectName}-mc-end`}
                type="number"
                value={config.subjects[subjectName].multiCorrect.end}
                onChange={(e) => updateSubjectRange(subjectName, 'multiCorrect', 'end', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].multiCorrect.enabled}
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs">Marking Scheme</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-mc-marks`} className="text-xs">+Marks</Label>
              <Input
                id={`${subjectName}-mc-marks`}
                type="number"
                value={config.subjects[subjectName].multiCorrect.marks}
                onChange={(e) => updateSubjectRange(subjectName, 'multiCorrect', 'marks', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].multiCorrect.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-mc-negative`} className="text-xs">-Marks</Label>
              <Input
                id={`${subjectName}-mc-negative`}
                type="number"
                value={config.subjects[subjectName].multiCorrect.negativeMark}
                onChange={(e) => updateSubjectRange(subjectName, 'multiCorrect', 'negativeMark', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].multiCorrect.enabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Numerical */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-green-600 font-medium">Numerical Questions</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.subjects[subjectName].numerical.enabled}
                onCheckedChange={(checked) => updateSubjectRange(subjectName, 'numerical', 'enabled', checked)}
              />
              <Label className="text-xs text-gray-500">
                {config.subjects[subjectName].numerical.enabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-num-start`} className="text-xs">Start Q#</Label>
              <Input
                id={`${subjectName}-num-start`}
                type="number"
                value={config.subjects[subjectName].numerical.start}
                onChange={(e) => updateSubjectRange(subjectName, 'numerical', 'start', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].numerical.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-num-end`} className="text-xs">End Q#</Label>
              <Input
                id={`${subjectName}-num-end`}
                type="number"
                value={config.subjects[subjectName].numerical.end}
                onChange={(e) => updateSubjectRange(subjectName, 'numerical', 'end', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].numerical.enabled}
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs">Marking Scheme</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor={`${subjectName}-num-marks`} className="text-xs">+Marks</Label>
              <Input
                id={`${subjectName}-num-marks`}
                type="number"
                value={config.subjects[subjectName].numerical.marks}
                onChange={(e) => updateSubjectRange(subjectName, 'numerical', 'marks', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].numerical.enabled}
              />
            </div>
            <div>
              <Label htmlFor={`${subjectName}-num-negative`} className="text-xs">-Marks</Label>
              <Input
                id={`${subjectName}-num-negative`}
                type="number"
                value={config.subjects[subjectName].numerical.negativeMark}
                onChange={(e) => updateSubjectRange(subjectName, 'numerical', 'negativeMark', e.target.value)}
                className="h-8"
                disabled={!config.subjects[subjectName].numerical.enabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Test name step
  if (testNameStep) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Mock Test</h2>
              <p className="text-gray-600">Start by giving your test a name for easy identification</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="testName" className="text-lg font-medium">Test Name</Label>
                <Input
                  id="testName"
                  type="text"
                  placeholder="e.g., JEE Main 2024, NEET Practice Test 1, etc."
                  value={config.testName}
                  onChange={(e) => setConfig(prev => ({...prev, testName: e.target.value}))}
                  className="mt-2 text-lg h-12"
                />
                <p className="text-sm text-gray-500 mt-2">
                  This name will be used to organize your files:
                </p>
                <ul className="text-sm text-gray-600 mt-1 ml-4 space-y-1">
                  <li>• Question Paper: {config.testName || '[Test Name]'} - Question Paper</li>
                  <li>• Solution: {config.testName || '[Test Name]'} - Solution</li>
                  <li>• Answer Key: {config.testName || '[Test Name]'} - Answer Key</li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  if (config.testName.trim()) {
                    setTestNameStep(false);
                  }
                }}
                disabled={!config.testName.trim()}
                size="lg"
                className="w-full"
              >
                Continue to Upload Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-6xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-3xl font-bold text-gray-900">{config.testName}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTestNameStep(true)}
                className="ml-4 text-blue-600 hover:text-blue-800"
              >
                Edit Name
              </Button>
            </div>
            <p className="text-gray-600">Upload your PDF question paper and solution to start your mock test</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Paper Upload */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Question Paper PDF
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {selectedFile ? (
                  <div>
                    <p className="text-green-600 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Drop your PDF here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF files up to 50MB</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4" asChild>
                    <span>Browse Files</span>
                  </Button>
                </Label>
              </div>

              {selectedFile && (
                <Button
                  onClick={() => setShowConfig(!showConfig)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Configure Test Settings
                </Button>
              )}
            </div>

            {/* Solution PDF Upload */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Solution PDF (Optional)
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  solutionFile ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {solutionFile ? (
                  <div>
                    <p className="text-blue-600 font-medium">{solutionFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(solutionFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Upload solution PDF to view after test completion</p>
                    <p className="text-sm text-gray-500">This will help you review correct answers</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleSolutionFileSelect}
                  className="hidden"
                  id="solution-upload"
                />
                <Label htmlFor="solution-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4" asChild>
                    <span>Browse Solution PDF</span>
                  </Button>
                </Label>
              </div>
            </div>

            {/* Answer Key Excel Upload */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Answer Key Excel (Required)
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  answerKeyFile ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {answerKeyFile ? (
                  <div>
                    <p className="text-orange-600 font-medium">{answerKeyFile.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(answerKeyFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Upload Excel file with answer keys</p>
                    <p className="text-sm text-gray-500">
                      Column A: Question Number, Column B: Correct Answer(s)
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Single correct: A, Multi-correct: A,B,C, Numerical: 25.5
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleAnswerKeyFileSelect}
                  className="hidden"
                  id="answerkey-upload"
                />
                <Label htmlFor="answerkey-upload" className="cursor-pointer">
                  <Button variant="outline" className="mt-4" asChild>
                    <span>Browse Excel File</span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          {showConfig && (
            <div className="mt-8">
              {/* Test Duration */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Test Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="duration">Duration (minutes):</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={config.duration}
                      onChange={(e) => setConfig(prev => ({...prev, duration: parseInt(e.target.value) || 180}))}
                      className="w-24"
                      min="1"
                      max="300"
                    />
                    <span className="text-sm text-gray-500">
                      ({Math.floor(config.duration / 60)}h {config.duration % 60}m)
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Subject-wise Configuration */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Subject-wise Question Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="physics" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="physics">Physics</TabsTrigger>
                      <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                      <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="physics" className="mt-6">
                      {renderSubjectConfig('physics', 'Physics', 'text-red-600')}
                    </TabsContent>
                    
                    <TabsContent value="chemistry" className="mt-6">
                      {renderSubjectConfig('chemistry', 'Chemistry', 'text-blue-600')}
                    </TabsContent>
                    
                    <TabsContent value="mathematics" className="mt-6">
                      {renderSubjectConfig('mathematics', 'Mathematics', 'text-green-600')}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Marking Scheme Explanation */}
              <Card className="mb-4 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">Marking Scheme Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-600">Single Correct Questions:</h4>
                    <p className="text-sm text-gray-700">+4 marks for correct answer, -1 mark for wrong answer</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-600">Multi Correct Questions:</h4>
                    <p className="text-sm text-gray-700">
                      • <strong>+4 marks</strong> when all correct options are selected<br/>
                      • <strong>+1 mark</strong> for each correct option selected (partial marking)<br/>
                      • <strong>-2 marks</strong> if any wrong option is selected
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600">Numerical Questions:</h4>
                    <p className="text-sm text-gray-700">+4 marks for correct answer, 0 marks for wrong answer</p>
                  </div>
                </CardContent>
              </Card>

              {/* Start Test Button */}
              <Button
                onClick={startTest}
                disabled={!selectedFile || !answerKeyFile}
                size="lg"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Start Mock Test
              </Button>
              
              {selectedFile && !answerKeyFile && (
                <p className="text-orange-600 text-sm mt-2 text-center">
                  ⚠️ Answer key Excel file is required to start the test
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}