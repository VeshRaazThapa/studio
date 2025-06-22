import YoutubeTranscript from 'youtube-transcript-api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing videoUrl in request body' }, { status: 400 });
    }

    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const transcriptData = await YoutubeTranscript.getTranscript(videoId);

    if (!transcriptData || transcriptData.length === 0) {
      return NextResponse.json({ error: 'No transcript available' }, { status: 404 });
    }

    // The library returns objects with text, offset (in ms), and duration (in ms).
    // Convert offset and duration to seconds.
    const simplifiedTranscript = transcriptData.map(({ text, offset, duration }) => ({
      text,
      start: offset / 1000,
      duration: duration / 1000,
    }));

    return NextResponse.json({
      id: videoId,
      transcript: simplifiedTranscript,
    });
  } catch (error: any) {
    console.error('Error fetching transcript with youtube-transcript-api:', error);
    let errorMessage = 'Failed to fetch transcript';
    if (error.message) {
      if (error.message.includes('TranscriptsDisabled') || error.message.includes('NoTranscriptFound')) {
        errorMessage = 'Transcripts are disabled or not available for this video.';
      } else if (error.message.includes('network error') || error.message.includes('fetch failed')) {
        errorMessage = 'A network error occurred while trying to fetch the transcript.';
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
