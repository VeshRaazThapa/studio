"use client";

import { getYoutubeVideoId } from '@/lib/youtube';
import { AlertTriangle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoId = getYoutubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg shadow-inner">
        <div className="text-center text-destructive p-4">
          <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
          <p className="font-semibold">Invalid Video URL</p>
          <p className="text-sm">Could not load video. Please check the URL.</p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl">
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        aria-label="YouTube Video Player"
      ></iframe>
    </div>
  );
}
