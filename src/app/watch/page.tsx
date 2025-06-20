import { Suspense } from 'react';
import { generateQuizQuestions, GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";
import WatchPageClient from "@/components/WatchPageClient";
import { Skeleton } from "@/components/ui/skeleton";

interface WatchPageProps {
  searchParams: {
    url?: string;
  };
}

async function QuizLoader({ videoUrl }: { videoUrl: string }) {
  let quizData: GenerateQuizQuestionsOutput["questions"] | null = null;
  let error: string | null = null;

  try {
    const result = await generateQuizQuestions({ videoUrl });
    quizData = result.questions;
    if (!quizData || quizData.length === 0) {
        error = "The AI could not generate questions for this video. It might be too short, private, or have content restrictions.";
    }
  } catch (e) {
    console.error("Failed to generate quiz questions:", e);
    error = "An unexpected error occurred while generating the quiz. Please try another video or check back later.";
  }

  return <WatchPageClient videoUrl={videoUrl} quizData={quizData} error={error} isLoadingQuiz={false} />;
}

function WatchPageSkeleton({ videoUrl }: { videoUrl: string | null }) {
  return (
     <div className="container mx-auto py-4 md:py-8 px-2 md:px-4">
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        <div className="w-full md:w-3/5 lg:w-2/3">
          {/* VideoPlayer will show its own state if videoUrl is invalid */}
          {videoUrl ? <Skeleton className="aspect-video w-full rounded-lg" /> : <div>Error: No video URL</div>}
        </div>
        <div className="w-full md:w-2/5 lg:w-1/3 space-y-4 p-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <Skeleton className="h-10 w-1/4 ml-auto" />
        </div>
      </div>
    </div>
  )
}


export default async function WatchPage({ searchParams }: WatchPageProps) {
  const videoUrl = searchParams.url || null;

  if (!videoUrl) {
    // This case should ideally be handled by WatchPageClient, but good to have a server-side check
    return <WatchPageClient videoUrl={null} quizData={null} error="No video URL provided." isLoadingQuiz={false} />;
  }
  
  return (
    <Suspense fallback={<WatchPageSkeleton videoUrl={videoUrl} />}>
      {/* @ts-expect-error Async Server Component */}
      <QuizLoader videoUrl={videoUrl} />
    </Suspense>
  );
}

// Ensure generateQuizQuestions is correctly typed for server components usage if needed
// For now, the provided type in flows seems okay for direct call.
