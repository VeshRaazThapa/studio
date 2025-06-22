"use client";
import VideoPlayer from "./VideoPlayer";
import QuizDisplay from "./QuizDisplay";
import { useEffect, useRef, useState, useMemo } from 'react';
import courseData from '@/common/chapters.json';
import TranscriptDisplay from '@/components/transcriptDisplay';
import transcriptJson from '@/common/transcript.json';
import ChaptersDisplay from '@/components/chaptersDisplay';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showTranscript, setShowTranscript] = useState(true);
  const [watchedChapters, setWatchedChapters] = useState<Set<number>>(new Set());
  const [chapterWatchData, setChapterWatchData] = useState<Map<number, { startTime: number; lastWatchedTime: number; totalWatched: number }>>(new Map());
  const playerRef = useRef<any>(null);
  const videoDurationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const allChapters = useMemo(() => courseData.units.flatMap(unit => unit.chapters), []);

  // Calculate chapter end times and add them to chapters
  const chaptersWithEndTimes = useMemo(() => {
    return allChapters.map((chapter, index) => {
      const nextChapter = allChapters[index + 1];
      const endTime = nextChapter ? nextChapter.startTime : (videoDurationRef.current || 0);
      return {
        ...chapter,
        endTime
      };
    });
  }, [allChapters, videoDurationRef.current]);

  const unitEndTimes = useMemo(() => {
    if (!videoDurationRef.current) return {};
    const endTimes: { [key: number]: number } = {};
    courseData.units.forEach((unit, index) => {
      const nextUnit = courseData.units[index + 1];
      endTimes[unit.unitNumber] = nextUnit ? nextUnit.chapters[0].startTime : videoDurationRef.current ?? 0;
    });
    return endTimes;
  }, [videoDurationRef.current]);

  // Calculate progress percentage based on properly watched chapters
  const progressPercentage = useMemo(() => {
    if (allChapters.length === 0) return 0;
    return Math.round((watchedChapters.size / allChapters.length) * 100);
  }, [watchedChapters.size, allChapters.length]);

  // Function to check if a chapter was properly watched (not skipped)
  const isChapterProperlyWatched = (chapterNumber: number): boolean => {
    const watchData = chapterWatchData.get(chapterNumber);
    if (!watchData) return false;
    
    const chapter = chaptersWithEndTimes.find(ch => ch.chapterNumber === chapterNumber);
    if (!chapter) return false;
    
    const chapterDuration = chapter.endTime - chapter.startTime;
    const watchPercentage = (watchData.totalWatched / chapterDuration) * 100;
    
    // Must watch at least 80% of the chapter AND not skip more than 60% of any portion
    return watchPercentage >= 80;
  };

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

    // Track watch time for each chapter
    chaptersWithEndTimes.forEach(chapter => {
      const chapterStart = chapter.startTime;
      const chapterEnd = chapter.endTime;
      
      // Check if we're currently within this chapter
      if (currentTime >= chapterStart && currentTime <= chapterEnd) {
        const existingData = chapterWatchData.get(chapter.chapterNumber);
        const timeDiff = currentTime - lastUpdateTimeRef.current;
        
        // Only count time if we're moving forward (not seeking backwards) and the difference is reasonable
        if (timeDiff > 0 && timeDiff < 5) { // Reduced threshold for better tracking
          const newTotalWatched = (existingData?.totalWatched || 0) + timeDiff;
          
          setChapterWatchData(prev => new Map(prev).set(chapter.chapterNumber, {
            startTime: existingData?.startTime || currentTime,
            lastWatchedTime: currentTime,
            totalWatched: newTotalWatched
          }));
        } else if (timeDiff >= 0) {
          // If seeking forward or small jump, just update the last watched time
          setChapterWatchData(prev => new Map(prev).set(chapter.chapterNumber, {
            startTime: existingData?.startTime || currentTime,
            lastWatchedTime: currentTime,
            totalWatched: existingData?.totalWatched || 0
          }));
        }
      }
    });

    // Update last update time
    lastUpdateTimeRef.current = currentTime;

  }, [currentTime, completedQuizUnits, activeQuizUnit, unitEndTimes, allChapters, chaptersWithEndTimes]);

  // Separate effect for checking chapter completion
  useEffect(() => {
    // Check if chapters are properly completed
    chaptersWithEndTimes.forEach(chapter => {
      const isProperlyWatched = isChapterProperlyWatched(chapter.chapterNumber);
      const watchData = chapterWatchData.get(chapter.chapterNumber);
      
      // Debug logging
      if (watchData && watchData.totalWatched > 0) {
        const chapterDuration = chapter.endTime - chapter.startTime;
        const watchPercentage = (watchData.totalWatched / chapterDuration) * 100;
        console.log(`Chapter ${chapter.chapterNumber}: ${watchData.totalWatched.toFixed(1)}s / ${chapterDuration.toFixed(1)}s = ${watchPercentage.toFixed(1)}% (Complete: ${isProperlyWatched})`);
      }
      
      if (isProperlyWatched && !watchedChapters.has(chapter.chapterNumber)) {
        console.log(`Marking chapter ${chapter.chapterNumber} as complete!`);
        setWatchedChapters(prev => new Set(prev).add(chapter.chapterNumber));
      } else if (!isProperlyWatched && watchedChapters.has(chapter.chapterNumber)) {
        // Remove from watched if no longer properly watched
        console.log(`Removing chapter ${chapter.chapterNumber} from completed list`);
        setWatchedChapters(prev => {
          const newSet = new Set(prev);
          newSet.delete(chapter.chapterNumber);
          return newSet;
        });
      }
    });
  }, [chapterWatchData, chaptersWithEndTimes, watchedChapters]);

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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column for chapters */}
        <div className="w-full lg:w-1/3">
          <ChaptersDisplay 
            courseData={courseData} 
            currentChapterId={currentChapterId} 
            onChapterSelect={handleTimeSelect}
            watchedChapters={watchedChapters}
            progressPercentage={progressPercentage}
            chapterWatchData={chapterWatchData}
          />
        </div>
        
        {/* Right column for video and scrollable content */}
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
              <div>
                {/* Transcript Toggle Button */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Transcript</h2>
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title={showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                  >
                    {showTranscript ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Transcript Display */}
                {showTranscript && (
                  <TranscriptDisplay transcriptData={transcriptJson} currentTime={currentTime} onTimeSelect={handleTimeSelect} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}