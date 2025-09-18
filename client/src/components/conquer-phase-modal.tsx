import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X, Trophy, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Mission {
  id: string;
  title: string;
  quizQuestions: QuizQuestion[];
}

interface ConquerPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission?: Mission;
}

export function ConquerPhaseModal({ isOpen, onClose, mission }: ConquerPhaseModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const quizQuestions: QuizQuestion[] = mission?.quizQuestions || [
    {
      question: "What is the most common cause of water contamination in rural areas?",
      options: [
        "Industrial pollution from factories",
        "Agricultural runoff and improper waste disposal",
        "Natural mineral deposits",
        "Excessive rainfall"
      ],
      correct: 1,
      explanation: "Agricultural runoff and improper waste disposal are the primary causes of water contamination in rural areas due to limited infrastructure."
    },
    {
      question: "Which filtration method is most effective for removing bacteria and viruses?",
      options: [
        "Sand filtration only",
        "Cloth filtration",
        "Combined chemical treatment and UV sterilization",
        "Boiling water for 1 minute"
      ],
      correct: 2,
      explanation: "Combined chemical treatment and UV sterilization provides the most comprehensive protection against microorganisms."
    },
    {
      question: "What is the main advantage of UV sterilization over chemical treatment?",
      options: [
        "It's much cheaper to implement",
        "It doesn't require electricity",
        "It kills microorganisms without adding chemicals to the water",
        "It works faster than chemical treatment"
      ],
      correct: 2,
      explanation: "UV sterilization's main advantage is that it effectively kills microorganisms without introducing chemicals into the water supply."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestion(0);
      setAnswers({});
      setShowFeedback({});
      setIsComplete(false);
    }
  }, [isOpen]);

  const handleAnswerChange = (value: string) => {
    const questionKey = `q${currentQuestion}`;
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
    setShowFeedback(prev => ({ ...prev, [questionKey]: true }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = () => {
    const correctAnswers = quizQuestions.reduce((count, question, index) => {
      const questionKey = `q${index}`;
      const userAnswer = parseInt(answers[questionKey] || "0");
      return userAnswer === question.correct ? count + 1 : count;
    }, 0);

    const score = (correctAnswers / quizQuestions.length) * 100;
    const xpEarned = 500 + (score === 100 ? 100 : 0);

    toast({
      title: "Mission Complete!",
      description: `You scored ${correctAnswers}/${quizQuestions.length} and earned ${xpEarned} XP!`,
    });

    // TODO: Save progress to backend
    console.log('Mission completed:', {
      score: correctAnswers,
      total: quizQuestions.length,
      percentage: score,
      xpEarned
    });

    setIsComplete(true);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQuestionKey = `q${currentQuestion}`;
  const hasAnswered = answers[currentQuestionKey] !== undefined;
  const currentQuestionData = quizQuestions[currentQuestion];
  const userAnswer = parseInt(answers[currentQuestionKey] || "0");
  const isCorrect = userAnswer === currentQuestionData?.correct;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <div className="sticky top-0 bg-background border-b p-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Conquer Phase: Final Quiz</DialogTitle>
              <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-conquer">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Progress value={progress} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid="text-quiz-progress">
                {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 overflow-y-auto">
          {!isComplete ? (
            <>
              <h3 className="text-lg font-semibold mb-4" data-testid="text-question">
                Question {currentQuestion + 1}: {currentQuestionData?.question}
              </h3>
              
              <RadioGroup 
                value={answers[currentQuestionKey] || ""} 
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestionData?.options.map((option, index) => {
                  const optionKey = index.toString();
                  const isSelected = answers[currentQuestionKey] === optionKey;
                  const isCorrectOption = index === currentQuestionData.correct;
                  
                  let optionClass = "flex items-center p-4 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50";
                  
                  if (showFeedback[currentQuestionKey] && isSelected) {
                    optionClass += isCorrect ? " bg-green-100 border-green-300" : " bg-red-100 border-red-300";
                  } else if (showFeedback[currentQuestionKey] && isCorrectOption) {
                    optionClass += " bg-green-100 border-green-300";
                  }

                  return (
                    <div key={index} className={optionClass}>
                      <RadioGroupItem value={optionKey} id={`option-${index}`} className="mr-3" />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>

              {showFeedback[currentQuestionKey] && (
                <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {currentQuestionData?.explanation}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 conquer-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mission Complete!</h3>
                <p className="text-muted-foreground">You've earned the Water Purification Expert badge!</p>
              </div>
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6">
                <div className="text-lg font-semibold text-secondary">+500 XP Earned</div>
                <div className="text-sm text-muted-foreground">Perfect score bonus: +100 XP</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/50">
          {!isComplete ? (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                data-testid="button-previous-question"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentQuestion === quizQuestions.length - 1 ? (
                <Button 
                  onClick={handleComplete}
                  disabled={!hasAnswered}
                  className="conquer-gradient text-white"
                  data-testid="button-complete-mission"
                >
                  Complete Mission
                  <Flag className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className="conquer-gradient text-white"
                  data-testid="button-next-question"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={onClose} className="w-full">
              Return to Dashboard
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
