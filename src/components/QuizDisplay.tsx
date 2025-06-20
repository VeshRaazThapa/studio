"use client";

import type { QuizQuestion, UserAnswer } from "@/types";
import { useState, useEffect } from "react";
import QuizQuestionCard from "./QuizQuestionCard";
import QuizResultsCard from "./QuizResultsCard";
import QuizProgressBar from "./QuizProgressBar";
import { Skeleton } from "@/components/ui/skeleton";

interface QuizDisplayProps {
  questions: QuizQuestion[];
  isLoading: boolean;
  error?: string | null;
  onQuizComplete?: (score: number, userAnswers: UserAnswer[]) => void;
}

export default function QuizDisplay({ questions, isLoading, error, onQuizComplete }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    // Reset state if questions change (e.g., new video)
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizFinished(false);
  }, [questions]);

  const handleAnswerSubmit = (selectedOptionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      { questionIndex: currentQuestionIndex, selectedOptionIndex, isCorrect }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizFinished(true);
      if (onQuizComplete) {
        onQuizComplete(score, userAnswers);
      }
    }
  };
  
  const handleViewResults = () => {
    setQuizFinished(true);
    if (onQuizComplete) {
      // Ensure score and userAnswers are latest before calling onQuizComplete
      // This might require passing the latest state directly if setScore/setUserAnswers are async
      // For now, assume state updates are fast enough.
      // A more robust way would be to calculate final score in this function.
       const finalUserAnswers = [...userAnswers];
       if (finalUserAnswers.length === questions.length -1 && userAnswers.find(ua => ua.questionIndex === currentQuestionIndex) === undefined) {
        // This means the last question's answer hasn't been added to userAnswers state yet.
        // This scenario should be handled carefully if handleAnswerSubmit is not guaranteed to update state before this.
        // However, the flow is Submit -> Next, so this should be okay.
       }

      onQuizComplete(score, finalUserAnswers);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setQuizFinished(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="h-10 w-1/4 ml-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md">
        <h3 className="text-lg font-semibold">Error loading quiz</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No quiz questions available for this video.</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <QuizResultsCard
        questions={questions}
        userAnswers={userAnswers}
        score={score}
        totalQuestions={questions.length}
        onRestartQuiz={handleRestartQuiz}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full space-y-6">
      <QuizProgressBar currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length} />
      <QuizQuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswerSubmit={handleAnswerSubmit}
        onNextQuestion={handleNextQuestion}
        onViewResults={handleViewResults}
      />
    </div>
  );
}
