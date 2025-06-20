"use client";

import type { QuizQuestion, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface QuizResultsCardProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
}

export default function QuizResultsCard({
  questions,
  userAnswers,
  score,
  totalQuestions,
  onRestartQuiz,
}: QuizResultsCardProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <Card className="w-full shadow-xl animate-enter">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Quiz Completed!</CardTitle>
        <CardDescription className="text-lg">
          You scored <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{totalQuestions}</span> ({percentage}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {percentage >= 80 && <p className="text-xl text-center text-accent font-semibold">🎉 Excellent Work! 🎉</p>}
          {percentage < 80 && percentage >= 50 && <p className="text-xl text-center text-yellow-600 font-semibold">👍 Good Effort! 👍</p>}
          {percentage < 50 && <p className="text-xl text-center text-destructive font-semibold">💡 Keep Practicing! 💡</p>}
        </div>
        
        <h3 className="text-xl font-headline font-semibold mb-3 text-center">Review Your Answers:</h3>
        <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted/30">
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(ua => ua.questionIndex === index);
              const isCorrect = userAnswer?.isCorrect;
              const selectedOptionText = userAnswer !== undefined ? question.options[userAnswer.selectedOptionIndex] : "Not answered";
              const correctAnswerText = question.options[question.correctAnswerIndex];

              return (
                <div key={index} className="p-4 rounded-md bg-card shadow">
                  <p className="font-semibold text-base mb-1">{index + 1}. {question.question}</p>
                  <div className="text-sm space-y-1">
                    <p>Your answer: <span className={cn(isCorrect ? "text-green-600" : "text-red-600")}>{selectedOptionText}</span></p>
                    {!isCorrect && <p>Correct answer: <span className="text-green-600">{correctAnswerText}</span></p>}
                  </div>
                  <div className="mt-2">
                    {isCorrect ? (
                      <Badge variant="default" className="bg-accent text-accent-foreground"><CheckCircle className="mr-1 h-4 w-4" /> Correct</Badge>
                    ) : (
                      <Badge variant="destructive"><XCircle className="mr-1 h-4 w-4" /> Incorrect</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onRestartQuiz} className="text-lg px-8 py-4">
          <RotateCcw className="mr-2 h-5 w-5" /> Restart Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
