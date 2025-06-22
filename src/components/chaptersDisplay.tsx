import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, CheckCircle } from "lucide-react";

// Assuming CourseData is defined elsewhere, for example:
interface Chapter {
  chapterNumber: number;
  chapterTitle: string;
  startTime: number;
}

interface Unit {
  unitNumber: number;
  unitTitle: string;
  chapters: Chapter[];
}

interface CourseData {
  units: Unit[];
}

export default function ChaptersDisplay({
  courseData,
  currentChapterId,
  onChapterSelect,
  watchedChapters,
  progressPercentage,
  chapterWatchData,
}: {
  courseData: CourseData;
  currentChapterId: number | null;
  onChapterSelect: (time: number) => void;
  watchedChapters: Set<number>;
  progressPercentage: number;
  chapterWatchData: Map<number, { startTime: number; lastWatchedTime: number; totalWatched: number }>;
}) {
  // Initialize the state with all unit numbers to have them open by default.
  // The function passed to useState ensures this map only runs on the initial render.
  const [openUnits, setOpenUnits] = useState<number[]>(() =>
    courseData.units.map((unit) => unit.unitNumber)
  );

  const toggleUnit = (unitNumber: number) => {
    setOpenUnits((prevOpenUnits) =>
      prevOpenUnits.includes(unitNumber)
        ? prevOpenUnits.filter((num) => num !== unitNumber)
        : [...prevOpenUnits, unitNumber]
    );
  };

  const toggleAllUnits = () => {
    if (openUnits.length === courseData.units.length) {
      // If all units are open, close all
      setOpenUnits([]);
    } else {
      // If some or none are open, open all
      setOpenUnits(courseData.units.map((unit) => unit.unitNumber));
    }
  };

  // Function to get chapter status
  const getChapterStatus = (chapterNumber: number) => {
    if (watchedChapters.has(chapterNumber)) {
      return 'completed'; // Green check
    }
    
    const watchData = chapterWatchData.get(chapterNumber);
    if (watchData && watchData.totalWatched > 0) {
      return 'partial'; // Faded white check
    }
    
    return 'unwatched'; // No check
  };

  return (
    <div className="sticky top-4">
      <div className="bg-gray-900 text-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Chapters</h2>
            <div className="text-sm text-gray-300 mt-1">
              Progress: {progressPercentage}%
            </div>
          </div>
          <button
            onClick={toggleAllUnits}
            className="p-2 rounded-md hover:bg-gray-800 transition-colors"
            title={openUnits.length === courseData.units.length ? "Collapse All" : "Expand All"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <ScrollArea className="h-[80vh]">
          {courseData.units.map((unit) => (
            <div key={unit.unitNumber}>
              <button
                onClick={() => toggleUnit(unit.unitNumber)}
                className="w-full text-left flex justify-between items-center my-2 text-white hover:bg-gray-800 rounded p-2 transition-colors"
              >
                <h3 className="font-bold text-lg">{unit.unitTitle}</h3>
                <span className="text-sm">
                  {openUnits.includes(unit.unitNumber) ? "▼" : "►"}
                </span>
              </button>
              {openUnits.includes(unit.unitNumber) &&
                unit.chapters.map((chapter) => {
                  const status = getChapterStatus(chapter.chapterNumber);
                  return (
                    <button
                      key={chapter.chapterNumber}
                      onClick={() => onChapterSelect(chapter.startTime)}
                      className={`w-full text-left p-2 pr-6 rounded ml-4 transition-colors flex items-center justify-between ${
                        chapter.chapterNumber === currentChapterId
                          ? "bg-white text-black font-semibold"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="flex-1">{chapter.chapterTitle}</span>
                      {status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 ml-2" />
                      )}
                      {status === 'partial' && (
                        <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}