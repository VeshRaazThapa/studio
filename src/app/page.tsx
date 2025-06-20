import VideoInputForm from '@/components/VideoInputForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 text-primary">Welcome to Edutube</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform any YouTube video into an interactive learning experience. Paste a video URL below to get started with AI-generated quizzes.
        </p>
      </section>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Start Learning</CardTitle>
          <CardDescription className="text-center">
            Enter a YouTube video URL to generate a quiz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VideoInputForm />
        </CardContent>
      </Card>

      <section className="mt-16 w-full max-w-4xl text-center">
        <h2 className="text-3xl font-headline font-semibold mb-8 text-primary">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/100x100.png" alt="Step 1 icon" width={80} height={80} className="mb-4 rounded-full" data-ai-hint="link input" />
            <h3 className="text-xl font-headline font-medium mb-2">1. Paste URL</h3>
            <p className="text-muted-foreground">Provide a link to any YouTube video you want to learn from.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/100x100.png" alt="Step 2 icon" width={80} height={80} className="mb-4 rounded-full" data-ai-hint="artificial intelligence" />
            <h3 className="text-xl font-headline font-medium mb-2">2. AI Magic</h3>
            <p className="text-muted-foreground">Our AI analyzes the video content and generates relevant quiz questions.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/100x100.png" alt="Step 3 icon" width={80} height={80} className="mb-4 rounded-full" data-ai-hint="quiz test" />
            <h3 className="text-xl font-headline font-medium mb-2">3. Learn & Test</h3>
            <p className="text-muted-foreground">Watch the video and answer questions to solidify your understanding.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
