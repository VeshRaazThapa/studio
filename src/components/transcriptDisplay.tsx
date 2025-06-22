import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function TranscriptDisplay({ transcriptData, currentTime, onTimeSelect }: { transcriptData: any, currentTime: number, onTimeSelect: (time: number) => void }) {
    const transcriptRef = useRef<HTMLDivElement>(null);
    const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(-1);
    const transcript = useMemo(() => transcriptData?.transcript || [], [transcriptData]);

    useEffect(() => {
        if (!transcript.length) return;

        const activeIdx = transcript.findIndex((item, i) => currentTime >= item.start && currentTime < (transcript[i + 1]?.start ?? Infinity));

        if (activeIdx !== -1 && activeIdx !== currentTranscriptIndex) {
            setCurrentTranscriptIndex(activeIdx);

            const container = transcriptRef.current;
            // Unsafely cast to HTMLElement to access properties like `children` and `getBoundingClientRect`.
            // In a real-world scenario, you might want to add more robust type checking.
            const element = container?.children[activeIdx] as HTMLElement;

            // 👇 THE KEY CHANGE IS HERE 👇
            if (container && element) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();

                // Check if the element is NOT within the visible bounds of the container
                const isNotInView =
                    elementRect.top < containerRect.top ||
                    elementRect.bottom > containerRect.bottom;

                // Only scroll if the element is not already visible
                if (isNotInView) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }, [currentTime, transcript, currentTranscriptIndex]);

    return (
        <div className="h-full">
            {/* Faded Box Structure */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                <div ref={transcriptRef} className="max-h-[60vh] overflow-y-auto space-y-1 pr-2">
                    {transcript.map((item, idx) => (
                        <p
                            key={idx}
                            onClick={() => onTimeSelect(item.start)}
                            className={`scroll-mt-32 p-2 cursor-pointer rounded transition-colors duration-200 ${
                                idx === currentTranscriptIndex
                                    ? 'bg-primary/20 text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            {item.text}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}