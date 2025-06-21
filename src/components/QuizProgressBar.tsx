"use client";

import { Progress } from "@/components/ui/progress";

interface QuizProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

// export default function QuizProgressBar({ currentQuestionIndex, totalQuestions }: QuizProgressBarProps) {
//   const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

//   return (
//     <div className="w-full mb-4">
//       <div className="flex justify-between text-sm text-muted-foreground mb-1">
//         <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
//         <span>{Math.round(progressPercentage)}% Complete</span>
//       </div>
//       <Progress value={progressPercentage} aria-label={`Quiz progress: ${Math.round(progressPercentage)}% complete`} className="h-3 rounded-full" />
//     </div>
//   );
// }

export default function QuizProgressBar({ currentQuestionIndex, totalQuestions }: { currentQuestionIndex: number, totalQuestions: number }) {
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm text-muted-foreground mb-1">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      <Progress value={progressPercentage} aria-label={`Quiz progress: ${Math.round(progressPercentage)}% complete`} className="h-3 rounded-full" />
    </div>
  );
}
