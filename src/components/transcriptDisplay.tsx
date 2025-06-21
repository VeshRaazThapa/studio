import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';


export default function TranscriptDisplay({ transcriptData, currentTime, onTimeSelect }: { transcriptData: any, currentTime: number, onTimeSelect: (time: number) => void }) {
    const transcriptRef = useRef<HTMLDivElement>(null);
    const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(-1);
    const transcript = useMemo(() => transcriptData?.transcript || [], [transcriptData]);

    useEffect(() => {
        if (!transcript.length) return;
        const activeIdx = transcript.findIndex((item, i) => currentTime >= item.start && currentTime < (transcript[i + 1]?.start ?? Infinity));
        if (activeIdx !== -1 && activeIdx !== currentTranscriptIndex) {
            setCurrentTranscriptIndex(activeIdx);
            transcriptRef.current?.children[activeIdx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTime, transcript, currentTranscriptIndex]);

    return (
        <div className="h-full">
            <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-background/80 py-2">Transcript</h2>
            <div ref={transcriptRef} className="max-h-[80vh] overflow-y-auto space-y-1">
                {transcript.map((item, idx) => (
                    <p key={idx} onClick={() => onTimeSelect(item.start)} className={`p-2 cursor-pointer rounded ${idx === currentTranscriptIndex ? 'bg-primary/20' : 'hover:bg-muted'}`}>
                        {item.text}
                    </p>
                ))}
            </div>
        </div>
    );
}