import TranscriptClient from 'youtube-transcript-api';
import { NextResponse } from 'next/server';
import transcript from '@/common/transcript.json'; // adjust based on `baseUrl` or relative path

export async function POST(request: Request) {

  return NextResponse.json(
    transcript
  );

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

    const client = new TranscriptClient();
    await client.ready;

    const fullTranscriptData = await client.getTranscript(videoId);

    // fullTranscriptData has the structure you posted, including "tracks"
    // Let's pick the first track's transcript if available
    const firstTrack = fullTranscriptData.tracks?.[0];

    if (!firstTrack || !firstTrack.transcript) {
      return NextResponse.json({ error: 'No transcript available' }, { status: 404 });
    }

    // Map to simplified array of lines with start time (number), duration (number), and text
    const simplifiedTranscript = firstTrack.transcript.map(({ text, start, dur }) => ({
      text,
      start: parseFloat(start),
      duration: parseFloat(dur),
    }));

    return NextResponse.json({
      id: fullTranscriptData.id,
      title: fullTranscriptData.title,
      author: fullTranscriptData.author,
      transcript: simplifiedTranscript,
    })
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
