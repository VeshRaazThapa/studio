
"use client";

import transcript from '@/common/transcript.json';
import chaptersData from '@/common/chapters.json';
import { useEffect, useRef, useState } from 'react';
import { getYoutubeVideoId } from '@/lib/youtube';
import { AlertTriangle, ListVideo, PanelLeft, PanelLeftClose, ChevronDown } from 'lucide-react';

const transcriptData = transcript;
const allChapters = chaptersData.units.flatMap(unit => unit.chapters);

export default function VideoPlayer({ videoUrl }) {
  const videoId = getYoutubeVideoId(videoUrl);
  const playerRef = useRef(null);
  const transcriptRef = useRef(null);
  const chaptersRef = useRef(null);

  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(-1);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [isChaptersVisible, setIsChaptersVisible] = useState(true);

  // State to manage the open/closed status of each unit accordion
  const [openUnits, setOpenUnits] = useState(() => {
    const initialState = {};
    chaptersData.units.forEach(unit => {
      initialState[unit.unitNumber] = true; // All units are open by default
    });
    return initialState;
  });

  useEffect(() => {
    if (!videoId) return;
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player(`player-${videoId}`, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          'playsinline': 1
        },
        events: {
          onReady: () => setInterval(syncPlayerState, 500),
        }
      });
    };

    return () => {
      if (window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = null;
      }
    };
  }, [videoId]);

  const syncPlayerState = () => {
    if (!playerRef.current || playerRef.current.getPlayerState() !== 1) return;

    const currentTime = playerRef.current.getCurrentTime();

    // Sync Transcript
    const activeTranscriptIndex = transcriptData.transcript.findIndex((item, i) => {
      const nextStart = transcriptData.transcript[i + 1]?.start || Infinity;
      return currentTime >= item.start && currentTime < nextStart;
    });

    if (activeTranscriptIndex !== currentTranscriptIndex) {
      setCurrentTranscriptIndex(activeTranscriptIndex);
      const node = transcriptRef.current?.children[activeTranscriptIndex];
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Sync Chapters
    const activeChapter = allChapters.slice().reverse().find(ch => currentTime >= ch.startTime);

    if (activeChapter && activeChapter.chapterNumber !== currentChapterId) {
      setCurrentChapterId(activeChapter.chapterNumber);
      const node = document.getElementById(`chapter-${activeChapter.chapterNumber}`);
      if (node) {
        node.scrollIntoViw({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const jumpTo = (time) => playerRef.current?.seekTo(time, true);

  const handleUnitToggle = (unitNumber) => {
    setOpenUnits(prev => ({ ...prev, [unitNumber]: !prev[unitNumber] }));
  };
  
  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg shadow-inner">
        <div className="text-center text-destructive p-4">
          <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
          <p className="font-semibold">Invalid Video URL</p>
          <p className="text-sm">Could not load video. Please check the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar: Chapters (Conditionally Rendered) */}
      {isChaptersVisible && (
        <div className="w-full lg:w-1/3 lg:max-w-sm flex-shrink-0">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
              <ListVideo className="w-6 h-6" />
              Course Chapters
            </h2>
            <div
              className="max-h-[80vh] overflow-y-auto space-y-2 pr-2"
              ref={chaptersRef}
            >
              {chaptersData.units.map(unit => (
                <div key={unit.unitNumber}>
                  <button
                    onClick={() => handleUnitToggle(unit.unitNumber)}
                    className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-800"
                  >
                    <span className="font-semibold text-lg text-blue-400">
                      Unit {unit.unitNumber}: {unit.unitTitle}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openUnits[unit.unitNumber] ? '' : '-rotate-90'
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openUnits[unit.unitNumber] ? 'max-h-[1000px]' : 'max-h-0'
                    }`}
                  >
                    <div className="space-y-1 pt-2 pl-4 border-l-2 border-gray-700 ml-2">
                      {unit.chapters.map(chapter => (
                        <button
                          key={chapter.chapterNumber}
                          id={`chapter-${chapter.chapterNumber}`}
                          onClick={() => jumpTo(chapter.startTime)}
                          className={`w-full text-left p-2 rounded transition-colors text-sm ${
                            chapter.chapterNumber === currentChapterId
                              ? 'bg-blue-600 font-semibold text-white'
                              : 'hover:bg-gray-700'
                          }`}
                        >
                          {chapter.chapterTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right Content: Video Player and Transcript */}
      <div className={isChaptersVisible ? "w-full lg:w-2/3" : "w-full"}>
        <div className="flex flex-col gap-4">
          {/* Chapters Toggle Button */}
          <div className="mb-4">
            <button
              onClick={() => setIsChaptersVisible(!isChaptersVisible)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {isChaptersVisible ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              <span>{isChaptersVisible ? 'Hide Chapters' : 'Show Chapters'}</span>
            </button>
          </div>

          {/* Video Player */}
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl sticky top-4">
            <div id={`player-${videoId}`} className="w-full h-full" />
          </div>

          {/* Transcript Below */}
          <h2 className="text-xl font-bold mt-4">Transcript</h2>
          <div
            className="max-h-[400px] overflow-y-auto p-4 bg-gray-800 text-white rounded-lg shadow-inner"
            ref={transcriptRef}
          >
            {transcriptData.transcript.map((item, idx) => (
              <p
                key={idx}
                onClick={() => jumpTo(item.start)}
                className={`p-2 cursor-pointer rounded transition-colors leading-relaxed ${
                  idx === currentTranscriptIndex ? 'bg-blue-600/80 font-medium' : 'hover:bg-gray-700'
                }`}
              >
                {item.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}