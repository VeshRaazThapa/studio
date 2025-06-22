import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}: {
  courseData: CourseData;
  currentChapterId: number | null;
  onChapterSelect: (time: number) => void;
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

  return (
    <div className="sticky top-4">
      <h2 className="text-xl font-bold mb-2">Chapters</h2>
      <ScrollArea className="h-[80vh]">
        {courseData.units.map((unit) => (
          <div key={unit.unitNumber}>
            <button
              onClick={() => toggleUnit(unit.unitNumber)}
              className="w-full text-left flex justify-between items-center my-2"
            >
              <h3 className="font-bold text-lg">{unit.unitTitle}</h3>
              <span className="text-sm">
                {openUnits.includes(unit.unitNumber) ? "▼" : "►"}
              </span>
            </button>
            {openUnits.includes(unit.unitNumber) &&
              unit.chapters.map((chapter) => (
                <button
                  key={chapter.chapterNumber}
                  onClick={() => onChapterSelect(chapter.startTime)}
                  className={`w-full text-left p-2 rounded ${
                    chapter.chapterNumber === currentChapterId
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {chapter.chapterTitle}
                </button>
              ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}