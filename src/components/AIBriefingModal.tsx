import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Brain, 
  Activity, 
  Terminal, 
  Briefcase, 
  Cpu, 
  CheckCircle 
} from 'lucide-react';

interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
  level: number;
  careerPath: string;
}

interface PlayerData {
  bank: {
    savings: number;
    neonCredits: number;
  };
  skills: Record<string, number>;
  tasks: any[];
}

interface CityEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  impact: string;
  duration: number;
}

interface AIBriefingData {
  briefing: string;
  statusAnalysis: string;
  warningLevel: 'LOW' | 'MEDIUM' | 'CRITICAL' | string;
  tacticalAdvice: string;
  projectedOutlook: string;
}

interface AIBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  playerData: PlayerData;
  day: number;
  activeCityEvent: CityEvent | null;
  implants: string[];
  nodesBreached: number;
  syndicateHires: string[];
  contraband: Record<string, number>;
}

export const AIBriefingModal: React.FC<AIBriefingModalProps> = ({
  isOpen,
  onClose,
  stats,
  playerData,
  day,
  activeCityEvent,
  implants,
  nodesBreached,
  syndicateHires,
  contraband
}) => {
  const [briefing, setBriefing] = useState<AIBriefingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'advice' | 'status'>('advice');

  const fetchBriefing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stats,
          playerData,
          day,
          activeCityEvent,
          implants,
          nodesBreached,
          syndicateHires,
          contraband
        }),
      });

      if (!response.ok) {
        throw new Error('Network response negative');
      }

      const data = await response.json();
      setBriefing(data);
    } catch (err) {
      console.error('Failed to grab central tactical briefing:', err);
      setError('Tele-link failed. Reconnecting bypass routers...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBriefing();
    }
  }, [isOpen, day]);

  if (!isOpen) return null;

  const warningColorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    LOW: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/30',
      glow: 'shadow-[0_0_15px_rgba(0,253,193,0.15)]',
    },
    MEDIUM: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/30',
      glow: 'shadow-[0_0_15px_rgba(251,209,45,0.15)]',
    },
    CRITICAL: {
      bg: 'bg-tertiary/10',
      text: 'text-tertiary',
      border: 'border-tertiary/30',
      glow: 'shadow-[0_0_15px_rgba(255,113,106,0.15)]',
    },
  };

  const currentWarning = warningColorMap[briefing?.warningLevel?.toUpperCase() || 'LOW'] || warningColorMap.LOW;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative bg-surface-container border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl rounded-sm group font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Futuristic Laser Scanner Overlay */}
        {loading && (
          <motion.div 
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-[3px] bg-primary/40 shadow-[0_0_10px_#fbd12d] z-50 pointer-events-none"
          />
        )}

        {/* Outer Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />

        {/* Subtle top branding line */}
        <div className="bg-black/40 border-b border-white/5 py-3 px-6 flex justify-between items-center bg-gradient-to-r from-primary/10 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">OTTO_SYSTEMS_UPLINK</span>
          </div>
          <p className="text-[9px] font-mono text-white/30 tracking-[0.2em]">CYCLE_{day} // VECTOR_LIVE</p>
        </div>

        {/* Modal Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 relative">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-sm border ${loading ? 'border-primary/40 animate-spin bg-primary/5' : 'border-secondary/40 bg-secondary/5'} text-secondary shrink-0`}>
              <Bot size={24} className={loading ? 'text-primary' : 'text-secondary'} />
            </div>
            <div>
              <h2 className="font-headline font-black text-2xl tracking-tighter text-glow text-white uppercase italic flex items-center gap-2">
                OTTO_TACTICAL_BRIEFING
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                {loading ? 'Decrypting simulation vectors...' : 'Direct strategic feed from core cognitive grid'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:static p-2 border border-white/10 hover:border-white/30 text-white/40 hover:text-white hover:bg-white/5 transition-all rounded-sm shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto tech-grid-fine">
          {error && (
            <div className="bg-tertiary/10 border border-tertiary/30 p-4 text-tertiary font-mono text-xs text-center flex flex-col items-center gap-2">
              <AlertTriangle size={20} className="animate-bounce" />
              <p className="font-bold uppercase tracking-wider">{error}</p>
              <button 
                onClick={fetchBriefing} 
                className="mt-2 px-4 py-1.5 bg-tertiary text-black text-[10px] font-black uppercase tracking-wider hover:bg-white transition-all"
              >
                RESTORE CONNECTION
              </button>
            </div>
          )}

          {loading && !briefing && (
            <div className="py-16 flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
                <Brain size={28} className="absolute inset-x-0 inset-y-0 m-auto text-primary animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono text-primary font-black uppercase tracking-widest">SYNCHRONIZING TELEMETRY</p>
                <p className="text-[10px] font-mono text-white/30 animate-pulse uppercase">Correlating city events • analyzing cyberware metrics</p>
              </div>
            </div>
          )}

          {!loading && briefing && (
            <div className="space-y-6">
              {/* Alert Warning Level Banner */}
              <div className={`p-4 border ${currentWarning.border} ${currentWarning.bg} ${currentWarning.glow} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all relative overflow-hidden`}>
                <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-white/5 to-transparent w-32 pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-black/40 border ${currentWarning.border} ${currentWarning.text}`}>
                    <Activity size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-black uppercase text-white/40 tracking-[0.34em]">SIMULATION_STATUS</span>
                    <h3 className="text-sm font-black font-headline text-white uppercase tracking-tight flex items-center gap-2 mt-0.5">
                      Grid Threat Evaluation: <span className={`${currentWarning.text} font-mono font-black italic`}>{briefing.warningLevel || 'LOW'}</span>
                    </h3>
                  </div>
                </div>
                <div className="bg-black/60 px-3 py-1 border border-white/5 rounded-sm flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#00fdc1]" />
                  <span className="text-[9.5px] font-mono text-white/50 tracking-wider font-bold">UPLINK_SECURE_98%</span>
                </div>
              </div>

              {/* Toggle Sub-sections */}
              <div className="flex border-b border-white/5 pb-0">
                <button
                  onClick={() => setActiveTelemetryTab('advice')}
                  className={`px-4 py-2 border-b-2 font-headline font-black text-xs uppercase tracking-widest transition-all ${
                    activeTelemetryTab === 'advice' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-white/40 hover:text-white/80'
                  }`}
                >
                  Tactical Guidance
                </button>
                <button
                  onClick={() => setActiveTelemetryTab('status')}
                  className={`px-4 py-2 border-b-2 font-headline font-black text-xs uppercase tracking-widest transition-all ${
                    activeTelemetryTab === 'status' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-white/40 hover:text-white/80'
                  }`}
                >
                  System Matrix Context
                </button>
              </div>

              {activeTelemetryTab === 'advice' ? (
                <div className="space-y-5">
                  {/* Strategic Overview Text */}
                  <div className="bg-black/40 border border-white/5 p-4 relative">
                    <div className="absolute -top-1.5 left-4 px-2 bg-surface-container border border-white/10 text-[8px] font-mono text-white/40 uppercase tracking-widest">ANALYSIS</div>
                    <p className="text-xs font-mono text-white/80 leading-relaxed italic">
                      "{briefing.statusAnalysis}"
                    </p>
                  </div>

                  {/* Bulleted Specific Advice */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-primary" />
                      CORE_ACTIONS_REQUIRED
                    </h4>
                    <div className="bg-[#12131a]/40 border border-white/5 p-5 font-mono text-xs text-white/70 space-y-3 pl-6 list-none relative">
                      <div className="absolute top-2 left-2 text-white/10 text-3xl font-headline pointer-events-none font-black italic select-none">TCT</div>
                      {briefing.tacticalAdvice.split('\n').map((bullet, idx) => {
                        const cleanBullet = bullet.replace(/^\*\s*/, '').replace(/^>\s*/, '');
                        if (!cleanBullet.trim()) return null;
                        
                        // Parse bold keywords (wrapped in **)
                        const parts = cleanBullet.split('**');
                        const rParts = parts.map((part, i) => {
                          if (i % 2 === 1) {
                            return <strong key={i} className="text-secondary font-black">{part}</strong>;
                          }
                          return part;
                        });

                        return (
                          <div key={idx} className="flex gap-2.5 items-start">
                            <span className="text-primary select-none mt-0.5 font-bold">{idx + 1}.</span>
                            <span className="flex-1 leading-relaxed text-[11px] text-white/80">{rParts}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Future Forecast */}
                  <div className="bg-black/60 border border-white/5 p-4 flex items-center gap-3">
                    <TrendingUp size={16} className="text-secondary shrink-0" />
                    <div className="flex-1 text-[11px] font-mono leading-relaxed text-white/50">
                      <b className="text-secondary tracking-widest uppercase text-[9px] block mb-0.5">FORECAST_OUTLOOK:</b>
                      "{briefing.projectedOutlook}"
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Player Parameters Matrix */}
                  <div className="bg-black/20 border border-white/5 p-4 space-y-3">
                    <h4 className="text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">Player Physical Matrix</h4>
                    
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Subject Name</span>
                        <span className="text-white font-bold">{stats.name || 'Anonymous User'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Active Career Track</span>
                        <span className="text-primary font-bold">{stats.careerPath}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Net Worth Value</span>
                        <span className="text-secondary font-bold font-headline">${stats.netWorth.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Neural Index (IQ)</span>
                        <span className="text-tertiary font-bold">{stats.iq} IQ</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-white/40">Liquid Bank Savings</span>
                        <span className="text-white/80 font-bold">${playerData.bank.savings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Augments and Systems Grid */}
                  <div className="bg-black/20 border border-white/5 p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-mono font-black uppercase text-white/40 tracking-wider">Cyberware & Cyber-threat parameters</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-white/40">Anomalies/Implants</span>
                          <span className="text-glow text-secondary font-bold">{implants.length} installed</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-white/40">Backdoor Terminals Breached</span>
                          <span className="text-glow text-primary font-bold">{nodesBreached} nodes</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-white/40">Hired Syndicate Units</span>
                          <span className="text-white/80 font-bold">{syndicateHires.length} agents</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-white/40">Active City Event</span>
                          <span className={`${activeCityEvent ? 'text-tertiary animate-pulse' : 'text-white/40'} font-bold`}>
                            {activeCityEvent ? activeCityEvent.title : 'NONE_DETECTED'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeCityEvent && (
                      <div className="bg-tertiary/5 border border-tertiary/20 p-2.5 text-[10px] font-mono text-tertiary leading-normal mt-2">
                        <span className="font-bold">GRID ALERT:</span> {activeCityEvent.description} (Operational multiplier: {activeCityEvent.impact})
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-black/30 border-t border-white/5 p-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={fetchBriefing}
            disabled={loading}
            className="px-5 py-3 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-[11px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            REFRESH TELEMETRY VECTOR
          </button>
          
          <button
            onClick={onClose}
            className="bg-primary hover:bg-white text-black px-6 py-3 font-headline font-black text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <CheckCircle size={14} />
            CLOSE COGNITIVE SEGMENT
          </button>
        </div>
      </motion.div>
    </div>
  );
};
