"use client";

import type { QuizQuestion, UserAnswer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
import { Youtube, Loader2, CheckCircle, XCircle, ArrowRight, Award, AlertTriangle, ListVideo, PanelLeft, PanelLeftClose, ChevronDown, RotateCcw } from "lucide-react";

interface QuizResultsCardProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  onRestartQuiz: () => void;
}

export default function QuizResultsCard({ questions, userAnswers, score, totalQuestions, onContinue }: { questions: QuizQuestion[], userAnswers: UserAnswer[], score: number, totalQuestions: number, onContinue: () => void }) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl text-primary">Quiz Completed!</CardTitle>
        <CardDescription>You scored {score} out of {totalQuestions} ({percentage}%)</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md border p-4">
          {questions.map((q, i) => <div key={i}><p>{q.question}</p></div>)}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onContinue} className="text-lg">Continue Lesson <ArrowRight className="ml-2 h-5 w-5" /></Button>
      </CardFooter>
    </Card>
  );
}
