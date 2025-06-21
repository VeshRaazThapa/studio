"use client";

import type { QuizQuestion } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (selectedOptionIndex: number) => void;
  onNextQuestion: () => void;
  onViewResults: () => void;
}

// export default function QuizQuestionCard({
//   question,
//   questionNumber,
//   totalQuestions,
//   onAnswerSubmit,
//   onNextQuestion,
//   onViewResults,
// }: QuizQuestionCardProps) {
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [showFeedback, setShowFeedback] = useState(false);

//   // Reset state when question changes
//   useEffect(() => {
//     setSelectedOption(null);
//     setIsSubmitted(false);
//     setShowFeedback(false);
//   }, [question]);

//   const handleSubmit = () => {
//     if (selectedOption === null) return;
//     setIsSubmitted(true);
//     setShowFeedback(true);
//     onAnswerSubmit(selectedOption);
//   };

//   const handleNext = () => {
//     if (questionNumber < totalQuestions) {
//       onNextQuestion();
//     } else {
//       onViewResults();
//     }
//   };

//   const getOptionClasses = (index: number) => {
//     if (!showFeedback) {
//       return selectedOption === index ? "border-primary ring-2 ring-primary" : "border-border";
//     }
//     // Feedback state
//     if (index === question.correctAnswerIndex) {
//       return "border-green-500 bg-green-500/10 ring-2 ring-green-500";
//     }
//     if (index === selectedOption && index !== question.correctAnswerIndex) {
//       return "border-red-500 bg-red-500/10 ring-2 ring-red-500";
//     }
//     return "border-border opacity-70";
//   };

//   const getOptionIcon = (index: number) => {
//     if (!showFeedback) return null;
//     if (index === question.correctAnswerIndex) {
//       return <CheckCircle className="h-5 w-5 text-green-500" />;
//     }
//     if (index === selectedOption && index !== question.correctAnswerIndex) {
//       return <XCircle className="h-5 w-5 text-red-500" />;
//     }
//     return null;
//   }

//   return (
//     <Card className="w-full shadow-lg animate-enter">
//       <CardHeader>
//         <CardTitle className="font-headline text-xl md:text-2xl">{`Question ${questionNumber}`}</CardTitle>
//         <CardDescription className="text-base">{question.question}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <RadioGroup
//           value={selectedOption !== null ? String(selectedOption) : undefined}
//           onValueChange={(value) => setSelectedOption(Number(value))}
//           disabled={isSubmitted}
//           className="space-y-3"
//         >
//           {question.options.map((option, index) => (
//             <Label
//               key={index}
//               htmlFor={`option-${index}`}
//               className={cn(
//                 "flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-all duration-300 hover:bg-muted/50",
//                 getOptionClasses(index)
//               )}
//             >
//               <RadioGroupItem value={String(index)} id={`option-${index}`} className="shrink-0" />
//               <span className="flex-grow text-base">{option}</span>
//               {getOptionIcon(index)}
//             </Label>
//           ))}
//         </RadioGroup>
//       </CardContent>
//       <CardFooter className="flex justify-end">
//         {!isSubmitted ? (
//           <Button onClick={handleSubmit} disabled={selectedOption === null} className="text-base px-6 py-3">
//             Submit Answer
//           </Button>
//         ) : questionNumber < totalQuestions ? (
//           <Button onClick={handleNext} className="text-base px-6 py-3 bg-accent hover:bg-accent/90">
//             Next Question <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         ) : (
//           <Button onClick={handleNext} className="text-base px-6 py-3 bg-primary hover:bg-primary/90">
//             View Results <Award className="ml-2 h-4 w-4" />
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }


export default function QuizQuestionCard({ question, questionNumber, totalQuestions, onAnswerSubmit, onNextQuestion, onViewResults }: { question: QuizQuestion, questionNumber: number, totalQuestions: number, onAnswerSubmit: (idx: number) => void, onNextQuestion: () => void, onViewResults: () => void }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => { setSelectedOption(null); setIsSubmitted(false); }, [question]);

  const handleSubmit = () => { if (selectedOption === null) return; setIsSubmitted(true); onAnswerSubmit(selectedOption); };
  const handleNext = () => { if (questionNumber < totalQuestions) { onNextQuestion(); } else { onViewResults(); } };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>{`Question ${questionNumber}`}</CardTitle>
        <CardDescription>{question.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption !== null ? String(selectedOption) : undefined} onValueChange={(v) => setSelectedOption(Number(v))} disabled={isSubmitted} className="space-y-3">
          {question.options.map((option, index) => (
            <Label key={index} htmlFor={`option-${index}`} className={cn("flex items-center space-x-3 rounded-md border p-4 cursor-pointer", isSubmitted && (index === question.correctAnswerIndex ? 'border-green-500' : (index === selectedOption ? 'border-red-500' : '')))}>
              <RadioGroupItem value={String(index)} id={`option-${index}`} />
              <span>{option}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!isSubmitted ? ( <Button onClick={handleSubmit} disabled={selectedOption === null}>Submit</Button> ) : (
          <Button onClick={handleNext}>{questionNumber < totalQuestions ? 'Next Question' : 'View Results'}</Button>
        )}
      </CardFooter>
    </Card>
  );
}
