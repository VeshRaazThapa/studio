
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Youtube, Loader2 } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid YouTube URL." })
    .refine(url => url.includes("youtube.com") || url.includes("youtu.be"), {
      message: "URL must be a valid YouTube link.",
    }),
});

// Helper function to format time (seconds to mm:ss)
function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function VideoInputForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [transcript, setTranscript] = useState<any[] | null>(null);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

 async function onSubmitTranscript(data: z.infer<typeof FormSchema>) {
    setIsLoadingTranscript(true);
    setTranscript(null); 
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: data.videoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Failed to fetch transcript",
          description: errorData.error || "An error occurred while fetching the transcript.",
        });
        setTranscript(null);
      } else {
        const transcriptData = await response.json();
        console.log('transcript data -->',transcriptData);
        // Assuming the API returns transcript objects with 'text' and 'start' (in seconds) or 'offset' (in ms)
        // The original code used entry.start.toFixed(2)
        // If transcriptData.transcript[0] has 'offset', use entry.offset / 1000 for time
        // If it has 'start', use entry.start
        // For this example, we'll assume `entry.start` is provided in seconds by the API.
        if (transcriptData.transcript && transcriptData.transcript.length > 0) {
          setTranscript(transcriptData.transcript);
        } else {
          setTranscript([]); 
          toast({
            variant: "default", // Using "default" variant for informational toast
            title: "No Transcript Found",
            description: "The video might not have a transcript, it's too short, or transcripts are disabled.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "URL Processing Error",
        description: "There was an issue processing the URL. Please check and try again.",
      });
      setTranscript(null);
    } finally {
      setIsLoadingTranscript(false);
    }
  }

  const handleGenerateQuiz = () => {
    const videoUrl = form.getValues("videoUrl");
    if (videoUrl && form.formState.isValid) {
      router.push(`/watch?url=${encodeURIComponent(videoUrl)}`);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid or Missing URL",
        description: "Please ensure you have a valid YouTube URL entered.",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTranscript)} className="space-y-6">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">YouTube Video URL</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      className="pl-10 text-base" 
                      placeholder="https://www.youtube.com/watch?v=..." 
                      {...field} 
                      disabled={isLoadingTranscript} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full text-lg py-6" 
            disabled={isLoadingTranscript || !form.watch("videoUrl") || !form.formState.isValid}
          >
            {isLoadingTranscript ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Fetching Transcript...
              </>
            ) : (
              "Fetch Transcript"
            )}
          </Button>
        </form>
      </Form>

      {isLoadingTranscript && !transcript && (
        <div className="mt-8 text-center py-6">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground mt-2">Loading transcript...</p>
        </div>
      )}

      {transcript && !isLoadingTranscript && (
        <div className="mt-8 p-4 bg-card/50 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-headline font-semibold text-primary">Transcript Preview</h3>
          {transcript.length > 0 ? (
            <ScrollArea className="h-[200px] w-full rounded-md border border-border bg-muted/20 p-3">
              {transcript.map((entry, index) => (
                <p key={index} className="text-sm mb-1.5 leading-relaxed">
                  <span className="font-medium text-primary/90">[{formatTime(entry.start || (entry.offset / 1000) || 0)}]</span> {entry.text}
                </p>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground text-center py-4">No transcript content found for this video, or the video is too short.</p>
          )}
          <Button 
            onClick={handleGenerateQuiz} 
            className="w-full text-lg py-6"
            disabled={transcript.length === 0} // Disable if no transcript text
          >
            Generate Quiz & Watch Video
          </Button>
        </div>
      )}
    </>
  );
}
