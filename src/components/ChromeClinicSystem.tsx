import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, X, Zap, Cpu as Sparkles, Shield, Eye, Flame, TrendingUp } from 'lucide-react';

export interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
  level: number;
  careerPath: 'Tech' | 'Finance' | 'Creative' | 'Medicine' | 'Law' | 'Service' | 'Underground' | 'Academic';
}

interface Implant {
  id: string;
  name: string;
  description: string;
  cost: number;
  statBonus: string;
  icon: React.ReactNode;
  category: 'CEREBRAL' | 'COGNITIVE' | 'SENSORY' | 'SYNERGY';
  slot: string;
}

export const ChromeClinicSystem = ({ 
  onClose, 
  stats, 
  onAction, 
  implants, 
  setImplants 
}: { 
  onClose: () => void; 
  stats: UserStats; 
  onAction: (update: any) => void; 
  implants: string[]; 
  setImplants: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [selectedImplant, setSelectedImplant] = useState<string | null>('cerebral_synapse');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);

  const implantList: Implant[] = [
    {
      id: 'cerebral_synapse',
      name: 'Neural Sync Link x8',
      description: 'Overclocks synaptic transmission. Accelerates all IQ gain operations by 50% and enhances deep logical reasoning capability.',
      cost: 4500,
      statBonus: '+50% IQ Growth / Classes',
      icon: <Cpu className="text-primary" size={24} />,
      category: 'CEREBRAL',
      slot: 'Neural Interface'
    },
    {
      id: 'kiroshi_ocular',
      name: 'Kiroshi Neo-Ocular v4',
      description: 'Micro-analytical ocular lens capable of high-speed packet decryption. Extends the time limit on Hacknet node bypasses by 12 seconds.',
      cost: 6200,
      statBonus: '+12s Hacknet Decrypt Time',
      icon: <Eye className="text-secondary" size={24} />,
      category: 'SENSORY',
      slot: 'Visual Matrix'
    },
    {
      id: 'subdermal_plating',
      name: 'Subdermal Plating S-200',
      description: 'Advanced subcutaneous carbon lattice structure. Permanently shields savings from blackout robberies and mitigates stress increases by 35%.',
      cost: 11500,
      statBonus: '-35% Stress Accrued',
      icon: <Shield className="text-white" size={24} />,
      category: 'SENSORY',
      slot: 'Integumentary'
    },
    {
      id: 'sandevistan',
      name: 'Sandevistan Boost-Drive',
      description: 'Accelerates metabolic and neurological reflexes. Optimizes focus and increases manual career task completion rate by 40%.',
      cost: 16000,
      statBonus: '+40% Task Completion Speed',
      icon: <Flame className="text-tertiary" size={24} />,
      category: 'COGNITIVE',
      slot: 'Nervous System'
    },
    {
      id: 'synergy_uplink',
      name: 'Venture Synergy Router',
      description: 'Direct corporate telemetry link. Bridges passive stock markets, and amplifies all daily passive venture yields by 20%.',
      cost: 24500,
      statBonus: '+20% Passive Business Income',
      icon: <TrendingUp className="text-primary" size={24} />,
      category: 'SYNERGY',
      slot: 'System Cluster'
    }
  ];

  const handleInstall = (implant: Implant) => {
    if (stats.netWorth < implant.cost) {
      onAction({ type: 'NOTIFY', msg: `CLINIC: INSUFFICIENT LIQUIDITY FOR CHROME (${implant.cost.toLocaleString()} CREDITS REQUIRED)` });
      return;
    }
    setInstallingId(implant.id);
    setInstallProgress(0);

    // Simulated surgical cybernetic sync
    let current = 0;
    const interval = setInterval(() => {
      current += 8;
      if (current >= 100) {
        setInstallProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setImplants((prev: string[]) => [...prev, implant.id]);
          onAction({ 
            type: 'NOTIFY', 
            msg: `SURGERY COMPLETE: ${implant.name.toUpperCase()} SUCCESSFULLY INTEGRATED.` 
          });
          // Mutate the parent stats by updating net worth
          onAction({
            type: 'STATS_UPDATE',
            stats: { netWorth: stats.netWorth - implant.cost, iq: stats.iq + 5 }
          });
          setInstallingId(null);
        }, 500);
      } else {
        setInstallProgress(current);
      }
    }, 100);
  };

  const activeImplant = implantList.find(i => i.id === selectedImplant);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[220] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
    >
      <div className="relative w-full max-w-5xl h-[85vh] bg-black border border-white/10 rounded-3xl overflow-hidden shadow-neon-glow-primary flex flex-col">
        {/* Scanning grid background lines */}
        <div className="absolute inset-0 opacity-[0.03] tech-grid-fine pointer-events-none" />
        
        {/* Neon scan line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-primary/20 shadow-[0_0_15px_pink] animate-pulse" />

        {/* Top bar header */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-white/[0.01]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary shadow-neon animate-ping" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">NEURAL_SYS_AUGMENT_LOC_09</span>
            </div>
            <h1 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">
              CHROME_IMPLANT_CLINIC
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Core Layout split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel: Augments list */}
          <div className="w-1/2 p-10 border-r border-white/5 overflow-y-auto space-y-4">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono mb-4">
              AVAILABLE_CONVERGENCE_NODES
            </h3>
            
            {implantList.map(implant => {
              const bIsInstalled = implants.includes(implant.id);
              const bIsActive = selectedImplant === implant.id;

              return (
                <motion.div
                  key={implant.id}
                  onClick={() => setSelectedImplant(implant.id)}
                  whileHover={{ x: bIsActive ? 0 : 4 }}
                  className={`p-5 border cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden ${
                    bIsActive 
                      ? 'bg-white/5 border-primary/50 shadow-neon-glow-sm' 
                      : 'bg-white/[0.01] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-3 border rounded-xl transition-all ${
                      bIsActive ? 'bg-primary/10 border-primary' : 'bg-black border-white/10 group-hover:border-white/35'
                    }`}>
                      {implant.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-headline font-black text-white uppercase tracking-wider">
                          {implant.name}
                        </span>
                        {bIsInstalled && (
                          <span className="text-[7px] font-black bg-primary/20 text-primary border border-primary/40 px-1.5 py-0.5 uppercase tracking-widest rounded-sm font-mono">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.15em] font-mono block mt-1">
                        Slot: {implant.slot} | Cost: ${implant.cost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right relative z-10">
                    <span className="text-[10px] font-mono font-black text-primary/80 uppercase">
                      {implant.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right panel: Details Hologram Preview */}
          <div className="w-1/2 p-10 flex flex-col justify-between bg-black/20">
            {activeImplant ? (
              <div className="space-y-8">
                {/* Visual Wireframe Preview */}
                <div className="aspect-video border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 tech-grid opacity-[0.03]" />
                  
                  {/* Rotating wireframe pulse rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="w-32 h-32 border border-dashed border-primary/20 rounded-full flex items-center justify-center relative"
                  >
                    <div className="w-24 h-24 border border-dashed border-secondary/35 rounded-full" />
                    <div className="absolute top-0 w-2 h-2 bg-primary rounded-full animate-ping" />
                  </motion.div>

                  <div className="absolute z-10 flex flex-col items-center">
                    <div className="p-4 bg-black/80 rounded-full border border-primary animate-pulse shadow-neon">
                      {activeImplant.icon}
                    </div>
                    <span className="text-[8px] font-mono font-black text-primary uppercase tracking-[0.2em] mt-3">
                      SYSTEM_PREVIEW_LINK_ACTIVE
                    </span>
                  </div>
                </div>

                {/* Text specifics */}
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h2 className="font-headline font-black text-xl text-white uppercase tracking-wider">
                      {activeImplant.name}
                    </h2>
                    <span className="text-xs font-mono font-bold text-primary">
                      ${activeImplant.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-[1px] bg-white/5 w-full mb-4" />
                  
                  <p className="text-xs text-white/50 leading-relaxed font-medium mb-6 uppercase tracking-wider">
                    {activeImplant.description}
                  </p>

                  <div className="bg-white/5 p-4 border border-white/5 flex justify-between items-center rounded-2xl">
                    <div>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">
                        IMPLANT_BENEFIT_COEFFICIENT
                      </span>
                      <div className="text-sm font-headline font-black text-primary uppercase mt-0.5">
                        {activeImplant.statBonus}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">
                        SURGERY_RISK
                      </span>
                      <div className="text-xs font-mono font-bold text-green-400 uppercase mt-0.5">
                        0.02%_MALFUNCTION
                      </div>
                    </div>
                  </div>
                </div>

                {/* Install actions / Loader */}
                <div>
                  {installingId === activeImplant.id ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono font-black text-primary tracking-widest uppercase mb-1">
                        <span>SYNAPSE_LINKING_IN_PROGRESS</span>
                        <span>{installProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <motion.div 
                          className="h-full bg-primary rounded-full"
                          animate={{ width: `${installProgress}%` }}
                          transition={{ ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ) : implants.includes(activeImplant.id) ? (
                    <button 
                      disabled
                      className="w-full py-5 bg-white/5 border border-white/10 text-white/30 text-xs font-headline font-black uppercase tracking-[0.3em] rounded-xl cursor-not-allowed uppercase"
                    >
                      CHROME_ALREADY_INSTALLED
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleInstall(activeImplant)}
                      disabled={stats.netWorth < activeImplant.cost}
                      className="w-full bg-primary py-5 font-headline font-black text-black hover:bg-white disabled:opacity-30 disabled:grayscale transition-all uppercase text-xs tracking-[0.3em] shadow-neon rounded-xl hover:scale-[1.01] cursor-pointer"
                    >
                      INSTALL_CHROME_BIO_AUGMENT
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Cpu size={48} className="text-white mb-4 animate-bounce" />
                <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase">
                  CHOOSE_AUGMENTATION_NODE
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
