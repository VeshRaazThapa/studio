import type { GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";

export type QuizQuestion = GenerateQuizQuestionsOutput["questions"][0];

export interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
