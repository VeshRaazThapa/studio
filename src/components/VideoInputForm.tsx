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
import { Youtube } from "lucide-react";

const FormSchema = z.object({
  videoUrl: z.string().url({ message: "Please enter a valid YouTube URL." })
    .refine(url => url.includes("youtube.com") || url.includes("youtu.be"), {
      message: "URL must be a valid YouTube link.",
    }),
});

export default function VideoInputForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const url = new URL(data.videoUrl);
      // Basic validation, more specific checks can be added
      if ((url.hostname === "www.youtube.com" && url.pathname === "/watch" && url.searchParams.has("v")) ||
          url.hostname === "youtu.be") {
        router.push(`/watch?url=${encodeURIComponent(data.videoUrl)}`);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid YouTube URL",
          description: "Please provide a valid YouTube video URL.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "URL Processing Error",
        description: "There was an issue processing the URL. Please check and try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">YouTube Video URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input className="pl-10 text-base" placeholder="https://www.youtube.com/watch?v=..." {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6">
          Generate Quiz
        </Button>
      </form>
    </Form>
  );
}
