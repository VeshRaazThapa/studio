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

export default function QuizDisplay({ questions, isLoading, error, onQuizComplete }: { questions: QuizQuestion[], isLoading: boolean, error?: string | null, onQuizComplete: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => { setCurrentQuestionIndex(0); setUserAnswers([]); setScore(0); setQuizFinished(false); }, [questions]);

  const handleAnswerSubmit = (selectedOptionIndex: number) => {
    const isCorrect = selectedOptionIndex === questions[currentQuestionIndex].correctAnswerIndex;
    if (isCorrect) setScore(s => s + 1);
    setUserAnswers(ua => [...ua, { questionIndex: currentQuestionIndex, selectedOptionIndex, isCorrect }]);
  };

  const handleNextQuestion = () => { if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(i => i + 1); else setQuizFinished(true); };

  if (isLoading) return <div>Loading Quiz...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!questions || questions.length === 0) return <div>No quiz questions for this unit.</div>;

  if (quizFinished) {
    return <QuizResultsCard questions={questions} userAnswers={userAnswers} score={score} totalQuestions={questions.length} onContinue={onQuizComplete} />;
  }

  return (
    <div className="w-full space-y-6">
      <QuizProgressBar currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length} />
      <QuizQuestionCard question={questions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} totalQuestions={questions.length} onAnswerSubmit={handleAnswerSubmit} onNextQuestion={handleNextQuestion} onViewResults={() => setQuizFinished(true)} />
    </div>
  );
}