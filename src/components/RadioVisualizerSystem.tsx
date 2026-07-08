import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Volume2, VolumeX, Music, Radio, ChevronRight } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  genre: string;
  tempo: number;
  freqPattern: number[];
}

export const RadioVisualizerSystem = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('grid_pulse');
  const [volume, setVolume] = useState<number>(0.2);
  const [bars, setBars] = useState<number[]>(Array(18).fill(8));
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<any>(null);
  const noteIndexRef = useRef(0);

  const playlist: Track[] = [
    {
      id: 'grid_pulse',
      name: '01. NEURAL_GRID_BASS',
      genre: 'DARKSYNTH',
      tempo: 125,
      freqPattern: [110, 110, 130, 110, 165, 110, 130, 110] // A2, C3, E3...
    },
    {
      id: 'neon_hustle',
      name: '02. RETRO_FUTURE_DRIVE',
      genre: 'CYBERPUNK_WAVE',
      tempo: 140,
      freqPattern: [220, 261.63, 329.63, 392, 440, 523.25, 659.25, 783.99] // Melodic arpeggio
    },
    {
      id: 'stasis_void',
      name: '03. NEURAL_ATMOSPHERE_DRIFT',
      genre: 'AMBIENT_DRONE',
      tempo: 90,
      freqPattern: [55, 65.41, 73.42, 82.41] // Deep low sub drone
    }
  ];

  const activeTrackObj = playlist.find(t => t.id === currentTrack) || playlist[0];

  // Procedural Web Audio Synth loop
  const startProceduralSynth = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const noteDuration = 60 / activeTrackObj.tempo / 2; // eighth notes
      
      const playNextNote = () => {
        if (!isPlaying || !audioCtxRef.current) return;
        
        const pattern = activeTrackObj.freqPattern;
        const noteFreq = pattern[noteIndexRef.current % pattern.length];
        
        // Setup oscillator and filter for that iconic analog resonance
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const mainGain = ctx.createGain();

        osc.type = currentTrack === 'neon_hustle' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
        
        filter.type = 'lowpass';
        // Sweep filter cutoff matching frequency node
        filter.frequency.setValueAtTime(noteFreq * 2.5, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(noteFreq * 0.8, ctx.currentTime + noteDuration);

        mainGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
        mainGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + noteDuration - 0.02);

        osc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + noteDuration);

        // Advance sequential note pointer
        noteIndexRef.current += 1;

        // Visual equalizer animation triggers from beat
        setBars(prev => prev.map(() => 5 + Math.floor(Math.random() * 32)));

        // Schedule next beat
        synthTimerRef.current = setTimeout(playNextNote, noteDuration * 1000);
      };

      playNextNote();
    } catch (e) {
      console.warn("AudioContext failed to initialize:", e);
    }
  };

  const stopProceduralSynth = () => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
    }
    setBars(Array(18).fill(8));
  };

  useEffect(() => {
    if (isPlaying) {
      startProceduralSynth();
    } else {
      stopProceduralSynth();
    }
    return () => stopProceduralSynth();
  }, [isPlaying, currentTrack, volume]);

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNextTrack = () => {
    const currentIndex = playlist.findIndex(t => t.id === currentTrack);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex].id);
    noteIndexRef.current = 0;
  };

  return (
    <div className="etched-glass p-5 border border-white/5 bg-black/80 flex items-center justify-between gap-6 relative overflow-hidden group min-w-[340px] shadow-2xl">
      {/* Absolute micro grid */}
      <div className="absolute inset-0 opacity-[0.02] tech-grid pointer-events-none" />

      {/* Interactive cassette-like spectrograph */}
      <div className="flex flex-col gap-2 relative z-10 w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Radio size={14} className={`text-primary ${isPlaying ? 'animate-spin' : ''}`} />
            <span className="text-[7px] font-black tracking-[0.4em] text-white/30 uppercase font-mono">
              NEURAL_AUDIO_RADIO
            </span>
          </div>
          <span className="text-[7px] font-mono font-black text-secondary uppercase animate-pulse">
            {activeTrackObj.genre}
          </span>
        </div>

        {/* Bouncing visual frequency bars */}
        <div className="h-10 w-full flex items-end gap-[3px] border-b border-white/5 pb-1 bg-black/40 px-2 rounded-lg">
          {bars.map((height, idx) => (
            <motion.div
              key={idx}
              className={`flex-1 rounded-t-sm ${
                currentTrack === 'neon_hustle' ? 'bg-secondary' : 'bg-primary'
              }`}
              animate={{ height: `${height}px` }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            />
          ))}
        </div>

        {/* Control Desk buttons */}
        <div className="flex items-center justify-between mt-3 text-white">
          <div className="overflow-hidden max-w-[160px]">
            <p className="text-[10px] font-headline font-black uppercase tracking-wider text-white select-none whitespace-nowrap overflow-ellipsis">
              {activeTrackObj.name}
            </p>
            <span className="text-[7px] font-mono font-bold text-white/30 uppercase block">
              BPM: {activeTrackObj.tempo} | WebSynth Link
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tone Toggle */}
            <button
              onClick={handleTogglePlay}
              className={`w-9 h-9 border flex items-center justify-center transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-primary text-black border-primary shadow-neon' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
            >
              {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            </button>

            {/* Skip Track */}
            <button
              onClick={handleNextTrack}
              className="w-9 h-9 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
