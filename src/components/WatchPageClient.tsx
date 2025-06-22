"use client";
import VideoPlayer from "./VideoPlayer";
import QuizDisplay from "./QuizDisplay";
import { useEffect, useRef, useState, useMemo } from 'react';
import courseData from '@/common/chapters.json';
import TranscriptDisplay from '@/components/transcriptDisplay';
import transcriptJson from '@/common/transcript.json';
import ChaptersDisplay from '@/components/chaptersDisplay';

// Define the Unit type if it's not already defined elsewhere
interface Unit {
  unitNumber: number;
  unitTitle: string;
  chapters: any[]; // Use a more specific type if available
}

export default function WatchPageClient({ videoUrl }: { videoUrl: string | null }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeQuizUnit, setActiveQuizUnit] = useState<Unit | null>(null);
  const [completedQuizUnits, setCompletedQuizUnits] = useState<Set<number>>(new Set());
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(null);
  const playerRef = useRef<any>(null);
  const videoDurationRef = useRef<number | null>(null);

  const allChapters = useMemo(() => courseData.units.flatMap(unit => unit.chapters), []);

  const unitEndTimes = useMemo(() => {
    if (!videoDurationRef.current) return {};
    const endTimes: { [key: number]: number } = {};
    courseData.units.forEach((unit, index) => {
      const nextUnit = courseData.units[index + 1];
      endTimes[unit.unitNumber] = nextUnit ? nextUnit.chapters[0].startTime : videoDurationRef.current ?? 0;
    });
    return endTimes;
  }, [videoDurationRef.current]);

  useEffect(() => {
    const duration = playerRef.current?.getDuration?.();
    if (duration) {
      videoDurationRef.current = duration;
    }

    if (activeQuizUnit) return;

    for (const unit of courseData.units) {
      if (currentTime >= (unitEndTimes[unit.unitNumber] || Infinity) && !completedQuizUnits.has(unit.unitNumber)) {
        setActiveQuizUnit(unit);
        playerRef.current?.pauseVideo();
        break;
      }
    }

    const activeChapter = allChapters.slice().reverse().find(ch => currentTime >= ch.startTime);
    if (activeChapter) setCurrentChapterId(activeChapter.chapterNumber);

  }, [currentTime, completedQuizUnits, activeQuizUnit, unitEndTimes, allChapters]);

  const handleQuizComplete = () => {
    if (activeQuizUnit) {
      setCompletedQuizUnits(prev => new Set(prev).add(activeQuizUnit.unitNumber));
      setActiveQuizUnit(null);
      playerRef.current?.playVideo();
    }
  };

  const handleTimeSelect = (time: number) => playerRef.current?.seekTo(time, true);

  const allQuestionsForUnit = useMemo(() => activeQuizUnit?.chapters.flatMap(ch => ch.quizz || []) || [], [activeQuizUnit]);

  if (!videoUrl) return <div>Missing Video URL.</div>;

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Left column for video and scrollable content */}
        <div className="w-full lg:w-2/3">
          {/* This div will stick to the top */}
          <div className="sticky top-4">
            <VideoPlayer videoUrl={videoUrl} onTimeUpdate={setCurrentTime} playerRef={playerRef} />
          </div>
          <div className='mt-4'>
            {activeQuizUnit ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Unit {activeQuizUnit.unitNumber} Quiz: {activeQuizUnit.unitTitle}</h2>
                <QuizDisplay key={activeQuizUnit.unitNumber} questions={allQuestionsForUnit} isLoading={false} onQuizComplete={handleQuizComplete} />
              </div>
            ) : (
              <TranscriptDisplay transcriptData={transcriptJson} currentTime={currentTime} onTimeSelect={handleTimeSelect} />
            )}
          </div>
        </div>
        {/* Right column for chapters */}
        <div className="w-full lg:w-1/3">
          <ChaptersDisplay courseData={courseData} currentChapterId={currentChapterId} onChapterSelect={handleTimeSelect} />
        </div>
      </div>
    </div>
  );
}