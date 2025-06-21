import type { GenerateQuizQuestionsOutput } from "@/ai/flows/generate-quiz-questions";

// export type QuizQuestion = GenerateQuizQuestionsOutput["questions"][0];

export interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Chapter {
  chapterNumber: number;
  chapterTitle: string;
  startTime: number;
  quizz: QuizQuestion[];
}

export interface Unit {
  unitNumber: number;
  unitTitle: string;
  chapters: Chapter[];
}

export interface CourseData {
  courseTitle: string;
  author: string;
  units: Unit[];
}

export interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
