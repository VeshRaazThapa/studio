import React, { useState, useEffect, useRef, useMemo } from 'react';

interface TranscriptItem {
    text: string;
    start: number;
    duration: number;
}

interface TranscriptData {
    transcript: TranscriptItem[];
}

export default function TranscriptDisplay({ 
    transcriptData, 
    currentTime, 
    onTimeSelect 
}: { 
    transcriptData: TranscriptData, 
    currentTime: number, 
    onTimeSelect: (time: number) => void 
}) {
    const transcriptRef = useRef<HTMLDivElement>(null);
    const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(-1);
    const transcript = useMemo(() => transcriptData?.transcript || [], [transcriptData]);

    useEffect(() => {
        if (!transcript.length) return;

        // Find the current transcript item based on time
        const activeIdx = transcript.findIndex((item: TranscriptItem, i: number) => {
            const nextStart = transcript[i + 1]?.start ?? Infinity;
            return currentTime >= item.start && currentTime < nextStart;
        });

        if (activeIdx !== -1 && activeIdx !== currentTranscriptIndex) {
            setCurrentTranscriptIndex(activeIdx);

            // Add a small delay to ensure the DOM has updated with the new highlight
            setTimeout(() => {
                const container = transcriptRef.current;
                const element = container?.children[activeIdx] as HTMLElement;

                if (container && element) {
                    // Check if we need to scroll by comparing positions
                    const containerRect = container.getBoundingClientRect();
                    const elementRect = element.getBoundingClientRect();
                    
                    // Calculate how many lines away the element is from the top
                    const lineHeight = 24; // Approximate line height in pixels
                    const linesFromTop = Math.abs(elementRect.top - containerRect.top) / lineHeight;
                    
                    // Only scroll if the element is more than 3 lines away from the top
                    if (linesFromTop > 3) {
                        // Calculate a small scroll offset to bring the element into view
                        const scrollOffset = 100; // Small offset in pixels
                        const targetScrollTop = container.scrollTop + (elementRect.top - containerRect.top) - scrollOffset;
                        
                        container.scrollTo({
                            top: targetScrollTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 300);
        }
    }, [currentTime, transcript, currentTranscriptIndex]);

    return (
        <div className="h-full">
            {/* Faded Box Structure */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
                <div ref={transcriptRef} className="max-h-[60vh] overflow-y-auto space-y-1 pr-2">
                    {transcript.map((item: TranscriptItem, idx: number) => (
                        <p
                            key={idx}
                            onClick={() => onTimeSelect(item.start)}
                            className={`scroll-mt-16 p-2 cursor-pointer rounded transition-colors duration-200 ${
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