
"use client";
import { useEffect} from 'react';

export default function VideoPlayer({ videoUrl, onTimeUpdate, playerRef }: { videoUrl: string, onTimeUpdate: (time: number) => void, playerRef: React.MutableRefObject<any> }) {
  const getYoutubeVideoId = (url:string | null) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    } catch (e) {
        return null;
    }
  }
  const videoId = getYoutubeVideoId(videoUrl);

  useEffect(() => {
    if (!videoId) return;
    const setupPlayer = () => {
      playerRef.current = new window.YT.Player(`player-${videoId}`, {
        videoId,
        events: { onReady: () => setInterval(syncPlayerState, 500) }
      });
    };
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = setupPlayer;
    } else {
      setupPlayer();
    }
  }, [videoId]);

  const syncPlayerState = () => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function' && playerRef.current.getPlayerState() === 1) {
      const newTime = playerRef.current.getCurrentTime();
      onTimeUpdate(newTime);
    }
  };

  return (
    <div className="aspect-video w-full bg-black rounded-lg mb-4 sticky top-4">
        <div id={`player-${videoId}`} className="w-full h-full" />
    </div>
  );
}