"use client";

import type { QuizQuestion } from "@/types";
import VideoPlayer from "./VideoPlayer";
import QuizDisplay from "./QuizDisplay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface WatchPageClientProps {
  videoUrl: string | null;
  quizData: QuizQuestion[] | null;
  error?: string | null;
  isLoadingQuiz: boolean;
}

export default function WatchPageClient({ videoUrl, quizData, error, isLoadingQuiz }: WatchPageClientProps) {
  if (!videoUrl) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Video URL</AlertTitle>
          <AlertDescription>
            No video URL was provided. Please go back and enter a YouTube video URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <div className="w-full md:w-3/5 lg:w-2/3">
          <VideoPlayer videoUrl={videoUrl} />
        </div>
        <div className="w-full md:w-2/5 lg:w-1/3">
          <QuizDisplay 
            questions={quizData || []}
            isLoading={isLoadingQuiz}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
