declare module 'youtube-transcript-api' {
  interface TranscriptItem {
    text: string;
    start: string;
    dur: string;
  }

  interface Track {
    transcript: TranscriptItem[];
  }

  interface FullTranscriptData {
    id: string;
    title: string;
    author: string;
    tracks?: Track[];
  }

  class TranscriptClient {
    ready: Promise<void>;
    getTranscript(videoId: string): Promise<FullTranscriptData>;
  }

  export default TranscriptClient;
}