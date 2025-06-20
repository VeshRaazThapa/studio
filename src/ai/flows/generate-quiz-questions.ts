'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating quiz questions from a YouTube video.
 *
 * - generateQuizQuestions - A function that triggers the quiz question generation flow.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  videoUrl: z.string().describe('The YouTube video URL.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers to the question.'),
      correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
    })
  ).describe('An array of quiz questions, each with options and the correct answer index.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an experienced educator creating quizzes for online educational videos.
  Given a YouTube video URL, your task is to generate a set of multiple-choice questions that test the viewer's understanding of the key concepts covered in the video. Each question should have several options, and indicate which option is the correct answer.

  Video URL: {{{videoUrl}}}

  Generate quiz questions to assess understanding of the video content. Return a JSON object that contains a list of question with their possible answers and correct answer index.
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateQuizQuestionsPrompt(input);
    return output!;
  }
);
