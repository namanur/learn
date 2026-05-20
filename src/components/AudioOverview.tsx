import { useState, useEffect, useRef } from 'react';
import { AudioSegment } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioOverviewProps {
  segments: AudioSegment[];
  phaseId: number;
}

export default function AudioOverview({ segments, phaseId }: AudioOverviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fallback Interval for visual simulation
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // When phase changes, reset audio completely
  useEffect(() => {
    stopSpeech();
    setActiveIndex(-1);
    setProgress(0);
    setIsPlaying(false);
  }, [phaseId]);

  // Handle synchronization of segments during visual simulation or real Speech
  const totalDurationPerSegment = 10; // seconds for simulation
  const totalDuration = segments.length * totalDurationPerSegment;

  const startSpeechSimulation = (startIndex = 0) => {
    if (simulationInterval.current) clearInterval(simulationInterval.current);

    let currentSec = startIndex * totalDurationPerSegment;
    setActiveIndex(startIndex);

    simulationInterval.current = setInterval(() => {
      currentSec += 0.5 * playbackRate;
      const currentSegmentIndex = Math.min(
        Math.floor(currentSec / totalDurationPerSegment),
        segments.length - 1
      );

      setActiveIndex(currentSegmentIndex);
      const calculatedProgress = Math.min((currentSec / totalDuration) * 100, 100);
      setProgress(calculatedProgress);

      if (currentSec >= totalDuration) {
        stopSpeech();
      }
    }, 500);
  };

  const speakSegment = (index: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (index >= segments.length) {
      stopSpeech();
      return;
    }

    const textToSpeak = segments[index].text;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : 1;

    // Get the standard host platform speaking voice
    const voices = window.speechSynthesis.getVoices();
    // Try to find an English voice
    const preferVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ||
                         voices.find((v) => v.lang.startsWith('en')) ||
                         voices[0];
    if (preferVoice) utterance.voice = preferVoice;

    utterance.onend = () => {
      if (index + 1 < segments.length) {
        speakSegment(index + 1);
      } else {
        stopSpeech();
      }
    };

    utterance.onerror = (e) => {
      // If speech fails or is blocked, the backup interval already manages highlighting
      console.warn("Speech Synthesis error/blocked, relying on visual playback tracker.", e);
    };

    setActiveIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause
      if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);
      const startingIndex = activeIndex === -1 || activeIndex >= segments.length ? 0 : activeIndex;

      if ('speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else {
            speakSegment(startingIndex);
          }
        } catch {
          // If browser locks speech, fall back gracefully
        }
      }

      startSpeechSimulation(startingIndex);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setIsPlaying(false);
  };

  const handleReset = () => {
    stopSpeech();
    setActiveIndex(-1);
    setProgress(0);
    handlePlayPause();
  };

  const selectSegmentDirectly = (index: number) => {
    setActiveIndex(index);
    setProgress((index * totalDurationPerSegment / totalDuration) * 100);
    if (isPlaying) {
      if ('speechSynthesis' in window) speakSegment(index);
      startSpeechSimulation(index);
    }
  };

  // Synchronize dynamic system mute state
  useEffect(() => {
    if ('speechSynthesis' in window && utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  // Synchronize browser playback rate
  useEffect(() => {
    if (isPlaying) {
      const startingIndex = activeIndex >= 0 ? activeIndex : 0;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        speakSegment(startingIndex);
      }
      startSpeechSimulation(startingIndex);
    }
  }, [playbackRate]);

  // Cleanup synthesis on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-lg">
            <Volume2 id="volume-icon-status" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-md font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              Intel Core Speech Overview
              <Sparkles id="sparkles-icon-synth" className="w-4 h-4 text-amber-500 animate-pulse" />
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Interactive structural audio guide synthesized from hardware transcripts
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Rate Selector */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-700 dark:text-stone-300 focus:outline-none"
          >
            <option value="0.75">0.75x</option>
            <option value="1">1.00x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.50x</option>
          </select>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-lg transition-colors"
            title="Restart Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animation Waveform Dashboard */}
      <div className="my-6 p-4 bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 tracking-wider uppercase">
            {isPlaying ? 'System Audio Output Active' : 'Standby Mode'}
          </span>
          <span className="text-xs font-mono font-semibold text-stone-500 dark:text-sky-400">
            {activeIndex !== -1 ? segments[activeIndex].timestamp : '00:00'} / {segments[segments.length - 1].timestamp}
          </span>
        </div>

        {/* Responsive Bouncing Waveform Simulation */}
        <div className="h-12 bg-stone-50 dark:bg-stone-900/50 rounded-md flex items-center justify-center gap-1 border border-stone-200/50 dark:border-stone-800/50 overflow-hidden px-4">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: 24 }).map((_, i) => {
              // Bouncing Heights
              const scaleY = isPlaying ? [1, 2.8, 1.2, 3.5, 0.8, 2.2, 1][(i + activeIndex) % 7] : 0.2;
              return (
                <motion.div
                  key={i}
                  animate={{ scaleY }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: isPlaying ? 0.6 + (i % 4) * 0.15 : 0.4,
                    ease: "easeInOut"
                  }}
                  className={`w-1.5 h-6 rounded-full origin-center ${
                    isPlaying ? 'bg-sky-500 dark:bg-sky-450' : 'bg-stone-300 dark:bg-stone-800'
                  }`}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Master Play Button Centered */}
        <button
          onClick={handlePlayPause}
          className="w-full py-4 px-6 bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Overview</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Play Phase {phaseId} Vocal Overview</span>
            </>
          )}
        </button>

        {/* Progress Timeline */}
        <div className="w-full bg-stone-150 dark:bg-stone-850 h-1.5 rounded-full overflow-hidden mt-2 relative">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Synchronized Script Transcript */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-3">
          Interactive Audio Transcript
        </h4>
        <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 text-sm leading-relaxed">
          {segments.map((segment, idx) => {
            const isSegmentActive = idx === activeIndex;
            return (
              <div
                key={segment.id}
                onClick={() => selectSegmentDirectly(idx)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 flex gap-3 ${
                  isSegmentActive
                    ? 'border-sky-500/50 bg-sky-50/70 dark:bg-sky-950/30 text-stone-900 dark:text-white shadow-xs'
                    : 'border-stone-150 dark:border-stone-850 bg-white dark:bg-stone-950/20 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span className="font-mono text-xs font-bold shrink-0 mt-0.5 text-stone-400 dark:text-stone-500">
                  [{segment.timestamp}]
                </span>
                <p className="flex-1 text-sm font-medium">{segment.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
