import TranscriptAPI from 'youtube-transcript-api';
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

    // youtube-transcript-api@3.0.0 (BenSpark) uses a static method
    const transcript = await TranscriptAPI.getTranscript(videoId);
    
    console.log('Transcript fetched via youtube-transcript-api:', transcript);
    return NextResponse.json({ transcript });
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
