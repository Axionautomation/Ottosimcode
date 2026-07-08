import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Zap, ShieldAlert, Wifi, RefreshCw } from 'lucide-react';

export interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
}

const playHackSound = (type: 'beep' | 'success' | 'fail' | 'select') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();

  if (type === 'select') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } else if (type === 'success') {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  } else if (type === 'fail') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }
};

export const HacknetSystem = ({
  onClose,
  stats,
  onAction,
  implants,
  nodesBreached,
  setNodesBreached
}: {
  onClose: () => void;
  stats: UserStats;
  onAction: (update: any) => void;
  implants: string[];
  nodesBreached: number;
  setNodesBreached: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [targetCode, setTargetCode] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [timer, setTimer] = useState(25);
  const [status, setStatus] = useState<'IDLE' | 'CRACKING' | 'SUCCESS' | 'FAIL'>('IDLE');
  const [rewardAmount, setRewardAmount] = useState(0);

  const hexValues = ['1C', 'E9', 'FF', '7A', '5B', 'E3', '04', 'D3', 'B2', '8A', 'C1', 'FE', 'A0', 'FD'];

  // Initialize standard level
  const generateLevel = () => {
    // Determine grid size (Installed cerebral/kiroshi ocular boosts decrypt time or narrows size)
    const hasOcular = implants.includes('kiroshi_ocular');
    const actualTimer = hasOcular ? 37 : 25; // +12s from ocular augment

    const cellsCount = 25; 
    const randomGrid = Array.from({ length: cellsCount }, () => hexValues[Math.floor(Math.random() * hexValues.length)]);
    
    // Choose index targets for code sequence to match
    const sequenceKeys: string[] = [];
    while (sequenceKeys.length < 3) {
      const val = randomGrid[Math.floor(Math.random() * cellsCount)];
      if (!sequenceKeys.includes(val)) sequenceKeys.push(val);
    }
    
    setGrid(randomGrid);
    setTargetCode(sequenceKeys);
    setSelectedIndices([]);
    setTimer(actualTimer);
    setStatus('CRACKING');

    // Base difficulty multiplier on node count
    const baseReward = 1500 + Math.floor(Math.random() * 500) + (nodesBreached * 150);
    setRewardAmount(baseReward);
  };

  useEffect(() => {
    generateLevel();
  }, [nodesBreached]);

  // Game countdown loop
  useEffect(() => {
    if (status !== 'CRACKING') return;
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setStatus('FAIL');
          playHackSound('fail');
          onAction({ 
            type: 'NOTIFY', 
            msg: `SIGNAL TRACED: BACKDOOR DECRYPTION COLLAPSED.` 
          });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const handleCellClick = (index: number) => {
    if (status !== 'CRACKING') return;
    
    const hex = grid[index];
    playHackSound('select');

    // Check if clicked cell matches our current target index sequence
    const currentTargetIndex = selectedIndices.length;
    const requiredHex = targetCode[currentTargetIndex];

    if (hex === requiredHex) {
      const nextSelected = [...selectedIndices, index];
      setSelectedIndices(nextSelected);

      // Decrypted full sequence successfully!
      if (nextSelected.length === targetCode.length) {
        setStatus('SUCCESS');
        playHackSound('success');
        setNodesBreached(prev => prev + 1);
        
        onAction({ 
          type: 'NOTIFY', 
          msg: `ACCESS LINK SECURED: DECRYPTION REWARD DEPOSITED (+$${rewardAmount.toLocaleString()})` 
        });

        // Pay the player standard credits and award intelligence boost
        onAction({
          type: 'STATS_UPDATE',
          stats: { netWorth: stats.netWorth + rewardAmount, iq: stats.iq + 2 }
        });
      }
    } else {
      // Wrong hex: reset sequence back to index 0
      setSelectedIndices([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[220] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-neon-glow-primary flex flex-col h-[75vh]">
        {/* CRT vignette styling */}
        <div className="absolute inset-0 pointer-events-none scanline opacity-40 z-10" />
        
        {/* Header telemetry info */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <Terminal size={24} className="text-primary animate-pulse" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-neon animate-pulse" />
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em] font-mono">HACKNET_TERMINAL_SUBSECT_09</span>
              </div>
              <h1 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">
                DECRYPTION_MODULE
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-8 font-mono">
            <div className="text-right">
              <span className="text-[8px] text-white/30 uppercase tracking-widest block">DECRYPTED_NODES</span>
              <span className="text-sm font-black text-white">{nodesBreached} _Bypassed</span>
            </div>
            
            <button 
              onClick={onClose}
              className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Console layout content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Grid Panel Hacking Terminal */}
          <div className="w-2/3 p-10 flex flex-col justify-center border-r border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[9px] font-mono font-black text-white/20 uppercase tracking-[0.3em]">
                MATRIX_KEYPORTAL_HEX_INDEX
              </span>
              
              <div className="flex items-center gap-3">
                <Wifi size={14} className="text-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">
                  ACTIVE_FIREWALL_TRACE
                </span>
              </div>
            </div>

            {/* Hex Grid visualizer */}
            <div className="grid grid-cols-5 gap-3 aspect-square max-w-[360px] mx-auto w-full">
              {grid.map((hex, idx) => {
                const isMatchedSel = selectedIndices.includes(idx);
                const isUnderSelection = idx === selectedIndices[selectedIndices.length - 1];

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square border flex items-center justify-center font-mono font-black text-xs transition-all relative ${
                      isMatchedSel
                        ? 'bg-primary text-black border-primary shadow-neon' 
                        : 'bg-white/[0.01] border-white/5 hover:border-primary/45 text-white/40 hover:text-white'
                    }`}
                  >
                    <span>{hex}</span>
                    {isMatchedSel && (
                      <motion.div 
                        layoutId={`active-pip-${idx}`} 
                        className="absolute inset-0 border-2 border-white pointer-events-none" 
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Decryption status panel (Right column) */}
          <div className="w-1/3 p-10 flex flex-col justify-between bg-white/[0.01]">
            <div className="space-y-8">
              {/* Target bypass code sequence */}
              <div className="bg-white/[0.02] p-6 border border-white/5 space-y-4">
                <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.2em]">
                  DESIRED_BYPASS_SEQUENCE
                </span>
                
                <div className="flex gap-4">
                  {targetCode.map((val, idx) => {
                    const isPassed = idx < selectedIndices.length;
                    const isActive = idx === selectedIndices.length;

                    return (
                      <div 
                        key={idx} 
                        className={`flex-1 aspect-square border-2 flex flex-col items-center justify-center font-mono font-black transition-all ${
                          isPassed 
                            ? 'bg-primary/20 border-primary text-primary shadow-neon-glow-sm'
                            : isActive 
                            ? 'bg-white/5 border-white/20 text-white animate-pulse'
                            : 'bg-black border-white/5 text-white/10'
                        }`}
                      >
                        <span className="text-sm">{val}</span>
                        <span className="text-[6px] text-white/30 tracking-widest uppercase mt-1">
                          K_{idx+1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ticking Trace Timer HUD */}
              <div className="bg-black border border-white/5 p-6 relative overflow-hidden">
                <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.2em] block mb-2">
                  TRACE_TIMEOUT_DIAL
                </span>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-headline font-black italic tabular-nums shadow-neon ${
                    timer <= 8 ? 'text-red-500 animate-pulse' : 'text-primary'
                  }`}>
                    {timer.toFixed(1)}s
                  </span>
                  <span className="text-[8px] font-black text-white/30 uppercase">
                    UNTIL_CYBER_LOCKDOWN
                  </span>
                </div>

                {/* Progress timer bar */}
                <div className="w-full h-1.5 bg-white/5 mt-4 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${timer <= 8 ? 'bg-red-500' : 'bg-primary'}`}
                    animate={{ width: `${(timer / (implants.includes('kiroshi_ocular') ? 37 : 25)) * 100}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>

              {/* Reward Potential info */}
              <div className="border border-white/5 p-6 flex justify-between">
                <div>
                  <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.2em]">REWARD</span>
                  <div className="text-lg font-headline font-black text-primary uppercase italic">
                    ${rewardAmount.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-[0.2em]">INTEL BOOST</span>
                  <div className="text-lg font-headline font-black text-secondary uppercase italic">
                    +2 _IQ
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive State Feedback / Buttons */}
            <div>
              <AnimatePresence mode="wait">
                {status === 'SUCCESS' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="p-4 bg-primary/10 border border-primary text-primary font-headline font-black uppercase text-xs tracking-widest">
                      SYSTEM_DECRYPTED_SUCCESSFULLY
                    </div>
                    <button 
                      onClick={generateLevel}
                      className="w-full bg-primary py-4 font-headline font-black text-black hover:bg-white uppercase text-xs tracking-[0.3em] shadow-neon mt-2 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} /> NEXT_DECRYPTION_NODE
                    </button>
                  </motion.div>
                )}

                {status === 'FAIL' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 font-headline font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                      <ShieldAlert size={14} /> DECRYPTION_FAILED
                    </div>
                    <button 
                      onClick={generateLevel}
                      className="w-full bg-white/10 hover:bg-white/20 py-4 font-headline font-black text-white text-xs tracking-[0.3em] border border-white/10 mt-2 cursor-pointer"
                    >
                      RESET_MODULE
                    </button>
                  </motion.div>
                )}

                {status === 'CRACKING' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-mono text-white/30 text-center uppercase tracking-widest"
                  >
                    {selectedIndices.length > 0 ? (
                      <span className="text-primary animate-pulse">Matching code key sequence index...</span>
                    ) : (
                      <span>Select consecutive values inside grid.</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
