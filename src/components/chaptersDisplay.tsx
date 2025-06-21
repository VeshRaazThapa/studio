import { ScrollArea } from "@/components/ui/scroll-area";


export default function ChaptersDisplay({ courseData, currentChapterId, onChapterSelect }: { courseData: CourseData, currentChapterId: number | null, onChapterSelect: (time: number) => void }) {
    return (
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-2">Chapters</h2>
          <ScrollArea className="h-[80vh]">
            {courseData.units.map(unit => (
              <div key={unit.unitNumber}>
                <h3 className="font-bold text-lg my-2">{unit.unitTitle}</h3>
                {unit.chapters.map(chapter => (
                  <button key={chapter.chapterNumber} onClick={() => onChapterSelect(chapter.startTime)} className={`w-full text-left p-2 rounded ${chapter.chapterNumber === currentChapterId ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                    {chapter.chapterTitle}
                  </button>
                ))}
              </div>
            ))}
          </ScrollArea>
        </div>
      );
}