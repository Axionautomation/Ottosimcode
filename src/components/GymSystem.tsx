import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, X, Zap, Target } from 'lucide-react';

export const GymSystem = ({ onClose, onAction, type }: { onClose: () => void; onAction: (msg: string) => void; type: string }) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const playGymSound = (type: 'btn' | 'complete' | 'exertion') => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playBtn = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    };

    const playExertion = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    };

    const playComplete = () => {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.4);
      });
    };

    switch(type) {
      case 'btn': playBtn(); break;
      case 'exertion': playExertion(); break;
      case 'complete': playComplete(); break;
    }
  };

  const labels: Record<string, { title: string; action: string; icon: any }> = {
    treadmill: { title: 'Neural_Cardio_Node', action: 'Synchronize_Cadence', icon: <Activity size={48} /> },
    weights: { title: 'Power_Grid_Optimizer', action: 'Execute_Rep_Cycle', icon: <Target size={48} /> },
    shower: { title: 'Cryo_Buffer_Purge', action: 'Initiate_Coolant', icon: <Zap size={48} /> },
  };

  const current = labels[type] || labels.treadmill;

  const handleAction = () => {
    if (progress < 100) {
      playGymSound('exertion');
      setProgress(p => Math.min(100, p + 20));
      if (progress + 20 >= 100) {
        playGymSound('complete');
        setIsFinishing(true);
      }
    } else {
      playGymSound('btn');
      onAction(`Workout Module Complete: ${current.title}. Vitality +5%`);
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-12 text-white"
    >
      <div className="w-full max-w-xl bg-surface-container border border-white/5 p-12 relative overflow-hidden">
        {/* Background Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute inset-0 bg-primary/5 rounded-full blur-[100px]"
        />

        <button onClick={() => { playGymSound('btn'); onClose(); }} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="relative z-10 text-center">
          <div className="mb-8 text-primary flex justify-center">
            {current.icon}
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">{current.title}</h2>
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-8">Bio-Metric_Sync_Protocol_v4.2</p>

          {/* Simple Gym Interior Visual */}
          <div className="relative w-full aspect-[21/9] bg-black/40 border border-white/5 overflow-hidden mb-12 p-4">
            <div className="absolute inset-0 opacity-[0.05] tech-grid-fine pointer-events-none" />
            <div className={`flex items-center justify-around h-full ${progress >= 100 ? 'text-primary' : 'text-white/20'}`}>
                {[...Array(5)].map((_, i) => (
                    <motion.div 
                        key={i}
                        animate={progress > i * 20 ? { scale: [1, 1.2, 1], opacity: 1 } : { scale: 1, opacity: 0.2 }}
                        className="p-3 border border-current rounded-md relative group"
                    >
                        <Activity size={24} className={progress > i * 20 ? 'animate-pulse' : ''} />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[6px] font-black uppercase whitespace-nowrap opacity-40">NODE_0{i+1}</div>
                    </motion.div>
                ))}
            </div>
            {/* Ambient scan line */}
            <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-0 h-[1px] bg-primary/20 pointer-events-none"
            />
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-12">
            <motion.div 
              animate={{ width: `${progress}%` }} 
              className="h-full bg-primary shadow-[0_0_15px_#fbd12d]" 
            />
          </div>

          <button 
            onClick={handleAction} 
            className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(251,209,45,0.4)]"
          >
            {progress < 100 ? current.action : 'Sync_Complete_Exit'}
          </button>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {['HEART_RATE: 144BPM', 'NEURAL_LOAD: 12%', 'CALORIES: 450'].map(stat => (
              <div key={stat} className="text-[8px] font-black text-white/40 border border-white/5 py-2 px-3 uppercase tracking-tighter">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
