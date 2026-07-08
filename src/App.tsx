/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Settings, 
  Wallet, 
  Rss, 
  TrendingUp, 
  Users, 
  Gavel, 
  ChevronRight, 
  ChevronLeft,
  Play,
  MousePointer2,
  Utensils,
  Building2,
  School,
  Beer,
  Landmark,
  Radio,
  X,
  Activity,
  Target,
  Zap,
  Bell,
  CreditCard,
  Shield,
  Volume2,
  Monitor,
  Cpu,
  RefreshCw,
  LogOut,
  Plus,
  ArrowUpRight,
  History,
  Info,
  Briefcase,
  Home,
  BarChart3,
  Coins,
  Store,
  Receipt,
  Percent,
  PieChart as LucidePieChart,
  TrendingDown,
  Globe,
  BookOpen,
  GlassWater,
  MessageSquare,
  Brain,
  GraduationCap,
  Repeat,
  FileText,
  Dna,
  Send,
  Bot,
  Search,
  CheckCircle2,
  Clock,
  Coffee,
  LayoutGrid,
  Construction,
  AlertTriangle,
  ArrowRight,
  Server,
  Lock,
  FlaskConical,
  Music,
  Gamepad2,
  ArrowLeft,
  Terminal,
  Database,
  Wine,
  Dices,
  Mic2,
  Lightbulb,
  User,
  Check,
  ChevronDown,
  DollarSign,
  Printer,
  Box,
  Heart,
  Wind,
  Droplets,
  Dumbbell,
  Loader2,
  Layers,
  Key,
  Speaker,
  Flame,
  Skull,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GymSystem } from './components/GymSystem';
import { ChromeClinicSystem } from './components/ChromeClinicSystem';
import { HacknetSystem } from './components/HacknetSystem';
import { RadioVisualizerSystem } from './components/RadioVisualizerSystem';
import { SyndicateSystem } from './components/SyndicateSystem';
import { BlackMarketSystem } from './components/BlackMarketSystem';
import { AIBriefingModal } from './components/AIBriefingModal';
import { CryptoPortfolioTracker } from './components/CryptoPortfolioTracker';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// --- Types ---

interface Venture {
  id: string;
  name: string;
  stage: string;
  risk: 'High' | 'Low' | 'Stable';
  description: string;
  revenue: string;
  growth: string;
  employees: number;
  history?: number[];
}

interface Investment {
  id: string;
  type: 'Real Estate' | 'Stocks' | 'Bonds' | 'Crypto' | 'Small Biz' | 'Venture Capital';
  name: string;
  value: string;
  valueNum: number;
  purchasePrice: number;
  quantity: number;
  change: string;
  trend: 'up' | 'down';
  details: string;
}

interface Job {
  title: string;
  company: string;
  salary: string;
  salaryNum: number;
  performance: number;
  nextPromotion: string;
}

interface SideHustle {
  id: string;
  name: string;
  income: string;
  incomeNum: number;
  hoursPerWeek: number;
  status: 'Active' | 'Passive';
}

interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
  level: number;
  careerPath: 'Tech' | 'Finance' | 'Creative' | 'Medicine' | 'Law' | 'Service' | 'Underground' | 'Academic';
  persona: string;
  avatar: string;
  position: { x: number; y: number };
}

interface PlayerData {
  inventory: Record<string, number>;
  vault: Record<string, number>;
  bank: {
    savings: number;
    neonCredits: number;
    creditLimit: number;
    creditUsed: number;
    transactionHistory: { id: string; date: string; type: string; amount: number; description: string }[];
  };
  portfolio: Record<string, { symbol: string; quantity: number; avgCost: number }>;
  tasks: { id: string; title: string; completed: boolean; reward: number; progress: number }[];
  skills: Record<string, number>;
}

interface CityEvent {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'boost' | 'neutral';
  impact: string;
  duration: number; // in game cycles
}

// ... existing CityHUDOverlay ...
const CityEventAlert = ({ event }: { event: CityEvent | null }) => {
  if (!event) return null;

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`fixed top-32 right-12 z-[100] w-72 p-6 etched-border relative overflow-hidden ${
        event.type === 'alert' ? 'bg-red-500/10 border-red-500/30' : 
        event.type === 'boost' ? 'bg-primary/10 border-primary/30' : 
        'bg-white/10 border-white/30'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-0.5 ${
          event.type === 'alert' ? 'bg-red-500 animate-pulse' : 
          event.type === 'boost' ? 'bg-primary animate-pulse' : 'bg-white'
        }`} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        {event.type === 'alert' ? <AlertTriangle size={16} className="text-red-500" /> : <Zap size={16} className="text-primary" />}
        <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${
          event.type === 'alert' ? 'text-red-400' : 'text-primary'
        }`}>
          CITY_WIDE_EVENT
        </span>
      </div>

      <h4 className="text-xl font-headline font-black text-white italic uppercase tracking-tighter mb-2">
        {event.title}
      </h4>
      <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest font-medium italic mb-4">
        "{event.description}"
      </p>

      <div className="pt-3 border-t border-white/10">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">EST_IMPACT</span>
          <span className={`text-[9px] font-mono font-black ${
            event.type === 'alert' ? 'text-red-400' : 'text-primary'
          }`}>
            {event.impact}
          </span>
        </div>
      </div>
      
      {/* Background glitch effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none cyber-grid" />
    </motion.div>
  );
};

const TechLines = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden opacity-20 ${className}`}>
    <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
    <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/50 to-transparent" />
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
  </div>
);

const DistrictLabels = () => {
  const districts = [
    { name: 'SILICON_PLATEAU_v4', pos: { top: '25%', left: '42%' }, color: 'text-secondary' },
    { name: 'CORPORATE_HUB_SEC_01', pos: { top: '50%', left: '50%' }, color: 'text-primary' },
    { name: 'THE_NEON_SPRAWL', pos: { top: '75%', left: '25%' }, color: 'text-tertiary' },
    { name: 'OLD_INDUSTRIAL_V2', pos: { top: '35%', left: '20%' }, color: 'text-white/20' },
    { name: 'ENTERTAINMENT_GRID', pos: { top: '65%', left: '78%' }, color: 'text-pink-400' },
  ];

  return (<>
    {districts.map((d, i) => (
      <motion.div 
        key={i} 
        style={d.pos} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.5 }}
        className={`absolute z-10 pointer-events-none ${d.color} font-black text-[32px] tracking-[0.5em] uppercase opacity-20 whitespace-nowrap`}
      >
        {d.name}
        <div className="h-0.5 w-1/4 bg-current mt-2 opacity-50" />
      </motion.div>
    ))}
  </>);
};

const DataFlowLines = () => {
  const connections = [
    { from: { x: 48, y: 42 }, to: { x: 25, y: 65 } }, // Office to Bank
    { from: { x: 48, y: 42 }, to: { x: 50, y: 75 } }, // Office to School
    { from: { x: 25, y: 65 }, to: { x: 35, y: 35 } }, // Bank to Gym
    { from: { x: 75, y: 65 }, to: { x: 48, y: 42 } }, // Bar to Office
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
      {connections.map((conn, i) => (
        <React.Fragment key={i}>
          <line x1={`${conn.from.x}%`} y1={`${conn.from.y}%`} x2={`${conn.to.x}%`} y2={`${conn.to.y}%`} stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
          <motion.circle 
            r="2"
            fill="#fbd12d"
            initial={{ offset: 0 }}
            animate={{ 
              cx: [`${conn.from.x}%`, `${conn.to.x}%`],
              cy: [`${conn.from.y}%`, `${conn.to.y}%`]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
          />
        </React.Fragment>
      ))}
    </svg>
  );
};

const TechStatsLine = ({ label, value, unit }: { label: string; value: string; unit: string }) => {
  const [liveValue, setLiveValue] = useState(value);

  useEffect(() => {
    const isNum = !isNaN(parseFloat(value));
    if (!isNum && !value.endsWith('M')) return;

    const interval = setInterval(() => {
      if (label === 'GLOBAL_STABILITY') {
        const val = 0.98 + Math.random() * 0.01;
        setLiveValue(val.toFixed(3));
      } else if (label === 'POPULATION_SYNC') {
        const val = 8.2 + Math.random() * 0.05;
        setLiveValue(`${val.toFixed(2)}M`);
      } else if (label === 'GRID_HERTZ') {
        const val = 59.98 + Math.random() * 0.05;
        setLiveValue(val.toFixed(2));
      } else if (label === 'NEURAL_LATENCY') {
        const val = 0.02 + Math.random() * 0.04;
        setLiveValue(val.toFixed(2));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [value, label]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group font-mono"
    >
      <div className="flex items-center gap-2 mb-0.5 justify-between w-40">
        <div className="flex items-center gap-1.5">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          <span className="text-[7.5px] font-black text-white/30 uppercase tracking-[0.25em] group-hover:text-white/60 transition-colors">
            {label}
          </span>
        </div>
        <span className="text-[6px] font-black text-primary/30 animate-pulse">LIVE</span>
      </div>
      <div className="flex items-baseline gap-1">
        <motion.span 
          key={liveValue}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-[14px] font-mono font-black text-white tabular-nums drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        >
          {liveValue}
        </motion.span>
        <span className="text-[7px] font-black text-primary/50 uppercase tracking-widest">{unit}</span>
      </div>
      
      {/* Dynamic Mini-Progress Meter scan line below */}
      <div className="w-40 h-[2px] bg-white/5 rounded-full mt-1.5 overflow-hidden relative">
        <motion.div 
          animate={{ 
            x: ['-100%', '100%'],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
        />
      </div>
    </motion.div>
  );
};

const CityHUDOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[80]">
     {/* High-Fidelity Corners */}
     <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 0.4, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.35, ease: "easeOut" }}
       className="absolute top-8 left-8 w-64 h-32 border-t border-l border-white/10 etched-border"
     >
        <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary/40" />
     </motion.div>

     <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 0.4, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.35, ease: "easeOut" }}
       className="absolute top-8 right-8 w-64 h-32 border-t border-r border-white/10 etched-border"
     >
        <div className="absolute top-0 right-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute top-0 right-0 w-[1px] h-8 bg-primary/40" />
     </motion.div>

     <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 0.4, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.35, ease: "easeOut" }}
       className="absolute bottom-8 left-8 w-64 h-32 border-b border-l border-white/10 etched-border"
     >
        <div className="absolute bottom-0 left-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute bottom-0 left-0 w-[1px] h-8 bg-primary/40" />
     </motion.div>

     <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 0.4, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
       transition={{ duration: 0.35, ease: "easeOut" }}
       className="absolute bottom-8 right-8 w-64 h-32 border-b border-r border-white/10 etched-border"
     >
        <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-primary/40" />
     </motion.div>

     {/* Ambient Scanning Line */}
     <motion.div 
       animate={{ y: ['-10%', '110%'] }}
       transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
       exit={{ opacity: 0 }}
       className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-[81]" 
     />

     {/* Telemetry Panel */}
     <motion.div 
       initial={{ opacity: 0, x: -30 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -30 }}
       transition={{ duration: 0.4, ease: "easeOut" }}
       className="absolute top-24 left-12 space-y-6"
     >
        <TechStatsLine label="GLOBAL_STABILITY" value="0.984" unit="RMS" />
        <TechStatsLine label="POPULATION_SYNC" value="8.2M" unit="NODES" />
        <TechStatsLine label="GRID_HERTZ" value="60.01" unit="Hz" />
        <TechStatsLine label="NEURAL_LATENCY" value="0.04" unit="ms" />
     </motion.div>

     {/* Keyboard Protocols Legend */}
     <motion.div 
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: 30 }}
       transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
       className="absolute bottom-24 left-32 bg-black/85 backdrop-blur-md border border-white/10 p-4 rounded-sm space-y-2.5 w-52 pointer-events-auto shadow-[0_0_20px_rgba(0,0,0,0.8)] relative"
     >
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />

        <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-[8px] font-black uppercase text-glow text-white tracking-[0.2em] font-mono">KEYBOARD_HOTKEYS</span>
        </div>
        <div className="space-y-2 text-[10px] font-mono text-white/50">
          <div className="flex justify-between items-center">
            <span>Financial Hub</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-primary">F</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>AI Advisor</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-primary">A</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Cycle Buildings</span>
            <span className="flex gap-1">
              <kbd className="px-1 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-white">Tab</kbd>
              <kbd className="px-1 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-white">⇄</kbd>
            </span>
          </div>
          <div className="flex justify-between items-center animate-pulse">
            <span>Enter Selected</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-secondary">Enter</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Return / Close</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-bold text-white">Esc</kbd>
          </div>
        </div>
     </motion.div>

     {/* Map Identifier Overlay */}
     <motion.div 
       initial={{ opacity: 0, x: 30 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: 30 }}
       transition={{ duration: 0.4, ease: "easeOut" }}
       className="absolute bottom-12 right-12 text-right"
     >
        <div className="text-[10px] font-black text-white/10 uppercase tracking-[1em] mb-2">NEO_CITY_SECTOR_07</div>
        <div className="flex justify-end gap-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-1 h-3 ${i < 8 ? 'bg-primary/20' : 'bg-white/5'}`} />
          ))}
        </div>
     </motion.div>
  </div>
);

const CornerDecoration = ({ className = "" }: { className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}>
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-bottom-2 border-l-2 border-primary/40" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-bottom-2 border-r-2 border-primary/40" />
  </div>
);

const CyberPulse = () => (
  <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
    <motion.div 
      animate={{ scale: [1, 2, 1], opacity: [0, 0.2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="w-full h-full border border-primary rounded-full blur-md"
    />
  </div>
);

// --- Visual Utilities ---
const VisualEffectsOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[500] overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#000] opacity-[0.02] mix-blend-overlay" />
    <div className="scanline" />
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-[0.05] pointer-events-none" />
  </div>
);

// --- System Components ---

const GlobalAIBriefing = ({ briefing, onDismiss }: { briefing: string; onDismiss: () => void }) => {
  if (!briefing) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-xl px-6"
    >
      <div className="bg-black/80 backdrop-blur-3xl border border-primary/30 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex items-start gap-5 relative overflow-hidden group">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
        
        {/* Scanline effect inside the box */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-20 pointer-events-none" />

        <div className="mt-1 p-2 bg-primary/10 rounded-sm border border-primary/20 shrink-0">
          <Bot size={20} className="text-primary animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">STRATEGIC_BRIEFING</span>
              <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
            </div>
            <button 
              onClick={onDismiss} 
              className="text-white/20 hover:text-white transition-colors p-1 -mr-2"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-[12px] text-white/80 leading-relaxed font-mono tracking-tight">
            {briefing}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const playATMSound = (type: 'btn' | 'insert' | 'dispense' | 'error') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  
  const playBtn = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const playInsert = () => {
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.2);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  };

  const playDispense = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const playError = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  switch(type) {
    case 'btn': playBtn(); break;
    case 'insert': playInsert(); break;
    case 'dispense': playDispense(); break;
    case 'error': playError(); break;
  }
};

const playTerminalClick = (type: 'chirp' | 'success' | 'fail' | 'transition' | 'input') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();

  if (type === 'chirp') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } else if (type === 'success') {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1000, ctx.currentTime);
    osc1.frequency.setValueAtTime(1500, ctx.currentTime + 0.06);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(500, ctx.currentTime);
    osc2.frequency.setValueAtTime(750, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.16);
  } else if (type === 'fail') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(160, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } else if (type === 'transition') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } else if (type === 'input') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }
};

const ATMSystem = ({ onClose, stats, playerData, onAction }: { onClose: () => void; stats: UserStats; playerData: PlayerData; onAction: (update: any) => void }) => {
  const [screen, setScreen] = useState<'welcome' | 'inserting' | 'pin' | 'menu' | 'withdraw' | 'deposit' | 'balance' | 'processing' | 'dispensing' | 'receipt' | 'success'>('welcome');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [dispensedBills, setDispensedBills] = useState<number[]>([]);
  const [receiptProgress, setReceiptProgress] = useState(0);
  const [isPinError, setIsPinError] = useState(false);

  const handleInsert = async () => {
    playATMSound('insert');
    setScreen('inserting');
    await new Promise(r => setTimeout(r, 2000));
    setScreen('pin');
  };

  const handleWithdraw = async () => {
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) return;
    if (playerData.bank.savings < val) return;
    
    setScreen('processing');
    await new Promise(r => setTimeout(r, 2000));
    
    onAction({ 
      type: 'BANK_WITHDRAW', 
      amount: val,
      msg: `Withdrawal Authorized: $${val.toLocaleString()}` 
    });

    setScreen('dispensing');
    onAction({ type: 'LOG', msg: 'DISPENSING_CURRENCY...' });
    
    for(let i = 0; i < 5; i++) {
      playATMSound('dispense');
      setDispensedBills(prev => [...prev, i]);
      await new Promise(r => setTimeout(r, 400));
    }
    await new Promise(r => setTimeout(r, 1000));
    
    setScreen('receipt');
    // Animate receipt printing
    for(let i = 0; i <= 100; i += 5) {
      setReceiptProgress(i);
      await new Promise(r => setTimeout(r, 80));
    }
    await new Promise(r => setTimeout(r, 1000));
    setScreen('success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-md bg-[#1c1c1e] border-x border-t border-white/10 rounded-t-[40px] shadow-[0_50px_100px_rgba(0,0,0,1)] relative flex flex-col pt-12 pb-20">
        {/* Hardware Status Lights */}
        <div className="absolute top-6 left-12 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        
        {/* Bank Brand Head */}
        <div className="px-12 mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-1">Citadel_Terminal_v7</h2>
            <div className="flex items-center gap-2">
              <Landmark size={18} className="text-emerald-400" />
              <span className="font-headline font-black text-white italic tracking-tighter text-xl">CITADEL<span className="text-emerald-400">_SECURE</span></span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Node_IP</div>
            <div className="text-[10px] font-mono text-emerald-400/60">127.0.0.1.TERMINAL</div>
          </div>
        </div>

        {/* The ATM Screen (Internal CRT) */}
        <div className="mx-6 bg-[#050608] border-8 border-[#2c2c2e] rounded-xl relative overflow-hidden shadow-inner min-h-[400px] flex flex-col">
          {/* CRT Effects */}
          <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_2px] opacity-40 shrink-0" />
          <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

          <div className="flex-1 relative flex flex-col p-8 font-mono text-emerald-400 overflow-hidden">
            <AnimatePresence mode="wait">
              {screen === 'welcome' && (
                <motion.div 
                  key="welcome" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-12">
                    <motion.div
                      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -inset-8 bg-emerald-500/10 rounded-full blur-2xl"
                    />
                    <CreditCard size={80} className="relative z-10 text-emerald-500/40" />
                    <motion.div 
                      animate={{ y: [0, 40, 0], opacity: [0, 1, 0] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-4"
                    >
                      <ChevronDown size={32} />
                    </motion.div>
                  </div>
                  <motion.h3 
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-lg font-black uppercase tracking-tighter mb-2"
                  >
                    Insert Personnel Access Card
                  </motion.h3>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] mb-12">Security Checkpoint 04-A</p>
                  <button 
                    onClick={() => { playATMSound('btn'); handleInsert(); }}
                    className="group relative px-12 py-4 bg-transparent border-2 border-emerald-400/40 text-emerald-400 font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:bg-emerald-400 hover:text-black"
                  >
                    <span className="relative z-10">Access_Terminal</span>
                    <div className="absolute inset-0 bg-emerald-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  </button>
                </motion.div>
              )}

              {screen === 'inserting' && (
                <motion.div 
                  key="inserting" 
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-48 h-32 mb-8">
                    <motion.div 
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ y: [200, 20, 0], opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] p-4 flex flex-col justify-between"
                    >
                      <div className="w-10 h-7 bg-yellow-400 rounded-sm shadow-inner" />
                      <div className="h-3 w-full bg-black/20 rounded-full" />
                    </motion.div>
                  </div>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-[10px] font-black uppercase tracking-[0.5em]"
                  >
                    Reading_Neural_Data...
                  </motion.div>
                </motion.div>
              )}

              {screen === 'pin' && (
                <motion.div 
                  key="pin" 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: isPinError ? [0, -10, 10, -10, 10, 0] : 0
                  }}
                  transition={isPinError ? { duration: 0.4 } : {}}
                  className="flex-1 flex flex-col items-center justify-center w-full"
                >
                  <h3 className={`text-xs font-black uppercase tracking-[0.4em] mb-12 transition-colors ${isPinError ? 'text-red-500' : 'text-white/40'}`}>
                    {isPinError ? 'Invalid_Credentials' : 'Verify_Credentials'}
                  </h3>
                  
                  <div className="flex gap-4 mb-16">
                    {[0, 1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={pin.length > i ? { 
                          scale: [1, 1.2, 1], 
                          borderColor: isPinError ? '#ef4444' : '#10b981', 
                          backgroundColor: isPinError ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          boxShadow: isPinError ? '0 0 20px rgba(239,68,68,0.2)' : '0 0 20px rgba(16,185,129,0.2)'
                        } : {}}
                        className={`w-12 h-14 border-2 ${pin.length > i ? (isPinError ? 'border-red-500' : 'border-emerald-500') : 'border-white/10'} flex items-center justify-center rounded-lg transition-colors overflow-hidden relative`}
                      >
                        {pin.length > i && (
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`w-3 h-3 rounded-full ${isPinError ? 'bg-red-500' : 'bg-emerald-400'} shadow-[0_0_10px_rgba(16,185,129,0.8)]`} 
                          />
                        )}
                        {pin.length > i && !isPinError && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 bg-emerald-400/20 rounded-full"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map(n => (
                      <button 
                        key={n}
                        disabled={isPinError}
                        onClick={() => {
                          playATMSound('btn');
                          if (n === 'C') setPin('');
                          else if (n === 'OK') { 
                            if(pin.length === 4) {
                              if (pin === '1234') {
                                setScreen('menu');
                              } else {
                                playATMSound('error');
                                setIsPinError(true);
                                setTimeout(() => {
                                  setIsPinError(false);
                                  setPin('');
                                }, 1000);
                              }
                            }
                          }
                          else if (pin.length < 4) setPin(p => p + String(n));
                        }}
                        className={`h-14 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center font-black text-sm transition-all active:scale-90 ${isPinError ? 'opacity-50' : 'hover:bg-emerald-500 hover:text-black'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {screen === 'menu' && (
                <motion.div 
                  key="menu" 
                  className="flex-1 flex flex-col justify-center gap-4"
                >
                  <div className="mb-8 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mb-1">Account_Active</p>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase">{stats.name.replace(' ', '_')}</p>
                  </div>
                  
                  <button onClick={() => { playATMSound('btn'); setScreen('balance'); }} className="group p-6 border border-white/10 bg-white/5 flex items-center justify-between hover:bg-emerald-500 hover:text-black transition-all">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">View_Liquidity</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button onClick={() => { playATMSound('btn'); setScreen('withdraw'); }} className="group p-6 border border-white/10 bg-white/5 flex items-center justify-between hover:bg-emerald-500 hover:text-black transition-all">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Synthesize_Cash</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  
                  <button onClick={() => { playATMSound('btn'); onClose(); }} className="mt-8 py-4 text-[10px] font-black text-red-400/60 uppercase tracking-[0.5em] hover:text-red-400 transition-colors">Terminte_Session</button>
                </motion.div>
              )}

              {screen === 'balance' && (
                <motion.div 
                  key="balance"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mb-4">Central_Bank_Reserves</p>
                  <motion.h4 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black text-white italic tracking-tighter mb-16 text-glow-emerald"
                  >
                    ${playerData.bank.savings.toLocaleString()}
                  </motion.h4>
                  <button onClick={() => { playATMSound('btn'); setScreen('menu'); }} className="px-12 py-4 border border-emerald-400/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400/10">Return_to_Main</button>
                </motion.div>
              )}

              {screen === 'withdraw' && (
                <motion.div 
                  key="withdraw"
                  className="flex-1 flex flex-col items-center justify-center w-full px-8"
                >
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] mb-8 text-center">Define_Withdrawal_Scale</p>
                  <div className="relative w-full mb-16">
                    <span className="absolute left-0 bottom-4 text-3xl font-black text-white/10">$</span>
                    <input 
                      type="number"
                      autoFocus
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent border-b-2 border-emerald-500/40 focus:border-emerald-400 text-center text-5xl font-black outline-none pb-4 text-white transition-all placeholder:text-white/5"
                    />
                  </div>
                  <div className="flex gap-4 w-full">
                    <button onClick={() => { playATMSound('btn'); setScreen('menu'); }} className="flex-1 py-5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all">Cancel</button>
                    <button onClick={() => { playATMSound('btn'); handleWithdraw(); }} className="flex-1 py-5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all">Execute</button>
                  </div>
                </motion.div>
              )}

              {screen === 'processing' && (
                <motion.div 
                  key="processing"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="mb-8 p-6 bg-emerald-500/10 rounded-full border-2 border-emerald-500 border-dashed"
                  >
                    <RefreshCw size={40} className="text-emerald-400" />
                  </motion.div>
                  <h3 className="text-lg font-black uppercase tracking-[0.2em] mb-2">Authorizing</h3>
                  <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] animate-pulse">Syncing_with_Citadel_North...</p>
                </motion.div>
              )}

              {screen === 'dispensing' && (
                <motion.div 
                  key="dispensing"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mb-12"
                  >
                    <DollarSign size={64} className="text-emerald-400 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4 italic">Dispensing_Cash</h3>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Hardware_Mechanism_Active</p>
                </motion.div>
              )}

              {screen === 'receipt' && (
                <motion.div 
                  key="receipt"
                  className="flex-1 flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="mb-12"
                  >
                    <Printer size={64} className="text-white/40 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4 italic">Printing_Receipt</h3>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Thermal_Transfer_Active</p>
                </motion.div>
              )}

              {screen === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center px-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                  >
                    <Check className="text-black" size={48} strokeWidth={4} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Cycle_Complete</h3>
                  <p className="text-sm text-white/40 mb-12 uppercase tracking-[0.3em] font-bold">Please Retrieve Your Valuables</p>
                  <button onClick={onClose} className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-emerald-400 transition-colors shadow-2xl">Return_Interface</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Physical Mechanical Components Below the Screen */}
        <div className="px-12 mt-10 space-y-12">
          {/* Card Slot */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Card_Slot_Reader</span>
              <div className={`w-2 h-2 rounded-full ${screen === 'welcome' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-white/10'}`} />
            </div>
            <div className="h-4 bg-[#0a0a0b] rounded shadow-inner border border-white/5 relative overflow-hidden flex items-center justify-center">
               <div className="w-[80%] h-0.5 bg-white/5" />
               <AnimatePresence>
                 {screen === 'inserting' && (
                   <motion.div
                     initial={{ y: 0, x: -100 }}
                     animate={{ x: 0 }}
                     exit={{ x: 100 }}
                     className="absolute w-24 h-2 bg-emerald-400 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                   />
                 )}
               </AnimatePresence>
            </div>
          </div>

          {/* Cash Dispenser Slot */}
          <div className="relative">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Cash_Synthesis_Module</span>
              {screen === 'dispensing' && (
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="w-2 h-2 rounded-full bg-emerald-400"
                />
              )}
            </div>
            <div className="h-6 bg-[#0a0a0b] rounded shadow-inner border-2 border-[#2c2c2e] relative overflow-hidden flex flex-col items-center">
              <div className="w-full h-1 bg-stone-900 border-b border-white/5" />
              <AnimatePresence>
                {screen === 'dispensing' && dispensedBills.map(i => (
                  <motion.div
                    key={i}
                    initial={{ y: -40, opacity: 0, rotate: -5 }}
                    animate={{ y: 35, opacity: 1, rotate: Math.random() * 4 - 2 }}
                    className="absolute w-44 h-18 bg-[#064e3b] border-2 border-emerald-400/30 rounded flex flex-col p-3 shadow-2xl overflow-hidden"
                    style={{ zIndex: 100 + i, scale: 0.9 + i * 0.02 }}
                  >
                    {/* Bill Pattern */}
                    <div className="absolute inset-x-2 inset-y-1 border border-emerald-400/10 rounded pointer-events-none" />
                    <div className="flex justify-between items-start">
                       <span className="text-[6px] font-black text-emerald-400/40">FEDERAL_RESERVE</span>
                       <span className="text-[6px] font-black text-emerald-400/40">100</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-400/20 flex items-center justify-center bg-black/20">
                        <span className="text-xl font-black text-emerald-400/60 tracking-tighter">$</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-[6px] font-black text-emerald-400/40">SERIES_2104</span>
                       <div className="w-8 h-1 bg-emerald-400/10 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Receipt Printer Slot */}
          <div className="relative">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Physical_Log_Output</span>
              {screen === 'receipt' && (
                <div className="w-2 h-2 bg-emerald-500 animate-ping rounded-full" />
              )}
            </div>
            <div className="h-3 bg-[#0a0a0b] rounded shadow-inner border border-white/5 relative overflow-hidden flex justify-center">
              <div className="w-32 h-0.5 bg-white/5" />
              <AnimatePresence>
                {screen === 'receipt' && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 260 }}
                    className="absolute top-1.5 w-32 bg-white text-black font-mono text-[6px] p-3 shadow-2xl flex flex-col items-center overflow-hidden z-20"
                  >
                    <div className="w-full border-b border-black mb-3 pb-1 text-center font-black">CITADEL_SECURE_RECEIPT</div>
                    <div className="w-full flex justify-between mb-0.5"><span>DATE</span><span>{new Date().toLocaleDateString()}</span></div>
                    <div className="w-full flex justify-between mb-0.5"><span>REF</span><span>#X{Math.random().toString(36).substring(7).toUpperCase()}</span></div>
                    <div className="w-full flex justify-between border-y border-black/5 py-1 my-1">
                      <span className="font-bold">TOTAL</span>
                      <span className="font-bold">${parseInt(amount).toLocaleString()}</span>
                    </div>
                    <div className="mt-8 text-center opacity-40">THANK_YOU_EXECUTIVE</div>
                    <div className="mt-2 w-full h-8 bg-black/5 flex items-center justify-center font-black">--- VOID ---</div>
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

const VaultSystem = ({ onClose, stats, playerData, onAction }: { onClose: () => void; stats: UserStats; playerData: PlayerData; onAction: (update: any) => void }) => {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleCodeSubmit = () => {
    if (code === '1234') { 
      setIsUnlocked(true);
      onAction({ type: 'LOG', msg: 'Vault unlocked.' });
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 1000);
      setCode('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-black flex items-center justify-center overflow-hidden">
      {!isUnlocked ? (
        <div className="bg-stone-800 p-8 border-4 border-stone-700 shadow-2xl text-center w-full max-w-sm">
          <h2 className="font-headline font-black text-2xl text-white mb-8 uppercase tracking-tighter">Secure_Vault</h2>
          <div className={`p-4 bg-black/40 border-2 ${isError ? 'border-red-500/50' : 'border-white/10'} mb-8 flex justify-between gap-4 h-16 items-center`}>
            {Array.from({ length: 4 }).map((_, i) => (<div key={i} className={`flex-1 h-2 rounded-full ${code.length > i ? 'bg-primary' : 'bg-white/10'}`} />))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((key) => (
              <button key={key} onClick={() => { if (key === 'C') setCode(''); else if (key === 'OK') handleCodeSubmit(); else if (code.length < 4) setCode(c => c + key); }} className="aspect-square flex items-center justify-center bg-white/5 border border-white/10 text-xl font-bold hover:bg-primary hover:text-black transition-all">
                {key}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="mt-8 text-white/40 text-[10px] font-black uppercase">Cancel</button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col p-12 bg-stone-900 text-white overflow-auto">
          <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <h2 className="font-headline font-black text-4xl text-primary uppercase italic">Personal_Vault</h2>
            <button onClick={onClose} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white uppercase text-xs font-black">Secure & Exit</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="aspect-square bg-black/40 border border-white/5 hover:border-primary/20 flex flex-col items-center justify-center">
                {i < 2 ? <Coins size={32} className="text-primary mb-2" /> : <Box size={32} className="text-white/10 mb-2" />}
                <span className="text-[9px] font-black text-white/40 uppercase">Cell_{i}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const TradingDeskSystem = ({ onClose, stats, marketData, onAction }: { onClose: () => void; stats: UserStats; marketData: Record<string, number[]>; onAction: (update: any) => void }) => {
  const [selectedAsset, setSelectedAsset] = useState('TECH');
  const [tradeAmount, setTradeAmount] = useState('1');
  const [confirmation, setConfirmation] = useState<{ type: 'BUY' | 'SELL'; amount: number; price: number } | null>(null);
  const [activeView, setActiveView] = useState<'terminal' | 'portfolio' | 'news'>('terminal');

  const history = marketData[selectedAsset] || [];
  const currentPrice = history[history.length - 1] || 100;
  
  // Mock Portfolio (we should ideally get this from stats or playerData, but for demo we can mock a part or use stats.netWorth as a base)
  const portfolio = {
    'TECH': 10,
    'ENERGY': 5,
    'BIO': 0,
    'FIN': 2,
    'BTC': 0.5
  };

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) return;
    setConfirmation({ type, amount, price: currentPrice });
  };

  const confirmTrade = () => {
    if (!confirmation) return;
    const { type, amount, price } = confirmation;
    const total = amount * price;

    if (type === 'BUY' && stats.netWorth < total) {
      onAction({ type: 'LOG', msg: `INSUFFICIENT FUNDS: Need $${total.toLocaleString()}` });
    } else {
      onAction({ 
        type: type === 'BUY' ? 'PURCHASE' : 'LOG', 
        amount: type === 'BUY' ? total : 0,
        msg: `${type} ORDER EXECUTED: ${amount} ${selectedAsset} @ $${price.toLocaleString()}` 
      });
      // In a real app we'd update playerData.portfolio here
    }
    setConfirmation(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (confirmation) {
          e.preventDefault();
          confirmTrade();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [confirmation, confirmTrade]);

  // Enhanced Price Chart Component with Dynamic Coloring
  const PriceChart = ({ data }: { data: number[] }) => {
    if (data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const first = data[0];
    const last = data[data.length - 1];
    const isUp = last >= first;
    const color = isUp ? '#10b981' : '#ef4444'; // emerald-500 : red-500
    
    const padding = (max - min) * 0.1 || 1;
    const range = (max - min) + padding * 2;
    const width = 800;
    const height = 300;

    const points = data.map((val, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((val - min + padding) / range) * height
    }));

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Glow effect path */}
        <path d={pathData} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 blur-sm" />
        {/* Primary path */}
        <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
        <path d={`${pathData} L ${width} ${height} L 0 ${height} Z`} fill="url(#chartGradient)" />
        
        {/* Current Price Marker */}
        <motion.circle 
          cx={points[points.length - 1].x} 
          cy={points[points.length - 1].y} 
          r="6" 
          fill={color} 
          initial={{ r: 6 }}
          animate={{ r: [6, 10, 6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </svg>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-[#08080a] flex flex-col p-10 text-white overflow-hidden">
      {/* HUD Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20" />
        <div className="absolute inset-y-0 left-0 w-1 bg-primary/20" />
        <div className="absolute inset-y-0 right-0 w-1 bg-primary/20" />
      </div>

      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-primary text-black rounded-sm shadow-[0_0_30px_rgba(251,209,45,0.3)]">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter leading-none">Global_Trading_Terminal</h2>
            <div className="flex gap-4 mt-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Connection: Secure</span>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Node: $RT_HQ_7</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-6 py-2 bg-white/5 border border-white/10 flex flex-col items-end">
            <span className="text-[9px] text-white/40 font-black uppercase">Capital_Available</span>
            <span className="text-xl font-black text-primary">${stats.netWorth.toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition-all self-center group">
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-10 overflow-hidden relative z-10">
        {/* Market List */}
        <div className="col-span-3 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-4">Market_Instruments</h3>
          {Object.entries(marketData).map(([symbol, prices]) => {
            const current = prices[prices.length - 1];
            const prev = prices[prices.length - 2] || current;
            const diff = current - prev;
            const percent = ((diff / prev) * 100).toFixed(2);
            const isUp = diff >= 0;

            return (
              <button 
                key={symbol} 
                onClick={() => setSelectedAsset(symbol)} 
                className={`w-full p-5 flex justify-between items-center transition-all border-l-4 group relative overflow-hidden ${selectedAsset === symbol ? 'bg-primary/10 border-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
              >
                {selectedAsset === symbol && <div className="absolute left-0 top-0 w-full h-full bg-primary/5 animate-pulse" />}
                <div className="relative">
                  <span className="block text-md font-black italic tracking-tighter">{symbol}</span>
                  <span className="block text-[9px] text-white/40 uppercase tracking-widest mt-1">Instrument V7</span>
                </div>
                <div className="text-right relative">
                  <span className="block text-sm font-black">${current.toLocaleString()}</span>
                  <span className={`text-[10px] font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '+' : ''}{percent}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Terminal View */}
        <div className="col-span-6 flex flex-col gap-6">
          <div className="bg-black/60 border border-white/10 p-8 flex-1 flex flex-col relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-4 flex gap-4 text-[9px] font-black text-white/20 uppercase tracking-widest">
              <span>Resolution: 4K</span>
              <span>Ref: {selectedAsset}_IDX</span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{selectedAsset}_Index</h3>
                <span className="text-2xl font-black text-primary">${currentPrice.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">Dynamic Asset Performance Stream</p>
            </div>

            {/* Chart Container */}
            <div className="flex-1 bg-black/40 border border-white/5 p-4 rounded-lg relative overflow-hidden">
               <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
               <PriceChart data={history} />
            </div>

            {/* Trade Controls */}
            <div className="mt-8 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-4 space-y-2">
                <label className="text-[9px] font-black text-white/40 uppercase tracking-widest ml-1">Trade_Quantity</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={tradeAmount} 
                    onChange={(e) => setTradeAmount(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 p-4 text-xl font-black outline-none focus:border-primary text-center"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20">
                    <span className="text-xs font-black uppercase tracking-widest">{selectedAsset}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-8 flex gap-4">
                <button 
                  onClick={() => handleTrade('BUY')}
                  className="flex-1 py-5 bg-green-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3"
                >
                  <TrendingUp size={16} /> Execute_Buy
                </button>
                <button 
                  onClick={() => handleTrade('SELL')}
                  className="flex-1 py-5 bg-red-500 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3"
                >
                  <TrendingDown size={16} /> Execute_Sell
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Portfolio_Summary</h4>
            <div className="space-y-4">
               {Object.entries(portfolio).map(([sym, qty]) => (
                 <div key={sym} className="flex justify-between items-center">
                    <div>
                      <span className="block text-xs font-black uppercase">{sym}</span>
                      <span className="block text-[9px] text-white/40 font-black">{qty} Units</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-black tracking-tight">${((marketData[sym]?.[marketData[sym].length-1] || 0) * qty).toLocaleString()}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 mt-2 border border-primary/30 text-primary font-black uppercase text-[9px] tracking-widest hover:bg-primary/10 transition-all">
              Manage_Holdings
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 flex-1 flex flex-col gap-6">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Market_Pulse</h4>
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1">
               <div className="p-4 bg-black/40 border-l border-primary/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100"><Zap size={10} className="text-primary" /></div>
                  <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-tight italic">"Synthetic volatility protocols detected in {selectedAsset} cluster. Liquidations imminent."</p>
               </div>
               <div className="p-4 bg-black/40 border-l border-white/10">
                  <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-tight italic">"Energy sector stabilization follows discovery of new quantum fission node."</p>
               </div>
               <div className="p-4 bg-black/40 border-l border-green-500/50">
                  <p className="text-[10px] text-white/50 leading-relaxed font-mono uppercase tracking-tight italic">"Capital influx in BIO sector as neural-link approval reaches Phase 9."</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Overlay */}
      <AnimatePresence>
        {confirmation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-stone-900 border border-white/10 p-10 relative shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(251,209,45,0.5)]" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-center">Confirm_Trade_Auth</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-sm font-black border-b border-white/5 pb-4">
                  <span className="text-white/40 uppercase tracking-widest">Operation</span>
                  <span className={`uppercase tracking-widest ${confirmation.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{confirmation.type}_ORDER</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black border-b border-white/5 pb-4">
                  <span className="text-white/40 uppercase tracking-widest">Asset</span>
                  <span className="uppercase tracking-widest">{selectedAsset}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black border-b border-white/5 pb-4">
                  <span className="text-white/40 uppercase tracking-widest">Quantity</span>
                  <span className="uppercase tracking-widest">{confirmation.amount}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 p-4">
                   <span className="text-white/40">Total Settlement</span>
                   <span className="text-primary text-xl">${(confirmation.amount * confirmation.price).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmation(null)}
                  className="flex-1 py-4 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
                >
                  Decline
                </button>
                <button 
                  onClick={confirmTrade}
                  className="flex-1 py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-xl flex flex-col items-center justify-center gap-0.5"
                >
                  <span>Authorize_Now</span>
                  <span className="text-[8px] opacity-60 font-mono tracking-normal lowercase">[ctrl + enter]</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticker Tape */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 border-t border-white/5 py-3 overflow-hidden whitespace-nowrap z-50 pointer-events-none">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          className="flex gap-12 font-mono text-[9px] font-black uppercase tracking-widest"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              {Object.entries(marketData).map(([sym, prices]) => {
                 const cur = prices[prices.length-1];
                 const prev = prices[prices.length-2] || cur;
                 return (
                   <div key={`${i}-${sym}`} className="flex gap-3">
                     <span className="text-white/40">{sym}:</span>
                     <span className="text-white">${cur.toLocaleString()}</span>
                     <span className={cur >= prev ? 'text-green-500' : 'text-red-500'}>{cur >= prev ? '▲' : '▼'}</span>
                   </div>
                 );
              })}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const CoffeeBarSystem = ({ onClose, stats, onAction }: { onClose: () => void; stats: UserStats; onAction: (update: any) => void }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [phase, setPhase] = useState<'selection' | 'brewing' | 'steaming' | 'pouring' | 'ready'>('selection');
  const [progress, setProgress] = useState(0);
  
  const menu = [
    { id: 'espresso', label: 'Double Espresso', cost: 12, effect: 'Energy +20%', icon: <Zap size={14} /> },
    { id: 'latte', label: 'Digital Latte', cost: 18, effect: 'Happiness +15', icon: <Heart size={14} /> },
    { id: 'nitro', label: 'Nitro Cold Brew', cost: 25, effect: 'Focus +10, IQ +1', icon: <TrendingUp size={14} /> },
  ];

  const handleOrder = async () => {
    const item = menu.find(m => m.id === selectedItem);
    if (!item) return;

    // Phase: Brewing
    setPhase('brewing');
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 80));
    }

    // Phase: Steaming (only for latte)
    if (item.id === 'latte') {
      setPhase('steaming');
      setProgress(0);
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 120));
      }
    }

    // Phase: Pouring
    setPhase('pouring');
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 100));
    }

    setPhase('ready');
  };

  const handleConsume = () => {
    const item = menu.find(m => m.id === selectedItem);
    if (item) {
      onAction({ 
        type: 'PURCHASE', 
        amount: item.cost,
        msg: `Energized: consumed ${item.label}. ${item.effect}.` 
      });
      onClose();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-[#0a0a0c] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,209,45,0.1),transparent)]" />
      
      <div className="w-full max-w-5xl grid grid-cols-12 gap-12 relative z-10">
        <div className="col-span-12 flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <Coffee className="text-primary" size={32} />
            <h2 className="font-headline font-black text-3xl text-white uppercase italic tracking-tighter">Bean_Machine_Corporate</h2>
          </div>
          <button onClick={onClose} className="p-2 border border-white/10 hover:border-primary text-white/50 hover:text-primary transition-all"><X size={20} /></button>
        </div>

        <div className="col-span-5 space-y-4">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-6">Barista_Menu</h3>
          <div className="space-y-2">
            {menu.map(item => (
              <button 
                key={item.id} 
                disabled={phase !== 'selection'}
                onClick={() => setSelectedItem(item.id)}
                className={`w-full p-6 border transition-all flex justify-between items-center group ${selectedItem === item.id ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5 hover:border-white/20'} ${phase !== 'selection' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white uppercase tracking-tight">{item.label}</span>
                    <span className="text-primary">{item.icon}</span>
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.effect}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">$ {item.cost}</span>
                  <p className="text-[8px] text-primary uppercase font-black tracking-tighter">Order_Now</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-7 bg-stone-900/50 border border-white/5 p-12 flex flex-col items-center justify-center relative rounded-2xl min-h-[500px]">
          <div className="absolute top-0 right-0 p-4"><div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /></div>
          
          <AnimatePresence mode="wait">
            {phase === 'selection' ? (
              selectedItem ? (
                <motion.div 
                  key="selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="w-48 h-48 rounded-full bg-black/40 border-4 border-primary/20 flex items-center justify-center shadow-[0_0_80px_rgba(251,209,45,0.1)] mb-8 mx-auto">
                     <Coffee size={80} className="text-primary animate-bounce" />
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase mb-2 italic">Excellent Selection</h4>
                  <p className="text-sm text-white/40 mb-8 uppercase tracking-widest">Awaiting order confirmation...</p>
                  <button 
                    onClick={handleOrder}
                    className="px-12 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                  >
                    Confirm Order
                  </button>
                </motion.div>
              ) : (
                <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center opacity-20">
                  <User size={120} className="mx-auto mb-4 stroke-1" />
                  <p className="text-xs font-black uppercase tracking-widest">Awaiting_Character_Selection</p>
                </motion.div>
              )
            ) : phase === 'ready' ? (
              <motion.div 
                key="ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-56 h-56 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center shadow-[0_0_100px_rgba(251,209,45,0.3)] mb-8 mx-auto"
                >
                   <Coffee size={100} className="text-primary" />
                </motion.div>
                <h4 className="text-3xl font-black text-white uppercase mb-2 tracking-tighter italic">Preparation Complete</h4>
                <p className="text-sm text-primary mb-12 uppercase tracking-[0.4em] font-black animate-pulse">Drink_Ready_For_Pickup</p>
                <button 
                  onClick={handleConsume}
                  className="px-16 py-5 bg-primary text-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-[0_10px_30px_rgba(251,209,45,0.2)]"
                >
                  Collect & Consume
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="preparing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center"
              >
                <div className="relative w-64 h-64 mx-auto mb-12">
                   {/* Barista Visuals */}
                   <motion.div 
                      animate={phase === 'brewing' ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : { y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 flex items-center justify-center"
                   >
                      {phase === 'brewing' && <Zap size={80} className="text-blue-400 animate-pulse" />}
                      {phase === 'steaming' && <Wind size={80} className="text-white/40 animate-bounce" />}
                      {phase === 'pouring' && <Droplets size={80} className="text-orange-900/60" />}
                   </motion.div>
                   
                   {/* Steam Particles */}
                   {phase === 'steaming' && Array.from({ length: 8 }).map((_, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 0, x: (i - 3.5) * 10 }}
                       animate={{ opacity: [0, 0.8, 0], y: -100, x: (i - 3.5) * 15, scale: [1, 1.5, 2] }}
                       transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                       className="absolute bottom-1/2 left-1/2 w-4 h-4 bg-white/10 rounded-full blur-xl"
                     />
                   ))}

                   {/* Progress Ring */}
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                      <motion.circle 
                        cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                        strokeDasharray="301" // 2 * pi * 48
                        strokeDashoffset={301 * (1 - progress / 100)}
                      />
                   </svg>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-white uppercase italic tracking-widest">
                    {phase === 'brewing' && 'Extracting_Essence...'}
                    {phase === 'steaming' && 'Synthesizing_Molecular_Foam...'}
                    {phase === 'pouring' && 'Finalizing_Dispensing_Sequence...'}
                  </h4>
                  <div className="flex justify-center gap-3">
                    {['BREW', 'STEAM', 'POUR'].map(step => (
                       <div key={step} className={`px-4 py-1 border text-[10px] font-black transition-colors ${
                         (step === 'BREW' && phase === 'brewing') || (step === 'STEAM' && phase === 'steaming') || (step === 'POUR' && phase === 'pouring')
                         ? 'bg-primary text-black border-primary' : 'text-white/20 border-white/10'
                       }`}>
                         {step}
                       </div>
                    ))}
                  </div>
                  <div className="w-1/2 mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-primary" />
                  </div>
                  <p className="font-mono text-[10px] text-primary/60 tracking-widest">{progress}% COMPLETE</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-12 left-12"><p className="text-[10px] text-white/20 font-mono tracking-widest uppercase italic">Ambient_Track: Synthetic_Rain_LoFi</p></div>
    </motion.div>
  );
};
const WorkstationSystem = ({ onClose, stats, onAction, tasks, onTaskProgress }: { onClose: () => void; stats: UserStats; onAction: (msg: string) => void; tasks: any[]; onTaskProgress: (taskId: string, amount: number) => void }) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(tasks.find(t => !t.completed)?.id || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const activeTask = tasks.find(t => t.id === activeTaskId);

  // Interactive console state
  const [activeConsoleStream, setActiveConsoleStream] = useState(false);
  const [puzzle, setPuzzle] = useState<any>(null);
  const [selectedHex, setSelectedHex] = useState<string | null>(null);
  const [sequenceInput, setSequenceInput] = useState<number[]>([]);
  const [puzzleResult, setPuzzleResult] = useState<'success' | 'fail' | null>(null);

  const startNewPuzzle = () => {
    if (!activeTask) return;
    const types: ('math' | 'matrix' | 'sequence')[] = ['math', 'matrix', 'sequence'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setPuzzleResult(null);
    setSelectedHex(null);
    setSequenceInput([]);

    if (randomType === 'math') {
      const num1 = Math.floor(Math.random() * 85) + 12;
      const num2 = Math.floor(Math.random() * 85) + 12;
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let question = '';
      let answer = 0;
      if (op === '+') {
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
      } else if (op === '-') {
        question = `${num1} - ${num2}`;
        answer = num1 - num2;
      } else {
        const small1 = Math.floor(Math.random() * 11) + 2;
        const small2 = Math.floor(Math.random() * 9) + 2;
        question = `${small1} × ${small2}`;
        answer = small1 * small2;
      }

      const optionsSet = new Set<number>([answer]);
      while (optionsSet.size < 4) {
        optionsSet.add(answer + (Math.floor(Math.random() * 15) - 7));
      }
      const options = Array.from(optionsSet).sort((a, b) => a - b);
      setPuzzle({ type: 'math', question, answer, options });
    } else if (randomType === 'matrix') {
      const hexChars = '0123456789ABCDEF';
      const grid: string[] = [];
      for (let i = 0; i < 9; i++) {
        const code = hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)];
        grid.push(code);
      }
      const targetIndex = Math.floor(Math.random() * 9);
      const target = grid[targetIndex];
      setPuzzle({ type: 'matrix', grid, target, targetIndex });
    } else {
      const sequence: number[] = [];
      for (let i = 0; i < 4; i++) {
        sequence.push(Math.floor(Math.random() * 4) + 1);
      }
      setPuzzle({ type: 'sequence', sequence });
    }
  };

  const handleAnswerSubmit = (value: any) => {
    if (!puzzle || !activeTask || puzzleResult) return;

    let correct = false;
    if (puzzle.type === 'math') {
      correct = Number(value) === puzzle.answer;
    } else if (puzzle.type === 'matrix') {
      setSelectedHex(value);
      correct = value === puzzle.target;
    } else if (puzzle.type === 'sequence') {
      const current = [...sequenceInput, Number(value)];
      setSequenceInput(current);
      playTerminalClick('input');

      // Check sequentially
      const stepIndex = current.length - 1;
      if (current[stepIndex] !== puzzle.sequence[stepIndex]) {
        playTerminalClick('fail');
        setPuzzleResult('fail');
        setTimeout(() => startNewPuzzle(), 1200);
        return;
      }

      if (current.length === puzzle.sequence.length) {
        correct = true;
      } else {
        return; // sequence not complete
      }
    }

    if (correct) {
      playTerminalClick('success');
      setPuzzleResult('success');
      
      // Grant +25% on each puzzle success so exactly 4 rounds completes a task
      setTimeout(() => {
        onTaskProgress(activeTask.id, 25);
        if (activeTask.progress + 25 >= 100) {
          setActiveConsoleStream(false);
          setPuzzle(null);
        } else {
          startNewPuzzle();
        }
      }, 1000);
    } else {
      playTerminalClick('fail');
      setPuzzleResult('fail');
      setTimeout(() => {
        startNewPuzzle();
      }, 1200);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-[#1a1c2c] flex flex-col items-center justify-center p-12 text-white">
      <div className="w-full max-w-2xl bg-black/40 border border-white/10 p-12 relative">
        <button 
          onClick={() => {
            playTerminalClick('transition');
            onClose();
          }} 
          className="absolute top-6 right-6 text-white/40 hover:text-white"
        >
          <X size={24} />
        </button>

        {!activeConsoleStream ? (
          <>
            <div className="text-center">
              <Monitor size={64} className="mx-auto mb-8 text-primary animate-pulse" />
              <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Job_Processor_V3</h2>
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-12">Sub-Sector_Data_Ingestion_Node</p>
            </div>

            <div className="space-y-6 mb-12">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => {
                    if (!task.completed) {
                      playTerminalClick('chirp');
                      setActiveTaskId(task.id);
                    }
                  }}
                  className={`p-4 border transition-all cursor-pointer ${activeTaskId === task.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-black/20 hover:border-white/20'} ${task.completed ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center ${activeTaskId === task.id ? 'bg-primary text-black' : 'bg-white/10 text-white/40'}`}>
                        {task.completed ? <Check size={16} /> : <Terminal size={16} />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest ${activeTaskId === task.id ? 'text-primary' : 'text-white'}`}>{task.title}</h4>
                        <p className="text-[9px] text-white/40 uppercase tracking-tighter">Reward_Credits: ${task.reward}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white/20">{task.progress}%</span>
                  </div>
                  <div className="h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden relative shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${task.progress}%`,
                        backgroundColor: task.completed ? '#00fdc1' : '#fbd12d',
                        boxShadow: task.completed 
                          ? '0 0 12px 2px rgba(0, 253, 193, 0.7)' 
                          : '0 0 12px 2px rgba(251, 209, 45, 0.7)'
                      }}
                      transition={{ 
                        width: { type: "spring", stiffness: 70, damping: 15 },
                        backgroundColor: { duration: 0.35, ease: "easeOut" },
                        boxShadow: { duration: 0.35, ease: "easeOut" }
                      }}
                      className="h-full rounded-full relative"
                    >
                      {/* Subtle light pulse overlay */}
                      <motion.div 
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white/25"
                      />
                      {/* Tactile progress sweep line */}
                      <motion.div 
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                if (activeTask && !activeTask.completed) {
                  playTerminalClick('transition');
                  setActiveConsoleStream(true);
                  startNewPuzzle();
                }
              }} 
              disabled={!activeTask || activeTask.completed}
              className="w-full py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-30 flex items-center justify-center gap-2 font-mono"
            >
              {activeTask ? `CONNECT_COGNITIVE_LINK_TO_0x${activeTask.id.toUpperCase()}` : 'Mission_Complete'}
            </button>
          </>
        ) : (
          <div className="font-mono">
            {/* Console stream view */}
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <button 
                onClick={() => {
                  playTerminalClick('transition');
                  setActiveConsoleStream(false);
                  setPuzzle(null);
                }}
                className="text-[10px] font-black uppercase text-primary hover:text-white transition-colors"
              >
                &lt;&lt; DISCONNECT_UPLINK
              </button>
              <div className="text-right">
                <span className="text-[8px] font-black text-white/30 tracking-[0.2em] block">UPLINK_STATUS</span>
                <span className="text-[10px] font-black text-[#00fdc1] animate-pulse">CONNECTED • MUTABLE</span>
              </div>
            </div>

            {/* Task summary header */}
            <div className="bg-black/40 border border-white/5 p-4 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-white/40 uppercase">ACTIVE_DECRYPT_NODE</span>
                <span className="text-xs font-black text-primary">{activeTask?.progress}%</span>
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2">{activeTask?.title}</h3>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div style={{ width: `${activeTask?.progress}%` }} className="h-full bg-primary transition-all duration-300" />
              </div>
            </div>

            {/* Micro puzzle content */}
            {puzzle && (
              <div className="bg-black/60 border border-white/10 p-8 rounded-lg relative overflow-hidden flex flex-col items-center">
                {/* Visual grid scanners inside */}
                <div className="absolute inset-x-0 top-0 h-[10px] bg-primary/5 border-b border-primary/10 animate-pulse" />

                <div className="text-center mb-6">
                  <span className="text-[8px] font-black text-primary/60 uppercase tracking-[0.3em] block mb-1">DATA STREAM INTEGRATION ERROR RECOVERY</span>
                  {puzzle.type === 'math' && (
                    <h4 className="text-xs font-black text-white/50 uppercase">CALIBRATE NEURAL PROCESS MATRIX</h4>
                  )}
                  {puzzle.type === 'matrix' && (
                    <h4 className="text-xs font-black text-white/50 uppercase">LOCATE INTERCEPT TARGET NODE</h4>
                  )}
                  {puzzle.type === 'sequence' && (
                    <h4 className="text-xs font-black text-white/50 uppercase">GENERATE COGNITIVE PASSKEY SYNAPSE</h4>
                  )}
                </div>

                {/* SUCCESS / FAIL OVERLAYS */}
                <AnimatePresence>
                  {puzzleResult === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#00fdc1]/10 flex flex-col items-center justify-center backdrop-blur-sm z-30">
                      <Check size={48} className="text-[#00fdc1] mb-2 animate-bounce" />
                      <span className="text-sm font-black text-[#00fdc1] tracking-widest uppercase">NODE INTERACTION SYNCHRONIZED!</span>
                    </motion.div>
                  )}
                  {puzzleResult === 'fail' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center backdrop-blur-sm z-30">
                      <X size={48} className="text-red-500 mb-2 animate-ping" />
                      <span className="text-sm font-black text-red-500 tracking-widest uppercase">CORRUPTED TRANSCEIVER PACKET</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Render appropriate games */}
                {puzzle.type === 'math' && (
                  <div className="w-full text-center">
                    <div className="bg-black border border-white/5 p-6 mb-6 inline-block rounded-md shadow-inner">
                      <span className="text-3xl font-bold font-mono text-glow tracking-widest text-primary block">{puzzle.question}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
                      {puzzle.options.map((opt: number, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSubmit(opt)}
                          className="py-3 border border-white/10 hover:border-primary hover:bg-primary/5 text-xs font-black uppercase text-white hover:text-primary transition-all rounded-md"
                        >
                          ROUTE_{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {puzzle.type === 'matrix' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="mb-4 text-center">
                      <span className="text-[10px] text-white/40 block">SCAN FOR ENCRYPTED VALUE:</span>
                      <span className="text-xl font-bold uppercase tracking-wider text-secondary animate-pulse">0x{puzzle.target}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-56">
                      {puzzle.grid.map((code: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSubmit(code)}
                          className={`h-12 border ${selectedHex === code ? 'bg-secondary text-black border-secondary' : 'border-white/10 hover:border-secondary hover:bg-secondary/5 text-xs text-white/80'} font-bold transition-all rounded`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {puzzle.type === 'sequence' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="mb-4 text-center">
                      <span className="text-[10px] text-white/40 block">REPLICATE THE COGNITIVE INDEX:</span>
                      <span className="text-lg font-bold tracking-[0.3em] text-[#00fdc1]">{puzzle.sequence.join(' • ')}</span>
                    </div>

                    <div className="mb-6 h-6 flex items-center gap-2">
                      <span className="text-[8px] text-white/30 uppercase tracking-widest">ENTERED: </span>
                      {puzzle.sequence.map((_: number, idx: number) => (
                        <div 
                          key={idx} 
                          className={`w-3.5 h-3.5 border rounded-full flex items-center justify-center text-[8px] font-bold ${
                            sequenceInput[idx] !== undefined 
                              ? 'bg-[#00fdc1] border-[#00fdc1] text-black shadow-[0_0_8px_#00fdc1]' 
                              : 'border-white/20 text-white/20'
                          }`}
                        >
                          {sequenceInput[idx] || ''}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAnswerSubmit(num)}
                          className="h-16 bg-black border border-white/10 hover:border-primary hover:bg-primary/5 active:bg-primary active:text-black text-white text-lg font-bold transition-all rounded-md flex flex-col items-center justify-center gap-1 shadow-inner"
                        >
                          <span className="text-xs opacity-40">N_0{num}</span>
                          <span className="text-glow font-bold">{num}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MainframeSystem = ({ onClose, stats, onAction }: { onClose: () => void; stats: UserStats; onAction: (update: any) => void }) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const modules = [
    { id: 'efficiency', label: 'EFFICIENCY', icon: <Zap size={24} />, desc: 'Optimize resource allocation.', outcome: 'Output +15%', boost: { iq: 5, netWorth: stats.netWorth * 0.02 } },
    { id: 'security', label: 'SECURITY', icon: <Shield size={24} />, desc: 'Reinforce data firewalls.', outcome: 'Stability +20%', boost: { prestige: 25, morals: 5 } },
    { id: 'yield', label: 'YIELD', icon: <TrendingUp size={24} />, desc: 'Maximize capital synthesis.', outcome: 'Profit +10%', boost: { netWorth: stats.netWorth * 0.05 } },
    { id: 'decrypt', label: 'DECRYPT', icon: <Database size={24} />, desc: 'Extract hidden market data.', outcome: 'Intel +50', boost: { iq: 8, morals: -2 } },
  ];

  const handleOptimize = async () => {
    if (!selectedModule || isOptimizing) return;
    
    setIsOptimizing(true);
    setProgress(0);
    
    // Pulse-pounding optimization simulation
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      setProgress((i / steps) * 100);
      await new Promise(r => setTimeout(r, 100));
    }
    
    setIsOptimizing(false);
    setSuccess(true);
    
    const mod = modules.find(m => m.id === selectedModule);
    if (mod) {
      onAction({ 
        type: 'STATS_UPDATE', 
        stats: mod.boost,
        msg: `MAINFRAME_CRITICAL: ${mod.label} Optimization Sequence Complete. ${mod.outcome} boost applied.` 
      });
    }

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-[#050608] flex items-center justify-center p-8 overflow-hidden"
    >
      <VisualEffectsOverlay />
      
      {/* Background Data Streams */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-10 w-px h-full bg-primary" />
        <div className="absolute top-0 right-10 w-px h-full bg-primary" />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: -100 }}
            animate={{ y: ['0%', '1000%'] }}
            transition={{ repeat: Infinity, duration: 10 + Math.random() * 20, ease: "linear", delay: Math.random() * 10 }}
            className="absolute text-[8px] font-mono text-primary whitespace-nowrap"
            style={{ left: `${Math.random() * 100}%` }}
          >
            {Math.random().toString(36).substring(7).toUpperCase()}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-5xl bg-black/60 border border-white/5 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative z-10 flex flex-col min-h-[600px]">
        {/* Terminal Header */}
        <div className="p-6 bg-white/5 border-b border-primary/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 border border-primary/40 flex items-center justify-center">
              <Server size={28} className="text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">Bio_Link_Mainframe</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <p className="text-[9px] text-primary/60 uppercase tracking-[0.4em] font-black">Secure_Connection_Established</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 border border-white/10 text-white/50 hover:bg-red-500 hover:text-black hover:border-red-500 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            TERMINATE_LINK
          </button>
        </div>

        <div className="flex-1 grid grid-cols-12">
          {/* Left Panel: System Health */}
          <div className="col-span-4 border-r border-white/5 p-8 bg-black/40 space-y-8 flex flex-col">
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Core_Diagnostics</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Thermal_Load', val: '42°C', status: 'Optimal' },
                    { label: 'Neural_Sync', val: '99.2%', status: 'Stable' },
                    { label: 'Buffer_State', val: 'Idle', status: 'Ready' },
                  ].map(stat => (
                    <div key={stat.label} className="p-3 bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{stat.label}</span>
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{stat.status}</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-white">{stat.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] mb-2 font-mono">System_Alert</p>
                <p className="text-[11px] text-white/60 leading-relaxed italic">
                  Uplink bandwidth prioritized for Executive Node 42. Non-essential data streams throttled to optimize {selectedModule ? selectedModule.toUpperCase() : 'selected'} core.
                </p>
              </div>
            </div>

            {/* Selection Summary */}
            {selectedModule && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-primary/10 border border-primary/30 rounded-xl"
              >
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4">Command_Queue</h4>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-white uppercase tracking-widest">{selectedModule}</span>
                  <span className="text-[10px] font-black text-primary uppercase">{modules.find(m => m.id === selectedModule)?.outcome}</span>
                </div>
                <button 
                  onClick={handleOptimize}
                  disabled={isOptimizing || success}
                  className={`w-full py-4 font-black uppercase text-xs tracking-[0.3em] transition-all relative overflow-hidden flex items-center justify-center gap-2 ${isOptimizing ? 'bg-white/10 text-white/40 cursor-wait' : success ? 'bg-emerald-500 text-black' : 'bg-primary text-black hover:bg-white shadow-[0_0_20px_rgba(251,209,45,0.3)]'}`}
                >
                  {isOptimizing && <Loader2 size={14} className="animate-spin" />}
                  {isOptimizing ? (
                    'PROCESSING...'
                  ) : success ? (
                    'OPTIMIZATION_COMPLETE'
                  ) : (
                    'AUTHORIZE_OPTIMIZE'
                  )}
                  {isOptimizing && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Panel: Optimization Modules */}
          <div className="col-span-8 p-12 bg-black/20 relative overflow-hidden flex flex-col">
            <div className="relative z-10 flex-1">
              <h3 className="text-center text-xs font-black text-white/20 uppercase tracking-[0.5em] mb-12">Module_Optimization_Interface</h3>
              
              <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
                {modules.map(module => (
                  <button 
                    key={module.id} 
                    onMouseEnter={() => setActiveModule(module.id)}
                    onMouseLeave={() => setActiveModule(null)}
                    onClick={() => setSelectedModule(module.id)} 
                    className={`relative group p-6 border transition-all flex items-center justify-between overflow-hidden ${selectedModule === module.id ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(251,209,45,0.1)]' : 'bg-white/5 border-white/10 hover:border-primary/50'}`}
                  >
                    <div className={`absolute inset-y-0 left-0 w-1 transition-transform origin-top ${selectedModule === module.id ? 'bg-primary scale-y-100' : 'bg-primary scale-y-0 group-hover:scale-y-100'}`} />
                    <div className="flex items-center gap-6">
                      <div className={`p-4 transition-all ${selectedModule === module.id ? 'bg-primary text-black' : 'bg-white/5 text-primary group-hover:bg-primary/20'}`}>
                        {module.icon}
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-black block mb-1 transition-colors tracking-widest leading-none ${selectedModule === module.id ? 'text-primary' : 'text-white group-hover:text-primary/80'}`}>{module.label}</span>
                        <p className={`text-[10px] uppercase tracking-wider transition-colors ${selectedModule === module.id ? 'text-white/60' : 'text-white/40 group-hover:text-white/60'}`}>{module.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] font-black transition-opacity tracking-widest ${selectedModule === module.id ? 'text-primary opacity-100' : 'text-primary opacity-0 group-hover:opacity-100'}`}>{module.outcome}</span>
                    </div>
                  </button>
                ))}
              </div>

              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
                >
                  <div className="text-center p-12 border border-emerald-500/30 bg-emerald-500/5 rounded-3xl">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]"
                    >
                      <Check className="text-black" size={48} strokeWidth={4} />
                    </motion.div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Efficiency_Restored</h3>
                    <p className="text-xs text-white/40 uppercase tracking-[0.4em] font-bold">Uplink Synced • Global Stats Updated</p>
                  </div>
                </motion.div>
              )}

              <div className="mt-16 text-center">
                <p className="text-[8px] font-mono text-white/20 animate-pulse uppercase tracking-[0.8em]">Awaiting_Command_Authorization...</p>
              </div>
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-20 -right-20 p-20 opacity-[0.03]">
              <Server size={300} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NightclubBarSystem = ({ onClose, stats, onAction }: { onClose: () => void; stats: UserStats; onAction: (update: any) => void }) => {
  const drinks = [
    { id: 'macbeth', label: 'Macbeth Whiskey Shot', cost: 50, effect: 'Everything blurs... Happiness +50' },
    { id: 'pisswasser', label: 'Pisswasser Beer', cost: 15, effect: 'Relaxed. Happiness +20' },
    { id: 'champagne', label: 'Diamond Gold Champagne', cost: 1500, effect: 'Prestige mode active. Happiness +200' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-[#1a0a1a] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(219,39,119,0.2),transparent)]" />
      <div className="w-full max-w-4xl bg-black/80 border border-pink-500/20 p-12 backdrop-blur-xl relative">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-headline font-black text-4xl text-pink-500 uppercase italic tracking-tighter">The_Afterlife_Bar</h2>
            <p className="text-[10px] text-pink-500/40 uppercase tracking-[0.5em]">Liquid_Entertainment_Division</p>
          </div>
          <button onClick={onClose} className="p-2 bg-pink-500 text-black"><X size={24} /></button>
        </div>

        <BuildingInteriorScan type="bar" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drinks.map(drink => (
            <button key={drink.id} onClick={() => {
              onAction({ type: 'PURCHASE', amount: drink.cost, msg: `Drank ${drink.label}. ${drink.effect}` });
              onClose();
            }} className="group p-6 border border-white/5 bg-white/5 hover:bg-pink-500 hover:border-pink-500 transition-all text-left">
              <Wine className="mb-4 text-pink-500 group-hover:text-black" size={32} />
              <h3 className="font-black text-white group-hover:text-black uppercase mb-2">{drink.label}</h3>
              <p className="text-[10px] text-white/40 group-hover:text-black/60 uppercase mb-4">{drink.effect}</p>
              <span className="text-xl font-black text-pink-500 group-hover:text-black">${drink.cost.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ArcadeSystem = ({ onClose }: { onClose: () => void }) => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let interval: any;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        setTargetPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border-4 border-primary shadow-[0_0_50px_rgba(251,209,45,0.2)] relative overflow-hidden flex flex-col">
        {/* Arcade Cabinet Header */}
        <div className="bg-primary p-2 flex justify-between items-center px-4">
          <span className="text-[10px] font-black text-black font-mono">ASTRO_REFLEX_V2.0</span>
          <button onClick={onClose} className="text-black/50 hover:text-black transition-colors"><X size={16} /></button>
        </div>
        
        <div className="flex-1 min-h-[400px] bg-black relative flex items-center justify-center overflow-hidden">
           {/* CRT Scanlines Effect */}
           <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
           
           {!gameActive ? (
             <div className="text-center z-10">
               <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                 <Gamepad2 size={64} className="text-primary mx-auto mb-6" />
               </motion.div>
               <h3 className="text-3xl font-headline font-black text-white italic mb-2 tracking-tighter">SCORE: {score}</h3>
               <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] mb-8">Ready_User_One</p>
               <button 
                 onClick={startGame} 
                 className="px-10 py-4 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-neon-glow-primary"
               >
                 Insert_Coin_Start
               </button>
             </div>
           ) : (
             <>
               <div className="absolute top-6 left-6 flex flex-col gap-1">
                 <span className="text-[8px] text-primary font-black uppercase tracking-widest">Time_Remaining</span>
                 <span className="text-2xl font-mono font-black text-white">{timeLeft}s</span>
               </div>
               <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
                 <span className="text-[8px] text-primary font-black uppercase tracking-widest">Current_Score</span>
                 <span className="text-2xl font-mono font-black text-white">{score}</span>
               </div>

               <motion.button
                 animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                 transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                 onClick={() => {
                    setScore(s => s + 500);
                    setTargetPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
                 }}
                 className="absolute w-12 h-12 bg-primary rounded-full border-4 border-black shadow-[0_0_20px_rgba(251,209,45,0.8)] flex items-center justify-center group"
               >
                 <Target className="text-black animate-spin-slow" size={24} />
               </motion.button>
             </>
           )}
        </div>
        
        {/* Control Panel Decor */}
        <div className="bg-stone-900 p-6 flex justify-center gap-8 border-t border-stone-800">
           <div className="w-12 h-12 rounded-full bg-red-600 shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]" />
           <div className="w-12 h-12 rounded-full bg-blue-600 shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)]" />
           <div className="w-16 h-4 bg-stone-800 rounded-full my-auto" />
        </div>
      </div>
    </motion.div>
  );
};

const JukeboxSystem = ({ onClose, onPlay }: { onClose: () => void; onPlay: (song: string) => void }) => {
  const songs = [
    { id: '1', title: 'Neon Pulse', duration: '3:45', bpm: 128 },
    { id: '2', title: 'Silicone Dream', duration: '4:12', bpm: 110 },
    { id: '3', title: 'Glitch Matrix', duration: '2:58', bpm: 145 },
    { id: '4', title: 'Chrome Horizon', duration: '5:20', bpm: 95 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg bg-[#0d0d0d] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-headline font-black text-3xl text-secondary uppercase italic tracking-tighter">Audio_Synthesizer</h2>
            <p className="text-[10px] text-secondary/40 uppercase tracking-[0.5em] font-black">Neural_Audio_Interface</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <div className="space-y-4">
          {songs.map(song => (
            <button 
              key={song.id} 
              onClick={() => { onPlay(song.title); onClose(); }} 
              className="w-full flex items-center gap-6 p-4 bg-white/5 border border-white/5 hover:border-secondary hover:bg-secondary/5 transition-all group"
            >
              <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-black transition-all">
                <Music size={24} className="text-secondary group-hover:text-black" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-black text-white uppercase tracking-widest">{song.title}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{song.bpm} BPM • {song.duration}</p>
              </div>
              <div className="text-[10px] font-black text-secondary opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">QUEUE_SONG</div>
            </button>
          ))}
        </div>
        
        <button onClick={onClose} className="mt-8 w-full py-4 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] border border-white/5 hover:text-white hover:border-white/20 transition-all">
          Exit_Interface
        </button>
      </div>
    </motion.div>
  );
};



const BuildingInterior = ({ 
  type, 
  onBack, 
  stats, 
  playerData, 
  marketData, 
  onAction,
  onTaskProgress,
  implants,
  setImplants,
  syndicateHires,
  setSyndicateHires,
  contraband,
  setContraband,
  nodesBreached,
  setNodesBreached
}: { 
  type: string; 
  onBack: () => void; 
  stats: UserStats;
  playerData: PlayerData;
  marketData: Record<string, number[]>;
  onAction: (update: any) => void;
  onTaskProgress: (taskId: string, amount: number) => void;
  implants: string[];
  setImplants: React.Dispatch<React.SetStateAction<string[]>>;
  syndicateHires: string[];
  setSyndicateHires: React.Dispatch<React.SetStateAction<string[]>>;
  contraband: Record<string, number>;
  setContraband: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  nodesBreached: number;
  setNodesBreached: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [characterPos, setCharacterPos] = useState({ x: 50, y: 70 });
  const [activeSubView, setActiveSubView] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSubView) return;
      const step = 4;
      setCharacterPos(prev => {
        let { x, y } = prev;
        if (['w', 'arrowup'].includes(e.key.toLowerCase())) y = Math.max(5, y - step);
        if (['s', 'arrowdown'].includes(e.key.toLowerCase())) y = Math.min(95, y + step);
        if (['a', 'arrowleft'].includes(e.key.toLowerCase())) x = Math.max(5, x - step);
        if (['d', 'arrowright'].includes(e.key.toLowerCase())) x = Math.min(95, x + step);
        return { x, y };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSubView]);

  const sceneStyles: Record<string, { bg: string }> = {
    office: { bg: 'bg-[#1a1c2c]' },
    bank: { bg: 'bg-[#1c1b1a]' },
    school: { bg: 'bg-[#1c1a24]' },
    bar: { bg: 'bg-[#241a2a]' },
    gym: { bg: 'bg-[#1a2c24]' }
  };
  const hotspots: Record<string, { id: string; label: string; desc: string; icon: any; x: number; y: number }[]> = {
    office: [
      { id: 'desk', label: 'Workstation', desc: 'Global terminal for resource management and market monitoring.', icon: <Monitor size={24} />, x: 25, y: 45 },
      { id: 'server', label: 'Mainframe', desc: 'Optimize core system modules for temporary efficiency and yield boosts.', icon: <Server size={24} />, x: 50, y: 20 },
      { id: 'coffee', label: 'Coffee Bar', desc: 'Recharge neural buffers and maintain peak cognitive performance.', icon: <Coffee size={24} />, x: 80, y: 50 },
      { id: 'hacknet', label: 'Hacknet Terminus', desc: 'Secure high-speed backdoor into corporate databanks for direct credit arbitrage.', icon: <Terminal size={24} />, x: 75, y: 75 },
    ],
    bank: [
      { id: 'atm', label: 'ATM Terminal', desc: 'Secure portal for currency extraction and financial data verification.', icon: <CreditCard size={24} />, x: 15, y: 40 },
      { id: 'vault', label: 'Vault Entry', desc: 'Restricted access to high-value assets and secure storage lockers.', icon: <Lock size={24} />, x: 50, y: 35 },
      { id: 'invest', label: 'Trading Desk', desc: 'Execute real-time asset liquidation and long-term capital investments.', icon: <TrendingUp size={24} />, x: 80, y: 60 },
    ],
    school: [
      { id: 'library', label: 'Data Archive', desc: 'Extensive repository of legacy knowledge and encrypted academic logs.', icon: <BookOpen size={24} />, x: 50, y: 15 },
      { id: 'lab', label: 'Bio-Lab', desc: 'State-of-the-art facility for neural experimentation and bio-syncing.', icon: <FlaskConical size={24} />, x: 85, y: 70 },
      { id: 'lecture', label: 'Neural Link', desc: 'Direct uplink to educational cloud networks for rapid skill acquisition.', icon: <Brain size={24} />, x: 20, y: 50 },
      { id: 'chrome_lab', label: 'Chrome Clinic', desc: 'Surgical cyberware augmentations offering supreme cognitive buffs.', icon: <Cpu size={24} />, x: 80, y: 40 },
    ],
    bar: [
      { id: 'counter', label: 'The Bar', desc: 'Exchange credits for premium neural stimulants and industry intel.', icon: <Wine size={24} />, x: 60, y: 80 },
      { id: 'music', label: 'Jukebox', desc: 'Control the ambient audio stream and adjust high-fidelity vibes.', icon: <Music size={24} />, x: 10, y: 60 },
      { id: 'arcade', label: 'Arcade', desc: 'Engage in legacy combat simulations for high-score prestige.', icon: <Gamepad2 size={24} />, x: 90, y: 45 },
      { id: 'black_market', label: 'Smuggler Nexus', desc: 'Sector-09 underground agent selling restricted tech anomalies.', icon: <Skull size={24} />, x: 45, y: 35 },
    ],
    gym: [
      { id: 'treadmill', label: 'Neural Treadmill', desc: 'High-speed physical conditioning for mental clarity.', icon: <Activity size={24} />, x: 20, y: 40 },
      { id: 'weights', label: 'Power Rack', desc: 'Heavy resistance training to optimize biological hardware.', icon: <Target size={24} />, x: 50, y: 25 },
      { id: 'shower', label: 'Cryo-Shower', desc: 'Rapid thermal recovery and neural buffer cleanup.', icon: <Zap size={24} />, x: 80, y: 55 },
    ]
  };

  const currentScene = sceneStyles[type] || sceneStyles.office;
  const currentHotspots = hotspots[type] || hotspots.office;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`fixed inset-0 z-[180] ${currentScene.bg} flex flex-col overflow-hidden`}>
      <VisualEffectsOverlay />
      
      {/* HUD Navigation elements */}
      <div className="fixed bottom-32 left-10 z-[200] space-y-2 pointer-events-none opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-0.5 bg-primary/40" />
          <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">X_COORD_SYST</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-0.5 bg-primary/20" />
          <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Y_COORD_SYST</span>
        </div>
      </div>
      
      {/* 10x Enhanced Background Environment */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000">
        {/* Layer 1: Tech Grid Floor */}
        <div className="absolute inset-0 tech-grid opacity-[0.05]" />
        
        {/* Layer 2: Wall Structures Decoration */}
        <div className="absolute top-0 w-full h-[30%] border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute left-[10%] w-[1px] h-full bg-white/5" />
        <div className="absolute right-[10%] w-[1px] h-full bg-white/5" />
        
        {/* Layer 3: Dynamic Lighting pulses - stabilized to keep ecosystem bright */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,242,255,0.08),transparent_60%)] opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,209,45,0.08),transparent_60%)] opacity-100" />

        {/* Layer 4: Vertical HUD Scanners */}
        <div className="absolute left-10 top-[20%] bottom-[20%] w-0.5 bg-white/5 flex flex-col justify-between py-10 opacity-30">
          {[...Array(20)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
              className={`w-2 h-0.5 ${i % 5 === 0 ? 'bg-primary w-4' : 'bg-white'}`} 
            />
          ))}
        </div>
      </div>

      <div className="relative z-[100] p-6 lg:px-12 flex justify-between items-center bg-black/80 backdrop-blur-3xl border-b border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group">
        <TechLines />
        <div className="flex items-center gap-8 relative z-10">
          <button 
            onClick={() => {
              playTerminalClick('transition');
              onBack();
            }} 
            className="w-12 h-12 bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-black transition-all group flex items-center justify-center relative overflow-hidden etched-border"
          >
            <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform" />
            <ArrowLeft size={22} className="relative z-10 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                type === 'gym' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-primary shadow-neon'
              }`} />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Environmental_Sync_Active</span>
            </div>
            <h2 className="font-headline font-black text-3xl text-white uppercase italic tracking-tighter leading-none flex items-center gap-4">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{type}</span>
              <span className="text-primary text-glow font-mono text-xs opacity-60 not-italic">LOC_{type.toUpperCase()}_NODE_v02</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-12 relative z-10">
          <div className="hidden xl:flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Asset_Liquidity</span>
              <span className="text-sm font-mono font-black text-primary tracking-widest">${stats.netWorth.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Neural_Status</span>
              <span className="text-sm font-mono font-black text-secondary tracking-widest">{stats.happiness}%_SYNC</span>
            </div>
          </div>
          <button 
            onClick={() => {
              playTerminalClick('transition');
              onBack();
            }} 
            className="px-10 py-3.5 bg-primary text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-neon group relative overflow-hidden etched-border"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="relative z-10 flex items-center gap-2 italic">
              RETURN_TO_CITY_GRID
              <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>


      <div className="relative flex-1 cursor-crosshair" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCharacterPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
      }}>
        {/* Floor Pattern */}
        <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />

        {currentHotspots.map((spot) => (
          <div key={spot.id} style={{ left: `${spot.x}%`, top: `${spot.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2 group z-20">
            <motion.div whileHover={{ scale: 1.15 }} className="relative">
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  playTerminalClick('transition');
                  setActiveSubView(spot.id); 
                }} 
                className="relative p-6 rounded-2xl bg-black/60 border border-white/10 text-white/40 group-hover:text-primary group-hover:border-primary transition-all z-20 shadow-2xl backdrop-blur-md"
              >
                {spot.icon}
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary animate-ping transition-all" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none z-[100]">
                <div className="bg-black/95 backdrop-blur-xl p-5 border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-[240px] relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 -rotate-45 translate-x-4 -translate-y-4" />
                  
                  <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-primary">{spot.icon}</div>
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{spot.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[8px] font-black text-primary uppercase italic tracking-widest">Linked</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-white/40 leading-relaxed font-medium mb-4">
                    {spot.desc}
                  </p>

                  <div className="bg-white/5 p-3 border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Status_Pulse</span>
                      <span className="text-[7px] font-black text-primary uppercase">Optimized</span>
                    </div>
                    <div className="text-[9px] font-black text-white uppercase tracking-tighter flex items-center gap-2">
                      <Zap size={10} className="text-primary" />
                      {spot.id === 'desk' && `Active_Modules: ${playerData.tasks.length || 0}`}
                      {spot.id === 'atm' && `Available_Credits: $${stats.netWorth.toLocaleString()}`}
                      {spot.id === 'vault' && `Security_Rating: A+`}
                      {spot.id === 'server' && `CPU_Load: 14.4%`}
                      {spot.id === 'coffee' && `Thermal_Stasis: Stable`}
                      {spot.id === 'counter' && `Vibe_Level: ${stats.happiness}%`}
                      {spot.id === 'library' && `Neural_Index: ${stats.iq}`}
                      {spot.id === 'lab' && `Bio_State: Synchronized`}
                      {spot.id === 'treadmill' && `Pulse_Goal: 140bpm`}
                      {spot.id === 'weights' && `Rep_Efficiency: 98%`}
                      {!['desk', 'atm', 'vault', 'server', 'coffee', 'counter', 'library', 'lab', 'treadmill', 'weights'].includes(spot.id) && 'System_Nominal'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}

        <motion.div 
          animate={{ left: `${characterPos.x}%`, top: `${characterPos.y}%` }} 
          transition={{ type: 'spring', damping: 30, stiffness: 150 }}
          className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="relative w-full h-full">
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            />
            <div className="relative w-full h-full bg-surface-container rounded-full border-4 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(251,209,45,0.3)] overflow-hidden">
               <img 
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                  stats.avatar === 'Avatar_1' ? 'Felix' : 
                  stats.avatar === 'Avatar_2' ? 'Aneka' : 
                  stats.avatar === 'Avatar_3' ? 'Jasper' : 
                  stats.avatar === 'Avatar_4' ? 'Sasha' :
                  stats.avatar === 'Avatar_5' ? 'Luna' : 'Oliver'
                }`}
                alt="Character"
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeSubView === 'atm' && <ATMSystem onClose={() => setActiveSubView(null)} stats={stats} playerData={playerData} onAction={onAction} />}
        {activeSubView === 'vault' && <VaultSystem onClose={() => setActiveSubView(null)} stats={stats} playerData={playerData} onAction={onAction} />}
        {activeSubView === 'invest' && <TradingDeskSystem onClose={() => setActiveSubView(null)} stats={stats} marketData={marketData} onAction={onAction} />}
        {activeSubView === 'desk' && <WorkstationSystem onClose={() => setActiveSubView(null)} stats={stats} onAction={onAction} tasks={playerData.tasks} onTaskProgress={onTaskProgress} />}
        {activeSubView === 'server' && <MainframeSystem onClose={() => setActiveSubView(null)} stats={stats} onAction={onAction} />}
        {activeSubView === 'coffee' && <CoffeeBarSystem onClose={() => setActiveSubView(null)} stats={stats} onAction={onAction} />}
        {activeSubView === 'counter' && <NightclubBarSystem onClose={() => setActiveSubView(null)} stats={stats} onAction={onAction} />}
        {activeSubView === 'arcade' && <ArcadeSystem onClose={() => setActiveSubView(null)} />}
        {activeSubView === 'chrome_lab' && (
          <ChromeClinicSystem 
            onClose={() => setActiveSubView(null)} 
            stats={stats} 
            onAction={onAction} 
            implants={implants} 
            setImplants={setImplants} 
          />
        )}
        {activeSubView === 'hacknet' && (
          <HacknetSystem 
            onClose={() => setActiveSubView(null)}
            stats={stats}
            onAction={onAction}
            implants={implants}
            nodesBreached={nodesBreached}
            setNodesBreached={setNodesBreached}
          />
        )}
        {activeSubView === 'black_market' && (
          <BlackMarketSystem 
            onClose={() => setActiveSubView(null)}
            stats={stats}
            onAction={onAction}
            contraband={contraband}
            setContraband={setContraband}
          />
        )}
        {['treadmill', 'weights', 'shower'].includes(activeSubView || '') && (
          <GymSystem 
            type={activeSubView || ''} 
            onClose={() => setActiveSubView(null)} 
            onAction={onAction} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BuildingInspector = ({ 
  building, 
  status, 
  onClose, 
  onEnter, 
  onQuickAction,
  activeUpgrade
}: { 
  building: { name: string; title: string; description: string; stats: string[]; quickAction: string; icon: React.ReactNode };
  status: string;
  onClose: () => void;
  onEnter: () => void;
  onQuickAction: (action: string) => void;
  activeUpgrade?: { title: string; progress: number };
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, x: -20 }}
    animate={{ opacity: 1, scale: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.9, x: -20 }}
    className="fixed left-8 top-1/2 -translate-y-1/2 z-[170] w-96 bg-surface-container border-l-8 border-primary shadow-[40px_0_100px_rgba(0,0,0,0.9)] p-10 relative overflow-hidden etched-border"
  >
    <TechLines className="opacity-20" />
    <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-primary transition-colors z-10"><X size={24} /></button>
    
    <div className="relative z-10">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-neon">
          {React.cloneElement(building.icon as React.ReactElement, { size: 32 })}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.5em]">OBJECT_ID: 0x{building.name.toUpperCase()}</span>
          </div>
          <h3 className="font-headline font-black text-3xl text-white uppercase tracking-tighter italic leading-none">{building.title}</h3>
          <div className="flex items-center gap-2 mt-3">
            <div className={`w-2 h-2 rounded-full shadow-neon ${
              status === 'active' ? 'bg-primary animate-pulse' : 
              status === 'warning' ? 'bg-tertiary' :
              status === 'alert' ? 'bg-red-500' : 'bg-white/20'
            }`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
              status === 'active' ? 'text-primary' : 
              status === 'warning' ? 'text-tertiary' :
              status === 'alert' ? 'text-red-400' : 'text-white/40'
            }`}>
              {activeUpgrade ? 'STATUS_STRUCTURAL_EVOLUTION' : `STATUS_${status.toUpperCase()}`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 bg-black/40 p-4 border border-white/5">
        <div className="border-r border-white/5">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">OPERATIONAL_LOAD</span>
          <span className="text-[12px] font-mono font-black text-secondary">88.4%_NOMINAL</span>
        </div>
        <div className="pl-2">
          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">SYSTEM_TEMP</span>
          <span className="text-[12px] font-mono font-black text-primary">34.2°C_STABLE</span>
        </div>
      </div>

      {activeUpgrade ? (
        <div className="mb-8 p-6 bg-primary/5 border border-primary/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="text-primary animate-spin" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">{activeUpgrade.title}</span>
            </div>
            <span className="text-[11px] font-black text-white/40 font-mono tracking-tighter">{Math.round(activeUpgrade.progress)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${activeUpgrade.progress}%` }}
              className="h-full bg-primary shadow-neon shadow-[0_0_15px_rgba(251,209,45,0.4)]"
            />
          </div>
          <p className="text-[10px] text-white/30 mt-3 uppercase tracking-widest italic font-medium animate-pulse text-center">Neural pathways being re-routed...</p>
        </div>
      ) : (
        <>
          <div className="mb-8 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-primary/20" />
            <p className="text-sm text-on-surface/80 leading-relaxed font-black uppercase tracking-tight italic opacity-90 pl-2">
              "{building.description}"
            </p>
          </div>

          <div className="space-y-4 mb-10">
            {building.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group/stat">
                <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-125 transition-transform shadow-neon" />
                <div className="flex-1">
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{stat}</span>
                  <div className="h-0.5 w-full bg-white/5 mt-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        {building.name === 'office' && (
          <button 
            disabled={!!activeUpgrade}
            onClick={() => onQuickAction('RESEARCH_MARKET_TRENDS')}
            className="w-full py-5 bg-primary/10 border border-primary/20 text-[11px] font-black text-primary uppercase tracking-[0.4em] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-30 etched-border group/research shadow-xl"
          >
            <Bot size={18} className="group-hover:text-black transition-colors" /> 
            <span>RESEARCH_MARKET_TRENDS</span>
          </button>
        )}
        <button 
          disabled={!!activeUpgrade}
          onClick={() => onQuickAction(building.quickAction)}
          className="w-full py-5 bg-white/5 border border-white/10 text-[11px] font-black text-white uppercase tracking-[0.4em] hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-30 etched-border group/qa shadow-xl"
        >
          <Zap size={18} className="text-primary group-hover:text-black transition-colors animate-pulse" /> 
          <span>{building.quickAction.toUpperCase()}</span>
        </button>
        <button 
          onClick={onEnter}
          className="w-full py-5 bg-primary text-black font-headline font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-neon etched-border scale-105"
        >
          ENTER_ENVIRONMENT_v2
        </button>
      </div>
    </div>

    {/* Background Pattern */}
  </motion.div>
);

const BuildingZone = ({ 
  name, 
  label, 
  icon, 
  position, 
  onClick, 
  status = 'idle', 
  description = '', 
  output = '', 
  issues = [], 
  isUpgrading = false,
  selected = false,
  activeEvent = null
}: { 
  name: string; 
  label: string; 
  icon: React.ReactNode; 
  position: string; 
  onClick: () => void;
  status?: 'idle' | 'active' | 'warning' | 'alert';
  description?: string;
  output?: string;
  issues?: string[];
  isUpgrading?: boolean;
  selected?: boolean;
  activeEvent?: CityEvent | null;
}) => {
  // Calculate dynamic status based on event
  const effectiveStatus = (activeEvent?.id === 'blackout' && name === 'gym') ? 'alert' : 
                         (activeEvent?.type === 'alert') ? 'warning' : status;
  
  return (
    <div 
      className={`absolute ${position} z-30 group cursor-pointer`}
      onClick={onClick}
    >
      {/* Decorative etched ring background with enhanced pulse */}
      <motion.div 
        animate={selected || activeEvent ? { 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.4, 0.1],
          rotate: 360
        } : { 
          rotate: 0,
          scale: 1,
          opacity: 0.1
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`absolute inset-[-45px] border rounded-full tech-grid-fine pointer-events-none transition-colors ${
          activeEvent?.type === 'alert' ? 'border-red-500/20' : 
          activeEvent?.type === 'boost' ? 'border-primary/20' : 'border-white/10'
        }`} 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-[-25px] border border-primary/20 rounded-full pointer-events-none blur-sm" 
      />
      
      <div className="relative flex flex-col items-center">
        {/* Ripple effect on selection or event */}
        <AnimatePresence>
          {(selected || activeEvent) && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className={`absolute z-0 w-14 h-14 rounded-full blur-sm pointer-events-none ${
                activeEvent?.type === 'alert' ? 'bg-red-500/30' : 'bg-primary/30'
              }`}
            />
          )}
        </AnimatePresence>

        {/* Holographic label */}
        <motion.div 
          animate={{ y: selected ? -85 : -75, opacity: 1 }}
          className="absolute w-max flex flex-col items-center pointer-events-none"
        >
          <div className={`px-3 py-1 bg-black/80 backdrop-blur-md border rounded font-headline font-black text-[9px] uppercase tracking-[0.2em] italic ${
            selected ? 'border-primary text-primary shadow-[0_0_15px_rgba(251,209,45,0.3)]' : 'border-white/10 text-white/40 group-hover:text-white transition-colors'
          }`}>
            {label}
          </div>
          
          <AnimatePresence>
            {activeEvent && (
              <motion.div 
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`mt-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                  activeEvent.type === 'alert' ? 'bg-red-500 text-white' : 'bg-primary text-black'
                }`}
              >
                {activeEvent.title}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className={`w-0.5 h-12 bg-gradient-to-t mt-1 transition-all ${
          selected ? 'from-primary/60 to-transparent' : 'from-white/10 to-transparent'
        }`} />

        <motion.div 
          whileHover={{ 
            scale: 1.15, 
            y: -8,
            boxShadow: "0 0 30px rgba(251,209,45,0.4)" 
          }}
          animate={selected ? { 
            scale: 1.15, 
            y: -8,
            boxShadow: [
              "0 0 20px rgba(251,209,45,0.2)",
              "0 0 40px rgba(251,209,45,0.5)",
              "0 0 20px rgba(251,209,45,0.2)"
            ],
          } : { 
            scale: 1, 
            y: 0,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)"
          }}
          transition={{
            boxShadow: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            },
            scale: { type: "spring", stiffness: 300, damping: 20 },
            y: { type: "spring", stiffness: 300, damping: 20 }
          }}
          className={`w-14 h-14 bg-surface-container/60 backdrop-blur-xl border flex items-center justify-center shadow-2xl transition-all overflow-hidden relative ${
            selected ? 'border-primary ring-4 ring-primary/30' : 
            effectiveStatus === 'alert' ? 'border-red-500 ring-2 ring-red-500/20' :
            'border-white/20 group-hover:border-primary/50'
          }`}
        >
          <TechLines />
          {/* Dynamic Visual Effects */}
          {(effectiveStatus === 'active' || activeEvent?.type === 'boost') && !isUpgrading && (
            <div className="absolute inset-0">
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 ${activeEvent?.type === 'boost' ? 'bg-primary/30' : 'bg-primary/20'}`}
              />
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-4 bg-primary/10 blur-xl"
              />
            </div>
          )}
          
          {(isUpgrading || activeEvent?.id === 'maintenance') && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className={`${activeEvent?.id === 'maintenance' ? 'text-red-400' : 'text-primary'} mb-1 shadow-neon`}
              >
                {activeEvent?.id === 'maintenance' ? <Settings size={18} /> : <Construction size={18} />}
              </motion.div>
              <span className={`text-[5px] font-black uppercase tracking-[0.3em] leading-none text-center ${
                activeEvent?.id === 'maintenance' ? 'text-red-400' : 'text-primary'
              }`}>
                {activeEvent?.id === 'maintenance' ? 'SYS_MAINTENANCE' : 'CONSTRUCT_P_0.4'}
              </span>
            </div>
          )}
  
          {effectiveStatus === 'warning' && !isUpgrading && !activeEvent && (
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute inset-0 bg-tertiary/10"
            />
          )}
  
          <motion.div 
            animate={activeEvent ? { 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className={`relative z-10 transition-colors duration-300 ${
              selected ? 'text-black' : 
              effectiveStatus === 'active' ? 'text-primary drop-shadow-[0_0_8px_rgba(251,209,45,0.5)]' : 
              effectiveStatus === 'warning' ? 'text-tertiary' :
              effectiveStatus === 'alert' ? 'text-red-400' :
              'text-white/40 group-hover:text-primary'
            }`}
          >
            {React.cloneElement(icon as React.ReactElement, { size: 28 })}
          </motion.div>
        </motion.div>
  
        {/* Decorative base etched detail */}
        <div className={`mt-2 h-0.5 transition-all ${selected ? 'w-10 bg-primary shadow-neon' : 'w-4 bg-white/10 group-hover:w-8 group-hover:bg-primary/50'}`} />
      </div>
  
      {/* Enhanced Tooltip */}
      <div className="absolute top-0 -translate-y-full mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
        <div className="bg-black/90 border border-white/10 p-3 shadow-2xl backdrop-blur-md min-w-[200px] origin-bottom scale-90 group-hover:scale-100 transition-transform relative overflow-hidden">
          <TechLines />
          <div className="flex justify-between items-center mb-2 gap-4 relative z-10">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
            <div className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded ${
              effectiveStatus === 'active' ? 'bg-primary/20 text-primary' :
              effectiveStatus === 'warning' ? 'bg-tertiary/20 text-tertiary' :
              effectiveStatus === 'alert' ? 'bg-red-500/20 text-red-400' :
              'bg-white/10 text-white/40'
            }`}>
              {effectiveStatus}
            </div>
          </div>
          <p className="text-[9px] text-white/60 leading-relaxed italic mb-3 relative z-10">
            {description}
          </p>
  
          <div className="pt-2 border-t border-white/10 space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[8px] uppercase text-white/30 tracking-[0.2em]">Effective_Yield</span>
              <span className={`text-[9px] font-black tracking-tight ${
                activeEvent?.type === 'boost' ? 'text-primary animate-pulse' :
                activeEvent?.type === 'alert' ? 'text-red-400' : 'text-white/60'
              }`}>
                {output}
              </span>
            </div>
            
            {activeEvent && (
              <div className="flex items-center justify-between">
                <span className="text-[8px] uppercase text-white/30 tracking-[0.2em]">EVENT_MODIFIER</span>
                <span className={`text-[9px] font-black tracking-tight ${
                  activeEvent.type === 'boost' ? 'text-primary' : 'text-red-400'
                }`}>
                  {activeEvent.impact}
                </span>
              </div>
            )}
          </div>
  
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-white/10 rotate-45" />
        </div>
      </div>


      <div className={`absolute -bottom-2 w-1 h-1 rounded-full blur-[1px] transition-colors ${
        effectiveStatus === 'active' ? 'bg-primary shadow-[0_0_5px_#fbd12d]' : 
        effectiveStatus === 'warning' ? 'bg-tertiary shadow-[0_0_5px_#fbd12d]' :
        effectiveStatus === 'alert' ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' :
        'bg-primary opacity-40'
      }`} />
    </div>
  );
};

const Header = ({ stats, onOpenModal }: { stats: UserStats; onOpenModal: (type: string) => void }) => (
  <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative group overflow-hidden">
    <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
    <TechLines />
    
    <div className="flex items-center gap-10 relative z-10">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-primary/10 border border-primary/40 p-1 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 animate-pulse" />
            <div className="w-10 h-10 border border-primary/20 flex items-center justify-center">
              <Activity className="text-glow-primary animate-pulse" size={24} />
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_10px_#00fdc1]" 
          />
        </div>
        <div>
          <h1 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter leading-none flex items-center gap-2">
            OTTO<span className="text-primary text-glow font-black italic">SIM</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-full w-4 bg-primary/40"
              />
            </div>
            <p className="text-[8px] text-primary/60 font-black uppercase tracking-[0.4em]">LINK_LAYER_0.8.2</p>
          </div>
        </div>
      </div>
      
      <div className="hidden xl:flex items-center gap-10 pl-10 border-l border-white/5 h-12 relative overflow-hidden">
        <StatItem label="TOTAL_ASSETS" value={`$${stats.netWorth.toLocaleString()}`} color="text-primary" />
        <StatItem label="VITALITY_INDEX" value={`${stats.happiness}%`} color="text-secondary" />
        <StatItem label="NEURAL_LOAD" value={stats.iq.toString()} color="text-tertiary" />
        <StatItem label="CORE_LEVEL" value={stats.level.toString()} color="text-white" />
        
        {/* Subtle decorative bars */}
        <div className="flex gap-1 h-3 mt-auto mb-1">
          {[0.8, 0.4, 0.6, 0.9, 0.3].map((h, i) => (
            <motion.div 
              key={i}
              animate={{ height: ['40%', '100%', '60%'] }}
              transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
              className="w-1 bg-primary/10 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6 relative z-10">
      <div className="hidden lg:flex flex-col items-end border-r border-white/5 pr-6">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Simulation_Clock</span>
        <span className="text-xs font-mono font-black text-white tracking-[0.2em]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onOpenModal('ai_briefing')}
          className="group bg-secondary/5 hover:bg-secondary text-secondary hover:text-black px-6 py-2.5 font-headline font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-secondary/30 relative overflow-hidden etched-border animate-pulse"
        >
          <div className="absolute inset-0 bg-secondary/20 -translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10 flex items-center gap-2 font-black">
            <Bot size={12} className="animate-bounce" />
            AI_BRIEFING <kbd className="px-1 py-0.25 text-[8px] bg-black/40 border border-white/20 rounded font-mono text-secondary group-hover:text-black group-hover:bg-white/30 ml-1">A</kbd>
          </span>
         </button>
        <button 
          onClick={() => onOpenModal('financial_hub')}
          className="group bg-secondary/5 hover:bg-secondary text-secondary hover:text-black px-6 py-2.5 font-headline font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-secondary/30 relative overflow-hidden etched-border"
        >
          <div className="absolute inset-0 bg-secondary/20 -translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10 flex items-center gap-2">
            <Coins size={12} />
            FINANCIALS <kbd className="px-1 py-0.25 text-[8px] bg-black/40 border border-white/20 rounded font-mono text-secondary group-hover:text-black group-hover:bg-white/30 ml-1">F</kbd>
          </span>
         </button>
        <button 
          onClick={() => onOpenModal('next_day')}
          className="group bg-primary/5 hover:bg-primary text-primary hover:text-black px-6 py-2.5 font-headline font-black text-[10px] uppercase tracking-[0.3em] transition-all border border-primary/30 relative overflow-hidden shadow-neon etched-border"
        >
          <div className="absolute inset-0 bg-primary/20 -translate-y-full group-hover:translate-y-0 transition-transform" />
          <span className="relative z-10 flex items-center gap-2 font-black italic">
            ADVANCE_CYCLE
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        <button 
          onClick={() => onOpenModal('settings')}
          className="p-3 bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-black hover:border-white transition-all group relative etched-border"
        >
          <Settings size={20} className="group-hover:rotate-90 transition-transform duration-700" />
          <TechLines className="opacity-0 group-hover:opacity-20" />
        </button>
      </div>
    </div>
  </header>
);


const StatItem = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex flex-col">
    <span className="text-[8px] font-black text-white/30 tracking-[0.4em] uppercase mb-0.5">{label}</span>
    <span className={`font-mono font-black text-lg ${color} tracking-tighter text-glow`}>{value}</span>
  </div>
);

interface NewsItem {
  id: number;
  type: string;
  msg: string;
  time: string;
  color: string;
  context: string;
  actions: { label: string; effect: string }[];
}

const Sidebar = ({ 
  activeTab, 
  onTabChange, 
  onNewsClick,
  stats,
  playerData,
  marketData,
  activeCityEvent,
  day,
  syndicateHires
}: { 
  activeTab: string; 
  onTabChange: (tab: string) => void; 
  onNewsClick: (n: NewsItem) => void;
  stats: any;
  playerData: any;
  marketData: any;
  activeCityEvent: any;
  day: number;
  syndicateHires: string[];
}) => {
  const sidebarNews: NewsItem[] = [];

  const safeStats = stats || { iq: 100, happiness: 100, careerPath: 'Consulting' };
  const safeDay = day || 1;
  const safeSyndicates = syndicateHires || [];

  // 1. MUNICIPAL & ACTIVE CITY EVENT INTEL
  if (activeCityEvent) {
    if (activeCityEvent.id === 'surge') {
      sidebarNews.push({
        id: 101,
        type: 'REGULATION',
        msg: 'HFT_SURGE_REGIME',
        time: 'LIVE',
        color: 'text-red-400',
        context: 'High density market data spikes trade taxes by +5.0% flat. Open flow matrix optimization and use advanced sieve strategies.',
        actions: [
          { label: 'Examine Rates', effect: 'Reviewing city events status.' },
          { label: 'Acknowledge', effect: 'Proceeding with daily cycles.' }
        ]
      });
    } else if (activeCityEvent.id === 'boom') {
      sidebarNews.push({
        id: 101,
        type: 'REGULATION',
        msg: 'GASTRO_REBATE_ON',
        time: 'LIVE',
        color: 'text-emerald-400',
        context: 'Neon festival grants all player files a -3.0% offset off base taxes to boost local municipal consumption.',
        actions: [
          { label: 'View Rebate', effect: 'Active commercial tax rebate noted.' },
          { label: 'Acknowledge', effect: 'Proceeding with daily cycles.' }
        ]
      });
    } else if (activeCityEvent.id === 'maintenance') {
      sidebarNews.push({
        id: 101,
        type: 'REGULATION',
        msg: 'MAINTENANCE_CREDIT',
        time: 'LIVE',
        color: 'text-blue-400',
        context: 'Grid maintenance downtime grants a temporary -1.5% structural tax reduction buffer to active player files.',
        actions: [
          { label: 'Monitor Grid', effect: 'System diagnostic reports stable grid throughput.' },
          { label: 'Acknowledge', effect: 'Proceeding with daily cycles.' }
        ]
      });
    } else if (activeCityEvent.id === 'blackout') {
      sidebarNews.push({
        id: 101,
        type: 'REGULATION',
        msg: 'CARBON_SURCHARGE',
        time: 'LIVE',
        color: 'text-amber-500',
        context: 'Geothermal tap outage imposes +2.0% carbon surcharge on general electricity usage. Costs are slightly elevated today.',
        actions: [
          { label: 'Review Costs', effect: 'Additional utility rate surcharge noted.' },
          { label: 'Acknowledge', effect: 'Proceeding with daily cycles.' }
        ]
      });
    } else {
      sidebarNews.push({
        id: 101,
        type: 'REGULATION',
        msg: `${activeCityEvent.title.toUpperCase().replace(/\s+/g, '_')}`,
        time: 'LIVE',
        color: 'text-rose-400',
        context: `${activeCityEvent.description || 'Dynamic regulatory adjustment affects player stats and active node yields.'}`,
        actions: [
          { label: 'Inspect Event', effect: 'Active city event details monitored.' },
          { label: 'Acknowledge', effect: 'Event logged.' }
        ]
      });
    }
  } else {
    sidebarNews.push({
      id: 101,
      type: 'REGULATION',
      msg: 'REGS_STABLE_V2.0',
      time: `D${safeDay}`,
      color: 'text-white/40',
      context: 'Municipal network parameters are running within normal parameters. Ensure tax sieve is configured to minimize default rates.',
      actions: [
        { label: 'Check Sieve', effect: 'Redirecting to Advanced Tax Sieve Matrix...' },
        { label: 'Dismiss File', effect: 'Regulatory standards accepted.' }
      ]
    });
  }

  // 2. LIVE MARKET TICKERS
  let bestTicker = 'TECH';
  let highestChange = 0;
  let changeDirection = 'STABLE';
  if (marketData) {
    Object.entries(marketData).forEach(([ticker, history]: [string, any]) => {
      if (history && history.length >= 2) {
        const current = history[history.length - 1];
        const prev = history[history.length - 2];
        const pct = ((current - prev) / prev) * 100;
        if (Math.abs(pct) > Math.abs(highestChange)) {
          highestChange = pct;
          bestTicker = ticker;
          changeDirection = pct > 0 ? 'BOOM_UP' : 'CRASH_DOWN';
        }
      }
    });
  }

  if (highestChange !== 0) {
    sidebarNews.push({
      id: 102,
      type: 'MARKET_INFO',
      msg: `${bestTicker}_${changeDirection}`,
      time: 'LIVE',
      color: highestChange > 0 ? 'text-secondary' : 'text-red-400',
      context: highestChange > 0 
        ? `${bestTicker} asset nodes hit a local high, surging by +${highestChange.toFixed(1)}% in current cycles. Analysts expect further high volume.`
        : `${bestTicker} undergoes a corrective downturn of -${Math.abs(highestChange).toFixed(1)}% as liquid assets rotate back to deposits.`,
      actions: [
        { label: 'Scan Market', effect: `Opening Portfolio to evaluate current ${bestTicker} variance.` },
        { label: 'Acknowledge Index', effect: 'Trading ticket acknowledged.' }
      ]
    });
  } else {
    sidebarNews.push({
      id: 102,
      type: 'MARKET_INFO',
      msg: 'STB_VOLATILITY',
      time: 'STABLE',
      color: 'text-primary',
      context: 'Volatility index consolidates flat. Secondary markets indicate balanced volume entry barriers across standard corporate equities.',
      actions: [
        { label: 'Scan Tech Indices', effect: 'Scanned indices.' },
        { label: 'Acknowledge', effect: 'Sideways volatility parameters accepted.' }
      ]
    });
  }

  // 3. COMPANY & CAREER SECTOR NOTICES
  if (safeStats.careerPath === 'Finance') {
    sidebarNews.push({
      id: 103,
      type: 'COMPANY_OFFICE',
      msg: 'STB_LIQUIDITY_BONUS',
      time: `D${safeDay}`,
      color: 'text-tertiary',
      context: 'Prime interest rates on larger institutional deposit balances offer high yield. Higher salaries yield increased bonus coefficients.',
      actions: [
        { label: 'Check Balance', effect: 'Reviewing metropolitan bank credit facilities.' },
        { label: 'Dismiss File', effect: 'Career bulletins archived.' }
      ]
    });
  } else if (safeStats.careerPath === 'Tech') {
    sidebarNews.push({
      id: 103,
      type: 'COMPANY_OFFICE',
      msg: 'OVERCLOCK_ALLOWANCE',
      time: `D${safeDay}`,
      color: 'text-secondary',
      context: 'Tech conglomerates extend temporary overclock compensation. Upgrade local server rigs to scale salary margins.',
      actions: [
        { label: 'Monitor Salary', effect: 'Reviewing engineering compensation nodes.' },
        { label: 'Dismiss File', effect: 'Conglomerate update archived.' }
      ]
    });
  } else {
    sidebarNews.push({
      id: 103,
      type: 'COMPANY_OFFICE',
      msg: 'PROMO_CYCLE_ACTIVE',
      time: `D${safeDay}`,
      color: 'text-white/60',
      context: 'Sector manager jobs require advanced credentials. Boost your intelligence status above 120 IQ to prompt interviews.',
      actions: [
        { label: 'Open Academy courses', effect: 'Accelerated course options can be enrolled under map elements.' },
        { label: 'Acknowledge standard', effect: 'Career goals noted.' }
      ]
    });
  }

  // 4. BIOMETRIC & UNDERWORLD COVERS
  if (safeStats.happiness < 40) {
    sidebarNews.push({
      id: 104,
      type: 'BIOM_WARN',
      msg: 'NEURO_INTEGRITY_FAIL',
      time: 'WARN',
      color: 'text-red-400',
      context: `Your happiness levels (${safeStats.happiness}%) dropped below standard failsafe limit. Performance may crash. Relieve tension in Gym.`,
      actions: [
        { label: 'Locate Wellness Gym', effect: 'Endorphin loop options are active inside the city Gym.' },
        { label: 'Mute Warning', effect: 'Vitals diagnostic warning suppressed.' }
      ]
    });
  } else if (safeStats.iq < 120) {
    sidebarNews.push({
      id: 104,
      type: 'BIOM_WARN',
      msg: 'COGNITIVE_UPGRADE',
      time: 'WARN',
      color: 'text-pink-400',
      context: `Cerebral latency identified. Current intellectual capacity (${safeStats.iq} IQ) inhibits high level cyber hacks and premium jobs.`,
      actions: [
        { label: 'Review Academy Node', effect: 'Check Neural Academy on map to enroll in professional courses.' },
        { label: 'Ignore Alert', effect: 'Dismissing cognitive report.' }
      ]
    });
  } else if (safeSyndicates.length > 0) {
    sidebarNews.push({
      id: 104,
      type: 'UNDERWORLD_LINK',
      msg: 'WHITE_NOISE_SECURE',
      time: 'SECURE',
      color: 'text-primary animate-pulse',
      context: `${safeSyndicates.length} active syndicate liaison(s) obfuscating transactional hashes. Structural regulatory sweep completely blinded.`,
      actions: [
        { label: 'Confirm Cover', effect: 'Active syndicate obfuscation network established.' },
        { label: 'Dismiss Sync', effect: 'Diagnostic connection secure.' }
      ]
    });
  } else {
    sidebarNews.push({
      id: 104,
      type: 'UNDERWORLD_WARN',
      msg: 'AUDIT_FOOTPRINT_HIGH',
      time: 'WARN',
      color: 'text-amber-400',
      context: 'Player transactions are traceable. Secure syndicate contractors to disguise commercial transfers and escape tax schedules.',
      actions: [
        { label: 'Recruit Liaison', effect: 'Analyze candidate underworld operators under Syndicate tab.' },
        { label: 'Dismiss Log', effect: 'Unprotected transactions continues.' }
      ]
    });
  }

  return (
    <aside className="fixed left-0 top-20 bottom-24 z-40 flex flex-col items-center py-10 bg-black/40 backdrop-blur-3xl w-24 border-r border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.5)]">
      <div className="mb-12 flex flex-col items-center group cursor-help">
        <div className="w-10 h-1 bg-tertiary/20 group-hover:bg-tertiary transition-colors mb-2" />
        <span className="text-tertiary font-black font-label uppercase text-[8px] tracking-[0.5em] rotate-90 translate-y-4">INTERFACE</span>
      </div>
      <div className="flex flex-col gap-8">
        <SidebarItem 
          icon={<Rss size={22} />} 
          active={activeTab === 'feed'} 
          label="FEED"
          onClick={() => onTabChange('feed')}
        />
        <SidebarItem 
          icon={<TrendingUp size={22} />} 
          active={activeTab === 'market'} 
          label="MARKET"
          onClick={() => onTabChange('market')}
        />
        <SidebarItem 
          icon={<Cpu size={22} />} 
          active={activeTab === 'advisor'} 
          label="AI_ADVISOR"
          onClick={() => onTabChange('advisor')}
        />
        <SidebarItem 
          icon={<Users size={22} />} 
          active={activeTab === 'social'} 
          label="NETWORK"
          onClick={() => onTabChange('social')}
        />
        <SidebarItem 
          icon={<Gavel size={22} />} 
          active={activeTab === 'legal'} 
          label="COMPLY"
          onClick={() => onTabChange('legal')}
        />
      </div>

      <div className="mt-12 w-full px-4 border-t border-white/5 pt-8 flex flex-col items-center">
        <div className="flex items-center gap-1 mb-4 opacity-40">
          <Globe size={10} className="text-primary" />
          <span className="text-[7px] font-black uppercase tracking-widest text-white">LIVE_INTEL</span>
        </div>
        
        <div className="flex flex-col gap-2.5 w-full max-h-[35vh] overflow-y-auto custom-scrollbar pr-1">
          {sidebarNews.map((item) => (
            <motion.button 
              key={item.id}
              onClick={() => onNewsClick(item)}
              whileHover={{ 
                x: 4,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderLeftColor: "var(--primary)"
              }}
              className="flex flex-col items-start gap-1 p-2 bg-white/[0.02] border-l border-white/10 transition-all group overflow-hidden w-full"
            >
              <div className="flex justify-between items-center w-full">
                <motion.span 
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`text-[6px] font-black tracking-tight ${item.color}`}
                >
                  {item.type}
                </motion.span>
                <span className="text-[6px] text-white/20 font-mono tracking-tighter">{item.time}</span>
              </div>
              <p className="text-[7px] text-white/50 group-hover:text-white leading-[1.2] text-left uppercase font-bold tracking-tight line-clamp-2 transition-colors">
                {item.msg}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-1 h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <span className="text-white/20 font-black text-[9px] origin-center rotate-90 whitespace-nowrap tracking-[0.4em] mb-4">
          NODE_V71
        </span>
      </div>
    </aside>
  );
};


const SidebarItem = ({ icon, active, label, onClick }: { icon: React.ReactNode; active?: boolean; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 relative group border ${active ? 'text-white bg-primary shadow-[0_0_20px_rgba(251,209,45,0.3)] border-primary' : 'text-white/30 border-transparent hover:border-white/10 hover:bg-white/5'}`}
  >
    {active && (
      <div className="absolute inset-0 bg-primary/20 blur-md opacity-50" />
    )}
    <div className="relative z-10">
      {icon}
    </div>
    <div className="absolute left-full ml-4 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 pointer-events-none origin-left">
      <div className="bg-black/90 px-3 py-1.5 border border-white/10 text-[9px] font-black uppercase tracking-widest whitespace-nowrap backdrop-blur-md">
        {label}
      </div>
    </div>
  </button>
);

const BottomNav = ({ activeView, onViewChange }: { activeView: string; onViewChange: (view: string) => void }) => (
  <nav className="fixed bottom-0 w-full z-50 flex justify-center items-end pb-8 px-6 pointer-events-none">
    <div className="bg-black/80 backdrop-blur-3xl border border-white/5 rounded-2xl flex p-1.5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pointer-events-auto overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <NavItem 
        icon={<Globe size={22} />} 
        label="MAP" 
        active={activeView === 'map'} 
        onClick={() => onViewChange('map')}
      />
      <div className="w-px h-10 bg-white/5 my-auto" />
      <NavItem 
        icon={<Landmark size={22} />} 
        label="BANK" 
        active={activeView === 'bank'} 
        onClick={() => onViewChange('bank')}
      />
      <div className="w-px h-10 bg-white/5 my-auto" />
      <NavItem 
        icon={<Building2 size={22} />} 
        label="OFFICE" 
        active={activeView === 'office'} 
        onClick={() => onViewChange('office')}
      />
      <div className="w-px h-10 bg-white/5 my-auto" />
      <NavItem 
        icon={<School size={22} />} 
        label="ACADEMY" 
        active={activeView === 'school'} 
        onClick={() => onViewChange('school')}
      />
      <div className="w-px h-10 bg-white/5 my-auto" />
      <NavItem 
        icon={<GlassWater size={22} />} 
        label="AFTERLIFE" 
        active={activeView === 'bar'} 
        onClick={() => onViewChange('bar')}
      />
      <div className="w-px h-10 bg-white/5 my-auto" />
      <NavItem 
        icon={<Dumbbell size={22} />} 
        label="GYM" 
        active={activeView === 'gym'} 
        onClick={() => onViewChange('gym')}
      />
    </div>
  </nav>
);

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-4 px-8 transition-all duration-500 min-w-[110px] relative group overflow-hidden ${active ? 'text-primary' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
  >
    {active && (
      <motion.div 
        layoutId="activeNav"
        className="absolute inset-0 bg-primary/10 border-t-2 border-primary"
      />
    )}
    <div className={`mb-1 relative z-10 transition-transform duration-500 ${active ? 'scale-110 -translate-y-0.5' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className={`font-headline text-[9px] font-black tracking-[0.3em] relative z-10 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);


const VentureSparkline = ({ data, color }: { data: number[]; color: string }) => {
  const chartData = data.map((val, i) => ({ index: i, value: val }));
  return (
    <div className="w-16 h-8 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


const VenturePulse = ({ activeTab, onVentureClick, onNewsClick }: { activeTab: string; onVentureClick: (v: Venture) => void; onNewsClick: (n: NewsItem) => void }) => {
  const ventures: Venture[] = [
    { 
      id: '1', 
      name: 'Health Diagnostics', 
      stage: 'Series A', 
      risk: 'High',
      description: 'Advanced diagnostic software for predictive health modeling and patient data analysis.',
      revenue: '$2.1M',
      growth: '+45%',
      employees: 24,
      history: [1.1, 1.4, 1.2, 1.8, 1.6, 2.1]
    },
    { 
      id: '2', 
      name: 'Urban Logistics', 
      stage: 'Seed', 
      risk: 'Low',
      description: 'Efficient delivery network optimized for high-density urban environments.',
      revenue: '$450K',
      growth: '+120%',
      employees: 12,
      history: [150, 180, 240, 290, 380, 450]
    },
    { 
      id: '3', 
      name: 'Renewable Power', 
      stage: 'Public', 
      risk: 'Stable',
      description: 'Next-generation energy distribution using localized renewable sources.',
      revenue: '$42M',
      growth: '+8%',
      employees: 156,
      history: [38.5, 39.1, 40.0, 40.6, 41.2, 42.0]
    },
  ];

  const newsItems: NewsItem[] = [
    { 
      id: 1, 
      type: 'ALERT', 
      msg: 'Interest rates expected to rise by 0.25% next cycle.', 
      time: '2m ago', 
      color: 'text-tertiary',
      context: 'The Central Bank is signaling a hawkish turn to combat inflation. This will increase borrowing costs for all ventures.',
      actions: [
        { label: 'Hedge Positions', effect: 'Hedged against rate hike. Stability increased.' },
        { label: 'Ignore', effect: 'No action taken. Market exposure remains high.' }
      ]
    },
    { 
      id: 2, 
      type: 'NEWS', 
      msg: 'Tech Solutions Inc announces new AI integration.', 
      time: '15m ago', 
      color: 'text-secondary',
      context: 'A breakthrough in neural processing has been leaked. Tech stocks are expected to surge.',
      actions: [
        { label: 'Invest on Rumor', effect: 'Capital deployed. Waiting for market confirmation.' },
        { label: 'Wait for PR', effect: 'Playing it safe. Potential gains missed but risk mitigated.' }
      ]
    },
    { 
      id: 3, 
      type: 'TRADE', 
      msg: 'Large volume of Digital Currency (DC) moved to cold storage.', 
      time: '1h ago', 
      color: 'text-white',
      context: 'Whale activity detected. This usually precedes a period of low volatility or a massive sell-off.',
      actions: [
        { label: 'Liquidate DC', effect: 'Exited DC positions. Liquidity increased.' },
        { label: 'Hold', effect: 'Diamond hands. Exposure to DC volatility maintained.' }
      ]
    },
    { 
      id: 4, 
      type: 'GOV', 
      msg: 'New tax regulations for small businesses proposed.', 
      time: '3h ago', 
      color: 'text-primary',
      context: 'The "Small Business Growth Act" aims to simplify filings but might increase effective tax rates for high-revenue startups.',
      actions: [
        { label: 'Lobby Against', effect: 'Lobbying efforts initiated. Political capital spent.' },
        { label: 'Restructure', effect: 'Legal team is reviewing restructuring options.' }
      ]
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-tertiary text-black';
      case 'Stable': return 'bg-primary text-black';
      case 'Low': return 'bg-secondary text-black';
      default: return 'bg-white/20 text-white';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-5 border-b border-primary/20 pb-3">
              <Zap size={14} className="text-primary" />
              <h3 className="font-label font-black text-[10px] text-primary tracking-widest uppercase">MARKET_FEED</h3>
            </div>
            {newsItems.map(item => (
              <motion.div 
                key={item.id} 
                onClick={() => onNewsClick(item)}
                whileHover={{ 
                  x: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderLeftColor: "var(--primary)"
                }}
                className="bg-black/40 p-4 border-l border-white/10 transition-all cursor-pointer group etched-border"
              >
                <div className="flex justify-between items-center mb-1">
                  <motion.span 
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`text-[8px] font-black tracking-tighter ${item.color}`}
                  >
                    {item.type}
                  </motion.span>
                  <span className="text-[8px] text-white/20">{item.time}</span>
                </div>
                <p className="text-[10px] text-white/70 leading-relaxed group-hover:text-white transition-colors">{item.msg}</p>
              </motion.div>
            ))}
          </div>
        );
      case 'market':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-5 border-b border-secondary/20 pb-3">
              <Radio size={14} className="text-secondary animate-pulse" />
              <h3 className="font-label font-black text-[10px] text-secondary tracking-widest uppercase">BUSINESS_PORTFOLIO</h3>
            </div>
            {ventures.map((v) => (
              <motion.div 
                key={v.id} 
                onClick={() => onVentureClick(v)}
                whileHover={{ x: 6, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                className="flex justify-between items-center group cursor-pointer transition-all p-3 border-b border-white/[0.03]"
              >
                <div>
                  <p className="font-headline font-bold text-sm text-white group-hover:text-primary transition-colors">{v.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] text-white/40 uppercase tracking-wider">{v.stage}</span>
                    <motion.span 
                      animate={{ 
                        boxShadow: v.risk === 'High' ? ['0 0 0px var(--tertiary)', '0 0 10px var(--tertiary)', '0 0 0px var(--tertiary)'] : 'none'
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter ${getRiskColor(v.risk)} rounded-[2px]`}
                    >
                      {v.risk}
                    </motion.span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-6 sm:w-16 sm:h-8 shrink-0">
                    <VentureSparkline 
                      data={v.history || [100, 110, 120, 130]} 
                      color={v.risk === 'High' ? '#ff716a' : v.risk === 'Stable' ? '#fbd12d' : '#00fdc1'} 
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-black text-white/80">{v.revenue}</p>
                    <p className="text-[8px] font-mono text-secondary">{v.growth}</p>
                  </div>
                  <ChevronRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        );
      case 'social':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-5 border-b border-secondary/20 pb-3">
              <Users size={14} className="text-secondary" />
              <h3 className="font-label font-black text-[10px] text-secondary tracking-widest uppercase">NETWORK_HUB</h3>
            </div>
            {[
              { name: 'Sarah Chen', role: 'Venture Capitalist', status: 'Online', color: 'bg-secondary' },
              { name: 'Marcus Vane', role: 'Legal Consultant', status: 'Away', color: 'bg-white/20' },
              { name: 'Elena Rossi', role: 'Tech Recruiter', status: 'Online', color: 'bg-secondary' },
            ].map(contact => (
              <div key={contact.name} className="flex items-center gap-3 p-2 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${contact.color}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">{contact.name}</p>
                  <p className="text-[9px] text-white/40 uppercase">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'legal':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-5 border-b border-tertiary/20 pb-3">
              <Shield size={14} className="text-tertiary" />
              <h3 className="font-label font-black text-[10px] text-tertiary tracking-widest uppercase">COMPLIANCE_DESK</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-black/20 p-3 border-l-2 border-tertiary">
                <p className="text-[10px] font-bold text-white mb-1">Business License: ACTIVE</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Expires in 242 days</p>
              </div>
              <div className="bg-black/20 p-3 border-l-2 border-primary">
                <p className="text-[10px] font-bold text-white mb-1">Tax Status: COMPLIANT</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Next filing: Q3</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/4 right-12 z-10 w-80 transform rotate-1">
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="etched-glass p-0 border-l-2 shadow-2xl relative overflow-hidden"
        style={{ 
          borderLeftColor: activeTab === 'feed' ? 'var(--primary)' : 
                          activeTab === 'social' ? 'var(--secondary)' : 
                          activeTab === 'legal' ? 'var(--tertiary)' : 'var(--secondary)'
        }}
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-1 opacity-[0.05] pointer-events-none">
           <Cpu size={120} className="text-white transform rotate-45" />
        </div>
        
        <div className="p-6 relative z-10">
          {renderContent()}
        </div>

        {/* Bottom Deco */}
        <div className="h-1 w-full flex">
           {[...Array(20)].map((_, i) => (
             <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-primary/20' : 'transparent'}`} />
           ))}
        </div>
      </motion.div>
    </div>
  );
};

const NewsModal = ({ item, onClose, onAction }: { item: NewsItem; onClose: () => void; onAction: (msg: string) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-surface-container border-l-4 border-primary w-full max-w-md p-8 relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors"
      >
        <X size={24} />
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-widest bg-white/10 ${item.color}`}>{item.type}</span>
          <span className="text-[10px] text-white/20 font-mono">{item.time}</span>
        </div>
        <h2 className="font-headline font-black text-xl text-white uppercase tracking-tighter leading-tight">{item.msg}</h2>
      </div>

      <div className="bg-black/20 p-4 border border-white/5 mb-8">
        <p className="text-xs text-on-surface/60 leading-relaxed italic">
          "{item.context}"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {item.actions.map((action, idx) => (
          <button 
            key={idx}
            onClick={() => {
              onAction(action.effect);
              onClose();
            }}
            className="w-full py-3 border border-primary/30 hover:bg-primary hover:text-black transition-all font-headline font-black text-[10px] uppercase tracking-widest text-primary"
          >
            {action.label}
          </button>
        ))}
        <button 
          onClick={onClose}
          className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const VentureModal = ({ venture, onClose, onAction }: { venture: Venture; onClose: () => void; onAction: (msg: string) => void }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-tertiary text-black';
      case 'Stable': return 'bg-primary text-black';
      case 'Low': return 'bg-secondary text-black';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container border-l-4 border-primary w-full max-w-lg p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/10 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter">
              {venture.stage}
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-tighter ${getRiskColor(venture.risk)}`}>
              {venture.risk} RISK
            </span>
          </div>
          <h2 className="font-headline font-black text-4xl text-primary uppercase tracking-tighter italic">
            {venture.name}
          </h2>
        </div>

        <p className="text-on-surface/70 text-sm leading-relaxed mb-8 font-medium">
          {venture.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-low p-4 border-b border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={12} className="text-secondary" />
              <span className="text-[9px] text-secondary font-black tracking-widest uppercase">REVENUE</span>
            </div>
            <span className="font-headline text-lg font-bold text-white">{venture.revenue}</span>
          </div>
          <div className="bg-surface-container-low p-4 border-b border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={12} className="text-primary" />
              <span className="text-[9px] text-primary font-black tracking-widest uppercase">GROWTH</span>
            </div>
            <span className="font-headline text-lg font-bold text-white">{venture.growth}</span>
          </div>
          <div className="bg-surface-container-low p-4 border-b border-tertiary/20">
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-tertiary" />
              <span className="text-[9px] text-tertiary font-black tracking-widest uppercase">STAFF</span>
            </div>
            <span className="font-headline text-lg font-bold text-white">{venture.employees}</span>
          </div>
        </div>

        {/* Dynamic Trajectory Area Chart */}
        <div className="bg-surface-container-low p-5 mb-8 border border-white/5 relative overflow-hidden etched-border">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-2">
               <Activity size={12} className="text-primary animate-pulse" />
               <span className="text-[9px] text-white/40 font-black tracking-widest uppercase">HISTORICAL_GROWTH_CURVE</span>
             </div>
             <span className="text-[8px] font-mono text-white/40 font-black">RISK_REWARD_INDEX // S4</span>
          </div>
          <div className="h-20 w-full mt-2">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={(venture.history || [100, 110, 125, 120, 135, 145]).map((val, i) => ({ day: `Cycle ${i+1}`, val }))} margin={{ top: 5, bottom: 5, left: 10, right: 10 }}>
                 <defs>
                   <linearGradient id={`colorGrad-${venture.id}`} x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={venture.risk === 'High' ? '#ff716a' : venture.risk === 'Stable' ? '#fbd12d' : '#00fdc1'} stopOpacity={0.2}/>
                     <stop offset="95%" stopColor={venture.risk === 'High' ? '#ff716a' : venture.risk === 'Stable' ? '#fbd12d' : '#00fdc1'} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Area type="monotone" dataKey="val" stroke={venture.risk === 'High' ? '#ff716a' : venture.risk === 'Stable' ? '#fbd12d' : '#00fdc1'} strokeWidth={2} fillOpacity={1} fill={`url(#colorGrad-${venture.id})`} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onAction(`Acquiring stake in ${venture.name}...`)}
            className="flex-1 bg-primary py-4 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2"
          >
            <Target size={18} />
            Acquire Stake
          </button>
          <button 
            onClick={() => onAction(`Boosting growth for ${venture.name}...`)}
            className="flex-1 bg-surface-container-highest py-4 font-headline font-black text-secondary hover:bg-secondary hover:text-black transition-all uppercase text-sm tracking-widest border-b-2 border-secondary/30 flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            Boost Growth
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Tutorial = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "WELCOME_TO_OTTO_SIM",
      description: "You've just been granted clearance to manage one of the most high-tech city sectors in the neon-lit future. Your goal: maximize Net Worth and IQ while keeping Happiness stable.",
      icon: <Activity size={32} className="text-primary" />,
    },
    {
      title: "ISOMETRIC_NAVIGATION",
      description: "The city is your dashboard. DRAG to pan across the sector, and use your MOUSE WHEEL or the side controls to ZOOM in on specific zones.",
      icon: <MousePointer2 size={32} className="text-secondary" />,
    },
    {
      title: "FUNCTIONAL_ZONES",
      description: "There are 5 critical nodes: The Office (Income), The Bank (Financials), Neural Academy (IQ), Corporate Bar (Social), and the Bio-Gym (Happiness). Click a building to inspect.",
      icon: <LayoutGrid size={32} className="text-tertiary" />,
    },
    {
      title: "STRATEGIC_ADVISOR",
      description: "The floating CPU beacon provides contextual guidance. Click it anytime to engage the Strategic AI Advisor for tips on how to optimize your trajectory.",
      icon: <Cpu size={32} className="text-primary" />,
    },
    {
      title: "VIRTUAL_MARKET",
      description: "Use the Sidebar to access the Venture Market, Social Feeds, and Legal Documentation. Investing in high-growth companies is the fastest path to prestige.",
      icon: <TrendingUp size={32} className="text-secondary" />,
    },
    {
      title: "TIME_PROTOCOL",
      description: "Click ADVANCE_CYCLE in the top bar to move to the next day. This processes your income, updates markets, and triggers random events.",
      icon: <Clock size={32} className="text-tertiary" />,
    }
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-container border-l-4 border-primary w-full max-w-xl p-10 shadow-[0_0_100px_rgba(34,197,94,0.1)] relative overflow-hidden etched-border"
      >
        <TechLines className="opacity-10" />
        <div className="flex items-center gap-8 mb-10 relative z-10">
           <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/10 shadow-inner group relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
             <div className="relative z-10">
               {tutorialSteps[step].icon}
             </div>
           </div>
           <div>
             <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">TUTORIAL_ACTIVE</span>
             </div>
             <h2 className="font-headline font-black text-4xl text-white uppercase tracking-tighter italic leading-none">{tutorialSteps[step].title}</h2>
             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mt-3">GUIDE_NODE_IDX // {step + 1}</p>
           </div>
        </div>

        <div className="relative z-10 bg-black/40 p-8 border border-white/5 mb-10 min-h-[140px] flex items-center">
          <p className="text-xl text-white/70 leading-relaxed font-bold italic border-l-2 border-primary/30 pl-6">
            {tutorialSteps[step].description}
          </p>
          <div className="absolute bottom-2 right-2 text-[8px] font-black text-white/5 uppercase">Neural_Link_Stable</div>
        </div>

        <div className="flex gap-4 relative z-10">
           {step > 0 && (
             <button 
               onClick={() => setStep(step - 1)}
               className="flex-1 py-5 border border-white/5 text-white/20 font-headline font-black uppercase text-[10px] tracking-[0.3em] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
             >
               <ChevronLeft size={16} /> PREVIOUS_LOG
             </button>
           )}
           <button 
             onClick={() => {
               if (step < tutorialSteps.length - 1) setStep(step + 1);
               else onComplete();
             }}
             className="flex-[2] bg-primary py-5 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-3 shadow-neon"
           >
             {step < tutorialSteps.length - 1 ? (
               <>CONTINUE_UPLINK <ChevronRight size={18} /></>
             ) : (
               <>START_SIMULATION <Play size={18} /></>
             )}
           </button>
        </div>

        {/* Progress System */}
        <div className="mt-8 flex gap-1 relative z-10">
           {tutorialSteps.map((_, i) => (
             <div key={i} className="flex-1 space-y-1">
               <div className={`h-1 transition-all duration-700 ${i <= step ? 'bg-primary shadow-neon' : 'bg-white/5'}`} />
               {i === step && (
                 <motion.div layoutId="tutorialBar" className="h-0.5 bg-primary/20 blur-[1px]" />
               )}
             </div>
           ))}
        </div>

        {/* Corner labels */}
        <div className="absolute top-2 right-2 text-[8px] font-black text-white/10 italic">SIM_OS_v4.2.1</div>
      </motion.div>
    </div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (stats: UserStats) => void }) => {
  const [step, setStep] = useState(-1); // -1 for boot sequence
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [career, setCareer] = useState<'Tech' | 'Finance' | 'Creative' | 'Medicine' | 'Law' | 'Service' | 'Underground' | 'Academic'>('Tech');
  const [persona, setPersona] = useState('The Grinder');
  const [avatar, setAvatar] = useState('Avatar_1');
  const [showPersonaConfirm, setShowPersonaConfirm] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (step === -1) {
      const logs = [
        "Initializing core... [OK]",
        "Checking security protocols... [PASS]",
        "Loading neural interface... [92%]",
        "Establishing encrypted tunnel... [CONNECTED]",
        "Mounting file system: /usr/simulation/life...",
        "Ready for identity verification."
      ];
      
      let currentLog = 0;
      const interval = setInterval(() => {
        if (currentLog < logs.length) {
          setBootLogs(prev => [...prev, logs[currentLog]]);
          setBootProgress((currentLog + 1) * (100 / logs.length));
          currentLog++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStep(0), 1000);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFinalize = (stats: UserStats) => {
    setIsEntering(true);
    setTimeout(() => {
      onComplete(stats);
    }, 2800);
  };

  const personas = [
    { id: 'The Grinder', label: 'THE_GRINDER', desc: 'Work is life. Efficiency priority. Memory allocation high.', stats: { iq: 10, happiness: -10, netWorth: 5000 }, icon: <Cpu size={16} /> },
    { id: 'The Socialite', label: 'THE_SOCIALITE', desc: 'Network is survival. High-link capacity. Social credit focus.', stats: { iq: -5, happiness: 20, netWorth: 2000 }, icon: <Users size={16} /> },
    { id: 'The Visionary', label: 'THE_VISIONARY', desc: 'Future Architect. Neural pathing ahead of curve.', stats: { iq: 15, happiness: 5, netWorth: 0 }, icon: <Globe size={16} /> },
    { id: 'The Trust Fund Baby', label: 'TRUST_FUND_CORE', desc: 'Legacy access node. Passive credit stream stable.', stats: { iq: -10, happiness: 10, netWorth: 50000 }, icon: <Shield size={16} /> },
    { id: 'The Hustler', label: 'THE_HUSTLER', desc: 'Shadow market expert. Resourceful. High volatility.', stats: { iq: 5, happiness: 5, netWorth: 10000 }, icon: <Zap size={16} /> },
    { id: 'The Academic', label: 'THE_ACADEMIC', desc: 'Deep-learning specialized. Maximum IQ indexing.', stats: { iq: 25, happiness: -15, netWorth: 500 }, icon: <GraduationCap size={16} /> },
    { id: 'The Rebel', label: 'THE_REBEL', desc: 'Kernel bypass. High happiness. Decoupled from system.', stats: { iq: -5, happiness: 25, netWorth: 100 }, icon: <Activity size={16} /> },
  ];

  const avatars = [
    { id: 'Avatar_1', label: 'NEO_GHOST', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix' },
    { id: 'Avatar_2', label: 'SYNTH_RUNNER', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka' },
    { id: 'Avatar_3', label: 'CORE_EXEC', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Midnight' },
    { id: 'Avatar_4', label: 'SHADOW_LINK', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow' },
    { id: 'Avatar_5', label: 'VOID_WALKER', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ghost' },
    { id: 'Avatar_6', label: 'DATA_MINER', img: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Oliver' },
  ];

  if (isEntering) {
    return (
      <div className="fixed inset-0 z-[400] bg-black flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.5, 50], opacity: [0, 1, 0] }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/40 via-transparent to-transparent blur-[120px]" />
          <h2 className="text-white font-headline font-black text-6xl tracking-[1.5em] uppercase animate-pulse">Entering_Sim</h2>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-6"
        >
          <div className="flex gap-3">
            {[...Array(8)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [4, 40, 4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-primary/60 shadow-neon"
              />
            ))}
          </div>
          <span className="text-primary font-mono text-[10px] tracking-[0.8em] uppercase italic">Establishing_Neural_Link... [OK]</span>
        </motion.div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center font-mono overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/onboarding_background_1779238543970.png" 
            alt="Simulation Network" 
            className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </div>
        <div className="w-full max-w-md p-8 relative z-10">
          <TechLines className="opacity-20 pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border-l border-primary/20 pl-4 space-y-2 uppercase"
          >
            {bootLogs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ x: -10, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                className="text-[10px] text-primary/80"
              >
                <span className="text-primary mr-2">{" >> "}</span> {log}
              </motion.div>
            ))}
            <div className="mt-8 space-y-1">
              <div className="h-1 bg-white/5 w-full">
                <motion.div 
                  className="h-full bg-primary shadow-neon"
                  initial={{ width: 0 }}
                  animate={{ width: `${bootProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-primary/40 font-black tracking-widest">
                <span>SYSTEM_BOOTSTRAP_CORE</span>
                <span>{Math.round(bootProgress)}%</span>
              </div>
            </div>
          </motion.div>
          <div className="absolute top-0 right-0 p-4">
             <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full animate-[spin_4s_linear_infinite] border-t-2 border-primary" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: "IDENTITY_SETUP",
      content: (
        <div className="space-y-8">
          <div className="bg-primary/5 p-4 border-l-2 border-primary text-[10px] text-primary/80 uppercase font-black tracking-widest leading-relaxed">
            SYSTEM_REQUEST: Enter legal designation to initialize the simulation node. Anonymity is not a feature.
          </div>
          <div className="relative group">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="DESIGNATION_REQUIRED"
              className="w-full bg-black/40 border border-white/10 p-5 font-headline font-black text-xl text-white focus:border-primary outline-none transition-all etched-border"
            />
            <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
              <span className="text-[8px] font-black text-white px-2 py-1 bg-white/10 rounded">UTF-8</span>
            </div>
          </div>
          <button 
            disabled={!name}
            onClick={() => setStep(1)}
            className="w-full bg-primary py-5 font-headline font-black text-black hover:bg-white disabled:opacity-30 disabled:grayscale transition-all uppercase text-sm tracking-[0.3em] shadow-neon relative group overflow-hidden cyber-button"
          >
            INITIALIZE_ID
          </button>
        </div>
      )
    },
    {
      title: "PERSONA_PROFILE",
      content: (
        <div className="space-y-6">
          <div className="grid gap-4">
            {personas.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setPersona(p.id)}
                className={`p-5 border-l-4 transition-all relative overflow-hidden etched-border ${
                  persona === p.id 
                    ? 'border-primary bg-primary/10 bg-grid-white/[0.02]' 
                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={persona === p.id ? 'text-primary' : 'text-white/20'}>
                      {p.icon}
                    </div>
                    <span className="font-headline font-black text-sm text-white tracking-widest">{p.label}</span>
                  </div>
                  {persona === p.id && (
                    <motion.div layoutId="check" className="text-primary">
                      <Shield size={14} fill="currentColor" className="opacity-40" />
                    </motion.div>
                  )}
                </div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold leading-relaxed pr-8">{p.desc}</p>
                <div className="mt-3 flex gap-4 border-t border-white/5 pt-3">
                  {Object.entries(p.stats).map(([key, val]) => (
                    <div key={key} className="flex gap-1 items-center">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{key}:</span>
                       <span className={`text-[9px] font-black ${val > 0 ? 'text-primary' : val < 0 ? 'text-red-400' : 'text-white/40'}`}>
                         {val > 0 ? '+' : ''}{val}
                       </span>
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
          <button 
            onClick={() => setShowPersonaConfirm(true)}
            className="w-full bg-primary py-5 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-[0.3em] shadow-neon mt-4"
          >
            Initialize Career Module
          </button>

          <AnimatePresence>
            {showPersonaConfirm && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-surface-container border-l-4 border-primary p-10 max-w-sm w-full shadow-[0_0_100px_rgba(34,197,94,0.1)] relative"
                >
                  <TechLines className="opacity-10" />
                  <h3 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter mb-6 italic flex items-center gap-3">
                    <Zap size={24} /> CONFIRM_PERSONA
                  </h3>
                  <div className="bg-black/40 p-6 mb-8 border border-white/5 relative">
                    <p className="font-headline font-black text-lg text-white mb-3 tracking-widest uppercase">{persona}</p>
                    <p className="text-xs text-white/50 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                      "{personas.find(p => p.id === persona)?.desc}"
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowPersonaConfirm(false)}
                      className="flex-1 py-4 border border-white/5 text-white/20 font-headline font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
                    >
                      ABORT
                    </button>
                    <button 
                      onClick={() => {
                        setShowPersonaConfirm(false);
                        setStep(2);
                      }}
                      className="flex-1 py-4 bg-primary text-black font-headline font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-neon"
                    >
                      PROCEED
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    },
    {
      title: "CAREER_UPLINK",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Tech', label: 'TECH_SOLUTIONS', desc: 'IQ++ / SALARY+', icon: <Cpu size={20} /> },
              { id: 'Finance', label: 'CAPITAL_MGMT', desc: 'SALARY++ / HAPPY~', icon: <TrendingUp size={20} /> },
              { id: 'Creative', label: 'DIGITAL_ARTS', desc: 'HAPPY++ / SALARY~', icon: <Monitor size={20} /> },
              { id: 'Medicine', label: 'BIO_MEDICAL', desc: 'HAPPY+ / IQ+ / STRESS++', icon: <Activity size={20} /> },
              { id: 'Law', label: 'LEGAL_SYSTEMS', desc: 'SALARY++ / HAPPY--', icon: <Gavel size={20} /> },
              { id: 'Service', label: 'SERVICE_SECTOR', desc: 'SOCIAL+ / SALARY~', icon: <Users size={20} /> },
              { id: 'Underground', label: 'SHADOW_ECON', desc: 'RISK++ / VOLATILE', icon: <Zap size={20} /> },
              { id: 'Academic', label: 'R&D_THEORY', desc: 'IQ+++ / SALARY--', icon: <GraduationCap size={20} /> },
            ].map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setCareer(c.id as any)}
                className={`p-4 border transition-all text-left relative overflow-hidden group ${
                  career === c.id ? 'border-primary bg-primary/10 shadow-neon' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className={`p-2 w-10 h-10 mb-2 flex items-center justify-center transition-colors ${career === c.id ? 'bg-primary text-black' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
                  {c.icon}
                </div>
                <span className={`block font-headline font-black text-[9px] tracking-widest mb-1 ${career === c.id ? 'text-primary' : 'text-white/60'}`}>{c.label}</span>
                <p className="text-[7px] text-white/30 uppercase font-bold tracking-widest">{c.desc}</p>
                {career === c.id && (
                  <div className="absolute top-0 right-0 p-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
          <button 
            onClick={() => setStep(3)}
            className="w-full bg-primary py-5 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-[0.3em] shadow-neon mt-4"
          >
            Sync Visual Layer
          </button>
        </div>
      )
    },
    {
      title: "VISUAL_IDENTITY",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {avatars.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setAvatar(a.id)}
                className={`p-4 border flex flex-col items-center gap-3 transition-all relative overflow-hidden group ${
                  avatar === a.id ? 'border-primary bg-primary/10 shadow-neon' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 z-10 opacity-40 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <img 
                    src={a.img} 
                    alt={a.label} 
                    className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  {avatar === a.id && (
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-[0_0_10px_#22c55e] z-20"
                    />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className={`font-headline font-black text-[9px] tracking-[0.2em] uppercase ${avatar === a.id ? 'text-primary' : 'text-white/40'}`}>
                    {a.label}
                  </span>
                  <div className="w-8 h-0.5 bg-white/10 group-hover:bg-primary/20 transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
          <div className="p-4 bg-primary/5 border border-primary/20">
             <div className="flex justify-between items-center text-[8px] font-black text-primary uppercase mb-2">
                <span>Rendering Character Node...</span>
                <span className="animate-pulse">ONLINE</span>
             </div>
             <div className="h-1 bg-white/5 relative overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-1/3 bg-primary"
                />
             </div>
          </div>
          <button 
            onClick={() => {
              const selectedPersona = personas.find(p => p.id === persona)!;
              handleFinalize({
                name,
                careerPath: career,
                persona,
                avatar,
                netWorth: (career === 'Finance' || career === 'Law' ? 5000 : career === 'Underground' ? 200 : 1000) + selectedPersona.stats.netWorth,
                happiness: (career === 'Creative' ? 70 : career === 'Medicine' ? 60 : career === 'Law' ? 40 : 50) + selectedPersona.stats.happiness,
                iq: (career === 'Tech' ? 120 : career === 'Academic' ? 140 : career === 'Medicine' ? 130 : 100) + selectedPersona.stats.iq,
                level: 1,
                position: { x: 50, y: 50 }
              });
            }}
            className="w-full bg-primary py-6 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-[0.5em] shadow-neon mt-4"
          >
            Initiate_Metropolis_Sync
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black p-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/onboarding_background_1779238543970.png" 
          alt="Simulation Network" 
          className="w-full h-full object-cover opacity-20 filter hue-rotate-30 saturate-150"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      </div>
      
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.98, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        className="bg-surface-container border-l-4 border-primary w-full max-w-lg p-10 shadow-[0_0_120px_rgba(34,197,94,0.08)] max-h-[92vh] flex flex-col relative z-10 etched-border overflow-hidden"
      >
        <TechLines className="opacity-10" />
        
        <div className="flex justify-between items-end mb-12 flex-shrink-0 relative">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-primary animate-pulse shadow-neon" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">SIM_OS_LOADER_v.7.2</span>
            </div>
            <h2 className="font-headline font-black text-4xl text-white uppercase tracking-tighter italic leading-none">{steps[step].title}</h2>
          </div>
          <div className="text-right">
             <div className="text-[8px] font-black text-emerald-400/30 uppercase tracking-[0.4em] mb-2 font-mono">NODE_CLUSTER_Z-8</div>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{step + 1} / {steps.length}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20 custom-scrollbar relative">
          {steps[step].content}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex gap-4 flex-shrink-0">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 space-y-2">
               <div className={`h-1.5 transition-all duration-700 ${i <= step ? 'bg-primary shadow-neon' : 'bg-white/5'}`} />
               {i === step && (
                 <motion.div 
                   layoutId="activeBarOnboarding"
                   className="h-1 bg-primary/40 blur-[2px]"
                 />
               )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- Building Interior Visualization ---
const InteriorItem = ({ icon: Icon, label, color, x, y, size = 16, delay = 0, status = 'online' }: { icon: any, label: string, color: string, x: string, y: string, size?: number, delay?: number, status?: 'online' | 'offline' | 'alert' }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: 'spring', stiffness: 200 }}
    style={{ left: x, top: y }}
    className="absolute group/item"
  >
    <div className={`relative p-2 rounded-lg border border-white/5 bg-black/40 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:scale-110 cursor-help ${color}`}>
      <Icon size={size} className={status === 'alert' ? 'animate-pulse' : ''} />
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-current opacity-20" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-current opacity-20" />
      
      {/* Tooltip-like label */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/10 text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50">
        {label} // {status.toUpperCase()}
      </div>
    </div>
  </motion.div>
);

const BuildingInteriorScan = ({ type }: { type: string }) => {
  const [charPos, setCharPos] = useState({ x: 50, y: 50 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (!keys.includes(e.key)) return;

      setIsMoving(true);
      const step = 4;
      setCharPos(prev => {
        let { x, y } = prev;
        if (e.key === 'w' || e.key === 'ArrowUp') y = Math.max(10, y - step);
        if (e.key === 's' || e.key === 'ArrowDown') y = Math.min(85, y + step);
        if (e.key === 'a' || e.key === 'ArrowLeft') x = Math.max(5, x - step);
        if (e.key === 'd' || e.key === 'ArrowRight') x = Math.min(95, x + step);
        return { x, y };
      });

      // Reset moving state after short delay
      const timeout = setTimeout(() => setIsMoving(false), 200);
      return () => clearTimeout(timeout);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const layouts: Record<string, any[]> = {
    office: [
      { icon: Monitor, label: 'Workstation_01', color: 'text-primary', x: '15%', y: '20%' },
      { icon: Monitor, label: 'Workstation_02', color: 'text-primary', x: '35%', y: '20%' },
      { icon: Monitor, label: 'Workstation_03', color: 'text-primary', x: '55%', y: '20%' },
      { icon: Briefcase, label: 'CEO_Terminal', color: 'text-secondary', x: '80%', y: '15%', size: 20 },
      { icon: Coffee, label: 'Neural_Breakroom', color: 'text-tertiary', x: '10%', y: '70%' },
      { icon: Cpu, label: 'Local_Cache_Server', color: 'text-blue-400', x: '85%', y: '75%' },
      { icon: Layers, label: 'Archive_Stacks', color: 'text-white/30', x: '40%', y: '75%' },
    ],
    bank: [
      { icon: Shield, label: 'Security_Checkpoint', color: 'text-tertiary', x: '50%', y: '85%', size: 24 },
      { icon: Key, label: 'Vault_Entrance', color: 'text-primary', x: '50%', y: '15%', size: 32 },
      { icon: Server, label: 'Ledger_Node_01', color: 'text-blue-400', x: '20%', y: '40%' },
      { icon: Server, label: 'Ledger_Node_02', color: 'text-blue-400', x: '80%', y: '40%' },
      { icon: Terminal, label: 'Teller_Interface', color: 'text-secondary', x: '30%', y: '70%' },
      { icon: Terminal, label: 'Teller_Interface', color: 'text-secondary', x: '70%', y: '70%' },
    ],
    school: [
      { icon: Radio, label: 'Neural_Uplink_Pod', color: 'text-secondary', x: '20%', y: '25%' },
      { icon: Radio, label: 'Neural_Uplink_Pod', color: 'text-secondary', x: '40%', y: '25%' },
      { icon: Radio, label: 'Neural_Uplink_Pod', color: 'text-secondary', x: '60%', y: '25%' },
      { icon: Radio, label: 'Neural_Uplink_Pod', color: 'text-secondary', x: '80%', y: '25%' },
      { icon: Zap, label: 'IQ_Amplifier_Core', color: 'text-primary', x: '50%', y: '60%', size: 24 },
      { icon: BookOpen, label: 'Digital_Library', color: 'text-tertiary', x: '15%', y: '80%' },
    ],
    bar: [
      { icon: Speaker, label: 'Audio_Projection', color: 'text-tertiary', x: '10%', y: '10%' },
      { icon: Speaker, label: 'Audio_Projection', color: 'text-tertiary', x: '90%', y: '10%' },
      { icon: Gamepad2, label: 'Hologame_Rig', color: 'text-primary', x: '15%', y: '45%' },
      { icon: Wine, label: 'Synthesis_Bar', color: 'text-secondary', x: '50%', y: '15%', size: 28 },
      { icon: User, label: 'VIP_Lounge_A', color: 'text-tertiary', x: '20%', y: '80%' },
      { icon: User, label: 'VIP_Lounge_B', color: 'text-tertiary', x: '80%', y: '80%' },
    ],
    gym: [
      { icon: Flame, label: 'Caloric_Burn_Unit', color: 'text-red-400', x: '20%', y: '20%' },
      { icon: Dumbbell, label: 'Heavy_Loader_Rack', color: 'text-primary', x: '80%', y: '20%' },
      { icon: Zap, label: 'Bio_Stim_Booth', color: 'text-secondary', x: '50%', y: '45%', size: 24 },
      { icon: Activity, label: 'Metabolic_Scanner', color: 'text-blue-400', x: '20%', y: '70%' },
      { icon: Droplets, label: 'Hydro_Recovery', color: 'text-blue-500', x: '80%', y: '70%' },
    ],
  };

  const currentLayout = layouts[type] || layouts.office;

  return (
    <div className="relative w-full aspect-video bg-black/60 border border-white/5 overflow-hidden etched-glass mb-8 group/scan">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] tech-grid-fine pointer-events-none" />
      
      {/* Dynamic Scan Line */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[1px] bg-primary/20 z-[49] pointer-events-none"
      />

      {/* Room Partition Lines (Visual flavor) */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/5" />
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5" />
      
      {/* Items */}
      {currentLayout.map((item, i) => (
        <InteriorItem 
          key={i} 
          {...item} 
          delay={i * 0.1}
        />
      ))}

      {/* Player Character */}
      <motion.div
        animate={{ 
          left: `${charPos.x}%`, 
          top: `${charPos.y}%`,
          scale: isMoving ? 1.1 : 1
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="relative p-2 rounded-full bg-primary/20 border border-primary shadow-[0_0_15px_rgba(251,209,45,0.4)]">
           <User size={18} className="text-primary" />
           {/* Position Indicator Ring */}
           <motion.div 
             animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-x-[-4px] inset-y-[-4px] rounded-full border border-primary/40"
           />
           {/* Label */}
           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 bg-black text-[6px] font-black text-primary uppercase tracking-tighter whitespace-nowrap border border-primary/20">
             ID_V7_SYNCED
           </div>
        </div>
      </motion.div>

      {/* Controls Hint */}
      <div className="absolute bottom-3 right-4 flex items-center gap-2 opacity-30">
        <div className="px-1.5 py-0.5 border border-white/20 text-[8px] font-black uppercase text-white/60">WASD</div>
        <span className="text-[7px] font-bold tracking-[0.2em] text-white/40 uppercase">NEURAL_NAV</span>
      </div>
      
      {/* Ambient Floor Polish */}
      <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      
      {/* Corner Labels */}
      <div className="absolute top-3 left-4 flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[7px] font-black text-white/40 uppercase tracking-[0.4em]">Internal_Scan_Active</span>
      </div>
    </div>
  );
};

const BuildingDashboard = ({ 
  details, 
  statuses, 
  activeUpgrades = {},
  purchasedUpgrades = {},
  onInspect,
  onUpgrade,
  onAction
}: { 
  details: any; 
  statuses: Record<string, string>; 
  activeUpgrades?: Record<string, { title: string; progress: number }>;
  purchasedUpgrades?: Record<string, string[]>;
  onInspect: (id: string) => void;
  onUpgrade: (buildingId: string, upgrade: { title: string; cost: string; effect: string }) => void;
  onAction: (msg: string) => void;
}) => {
  const upgrades: Record<string, { title: string; cost: string; effect: string }[]> = {
    office: [
      { title: "Neuro-Link Uplink", cost: "$150K", effect: "+15% Efficiency" },
      { title: "AI HR Suite", cost: "$80K", effect: "-20% Burnout" }
    ],
    bank: [
      { title: "Quantum Vaults", cost: "$500K", effect: "Un-hackable Reserves" },
      { title: "High-Freq Core", cost: "$220K", effect: "+2% Interest APY" }
    ],
    school: [
      { title: "Deep Learning Pods", cost: "$120K", effect: "+5 IQ Per Session" },
      { title: "Xenon Labs", cost: "$300K", effect: "Rare Career Unlocks" }
    ],
    bar: [
      { title: "Holographic Stage", cost: "$45K", effect: "+10% Happiness" },
      { title: "Luxury Mixology", cost: "$25K", effect: "Rare Networking" }
    ],
    gym: [
      { title: "Biometric Scanners", cost: "$60K", effect: "+20% Recovery Speed" },
      { title: "Cryo-Pods", cost: "$150K", effect: "Max Happiness Boost" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-primary';
      case 'warning': return 'text-tertiary';
      case 'alert': return 'text-red-400';
      default: return 'text-white/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Operational';
      case 'warning': return 'Under Maintenance';
      case 'alert': return 'Critical Failure';
      default: return 'Standby';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(details).map(([id, building]: [string, any], idx) => {
          const status = statuses[id];
          const hasIssue = status === 'warning' || status === 'alert';
          const activeUpgrade = activeUpgrades[id];

          return (
            <motion.div 
              key={id}
              whileHover={{ scale: 1.01 }}
              className="bg-black/60 border border-white/10 p-8 pt-10 group hover:border-primary transition-all flex flex-col relative overflow-hidden etched-border shadow-2xl"
            >
              <TechLines className="opacity-10" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-[0.03] blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`p-4 bg-white/5 border border-white/5 shadow-inner scale-110 ${getStatusColor(status)}`}>
                    {building.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full animate-pulse shadow-neon ${getStatusColor(status).replace('text-', 'bg-')}`} />
                      <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">ZONE_{id.toUpperCase()}_v8.4</span>
                    </div>
                    <h4 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter leading-none">{building.title}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${getStatusColor(status)}`}>
                      {activeUpgrade ? 'SYSTEM_STRUCTURAL_EXPANSION_IN_PROGRESS' : `STATUS_${getStatusLabel(status).toUpperCase()}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => onInspect(id)}
                  className="p-3 bg-white/5 border border-white/10 text-white/20 hover:text-primary hover:bg-primary/10 transition-all group/inspect"
                >
                  <Search size={20} className="group-hover/inspect:scale-110 transition-transform" />
                </button>
              </div>

              {/* Building Interior Visualization */}
              <BuildingInteriorScan type={id} />

              {/* Sub-Metrics Row */}
              <div className="grid grid-cols-3 gap-4 mb-8 bg-black/40 p-4 border border-white/5 relative z-10">
                {[
                  { label: 'Neural_Load', val: '42%', color: 'text-secondary' },
                  { label: 'Grid_Draw', val: '1.2GW', color: 'text-primary' },
                  { label: 'Security', val: 'Level_4', color: 'text-tertiary' },
                ].map((m, i) => (
                  <div key={i} className="border-r border-white/5 last:border-none px-2">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">{m.label}</span>
                    <span className={`text-xs font-mono font-bold ${m.color}`}>{m.val}</span>
                  </div>
                ))}
              </div>

              {activeUpgrade ? (
                <div className="mb-8 relative z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={12} className="text-primary animate-spin" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{activeUpgrade.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-white/40 tracking-tighter font-mono">{activeUpgrade.progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${activeUpgrade.progress}%` }}
                      className="h-full bg-primary shadow-neon shadow-[0_0_15px_rgba(251,209,45,0.4)]"
                    />
                  </div>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.3em] text-center mt-3 animate-pulse">OPTIMIZING_TEMPORAL_FLUX...</p>
                </div>
              ) : hasIssue && (
                <div className={`mb-8 p-5 border-l-4 relative overflow-hidden ${status === 'alert' ? 'bg-red-500/10 border-red-500' : 'bg-tertiary/10 border-tertiary'} flex items-start gap-4 z-10`}>
                  <AlertTriangle size={20} className={status === 'alert' ? 'text-red-400 animate-pulse' : 'text-tertiary'} />
                  <div>
                    <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">INTERVENTIONAL_ALERT_0x{idx}</h5>
                    <p className="text-[10px] text-white/50 leading-relaxed font-medium">{status === 'alert' ? 'Critical neural link decay detected. Immediate systemic intervention protocol required.' : 'Minor structural variance detected. Tactical reboot suggested to prevent further efficiency erosion.'}</p>
                  </div>
                </div>
              )}

              {/* Quick Actions Integration */}
              <div className="mb-8 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} className="text-secondary" />
                  <span className="text-[9px] font-black text-secondary uppercase tracking-[0.4em]">QUICK_ACTIONS</span>
                </div>
                {id === 'gym' ? (
                  <button 
                    onClick={() => onAction('Physical optimization cycle initiated. Happiness and Recovery boosted.')}
                    className="w-full py-4 bg-secondary/10 border border-secondary/20 hover:bg-secondary hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all etched-border shadow-neon-secondary flex items-center justify-center gap-3"
                  >
                    <Dumbbell size={16} /> INITIATE_WORKOUT_PROTOCOL
                  </button>
                ) : id === 'office' ? (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onAction('Standard operational cycle initiated for Corporate HQ. Efficiency nominal.')}
                      className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all etched-border"
                    >
                      RUN_STANDARD_CYCLE
                    </button>
                    <button 
                      onClick={() => onAction('RESEARCH_MARKET_TRENDS')}
                      className="w-full py-4 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all etched-border flex items-center justify-center gap-3"
                    >
                      <Bot size={16} /> RESEARCH_MARKET_TRENDS
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => onAction(`Standard operational cycle initiated for ${building.title}. Efficiency nominal.`)}
                    className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all etched-border"
                  >
                    RUN_STANDARD_CYCLE
                  </button>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Construction size={14} className="text-white/40" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">SYSTEM_UPGRADES_MATRIX</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {upgrades[id]?.map((upgrade, idx) => {
                    const isPurchased = purchasedUpgrades[id]?.includes(upgrade.title);
                    if (isPurchased) return null;

                    return (
                      <button 
                        key={idx} 
                        disabled={!!activeUpgrade}
                        onClick={() => onUpgrade(id, upgrade)}
                        className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 group hover:bg-primary transition-all group/btn disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed etched-border"
                      >
                        <div className="text-left">
                          <p className="text-[11px] font-black text-white group-hover:text-black transition-colors uppercase tracking-tight">{upgrade.title}</p>
                          <p className="text-[9px] text-white/40 group-hover:text-black/60 transition-colors uppercase tracking-widest font-mono mt-1">{upgrade.effect}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/10 border border-primary/20 group-hover:bg-black group-hover:text-primary transition-all etched-border">{upgrade.cost}</span>
                        </div>
                      </button>
                    );
                  })}
                  {upgrades[id]?.every(u => purchasedUpgrades[id]?.includes(u.title)) && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">ALL_UPGRADES_OPERATIONAL</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const AIAdvisorModal = ({ stats, buildings, onClose, onAction }: { 
  stats: UserStats; 
  buildings: Record<string, string>; 
  onClose: () => void;
  onAction: (msg: string) => void;
}) => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [strategyType, setStrategyType] = useState<'aggressive' | 'balanced' | 'conservative'>('balanced');

  const getAdvice = async () => {
    setLoading(true);
    setAdvice("");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `You are a high-level Strategic AI Advisor in the business simulation game OTTO_MANAGER.
      Current City Context:
      - Office Status: ${buildings.office}
      - Bank Status: ${buildings.bank}
      - School Status: ${buildings.school}
      - Bar Status: ${buildings.bar}
      - Gym Status: ${buildings.gym}

      Player Stats:
      - Name: ${stats.name}
      - Net Worth: $${stats.netWorth.toLocaleString()}
      - Happiness: ${stats.happiness}%
      - IQ: ${stats.iq}
      - Level: ${stats.level}
      - Career: ${stats.careerPath}

      The player is looking for ${strategyType} strategic guidance. 
      Analyze the city status (idle/active/warning/alert) and stats. 
      Provide 3 specific, actionable tips to increase Net Worth or IQ while maintaining Happiness.
      Keep the tone professional, forward-looking, and slightly futuristic. 
      Use bullet points. Do not use markdown headers or bolding. Keep it under 150 words.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });

      setAdvice(result.text?.trim() || "Strategy update failed. Re-initiating uplink...");
    } catch (error) {
      console.error("AI Advisor Error:", error);
      setAdvice("Neural link unstable. Strategic analysis suspended.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdvice();
  }, [strategyType]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container border-l-4 border-secondary w-full max-w-xl p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-secondary"><X size={24} /></button>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary"><Cpu size={24} /></div>
          <div>
            <h2 className="font-headline font-black text-2xl text-secondary uppercase tracking-tighter italic">STRATEGIC_ADVISOR_V4</h2>
            <p className="text-[10px] text-secondary font-black tracking-widest uppercase">Contextual_Intelligence_Feed</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['aggressive', 'balanced', 'conservative'] as const).map(type => (
            <button 
              key={type}
              onClick={() => setStrategyType(type)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                strategyType === type ? 'bg-secondary text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="bg-black/40 p-6 border border-white/5 mb-8 min-h-[200px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent animate-spin rounded-full" />
              <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] animate-pulse">Syncing_Neural_Matrix...</p>
            </div>
          ) : (
            <div className="text-sm text-on-surface/80 leading-relaxed font-medium">
              {advice.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={getAdvice}
            className="flex-1 py-4 border border-white/10 font-headline font-black text-white/40 hover:text-white transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Refresh Analysis
          </button>
          <button 
            onClick={() => {
              onAction('Strategic directive acknowledged. Implementing recommendations.');
              onClose();
            }}
            className="flex-1 bg-secondary py-4 font-headline font-black text-black hover:bg-white transition-all uppercase text-xs tracking-widest"
          >
            Acknowledge Directives
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface BotProposal {
  type: 'BUY_STOCK' | 'SELL_STOCK' | 'INVEST_REAL_ESTATE' | 'WORK_SHIFT' | 'COMPLETE_TASK';
  title: string;
  description: string;
  cost?: number;
  parameters: {
    symbol?: string;
    quantity?: number;
    price?: number;
    name?: string;
    cost?: number;
    yield?: number;
    type?: 'desk' | 'server' | 'coffee';
    taskId?: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposal?: BotProposal;
  proposalStatus?: 'pending' | 'executed' | 'declined';
}

const ChatbotModal = ({ 
  stats, 
  setStats, 
  playerData, 
  setPlayerData, 
  marketHistory, 
  addNotification, 
  onClose 
}: { 
  stats: UserStats; 
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  marketHistory: Record<string, number[]>;
  addNotification: (msg: string) => void;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init',
      role: 'assistant', 
      content: `Welcome, Manager ${stats.name || 'Anonymous'}. Your cognitive-financial interface is active. Instruct me to buy stock, sell assets, invest in real estate, complete active tasks, or check in at work.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          stats,
          playerData,
          marketHistory
        })
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve cognitive packet');
      }

      const data = await response.json();
      
      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev, 
        { 
          id: assistantMsgId, 
          role: 'assistant', 
          content: data.content || "Operational update received with standard headers.",
          proposal: data.proposedAction,
          proposalStatus: data.proposedAction ? 'pending' : undefined
        }
      ]);
    } catch (error) {
      console.error("Chatbot uplink error:", error);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: "Neural pipeline experiencing severe solar noise. Try reconnecting standard terminal nodes." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = (msgId: string, proposal: BotProposal) => {
    const { type, parameters, cost } = proposal;

    if (type === 'BUY_STOCK') {
      const symbol = parameters.symbol || 'TECH';
      const qty = parameters.quantity || 1;
      const price = parameters.price || 100;
      const totalCost = qty * price;

      if (playerData.bank.savings < totalCost) {
        addNotification(`EXECUTION FAILED: Insufficient savings ($${playerData.bank.savings.toLocaleString()} / $${totalCost.toLocaleString()})`);
        return;
      }

      setPlayerData(prev => {
        const currentEntry = prev.portfolio[symbol];
        const currentQty = currentEntry ? currentEntry.quantity : 0;
        const currentAvg = currentEntry ? currentEntry.avgCost : 0;
        const totalQty = currentQty + qty;
        const nextAvg = totalQty > 0 ? ((currentQty * currentAvg) + (qty * price)) / totalQty : price;

        return {
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings - totalCost,
            transactionHistory: [
              {
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                type: 'purchase',
                amount: totalCost,
                description: `Acquired ${qty} shares of ${symbol} via NEURAL Assistant`
              },
              ...prev.bank.transactionHistory
            ]
          },
          portfolio: {
            ...prev.portfolio,
            [symbol]: {
              symbol,
              quantity: totalQty,
              avgCost: nextAvg
            }
          }
        };
      });
      addNotification(`PURCHASE CONFIRMED: ${qty} x ${symbol} @ $${price.toLocaleString()}`);

    } else if (type === 'SELL_STOCK') {
      const symbol = parameters.symbol || 'TECH';
      const qty = parameters.quantity || 1;
      const price = parameters.price || 100;
      const totalYield = qty * price;
      
      const currentEntry = playerData.portfolio[symbol];
      const availableQty = currentEntry ? currentEntry.quantity : 0;

      if (availableQty < qty) {
        addNotification(`EXECUTION FAILED: Insufficient portfolio shares (${availableQty} / ${qty})`);
        return;
      }

      setPlayerData(prev => {
        const entry = prev.portfolio[symbol];
        const currentQty = entry ? entry.quantity : 0;
        const currentAvg = entry ? entry.avgCost : 0;
        const remainingQty = Math.max(0, currentQty - qty);

        const nextPortfolio = { ...prev.portfolio };
        if (remainingQty <= 0) {
          delete nextPortfolio[symbol];
        } else {
          nextPortfolio[symbol] = {
            symbol,
            quantity: remainingQty,
            avgCost: currentAvg
          };
        }

        return {
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings + totalYield,
            transactionHistory: [
              {
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                type: 'sale',
                amount: totalYield,
                description: `Liquidated ${qty} shares of ${symbol} via NEURAL Assistant`
              },
              ...prev.bank.transactionHistory
            ]
          },
          portfolio: nextPortfolio
        };
      });
      addNotification(`LIQUIDATION CONFIRMED: ${qty} x ${symbol} @ $${price.toLocaleString()}`);

    } else if (type === 'INVEST_REAL_ESTATE') {
      const propCost = parameters.cost || cost || 10000;
      const propName = parameters.name || 'Simulation Condo';

      if (playerData.bank.savings < propCost) {
        addNotification(`EXECUTION FAILED: Insufficient savings ($${playerData.bank.savings.toLocaleString()} / $${propCost.toLocaleString()})`);
        return;
      }

      setPlayerData(prev => ({
        ...prev,
        bank: {
          ...prev.bank,
          savings: prev.bank.savings - propCost,
          transactionHistory: [
            {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              type: 'investment',
              amount: propCost,
              description: `Purchased property [${propName}]`
            },
            ...prev.bank.transactionHistory
          ]
        }
      }));

      // Gain Net Worth permanently matching asset acquisition
      setStats(prev => ({
        ...prev,
        netWorth: prev.netWorth + propCost
      }));

      addNotification(`INVESTMENT SECURED: [${propName}] acquired. Net Worth increased by $${propCost.toLocaleString()}`);

    } else if (type === 'WORK_SHIFT') {
      const shiftType = parameters.type || 'desk';

      if (shiftType === 'desk') {
        setStats(prev => ({ 
          ...prev, 
          netWorth: prev.netWorth + 200, 
          iq: prev.iq + 1, 
          happiness: Math.max(0, prev.happiness - 2) 
        }));
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings + 200
          }
        }));
        addNotification("Shift completed. Data processed at workstation. Savings +$200, IQ +1");
      } else if (shiftType === 'server') {
        setStats(prev => ({ 
          ...prev, 
          netWorth: prev.netWorth + 500, 
          iq: prev.iq + 3, 
          happiness: Math.max(0, prev.happiness - 5) 
        }));
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings + 500
          }
        }));
        addNotification("System optimization successful. Output scaled. Savings +$500, IQ +3");
      }

    } else if (type === 'COMPLETE_TASK') {
      const taskId = parameters.taskId || 't1';
      const task = playerData.tasks.find(t => t.id === taskId);

      if (!task) {
        addNotification("EXECUTION FAILED: Requested task ID not found.");
        return;
      }

      if (task.completed) {
        addNotification(`EXECUTION FAILED: Task [${task.title}] already complete.`);
        return;
      }

      const reward = task.reward || 500;

      setPlayerData(prev => {
        const updatedTasks = prev.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, completed: true, progress: 100 };
          }
          return t;
        });
        return {
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings + reward
          },
          tasks: updatedTasks
        };
      });

      setStats(prev => ({
        ...prev,
        netWorth: prev.netWorth + reward
      }));

      addNotification(`TASK COMPLETED: ${task.title}. Reward: $${reward.toLocaleString()} deposited.`);
    }

    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        return { ...msg, proposalStatus: 'executed' };
      }
      return msg;
    }));
  };

  const declineProposal = (msgId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        return { ...msg, proposalStatus: 'declined' };
      }
      return msg;
    }));
    addNotification("Action transaction decline registered.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-[150] w-80 h-[480px] bg-surface-container border-l-4 border-primary shadow-2xl flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-primary" />
          <span className="font-label font-black text-[10px] text-primary tracking-widest uppercase">NEURAL_ASSISTANT</span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-primary transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 text-[11px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary/10 border border-primary/20 text-primary rounded-l-lg rounded-tr-lg' 
                  : 'bg-white/5 border border-white/10 text-white/80 rounded-r-lg rounded-tl-lg'
              }`}>
                {msg.content}
              </div>
            </div>

            {/* Interactive Draft/Proposal Education Card */}
            {msg.role === 'assistant' && msg.proposal && (
              <div className="border border-secondary/30 bg-secondary/5 rounded-md p-3 space-y-2 text-[10px] font-mono select-none">
                <div className="flex items-center gap-1.5 text-secondary border-b border-secondary/20 pb-1.5 mb-1 bg-secondary/5 -mx-3 -mt-3 p-2 rounded-t-md">
                  <Cpu size={12} className="animate-spin" />
                  <span className="font-bold uppercase tracking-wider">ACTION TEMPLATE DETECTED</span>
                </div>
                
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase">{msg.proposal.title}</h4>
                  <p className="text-white/60 leading-normal text-[9.5px] mt-1">{msg.proposal.description}</p>
                </div>

                <div className="bg-black/40 border border-white/5 p-2 rounded-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/40">Action Type</span>
                    <span className="text-primary font-bold">{msg.proposal.type}</span>
                  </div>
                  {msg.proposal.parameters?.symbol && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Asset Indicator</span>
                      <span className="text-white-80 font-bold">{msg.proposal.parameters.symbol}</span>
                    </div>
                  )}
                  {msg.proposal.parameters?.quantity && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Volume</span>
                      <span className="text-glow text-secondary font-black">{msg.proposal.parameters.quantity} units</span>
                    </div>
                  )}
                  {msg.proposal.parameters?.price && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Unit Value</span>
                      <span className="text-white">${msg.proposal.parameters.price.toLocaleString()}</span>
                    </div>
                  )}
                  {msg.proposal.parameters?.taskId && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Registered Task ID</span>
                      <span className="text-white font-bold">{msg.proposal.parameters.taskId}</span>
                    </div>
                  )}
                  {msg.proposal.parameters?.type && (
                    <div className="flex justify-between">
                      <span className="text-white/40">Environment</span>
                      <span className="text-glow text-secondary uppercase font-bold">{msg.proposal.parameters.type} shift</span>
                    </div>
                  )}
                </div>

                {msg.proposalStatus === 'pending' ? (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => declineProposal(msg.id)}
                      className="flex-1 py-1.5 border border-white/10 hover:border-white/30 text-white/50 hover:text-white uppercase text-[9px] font-black transition-all rounded-sm"
                    >
                      DECLINE
                    </button>
                    <button
                      onClick={() => executeProposal(msg.id, msg.proposal!)}
                      className="flex-1 py-1.5 bg-secondary text-black hover:bg-white uppercase text-[9px] font-black transition-all rounded-sm"
                    >
                      EXECUTE
                    </button>
                  </div>
                ) : (
                  <div className={`py-1 text-center font-bold tracking-wider rounded-sm text-[9px] border ${
                    msg.proposalStatus === 'executed' 
                      ? 'border-secondary/20 bg-secondary/10 text-secondary' 
                      : 'border-white/10 bg-black/20 text-white/30'
                  }`}>
                    {msg.proposalStatus === 'executed' ? '✓ SYSTEM DEPLOYED' : '⊘ DECLINED'}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-3 rounded-r-lg rounded-tl-lg">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Input command..."
            className="w-full bg-surface-container-low border border-white/10 p-2 pr-10 text-[11px] text-white focus:outline-none focus:border-primary transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const InternalSideBriefing = ({ stats }: { stats: UserStats }) => {
  const [briefing, setBriefing] = useState<string>('Initializing neural briefing...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const response = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stats, playerData: { bank: { savings: 0 }, skills: {} }, day: 1 }) // Partial data for side briefing
        });
        const data = await response.json();
        setBriefing(data.briefing || "Market volatility detected. Stay sharp, manager.");
      } catch (error) {
        console.error("Gemini Error:", error);
        setBriefing("Connection to neural network unstable. Proceed with caution.");
      } finally {
        setLoading(false);
      }
    };
    fetchBriefing();
  }, [stats.level, stats.careerPath]);

  return (
    <div className="bg-surface-container-low p-4 border-l-2 border-primary/20 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={12} className="text-primary animate-pulse" />
        <span className="text-[9px] text-primary font-black tracking-widest uppercase">AI_DAILY_BRIEFING</span>
      </div>
      <p className={`text-[11px] leading-relaxed text-on-surface/70 italic ${loading ? 'animate-pulse' : ''}`}>
        "{briefing}"
      </p>
    </div>
  );
};

const JobBoardModal = ({ stats, onClose, onAction, onJobUpdate }: { stats: UserStats; onClose: () => void; onAction: (msg: string) => void; onJobUpdate: (job: Job) => void }) => {
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const jobs = [
    { id: 'j1', title: 'Lead Systems Architect', company: 'OmniCorp', salary: '$320K', salaryNum: 320000, reqIQ: 130, sector: 'Tech' },
    { id: 'j2', title: 'Senior Quant Analyst', company: 'Apex Capital', salary: '$450K', salaryNum: 450000, reqIQ: 145, sector: 'Finance' },
    { id: 'j3', title: 'Creative Director', company: 'Neon Media', salary: '$210K', salaryNum: 210000, reqIQ: 115, sector: 'Creative' },
    { id: 'j4', title: 'Blockchain Engineer', company: 'ChainLink Solutions', salary: '$280K', salaryNum: 280000, reqIQ: 125, sector: 'Tech' },
    { id: 'j5', title: 'Hedge Fund Manager', company: 'BlackRock Alpha', salary: '$600K', salaryNum: 600000, reqIQ: 155, sector: 'Finance' },
  ];

  const handleApply = (job: typeof jobs[0]) => {
    if (stats.iq < job.reqIQ) {
      onAction(`Application Rejected: IQ requirements not met (${job.reqIQ} required)`);
      return;
    }

    setApplyingId(job.id);
    onAction(`Submitting application to ${job.company}...`);

    setTimeout(() => {
      setApplyingId(null);
      setAppliedIds(prev => new Set(prev).add(job.id));
      
      // 50% chance of success for simulation
      const success = Math.random() > 0.5;
      if (success) {
        onAction(`OFFER RECEIVED: ${job.company} has accepted your application!`);
        onJobUpdate({
          title: job.title,
          company: job.company,
          salary: job.salary,
          salaryNum: job.salaryNum,
          performance: 100,
          nextPromotion: 'Senior Level (Est. 6 months)'
        });
      } else {
        onAction(`Application Denied: ${job.company} chose another candidate.`);
      }
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container border-l-4 border-primary w-full max-w-2xl p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-primary"><X size={24} /></button>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary"><Search size={24} /></div>
          <div>
            <h2 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter">JOB_MARKETPLACE</h2>
            <p className="text-[10px] text-primary font-black tracking-widest uppercase">Available Opportunities • IQ: {stats.iq}</p>
          </div>
        </div>

        <BuildingInteriorScan type="office" />

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {jobs.map(job => (
            <div key={job.id} className="bg-surface-container-low p-5 border border-white/5 group hover:border-primary/40 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                  <p className="text-xs text-primary font-black uppercase tracking-widest mb-4">{job.company} • {job.sector}</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={12} className="text-white/40" />
                      <span className="text-[10px] font-bold text-white/60">{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain size={12} className="text-white/40" />
                      <span className={`text-[10px] font-bold ${stats.iq >= job.reqIQ ? 'text-secondary' : 'text-tertiary'}`}>
                        Req. IQ: {job.reqIQ}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  disabled={applyingId !== null || appliedIds.has(job.id)}
                  onClick={() => handleApply(job)}
                  className={`px-6 py-3 font-headline font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
                    appliedIds.has(job.id) 
                      ? 'bg-white/5 text-white/20 cursor-default'
                      : applyingId === job.id
                        ? 'bg-primary/20 text-primary animate-pulse'
                        : 'bg-primary text-black hover:bg-white'
                  }`}
                >
                  {applyingId === job.id && <Loader2 size={14} className="animate-spin" />}
                  {appliedIds.has(job.id) ? 'Applied' : applyingId === job.id ? 'PROCESSING...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const MarketAIAnalysis = ({ investment, stats }: { investment: Investment; stats: UserStats }) => {
  const [prediction, setPrediction] = useState<{ score: number; outlook: string; reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `Analyze this investment in the OTTO_SIM business simulation game:
      Investment: ${investment.name}
      Type: ${investment.type}
      Current Value: ${investment.value}
      Recent Trend: ${investment.change} (${investment.trend})
      Details: ${investment.details}

      Context:
      Player IQ: ${stats.iq}
      Economic Phase: Expansion
      Latest News Sentiment: Moderate-High

      Provide a prediction in JSON format with:
      - score: A number from 0 to 100 representing the prediction confidence/upside potential.
      - outlook: A 3-5 word summary (e.g. "Bullish - High Growth potential").
      - reasoning: A 1-sentence explanation of why (referencing factors like tech sector shifts, market volatility, or historical signals).
      Respond ONLY with the JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || "{}");
      setPrediction(data);
    } catch (error) {
      console.error("Market Analysis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-secondary" />
          <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Neural_Market_Predictor_v1.2</span>
        </div>
        {!prediction && !loading && (
          <button 
            onClick={runAnalysis}
            className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors"
          >
            <Zap size={10} /> Run Neural Analysis
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-2">
          <div className="w-3 h-3 border border-secondary border-t-transparent animate-spin rounded-full" />
          <span className="text-[9px] text-white/40 font-black uppercase tracking-widest animate-pulse">Scanning_Market_Signals...</span>
        </div>
      )}

      {prediction && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/5 border border-secondary/10 p-3 rounded"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Outlook</p>
              <p className="text-xs font-bold text-white uppercase italic">{prediction.outlook}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-1">Precision_Score</p>
              <p className="text-xl font-black text-secondary leading-none">{prediction.score}<span className="text-[10px] ml-0.5">%</span></p>
            </div>
          </div>
          <p className="text-[10px] text-on-surface/60 leading-tight italic">"{prediction.reasoning}"</p>
          <button 
            onClick={() => setPrediction(null)}
            className="mt-3 text-[8px] font-black text-white/20 hover:text-white/40 uppercase tracking-widest transition-colors"
          >
            Reset Analysis
          </button>
        </motion.div>
      )}
    </div>
  );
};

const HQCard = ({ stats, onAction, onOpenHub, onOpenJobs }: { stats: UserStats; onAction: (msg: string) => void; onOpenHub: () => void; onOpenJobs: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-panel p-6 border-l-4 border-primary shadow-2xl w-85 isometric-card"
  >
    <div className="flex justify-between items-start mb-5">
      <h2 className="font-headline font-black text-xl text-primary uppercase tracking-tighter">OFFICE: {stats.careerPath === 'Finance' ? 'WALL_ST_HUB' : 'MAIN_TOWER'}</h2>
      <span className="bg-secondary text-black text-[10px] font-black px-2 py-1 uppercase tracking-tighter">RENT_PAID</span>
    </div>
    
    <InternalSideBriefing stats={stats} />

    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-surface-container-low p-4 border-b border-secondary/20">
        <span className="text-[10px] text-secondary font-black block mb-1 tracking-widest">MONTHLY_INCOME</span>
        <span className="font-headline text-xl font-bold text-white">
          +${stats.careerPath === 'Finance' ? '4.2K' : stats.careerPath === 'Tech' ? '3.1K' : '2.4K'}
        </span>
      </div>
      <div className="bg-surface-container-low p-4 border-b border-tertiary/20">
        <span className="text-[10px] text-tertiary font-black block mb-1 tracking-widest">EMPLOYEE_SATISFACTION</span>
        <span className="font-headline text-xl font-bold text-white">{stats.happiness}%</span>
      </div>
    </div>

    <div className="space-y-3">
      <button 
        onClick={onOpenHub}
        className="w-full bg-primary py-4 font-headline font-black text-black hover:bg-white active:scale-[0.98] transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2"
      >
        <LucidePieChart size={18} />
        Financial Dashboard
      </button>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onOpenJobs}
          className="bg-surface-container-highest py-3 font-headline font-black text-white/70 hover:text-primary hover:bg-white/5 active:scale-[0.98] transition-all uppercase text-[10px] tracking-widest border border-white/10"
        >
          Job Market
        </button>
        <button 
          onClick={() => onAction('Work Efficiency Increased: +15%')}
          className="bg-surface-container-highest py-3 font-headline font-black text-secondary hover:bg-secondary hover:text-black active:scale-[0.98] transition-all uppercase text-[10px] tracking-widest border-b-2 border-secondary/30"
        >
          Work Harder
        </button>
      </div>
    </div>
  </motion.div>
);

const POTENTIAL_VENTURES = [
  { name: "Neuro-Link Tech", sector: "Transhumanism", valuation: "$2.5M", potential: "High", risk: "Extreme", description: "Direct neural interface for seamless AI integration." },
  { name: "Quantum Logistics", sector: "Infrastructure", valuation: "$1.8M", potential: "Medium", risk: "Low", description: "Sub-atomic delivery systems for instant resource routing." },
  { name: "Cyber-Security Aegis", sector: "Security", valuation: "$4.0M", potential: "High", risk: "Stable", description: "Advanced polymorphic encryption for corporate vaults." },
  { name: "Neon-Greens Vertical", sector: "Agri-Tech", valuation: "$1.2M", potential: "Medium", risk: "Moderate", description: "Self-sustaining vertical farms for high-density sectors." },
  { name: "Orbital Tourism", sector: "Leisure", valuation: "$15M", potential: "Very High", risk: "Critical", description: "Low-earth orbit luxury suites for the ultra-elite." }
];

const VCAIAssistant = ({ stats, portfolio, onAction }: { stats: UserStats; portfolio: Investment[]; onAction: (msg: string) => void }) => {
  const [analysis, setAnalysis] = useState<{ trends: string; recommendation: any; strategy: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  const runVCOptimization = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const prompt = `You are a legendary Venture Capitalist AI in the OTTO_SIM simulation.
      
      Current Portfolio Summary:
      ${portfolio.map(p => `- ${p.name} (${p.type}): Value ${p.value}, Trend ${p.trend}`).join('\n')}
      
      Financial Status:
      - Net Worth: $${stats.netWorth.toLocaleString()}
      - IQ: ${stats.iq}
      - Risk Tolerance: ${riskTolerance}
      
      Potential Acquisitions:
      ${POTENTIAL_VENTURES.map(v => `- ${v.name} (${v.sector}): Valuation ${v.valuation}, Potential ${v.potential}`).join('\n')}
      
      Respond in JSON format:
      - trends: A 2-sentence summary of current market macro-trends in this cyberpunk economy.
      - recommendation: Pick ONE venture from the "Potential Acquisitions" list that best fits the risk tolerance and financial status. Include name and why.
      - strategy: A 1-sentence strategic focus for the next 10 simulation days.
      Respond ONLY with JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || "{}");
      setAnalysis(data);
    } catch (error) {
      console.error("VC AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 rounded-lg">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-headline font-black text-xl text-white uppercase italic tracking-tighter">VC_NEURAL_UPLINK</h3>
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest">Autonomous_Investment_Director_v2.0</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-2">
            {(['conservative', 'balanced', 'aggressive'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setRiskTolerance(mode)}
                className={`py-2 text-[9px] font-black uppercase tracking-widest transition-all ${riskTolerance === mode ? 'bg-secondary text-black ring-2 ring-secondary/50' : 'bg-white/5 text-white/40 hover:bg-white/10 border border-white/5'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={runVCOptimization}
            disabled={loading}
            className="w-full py-4 bg-secondary hover:bg-white text-black font-headline font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(var(--secondary-rgb),0.2)] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Processing_Markets...
              </>
            ) : (
              <>
                <TrendingUp size={18} /> Run_Portfolio_Inference
              </>
            )}
          </button>
        </div>

        {/* Background Grids */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl pointer-events-none" />
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-black/40 border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-secondary" />
                <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Market_Trends_Analysis</h4>
              </div>
              <p className="text-sm text-white/70 leading-relaxed italic">"{analysis.trends}"</p>
            </div>

            <div className="bg-secondary/10 border border-secondary/30 p-5 relative group overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-secondary" />
                <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Strategic_Acquisition_Target</h4>
              </div>
              <div className="mb-4">
                <h5 className="font-headline font-black text-2xl text-white uppercase tracking-tighter italic">{analysis.recommendation?.name}</h5>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Recommended Based On: {riskTolerance} Risk Profile</p>
              </div>
              <p className="text-xs text-on-surface/80 leading-relaxed mb-6">
                {analysis.recommendation?.why}
              </p>
              <button
                onClick={() => onAction(`Initiating acquisition protocol for ${analysis.recommendation?.name}...`)}
                className="w-full py-3 bg-white/10 hover:bg-white hover:text-black border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Send Term Sheet
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-primary" />
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">VC_Directives</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{analysis.strategy}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskList = ({ tasks, onAction }: { tasks: any[]; onAction: (msg: string) => void }) => {
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task.id} className="bg-black/30 border border-white/5 p-4 rounded-lg group hover:border-primary/40 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-headline font-bold text-white text-sm">{task.title}</h4>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">Reward: ${task.reward}</p>
            </div>
            {task.completed ? (
              <span className="text-[10px] font-black text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">Completed</span>
            ) : (
              <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">Active</span>
            )}
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-white/40 bg-white/5">
                  Task Progression
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black inline-block text-primary">
                  {task.progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${task.completed ? 'bg-secondary' : 'bg-primary'}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FinancialHubModal = ({ 
  stats, 
  currentJob, 
  onClose, 
  onAction, 
  history,
  buildingDetails,
  buildingStatuses,
  setActiveView,
  setSelectedMapBuilding,
  activeUpgrades,
  purchasedUpgrades,
  onUpgrade,
  playerData,
  setPlayerData,
  syndicateHires,
  setSyndicateHires,
  day,
  activeCityEvent,
  addNotification
}: { 
  stats: UserStats; 
  currentJob: Job; 
  onClose: () => void; 
  onAction: (msg: any) => void; 
  history: { day: number; value: number }[];
  buildingDetails: any;
  buildingStatuses: Record<string, string>;
  setActiveView: (view: string) => void;
  setSelectedMapBuilding: (id: string | null) => void;
  activeUpgrades: Record<string, any>;
  purchasedUpgrades: Record<string, string[]>;
  onUpgrade: (buildingId: string, upgrade: any) => void;
  playerData: PlayerData;
  setPlayerData?: React.Dispatch<React.SetStateAction<any>>;
  syndicateHires: string[];
  setSyndicateHires: React.Dispatch<React.SetStateAction<string[]>>;
  day: number;
  activeCityEvent: CityEvent | null;
  addNotification?: (msg: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'career' | 'city' | 'vc_lab' | 'financials' | 'syndicate' | 'tax_calc'>('overview');
  const [activeSubTab, setActiveSubTab] = useState('real_estate');
  const [historyTimeframe, setHistoryTimeframe] = useState<'all' | '30d' | '7d'>('all');
  const [activeChartMode, setActiveChartMode] = useState<'net_worth' | 'asset_growth'>('net_worth');
  const [portfolioChartMode, setPortfolioChartMode] = useState<'cost_basis' | 'risk_return'>('cost_basis');
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [showEduOverlay, setShowEduOverlay] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [aiAvoidanceActive, setAiAvoidanceActive] = useState(false);
  const [taxDeductionsClaimed, setTaxDeductionsClaimed] = useState<string[]>([]);
  const [taxOptimizing, setTaxOptimizing] = useState(false);
  const [optimizationConsole, setOptimizationConsole] = useState<string[]>([]);

  // Extract current stock prices to make the stocks investment live and reactive
  const marketHistory: Record<string, number[]> = (playerData as any).marketHistory || {
    'TECH': [150, 162],
    'ENERGY': [80, 78],
    'BIO': [210, 225],
    'FIN': [120, 128],
    'BTC': [62000, 65200]
  };

  const calculateEstimatedTaxes = () => {
    const careerIncome = stats.careerPath === 'Finance' ? 4200 : stats.careerPath === 'Tech' ? 3100 : 2400;
    
    let buildingBonus = 0;
    Object.keys(purchasedUpgrades || {}).forEach(bId => {
      (purchasedUpgrades[bId] || []).forEach(upg => {
        if (upg.includes('Uplink')) buildingBonus += 1500;
        if (upg.includes('Core')) buildingBonus += 2500;
        if (upg.includes('Labs') || upg.includes('Pods')) buildingBonus += 1000;
        if (upg.includes('Mixology') || upg.includes('Stage')) buildingBonus += 600;
        if (upg.includes('Scanners')) buildingBonus += 400;
      });
    });
    
    // Cycle based and annualized
    const cycleIncome = careerIncome + buildingBonus;
    const annualizedIncome = cycleIncome * 12;
    
    // Total gains of portfolio (from investments computed below)
    const valuationStocks = Object.entries(playerData.portfolio || {}).reduce((sum, [sym, ent]) => {
      const arr = marketHistory[sym];
      const pr = arr && arr.length > 0 ? arr[arr.length - 1] : 100;
      return sum + (ent.quantity * pr);
    }, 0);
    const costStocks = Object.entries(playerData.portfolio || {}).reduce((sum, [sym, ent]) => {
      return sum + (ent.quantity * ent.avgCost);
    }, 0);

    const portfolioBaseVal = 850000 + 50000 + 340000 + 150000 + 1200000;
    const portfolioCostVal = 750000 + 49261 + 234482 + 142857 + 500000;
    
    const stocksDelta = Math.max(0, valuationStocks - costStocks);
    const staticGains = Math.max(0, portfolioBaseVal - portfolioCostVal);
    const totalInvestmentGains = staticGains + stocksDelta;
    
    let baseIncomeTaxRate = 0.15;
    let baseCapitalGainsRate = 0.10;
    
    let eventTaxAdjustment = 0;
    let regulationName = "Municipal Credit Protocol v2.5";
    let eventAdjustmentText = "Default flat city surcharge applied on net digital earnings.";
    
    if (activeCityEvent) {
      if (activeCityEvent.id === 'surge') {
        eventTaxAdjustment = 0.05;
        regulationName = "HFT & Data Surge Surcharge Regime";
        eventAdjustmentText = "High density telemetry spikes local trade taxes by +5.0% on and off-grid trades.";
      } else if (activeCityEvent.id === 'boom') {
        eventTaxAdjustment = -0.03;
        regulationName = "Neon Festival Gastronomy Rebate Initiative";
        eventAdjustmentText = "Celebration activities grant all active files a -3.0% offset to boost municipal spending.";
      } else if (activeCityEvent.id === 'maintenance') {
        eventTaxAdjustment = -0.015;
        regulationName = "Grid Maintenance Firmware Credit";
        eventAdjustmentText = "System maintenance downtime results in a -1.5% structural tax reduction buffer.";
      } else if (activeCityEvent.id === 'blackout') {
        eventTaxAdjustment = 0.02;
        regulationName = "Emergency Carbon Surcharge Levy";
        eventAdjustmentText = "Geothermal tap outages impose an emergency +2.0% carbon surcharge to fund diesel back-burners.";
      }
    }
    
    let totalDeductions = 0;
    const deductionsList: { id: string; name: string; val: number; qualified: boolean; desc: string }[] = [];

    const hasRigUpgrade = Object.keys(purchasedUpgrades || {}).length > 0;
    deductionsList.push({
      id: 'implant',
      name: 'Cyber Implants & Rig Write-off',
      val: 0.015,
      qualified: hasRigUpgrade,
      desc: 'Declare server rig cooling and neuro-chips as professional operating tools (-1.5% off tax rate).'
    });

    const hasSyndicate = (syndicateHires || []).length > 0;
    deductionsList.push({
      id: 'syndicate',
      name: 'Syndicate Liaison Safe Harbor',
      val: 0.03,
      qualified: hasSyndicate,
      desc: 'Underground operations protect capital gains and ledger transactions (-3.0% off tax rate).'
    });

    // We can assume they qualify for stock harvesting if active stocks portfolio is set up:
    const hasStockLoss = valuationStocks > 0 && valuationStocks < costStocks;
    deductionsList.push({
      id: 'loss',
      name: 'Capital Loss Harvesting Protocol',
      val: 0.025,
      qualified: hasStockLoss || day > 1, // Let day > 1 act as qualified since market fluctuate
      desc: 'Offset short-term wins by reporting down-trending stocks in portfolio (-2.5% off tax rate).'
    });

    deductionsList.push({
      id: 'hustle',
      name: 'Micro-Hustle Sandbox Credit',
      val: 0.01,
      qualified: true, // Always qualified in current structure due to default consultings
      desc: 'Local incubation credit awarded on verified active/passive side jobs (-1.0% off tax rate).'
    });

    deductionsList.forEach(d => {
      if (d.qualified) totalDeductions += d.val;
    });

    const effectiveIncomeTaxRate = Math.max(0.01, baseIncomeTaxRate + eventTaxAdjustment - totalDeductions - (aiAvoidanceActive ? 0.04 : 0));
    const effectiveCapGainsRate = Math.max(0.01, baseCapitalGainsRate + (eventTaxAdjustment * 0.5) - (totalDeductions * 0.5) - (aiAvoidanceActive ? 0.02 : 0));
    
    const incomeTax = annualizedIncome * effectiveIncomeTaxRate;
    const capGainsTax = totalInvestmentGains * effectiveCapGainsRate;
    const grossTaxes = incomeTax + capGainsTax;
    
    return {
      cycleIncome,
      annualizedIncome,
      totalInvestmentGains,
      baseIncomeTaxRate,
      baseCapitalGainsRate,
      eventTaxAdjustment,
      regulationName,
      eventAdjustmentText,
      totalDeductions,
      deductionsList,
      effectiveIncomeTaxRate,
      effectiveCapGainsRate,
      incomeTax,
      capGainsTax,
      grossTaxes
    };
  };

  const getPrice = (sym: string) => {
    const arr = marketHistory[sym];
    return arr && arr.length > 0 ? arr[arr.length - 1] : 100;
  };

  const stocksValue = Object.entries(playerData.portfolio || {}).reduce((sum, [sym, ent]) => {
    return sum + (ent.quantity * getPrice(sym));
  }, 0);

  const stocksCost = Object.entries(playerData.portfolio || {}).reduce((sum, [sym, ent]) => {
    return sum + (ent.quantity * ent.avgCost);
  }, 0);

  const investments: Investment[] = [
    { 
      id: 're1', 
      type: 'Real Estate', 
      name: 'Sky-Rise Apt 12B', 
      value: '$850K', 
      valueNum: 850000, 
      purchasePrice: 750000, 
      quantity: 1, 
      change: '+13.3%', 
      trend: 'up', 
      details: 'District 4 Luxury Residential. Provides stable long-term capital preservation.' 
    },
    { 
      id: 'st1', 
      type: 'Stocks', 
      name: stocksValue > 0 ? 'Active Cyber Portfolio' : 'Neural-corp Systems', 
      value: stocksValue > 0 ? `$${Math.round(stocksValue).toLocaleString()}` : '$120K', 
      valueNum: stocksValue > 0 ? stocksValue : 120000, 
      purchasePrice: stocksCost > 0 ? stocksCost : 122448, 
      quantity: stocksValue > 0 ? Object.values(playerData.portfolio).reduce((s, x) => s + x.quantity, 0) : 1000, 
      change: stocksValue > 0 ? `${(stocksCost > 0 ? ((stocksValue - stocksCost) / stocksCost * 100) : 0).toFixed(1)}%` : '-2.0%', 
      trend: stocksValue >= stocksCost ? 'up' : 'down', 
      details: stocksValue > 0 ? 'Active holdings synced directly with your trading terminal portfolio.' : 'Core Neural Link Infrastructure. Highly liquid equity index.' 
    },
    { 
      id: 'bo1', 
      type: 'Bonds', 
      name: 'Metro Muni Bonds', 
      value: '$50K', 
      valueNum: 50000, 
      purchasePrice: 49261, 
      quantity: 50, 
      change: '+1.5%', 
      trend: 'up', 
      details: 'Infrastructure Development. Guaranteed low-drawdown sovereign asset.' 
    },
    { 
      id: 'cr1', 
      type: 'Crypto', 
      name: 'OTTO_Coin Ledger', 
      value: '$340K', 
      valueNum: 340000, 
      purchasePrice: 234482, 
      quantity: 5.4, 
      change: '+45.0%', 
      trend: 'up', 
      details: 'Virtual Governance Utility. Extreme beta and volatility matrix.' 
    },
    { 
      id: 'sb1', 
      type: 'Small Biz', 
      name: 'Cyber Coffee Co.', 
      value: '$150K', 
      valueNum: 150000, 
      purchasePrice: 142857, 
      quantity: 1, 
      change: '+5.0%', 
      trend: 'up', 
      details: 'Strategic Intelligence Hub. Steady offline passive cash receipts.' 
    },
    { 
      id: 'vc1', 
      type: 'Venture Capital', 
      name: 'Bio-Gen Startup', 
      value: '$1.2M', 
      valueNum: 1200000, 
      purchasePrice: 500000, 
      quantity: 1, 
      change: '+140.0%', 
      trend: 'up', 
      details: 'Neural Optimization Platform. High seed phase risk with hyper-scaling upside.' 
    },
  ];

  const sideHustles: SideHustle[] = [
    { id: 'sh1', name: 'Automated Research Tool', income: '$1.2K / Mo', incomeNum: 1200, hoursPerWeek: 2, status: 'Passive' },
    { id: 'sh2', name: 'IT Security Consulting', income: '$4.5K / Mo', incomeNum: 4500, hoursPerWeek: 15, status: 'Active' },
  ];

  // Allocation calculation (including actual savings cash to be realistic and educational!)
  // This teaches standard asset allocation splits!
  const allocationData = [
    { name: 'Savings Cash', value: playerData.bank.savings || 5000 },
    ...investments.reduce((acc, inv) => {
      const existing = acc.find(item => item.name === inv.type);
      if (existing) { existing.value += inv.valueNum; } 
      else { acc.push({ name: inv.type, value: inv.valueNum }); }
      return acc;
    }, [] as { name: string; value: number }[])
  ];

  const CHART_COLORS = ['#00e5ff', '#fcb316', '#ff007f', '#00ff66', '#a855f7', '#f97316', '#ffffff'];

  const generateTickerAlerts = () => {
    const alerts: { label: string; value: string; change: string; isHigh: boolean; type: string; category: string }[] = [];

    // Add generic live stock market history prices
    const stockSymbols = ['TECH', 'ENERGY', 'BIO', 'FIN', 'BTC'];
    stockSymbols.forEach(sym => {
      const hist = marketHistory[sym] || [100, 105];
      const cur = hist[hist.length - 1] || 100;
      const prevPrice = hist[hist.length - 2] || cur;
      const diffPct = prevPrice > 0 ? ((cur - prevPrice) / prevPrice * 100) : 0;
      const formattedDiff = (diffPct >= 0 ? '+' : '') + diffPct.toFixed(2) + '%';
      const isUp = diffPct >= 0;
      
      const highVal = Math.max(...hist, cur * 1.05);
      const lowVal = Math.min(...hist, cur * 0.95);

      alerts.push({
        label: `${sym}/USD`,
        value: `$${cur.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        change: formattedDiff,
        isHigh: isUp,
        type: `ATH: $${highVal.toLocaleString(undefined, { maximumFractionDigits: 1 })} | ATL: $${lowVal.toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
        category: 'STOCK_ORBIT'
      });
    });

    // Add user's held asset alerts dynamically!
    investments.forEach(inv => {
      const pctChange = parseFloat(inv.change);
      const isUp = inv.trend === 'up' || pctChange >= 0;
      
      const costBasis = inv.purchasePrice;
      const currentVal = inv.valueNum;
      const highestEst = Math.max(currentVal, costBasis * 1.15);
      const lowestEst = Math.min(currentVal * 0.9, costBasis * 0.95);

      alerts.push({
        label: `${inv.name.toUpperCase()}`,
        value: inv.value,
        change: inv.change,
        isHigh: isUp,
        type: `COST: $${costBasis.toLocaleString()} | EST. ATH: $${highestEst.toLocaleString()}`,
        category: `HELD_${inv.type.toUpperCase().replace(' ', '_')}`
      });
    });

    return alerts;
  };

  const tickerItems = generateTickerAlerts();

  // Retroactive history builder: If they open the app on Day 1, single points look empty and unprofessional.
  // We generate a beautiful backward history of their previous days progression, calculating volatile splits!
  const getEnrichedHistory = () => {
    const currentNW = stats.netWorth || 278500;
    const generated = [];
    const pointsCount = 14;
    
    for (let i = pointsCount; i >= 1; i--) {
      const pastDay = Math.round(day - i);
      if (pastDay < -15) continue;
      
      const stepFactor = 1 + (i * 0.045) + (Math.sin(i * 1.5) * 0.022);
      const generatedNW = Math.round(currentNW / stepFactor);
      
      const movingAvg = Math.round(currentNW / (1 + ((i + 2) * 0.043)));
      
      generated.push({
        day: pastDay <= 0 ? `D-Minus ${Math.abs(pastDay) + 1}` : `Day ${pastDay}`,
        dayNum: pastDay,
        value: generatedNW,
        movingAverage: movingAvg,
        // Individual performance curves
        stocksVal: Math.round(generatedNW * 0.14 * (1 + Math.sin(pastDay * 0.5) * 0.12)),
        cryptoVal: Math.round(generatedNW * 0.11 * (1 + Math.cos(pastDay * 0.8) * 0.35)),
        realEstateVal: Math.round(generatedNW * 0.52),
        savingsCash: Math.round(generatedNW * 0.23 * (1 - Math.sin(pastDay * 0.3) * 0.05))
      });
    }

    // Add active real history days
    history.forEach((h, hIdx) => {
      const priorVal1 = hIdx > 0 ? history[hIdx - 1].value : currentNW * 0.9;
      const priorVal2 = hIdx > 1 ? history[hIdx - 2].value : priorVal1 * 0.9;
      const movingAvg = Math.round((h.value + priorVal1 + priorVal2) / 3);

      generated.push({
        day: `Day ${h.day}`,
        dayNum: h.day,
        value: h.value,
        movingAverage: movingAvg,
        stocksVal: Math.round(h.value * 0.14 * (1 + Math.sin(h.day * 0.5) * 0.05)),
        cryptoVal: Math.round(h.value * 0.11 * (1 + Math.cos(h.day * 0.8) * 0.15)),
        realEstateVal: Math.round(h.value * 0.52),
        savingsCash: Math.round(h.value * 0.23)
      });
    });

    return generated;
  };

  const enrichedHistory = getEnrichedHistory();

  // Filter timeframe
  const filteredHistory = enrichedHistory.filter((item) => {
    if (historyTimeframe === '7d') {
      const maxDay = day;
      return item.dayNum > maxDay - 7;
    }
    if (historyTimeframe === '30d') {
      const maxDay = day;
      return item.dayNum > maxDay - 30;
    }
    return true;
  });

  // Calculate high-fidelity metrics for our educational & strategy panel
  const totalFinancialAssets = allocationData.reduce((sum, item) => sum + item.value, 0);
  const liquidCash = playerData.bank.savings + (playerData.bank.neonCredits / 10); // NeonCredits has a fractional peg
  const liquidityRatioPct = Math.round((liquidCash / totalFinancialAssets) * 100);
  
  // High volatility / High yield assets: Crypto and Venture Capital
  const highBetaVal = (investments.find(i => i.type === 'Crypto')?.valueNum || 0) + (investments.find(i => i.type === 'Venture Capital')?.valueNum || 0);
  const portfolioBetaRatio = Math.round((highBetaVal / totalFinancialAssets) * 100);

  // Growth trajectory estimate based on performance index
  const compoundVelocityIndex = Math.min(100, Math.round((stats.iq * 0.4) + (currentJob.performance * 0.6)));

  const financialConcepts: Record<string, { title: string; score: string; explanation: string; status: 'OPTIMAL' | 'WARN' | 'DIVERSIFIED'; color: string }> = {
    liquidity: {
      title: 'LIQUIDITY_RESERVE_RATIO',
      score: `${liquidityRatioPct}%`,
      explanation: 'Tells you how quickly you can convert assets to cash. Recommended range: 15-30%. Your Cash protects you from sudden negative shock cycles. Higher ratios are safe but lose to inflation speed; lower ratio increases bankruptcy risks during crashes.',
      status: liquidityRatioPct >= 15 && liquidityRatioPct <= 35 ? 'OPTIMAL' : 'WARN',
      color: liquidityRatioPct >= 15 && liquidityRatioPct <= 35 ? 'text-secondary' : 'text-amber-400'
    },
    beta: {
      title: 'VOLATILITY_BETA_EXPOSURE',
      score: `${portfolioBetaRatio}%`,
      explanation: 'Measures exposure in high-beta speculative vectors (Crypto & Seed Venture Startups). Recommended: under 25% for intermediate players. Higher values mean extreme growth potential during expansion run-ups, but fatal vulnerabilities to grid corrections.',
      status: portfolioBetaRatio <= 25 ? 'DIVERSIFIED' : 'WARN',
      color: portfolioBetaRatio <= 25 ? 'text-secondary' : 'text-rose-400'
    },
    velocity: {
      title: 'COMPOUNDING_VELOCITY',
      score: `${compoundVelocityIndex}/100`,
      explanation: 'Derived from IQ brain power and job performance efficiency. Controls the pace of capital progression. Upgrade neural implants at Corporate HQ to permanently raises brain IQ, resulting in hyper-exponential asset yields.',
      status: compoundVelocityIndex >= 70 ? 'OPTIMAL' : 'WARN',
      color: compoundVelocityIndex >= 70 ? 'text-primary' : 'text-neutral-400'
    }
  };

  // Custom tooltips for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0c10] border border-white/15 p-4 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.95)] min-w-[200px] font-mono relative text-left">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />
          
          <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-1.5 mb-2 flex justify-between">
            <span>TELEMETRY_LOG</span>
            <span className="text-secondary font-black">{label}</span>
          </div>
          <div className="space-y-1.5">
            {payload.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center gap-4">
                <span className="text-[10px] text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name === 'value' ? 'Net Worth' : p.name === 'movingAverage' ? 'Trend EMA' : p.name.replace('Val', '')}
                </span>
                <span className="text-[11px] font-black text-white" style={{ color: p.color }}>
                  ${Math.round(p.value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderInvestments = () => {
    const filtered = investments.filter(inv => {
      if (activeSubTab === 'real_estate') return inv.type === 'Real Estate';
      if (activeSubTab === 'stocks') return inv.type === 'Stocks';
      if (activeSubTab === 'bonds') return inv.type === 'Bonds';
      if (activeSubTab === 'crypto') return inv.type === 'Crypto';
      if (activeSubTab === 'small_biz') return inv.type === 'Small Biz';
      if (activeSubTab === 'venture_capital') return inv.type === 'Venture Capital';
      return true;
    });

    // Investment cost-basis vs market valuation data
    const costBasisData = investments.map(inv => ({
      name: inv.type,
      Cost: inv.purchasePrice,
      Valuation: inv.valueNum,
      Yield: Math.round(((inv.valueNum - inv.purchasePrice) / (inv.purchasePrice || 1)) * 100)
    }));

    // Expected yield vs volatility risk structure (CAPM Modern Portfolio Theory Spectrum)
    const riskReturnData = [
      {
        name: 'Savings Cash',
        volatility: 1.5,
        expectedReturn: 3.5,
        weight: Math.round(((playerData.bank.savings || 5000) / totalFinancialAssets) * 100),
        value: playerData.bank.savings || 5000,
        sharpe: 1.25,
        beta: 0.00,
        color: '#ffffff'
      },
      {
        name: 'Bonds',
        volatility: 6.0,
        expectedReturn: 5.2,
        weight: Math.round(((investments.find(i => i.type === 'Bonds')?.valueNum || 50000) / totalFinancialAssets) * 100),
        value: investments.find(i => i.type === 'Bonds')?.valueNum || 50000,
        sharpe: 0.45,
        beta: 0.15,
        color: '#a855f7'
      },
      {
        name: 'Real Estate',
        volatility: 13.5,
        expectedReturn: 12.8,
        weight: Math.round(((investments.find(i => i.type === 'Real Estate')?.valueNum || 850000) / totalFinancialAssets) * 100),
        value: investments.find(i => i.type === 'Real Estate')?.valueNum || 850000,
        sharpe: 0.72,
        beta: 0.55,
        color: '#00ff66'
      },
      {
        name: 'Small Biz',
        volatility: 22.0,
        expectedReturn: 15.5,
        weight: Math.round(((investments.find(i => i.type === 'Small Biz')?.valueNum || 150000) / totalFinancialAssets) * 100),
        value: investments.find(i => i.type === 'Small Biz')?.valueNum || 150000,
        sharpe: 0.56,
        beta: 0.85,
        color: '#f97316'
      },
      {
        name: 'Stocks',
        volatility: 35.0,
        expectedReturn: 19.4,
        weight: Math.round(((stocksValue || 120000) / totalFinancialAssets) * 100),
        value: stocksValue || 120000,
        sharpe: 0.48,
        beta: 1.15,
        color: '#00e5ff'
      },
      {
        name: 'Venture Capital',
        volatility: 75.0,
        expectedReturn: 44.5,
        weight: Math.round(((investments.find(i => i.type === 'Venture Capital')?.valueNum || 1200000) / totalFinancialAssets) * 100),
        value: investments.find(i => i.type === 'Venture Capital')?.valueNum || 1200000,
        sharpe: 0.54,
        beta: 1.85,
        color: '#fcb316'
      },
      {
        name: 'Crypto',
        volatility: 110.0,
        expectedReturn: 60.5,
        weight: Math.round(((investments.find(i => i.type === 'Crypto')?.valueNum || 340000) / totalFinancialAssets) * 100),
        value: investments.find(i => i.type === 'Crypto')?.valueNum || 340000,
        sharpe: 0.51,
        beta: 2.45,
        color: '#ff007f'
      }
    ];

    const CustomRiskReturnTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-[#0b0c10] border border-white/15 p-4 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.95)] min-w-[220px] font-mono relative text-left">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />
            
            <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] border-b border-white/5 pb-1.5 mb-2 flex justify-between">
              <span>ASSET_DYNAMICS_UPLINK</span>
              <span className="font-black" style={{ color: data.color }}>{data.name}</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase tracking-wider">Expected Return:</span>
                <span className="font-black text-white">{data.expectedReturn}% / Cycle</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase tracking-wider">Volatility (Risk σ):</span>
                <span className="font-black text-rose-400">{data.volatility}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase tracking-wider">Sharpe Efficiency:</span>
                <span className="font-black text-primary">{data.sharpe}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase tracking-wider">Market Beta Ratio:</span>
                <span className="font-black text-secondary">{data.beta}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1">
                <span className="text-white/30 uppercase tracking-wider font-bold">Total Weight:</span>
                <span className="font-black text-white">{data.weight}% (${data.value.toLocaleString()})</span>
              </div>
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-8">
        {/* Dynamic Comparison / Frontier Matrix Block */}
        <div className="bg-[#0c0c0e] border border-white/5 p-8 relative overflow-hidden etched-border">
          <TechLines className="opacity-5" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h4 className="font-headline font-black text-xl text-white uppercase italic tracking-tighter">
                {portfolioChartMode === 'cost_basis' ? 'PORTFOLIO_COST_BASIS_MATRIX' : 'MODERN_PORTFOLIO_EFFICIENT_FRONTIER'}
              </h4>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1">
                {portfolioChartMode === 'cost_basis'
                  ? 'Acquisition Cost vs Current Asset Valuation // Performance Metric'
                  : 'CAPM Spectrum Graph // Volatility Risk vs Expected Cycle Returns'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setPortfolioChartMode('cost_basis')}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${portfolioChartMode === 'cost_basis' ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
              >
                Cost_Basis_Index
              </button>
              <button
                onClick={() => setPortfolioChartMode('risk_return')}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${portfolioChartMode === 'risk_return' ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
              >
                Efficient_CAPM_Frontier
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full chart-scan-container">
            <div className={portfolioChartMode === 'cost_basis' ? "chart-scanner-beam-secondary" : "chart-scanner-beam-primary"} />
            <ResponsiveContainer width="100%" height="100%">
              {portfolioChartMode === 'cost_basis' ? (
                <BarChart data={costBasisData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px', uppercase: true, color: 'rgba(255,255,255,0.5)' }} />
                  <Bar dataKey="Cost" fill="#ffffff" radius={[2, 2, 0, 0]} opacity={0.25} />
                  <Bar dataKey="Valuation" fill="#00ff66" radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    type="number" 
                    dataKey="volatility" 
                    name="Volatility" 
                    unit="%" 
                    stroke="rgba(255,255,255,0.3)" 
                    fontSize={9} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 120]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="expectedReturn" 
                    name="Expected Return" 
                    unit="%" 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={9} 
                    axisLine={false} 
                    tickLine={false}
                    domain={[0, 70]}
                  />
                  <ZAxis type="number" dataKey="value" range={[60, 480]} />
                  <Tooltip content={<CustomRiskReturnTooltip />} />
                  <Scatter name="Asset Classes" data={riskReturnData}>
                    {riskReturnData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {portfolioChartMode === 'risk_return' && (
            <div className="mt-4 border-t border-white/5 pt-4 text-[9px] font-mono text-white/40 flex justify-between items-center">
              <span>● DOTS: CAPM asset spectrum // SIZE: relative current capital volume // SHAPE: expected cycle yield vs risk index ratio</span>
              <span className="text-secondary font-black">X-AXIS: SYSTEM VOLATILITY (σ) // Y-AXIS: TARGET YIELD VELOCITY</span>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
          {[
            { id: 'all_assets', label: 'All Assets', icon: <LayoutGrid size={12} /> },
            { id: 'real_estate', label: 'Real Estate', icon: <Home size={12} /> },
            { id: 'stocks', label: 'Stocks', icon: <BarChart3 size={12} /> },
            { id: 'bonds', label: 'Bonds', icon: <Shield size={12} /> },
            { id: 'crypto', label: 'Crypto', icon: <Coins size={12} /> },
            { id: 'small_biz', label: 'Small Biz', icon: <Store size={12} /> },
            { id: 'venture_capital', label: 'Venture Capital', icon: <TrendingUp size={12} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border border-white/5 ${activeSubTab === tab.id ? 'bg-primary text-black border-primary' : 'bg-white/5 text-white/40 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === 'crypto' ? (
          <CryptoPortfolioTracker playerData={playerData} setPlayerData={setPlayerData} onAction={onAction} addNotification={addNotification} day={day} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeSubTab === 'all_assets' ? investments : filtered).map(inv => {
              const hasProfit = inv.valueNum >= inv.purchasePrice;
              const yieldPercent = ((inv.valueNum - inv.purchasePrice) / inv.purchasePrice * 100).toFixed(1);

              return (
                <div key={inv.id} className="bg-black/30 p-6 border border-white/5 group hover:border-primary/40 transition-all relative overflow-hidden etched-border flex flex-col justify-between">
                  <TechLines className="opacity-5" />
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-headline font-black text-lg text-white italic uppercase tracking-tighter leading-none">{inv.name}</h4>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1.5">{inv.type} // {inv.id.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-white tracking-tighter leading-none">{inv.value}</p>
                        <p className={`text-[9px] font-black flex items-center justify-end gap-0.5 mt-1 ${hasProfit ? 'text-secondary' : 'text-rose-500'}`}>
                          {hasProfit ? <ArrowUpRight size={8} /> : <TrendingDown size={8} />}
                          {hasProfit ? '+' : ''}{yieldPercent}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-4 bg-white/[0.01] p-3 border border-white/5">
                      <div>
                        <span className="text-[8px] text-white/20 font-black uppercase tracking-widest block mb-0.5">Asset Cost</span>
                        <span className="font-mono text-xs text-white/60">${inv.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/20 font-black uppercase tracking-widest block mb-0.5">Yield Speed</span>
                        <span className={`font-mono text-xs ${hasProfit ? 'text-secondary' : 'text-rose-400'}`}>
                          {hasProfit ? '+' : ''}{(Math.random() * 5 + 4).toFixed(1)}% / Cycle
                        </span>
                      </div>
                    </div>

                    {inv.type === 'Venture Capital' && (
                      <div className="mb-4 bg-white/[0.01] p-3 border border-white/5 relative overflow-hidden rounded-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] text-white/30 font-black uppercase tracking-widest block">HISTORICAL VENTURE GROWTH</span>
                          <span className="text-[8px] font-mono text-secondary font-black">{inv.change}</span>
                        </div>
                        <div className="h-10 w-full">
                          <VentureSparkline 
                            data={inv.id === 'vc1' ? [500000, 620000, 750000, 920000, 1080000, 1200000] : [100, 110, 130, 120, 145, 160]} 
                            color={hasProfit ? '#00fdc1' : '#ff716a'} 
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-white/50 leading-relaxed font-normal mb-6 italic">"{inv.details}"</p>
                  </div>
                  
                  <div>
                    <MarketAIAnalysis investment={inv} stats={stats} />
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => onAction(`Deploying capital injection for ${inv.name}...`)} className="flex-1 py-2.5 bg-primary/5 hover:bg-primary hover:text-black text-[9px] font-black uppercase tracking-widest transition-all border border-primary/20 etched-border">
                        Inject_Capital
                      </button>
                      <button onClick={() => onAction(`Initiating asset liquidation protocol for ${inv.name}`)} className="px-4 py-2.5 border border-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-black text-[9px] font-black uppercase tracking-widest transition-all etched-border">
                        Liquidate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderCareer = () => (
    <div className="space-y-8">
      <div className="bg-black/40 p-8 border-l-4 border-secondary relative overflow-hidden etched-border animate-fade-in">
        <TechLines />
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-neon">
            <Briefcase size={32} />
          </div>
          <div>
            <h3 className="font-headline font-black text-3xl text-white uppercase italic tracking-tighter leading-none">{currentJob.title}</h3>
            <p className="text-[10px] text-secondary font-black tracking-[0.5em] uppercase mt-2">{currentJob.company} // DEPT_STRAT_04</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="p-5 bg-white/5 border border-white/5 etched-border">
            <span className="text-[9px] text-white/20 font-black tracking-[0.4em] uppercase block mb-2">ANNUAL_CREDIT_FLOW</span>
            <span className="font-headline text-3xl font-black text-white italic tracking-tighter">{currentJob.salary}</span>
          </div>
          <div className="p-5 bg-white/5 border border-white/5 etched-border">
            <span className="text-[9px] text-white/20 font-black tracking-[0.4em] uppercase block mb-2">CORE_EFFICIENCY</span>
            <div className="flex items-center gap-3">
              <span className="font-headline text-3xl font-black text-secondary italic tracking-tighter">{currentJob.performance}%</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${currentJob.performance}%` }} className="h-full bg-secondary shadow-neon" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-secondary/5 border border-secondary/20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Info size={16} className="text-secondary animate-pulse" />
            <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">{currentJob.nextPromotion}</span>
          </div>
          <button onClick={() => onAction('Submitting performance review dossier...')} className="px-4 py-2 bg-secondary/20 hover:bg-secondary text-secondary hover:text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-secondary/40 etched-border">Request Review</button>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase mb-4">SIDE_HUSTLE_MATRIX</h4>
        <div className="space-y-4">
          {sideHustles.map(sh => (
            <div key={sh.id} className="flex items-center justify-between p-6 bg-black/30 border border-white/5 group hover:border-secondary/40 transition-all etched-border">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${sh.status === 'Active' ? 'bg-secondary shadow-neon animate-pulse' : 'bg-white/10'}`} />
                <div>
                  <p className="text-base font-black text-white uppercase tracking-tight">{sh.name}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1">{sh.status} • {sh.hoursPerWeek}H/WK // PASSIVE_FLOW_{sh.id.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-secondary tracking-tighter">{sh.income}</p>
                <button onClick={() => onAction(`Optimizing ${sh.name} throughput...`)} className="text-[9px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all">Adjust_Config</button>
              </div>
            </div>
          ))}
          <button onClick={() => onAction('Scanning dark-web node for opportunities...')} className="w-full py-6 border border-dashed border-white/10 text-[10px] font-black text-white/20 hover:text-white hover:border-white/20 uppercase tracking-[0.4em] transition-all etched-border mt-4">
            + DEPLOY_NEW_HUSTLE_NODE
          </button>
        </div>
      </div>
      <div className="mt-12">
        <h4 className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase mb-6">OPERATIONAL_DIRECTIVES</h4>
        <TaskList tasks={playerData.tasks} onAction={onAction} />
      </div>
    </div>
  );

  const renderFinancials = () => {
    const totalAllocationValue = allocationData.reduce((sum, item) => sum + item.value, 0);

    const filteredTransactions = (playerData.bank.transactionHistory || []).filter(item => {
      if (historyTimeframe === 'all') return true;
      const transDate = new Date(item.date);
      const now = new Date();
      const diffMs = now.getTime() - transDate.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (historyTimeframe === '7d') return diffDays <= 7;
      if (historyTimeframe === '30d') return diffDays <= 30;
      return true;
    });

    const taxReport = calculateEstimatedTaxes();

    return (
      <div className="space-y-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 p-8 border-b-2 border-red-500/20 relative group hover:border-red-500/40 transition-all etched-border">
            <TechLines className="opacity-10" />
            <div className="flex items-center gap-3 mb-4">
              <Receipt size={16} className="text-red-400" />
              <span className="text-[10px] text-red-400/60 font-black tracking-[0.5em] uppercase">SYSTEM_TAX_ESTIMATE</span>
            </div>
            <span className="font-headline text-4xl font-black text-white tracking-tighter italic">${(taxReport.grossTaxes / 1000).toFixed(1)}K</span>
            <p className="text-[10px] text-white/30 mt-3 uppercase tracking-[0.3em]">
              EF_RATE: {Math.round(taxReport.effectiveIncomeTaxRate * 100)}% INC // {Math.round(taxReport.effectiveCapGainsRate * 100)}% CAPG
            </p>
            <button onClick={() => {
              setActiveTab('tax_calc');
              onAction('Opening ADVANCED_TAX_SIEVE_MATRIX...');
            }} className="mt-6 w-full py-3 bg-red-500/10 hover:bg-rose-500 hover:text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-red-500/20 etched-border">Optimize_Liability_Matrix</button>
          </div>
          <div className="bg-black/30 p-8 border-b-2 border-primary/20 relative group hover:border-primary/40 transition-all etched-border">
            <TechLines className="opacity-10" />
            <div className="flex items-center gap-3 mb-4">
              <Globe size={16} className="text-primary" />
              <span className="text-[10px] text-primary/60 font-black tracking-[0.5em] uppercase">GLOBAL_NET_WORTH_RANK</span>
            </div>
            <span className="font-headline text-4xl font-black text-white tracking-tighter italic">${(stats.netWorth / 1000000).toFixed(2)}M</span>
            <p className="text-[10px] text-secondary font-black mt-3 uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp size={10} /> +4.2%_DELTA_THIS_CYCLE
            </p>
            <button onClick={() => onAction('Generating wealth manifestation dossier...')} className="mt-6 w-full py-3 bg-primary/10 hover:bg-primary hover:text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-primary/20 etched-border">Export_Wealth_Dossier</button>
          </div>
        </div>

        {/* Dynamic Area Performance Analytics */}
        <div className="bg-black/40 p-8 border border-white/5 relative etched-border">
          <TechLines />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h3 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">Performance_Trend_Analytics</h3>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] mt-1">Growth Velocity // Multi-Stage Expansion Analysis</p>
            </div>
            <div className="flex gap-3">
              {(['all', '30d', '7d'] as const).map(tf => (
                <button 
                  key={tf}
                  onClick={() => setHistoryTimeframe(tf)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all border ${historyTimeframe === tf ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full chart-scan-container">
            <div className="chart-scanner-beam-primary" />
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredHistory}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbd12d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#fbd12d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#fbd12d" strokeWidth={3} fillOpacity={1} fill="url(#colorMain)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction log */}
        <div className="bg-black/40 border border-white/5 relative overflow-hidden etched-border">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <History size={18} className="text-primary" />
              <h3 className="font-headline font-black text-xl text-white uppercase italic tracking-tighter">TRANS_HISTORY_LOG</h3>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-widest">
              <span>{filteredTransactions.length} ENTRIES_MATCHED</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Directive</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Credit_Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-[10px] text-white/40 tracking-tighter">{tx.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-bold text-white/80 group-hover:text-primary transition-colors uppercase italic">{tx.description || 'System interaction node'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                          tx.type === 'withdrawal' || tx.type === 'purchase' ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono text-sm font-black ${
                          tx.type === 'withdrawal' || tx.type === 'purchase' ? 'text-red-400' : 'text-primary'
                        }`}>
                          {tx.type === 'withdrawal' || tx.type === 'purchase' ? '-' : '+'}${tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Activity size={32} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">No_Historical_Data_Found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-white/[0.01] border-t border-white/5 flex justify-center">
             <button className="text-[9px] font-black text-white/20 hover:text-white uppercase tracking-[0.3em] transition-all">EXPAND_FULL_LOG_DAEMON</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 overflow-hidden bg-black/75 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 25 }}
        className="w-full h-full max-w-7xl bg-[#070708] border border-white/10 flex flex-col relative overflow-hidden etched-border shadow-[0_0_120px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <TechLines />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary shadow-neon" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,5px_100%] pointer-events-none opacity-15" />
        
        {/* Modal Top Bar */}
        <div className="p-10 pb-6 flex justify-between items-start relative z-10 border-b border-white/5">
          <div className="flex gap-8 items-center">
            <div className="relative">
              <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center p-2">
                <Landmark className="text-glow-primary text-primary" size={32} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary animate-ping rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-neon" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">SYSTEM_FINANCE_v4.5.1</span>
              </div>
              <h2 className="font-headline font-black text-5xl text-white uppercase italic tracking-tighter leading-none">
                FINANCIAL_<span className="text-primary drop-shadow-[0_0_15px_rgba(251,209,45,0.4)]">HUB</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEduOverlay(!showEduOverlay)}
              className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all border etched-border flex items-center gap-2 ${showEduOverlay ? 'bg-secondary text-black border-secondary' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border-white/10'}`}
            >
              <Info size={12} /> Education_Matrix
            </button>
            <button 
              onClick={onClose}
              className="p-4 bg-white/5 border border-white/10 text-white/40 hover:bg-white hover:text-black transition-all group etched-border"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Navigation Sidebar/Rail */}
        <div className="flex flex-1 overflow-hidden h-full">
          <div className="w-72 bg-black/40 backdrop-blur-[12px] border-r border-white/5 flex flex-col p-6 gap-2 shrink-0">
            {[
              { id: 'overview', label: 'Dashboard', icon: <Activity className="text-primary" /> },
              { id: 'investments', label: 'Portfolio', icon: <TrendingUp className="text-secondary" /> },
              { id: 'career', label: 'Career_Link', icon: <Briefcase className="text-tertiary" /> },
              { id: 'city', label: 'City_Assets', icon: <Building2 className="text-white" /> },
              { id: 'vc_lab', label: 'VC_Incubator', icon: <FlaskConical className="text-secondary" /> },
              { id: 'syndicate', label: 'Syndicate_Org', icon: <Users className="text-primary animate-pulse" /> },
              { id: 'financials', label: 'Flow_Matrix', icon: <PieChart className="text-primary" /> },
              { id: 'tax_calc', label: 'Tax_Sieve', icon: <Percent className="text-rose-400" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-4 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative group overflow-hidden etched-border ${
                  activeTab === tab.id ? 'text-white bg-white/5 border-white/20 shadow-inner' : 'text-white/35 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <div className={`absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform ${activeTab === tab.id ? 'translate-x-0' : ''}`} />
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="nav-glow" className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-neon" />
                )}
              </button>
            ))}

            {/* Micro-Metrics Section inside Railroad panel for ultimate density & aesthetic pairing */}
            <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
              <span className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-black block">SYSTEM_VITALS</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/[0.01] p-3 border border-white/5 rounded-sm">
                  <span className="text-[8px] text-white/20 font-mono block">Sync Load</span>
                  <span className="font-mono text-xs text-secondary font-black">98.2%</span>
                </div>
                <div className="bg-white/[0.01] p-3 border border-white/5 rounded-sm">
                  <span className="text-[8px] text-white/20 font-mono block">Node Link</span>
                  <span className="font-mono text-xs text-primary font-black">ESTABLISHED</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 bg-white/[0.02] border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed">
              <Activity size={12} className="mb-3 text-secondary animate-pulse" />
              NEURAL_STATUS: OPTIMAL<br />
              UPLINK_STRENGTH: 98%<br />
              ENCRYPTION: AES-4096
            </div>
          </div>

          {/* Main Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative font-sans">
            
            {/* Interactive Educational Explanation Drawer Overlay */}
            <AnimatePresence>
              {showEduOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#0b0c0f] border border-secondary/30 p-8 mb-8 relative z-50 text-left overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rotate-45 pointer-events-none" />
                  <h3 className="font-headline font-black text-xl text-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                    <Info size={18} className="text-secondary" /> CORE_FINANCIAL_LAWS_&-FORMULAS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/[0.02] p-5 border border-white/5">
                      <h4 className="font-mono text-xs font-black text-white uppercase tracking-wider mb-2">Compound Growth Equation</h4>
                      <div className="bg-black/40 p-3 rounded font-mono text-xs text-secondary mb-3 text-center">
                        A = P × (1 + r/n)ᵀ
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Compounding interest is the 8th wonder of the world. Each day cycle multiplies the previous day's dividends. If you reinvest, your interest earns interest, scaling exponentially.
                      </p>
                    </div>
                    <div className="bg-white/[0.02] p-5 border border-white/5">
                      <h4 className="font-mono text-xs font-black text-white uppercase tracking-wider mb-2">Rule of 72 Formulation</h4>
                      <div className="bg-black/40 p-3 rounded font-mono text-xs text-secondary mb-3 text-center">
                        Years to Double ≈ 72 / Interest Rate
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        To estimate how fast your assets double, divide 72 by your passive yield rate. A venture offering 15% yield will double your hard-earned credits in roughly 4.8 simulated day cycles!
                      </p>
                    </div>
                    <div className="bg-white/[0.02] p-5 border border-white/5">
                      <h4 className="font-mono text-xs font-black text-white uppercase tracking-wider mb-2">The Asset Allocation Rule</h4>
                      <div className="bg-black/40 p-3 rounded font-mono text-xs text-secondary mb-3 text-center">
                        Speculative + Core + Liquidity = NetWorth
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Diversification is mandatory. Putting everything in Crypto increases risk of full wipeouts. Hold a mix of Real Estate (stable), Stocks/Bonds (medium), and Savings (immediate liquidity).
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEduOverlay(false)} 
                    className="mt-6 px-4 py-2 bg-secondary/10 hover:bg-secondary hover:text-black font-mono text-[9px] font-black uppercase tracking-widest transition-all border border-secondary/30"
                  >
                    DISMISS_MATRIX
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-12 gap-10 text-left">
                    <div className="col-span-12 lg:col-span-8 space-y-10">
                      
                      {/* Interactive Stat Cards with hover definitions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { 
                            id: 'nw', 
                            label: 'Total_Equity', 
                            value: `$${stats.netWorth.toLocaleString()}`, 
                            trend: '+14.2% YoY Velocity', 
                            icon: <Wallet />, 
                            color: 'text-primary', 
                            desc: 'Total worth sum of your Cash, Bonds, Stocks, Crypto, and real estate assets minus liabilities.' 
                          },
                          { 
                            id: 'ns', 
                            label: 'Neural_Sync', 
                            value: `${stats.happiness}%`, 
                            trend: 'Fatigue -2% Daily Grinds', 
                            icon: <Activity />, 
                            color: 'text-secondary', 
                            desc: 'Your mental battery index. Slows down daily. Go to the Gym or Bar to recharge and optimize compounding speed.' 
                          },
                          { 
                            id: 'mr', 
                            label: 'Market_Rep', 
                            value: `Tier ${stats.level}`, 
                            trend: `${Math.round(stats.netWorth % 50000)} / $50,000 to Level Up`, 
                            icon: <Target />, 
                            color: 'text-tertiary', 
                            desc: 'Representing your leverage power and prestige in the finance sector. High Tiers unlocked via total accrued wealth.' 
                          },
                          { 
                            id: 'tax', 
                            label: 'Tax_Sieve', 
                            value: `$${(calculateEstimatedTaxes().grossTaxes / 1000).toFixed(1)}K`, 
                            trend: `Eff Rate: ${Math.round(calculateEstimatedTaxes().effectiveIncomeTaxRate * 100)}%`, 
                            icon: <Percent />, 
                            color: 'text-rose-400', 
                            desc: 'Calculated annual liability based on career path, active node yields, investment gains, and current city regulations. Click on optimization menu to bypass.' 
                          },
                        ].map((stat, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedMetric(selectedMetric === stat.id ? null : stat.id)}
                            className={`bg-white/5 border p-8 pt-10 relative group overflow-hidden cursor-pointer transition-all etched-border ${selectedMetric === stat.id ? 'border-primary/65 bg-white/10' : 'border-white/10 hover:border-white/20'}`}
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity">
                              {stat.icon}
                            </div>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] block mb-3">{stat.label}</span>
                            <div className={`text-4xl font-headline font-black tracking-tighter mb-2 italic ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full animate-pulse ${stat.color.replace('text-', 'bg-')}`} />
                              {stat.trend}
                            </div>
                            <AnimatePresence>
                              {selectedMetric === stat.id && (
                                <motion.p 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="text-[10px] text-white/50 border-t border-white/5 pt-3 mt-3 leading-relaxed"
                                >
                                  {stat.desc}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Performance Trend Analytics Block */}
                      <div className="bg-black/30 border border-white/5 p-10 relative overflow-hidden etched-border">
                        <TechLines />
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                          <div>
                            <h3 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">
                              {activeChartMode === 'net_worth' ? 'Wealth_Expansion_Matrix' : 'Asset_Class_Outflow_Index'}
                            </h3>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] mt-1.5">
                              {activeChartMode === 'net_worth' ? 'Historical Growth Rate // Integrated Neural Compounding' : 'Outflow yield velocity index per asset class'}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                            {/* Timeframe selector row */}
                            <div className="flex gap-2">
                              {(['7d', '30d', 'all'] as const).map(tf => (
                                <button 
                                  key={tf}
                                  onClick={() => setHistoryTimeframe(tf)}
                                  className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all border ${historyTimeframe === tf ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                                >
                                  {tf === 'all' ? 'ALL_TIME' : tf.toUpperCase()}
                                </button>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {/* Toggle Chart Mode */}
                              <button 
                                onClick={() => setActiveChartMode('net_worth')}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${activeChartMode === 'net_worth' ? 'border-primary text-primary bg-primary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                              >
                                Net_Worth_EMA
                              </button>
                              <button 
                                onClick={() => setActiveChartMode('asset_growth')}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${activeChartMode === 'asset_growth' ? 'border-secondary text-secondary bg-secondary/10 shadow-neon' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                              >
                                Asset_Yields
                              </button>
                              {/* Toggle Moving Average indicator */}
                              <button 
                                onClick={() => setShowMovingAverage(!showMovingAverage)}
                                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${showMovingAverage ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-white/10 text-white/20 hover:border-white/20'}`}
                                title="Exponential Moving Average of Net Worth"
                              >
                                EMA_Trend
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="h-[380px] w-full chart-scan-container">
                          <div className={activeChartMode === 'net_worth' ? "chart-scanner-beam-primary" : "chart-scanner-beam-secondary"} />
                          <ResponsiveContainer width="100%" height="100%">
                            {activeChartMode === 'net_worth' ? (
                              <AreaChart data={filteredHistory}>
                                <defs>
                                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbd12d" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#fbd12d" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Area type="monotone" dataKey="value" stroke="#fbd12d" strokeWidth={3} fill="url(#grad1)" />
                                {showMovingAverage && (
                                  <Line type="monotone" dataKey="movingAverage" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Trend EMA" />
                                )}
                              </AreaChart>
                            ) : (
                              <LineChart data={filteredHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                                <Tooltip content={<CustomChartTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                <Line type="monotone" dataKey="stocksVal" stroke="#00e5ff" strokeWidth={2} dot={false} name="Stocks" />
                                <Line type="monotone" dataKey="cryptoVal" stroke="#ff007f" strokeWidth={2} dot={false} name="Crypto" />
                                <Line type="monotone" dataKey="realEstateVal" stroke="#00ff66" strokeWidth={2} dot={false} name="Real Estate" />
                                <Line type="monotone" dataKey="savingsCash" stroke="#ffffff" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Cash Reserve" />
                              </LineChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Portfolio Allocation Breakdown & Strategy panel */}
                    <div className="col-span-12 lg:col-span-4 space-y-10">
                      
                      {/* Portfolio Allocation Pie Chart */}
                      <div className="bg-white/[0.02] border border-white/10 p-10 etched-border h-full flex flex-col justify-between">
                        <div>
                          <h3 className="font-headline font-black text-3xl text-white uppercase italic tracking-tighter mb-2">Portfolio_Mix</h3>
                          <p className="text-[9px] text-white/35 uppercase tracking-[0.3em] mb-8">Optimal asset allocation threshold ratio</p>
                          <div className="h-[250px] mb-8 relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={allocationData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={6} dataKey="value">
                                  {allocationData.map((e, index) => <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />)}
                                </Pie>
                                <Tooltip content={<CustomChartTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Net Worth</span>
                              <span className="text-xl font-bold font-headline text-white italic tracking-tighter">${stats.netWorth.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {allocationData.map((item, i) => {
                            const ratio = Math.round((item.value / totalFinancialAssets) * 100);
                            return (
                              <div key={i} className="flex items-center justify-between group border-b border-white/5 pb-2 last:border-b-0">
                                <div className="flex items-center gap-3">
                                  <div className="w-2.5 h-2.5 rounded-full shadow-neon" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                  <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{item.name}</span>
                                </div>
                                <div className="text-right font-mono text-sm font-black text-white italic tracking-tighter">
                                  <span>${(item.value / 1000).toFixed(0)}K</span>
                                  <span className="text-[9px] text-white/20 ml-2 font-normal">({ratio}%)</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Real Educational Metrics Diagnostic Block */}
                      <div className="bg-black/40 border border-white/5 p-8 relative overflow-hidden etched-border">
                        <TechLines className="opacity-5" />
                        <h4 className="text-[11px] font-black text-white/20 tracking-[0.4em] uppercase mb-6 flex items-center gap-2">
                          <Activity size={12} className="animate-pulse" /> STRATEGY_DIAGNOSTICS
                        </h4>
                        
                        <div className="space-y-6 text-left">
                          {Object.entries(financialConcepts).map(([key, item]) => (
                            <div key={key} className="border-b border-white/5 pb-4 last:border-0">
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-[10px] font-black tracking-widest uppercase text-white/70">{item.title}</div>
                                <div className={`font-mono font-black text-base ${item.color}`}>{item.score}</div>
                              </div>
                              <p className="text-[10px] text-white/40 leading-relaxed font-normal">{item.explanation}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[8px] text-white/35 font-mono uppercase">Status:</span>
                                <span className={`px-2 py-0.5 text-[7px] font-black uppercase rounded ${item.status === 'OPTIMAL' ? 'bg-secondary/15 text-secondary' : 'bg-rose-500/15 text-rose-400'}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
                {activeTab === 'investments' && renderInvestments()}
                {activeTab === 'career' && renderCareer()}
                {activeTab === 'financials' && renderFinancials()}
                {activeTab === 'tax_calc' && (
                  <div className="space-y-10 text-left animate-fade-in">
                    <div>
                      <h3 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter">TAX_SIEVE_DECIPHER</h3>
                      <p className="text-[10px] text-rose-400 font-black tracking-[0.5em] uppercase mt-2 flex items-center gap-3">
                        <Activity size={14} className="animate-pulse" /> Advanced Municipal Sieve Protocol // ONLINE
                      </p>
                    </div>

                    <div className="grid grid-cols-12 gap-10">
                      {/* Left: Dynamic Line-item audit & event influence */}
                      <div className="col-span-12 lg:col-span-12 xl:col-span-7 space-y-8">
                        
                        {/* City Regulation & Event Adjuster */}
                        <div className="bg-black/30 p-8 border border-white/5 relative etched-border">
                          <TechLines className="opacity-10" />
                          <div className="flex items-center gap-3 mb-4">
                            <Percent size={18} className="text-rose-400" />
                            <h4 className="text-[12px] font-black text-rose-400 uppercase tracking-widest">Active_City_Reg_Status</h4>
                          </div>
                          
                          <div className="p-4 bg-white/5 border border-white/5 flex flex-col justify-between mb-4">
                            <span className="text-[9px] text-white/35 uppercase tracking-widest font-mono">Current Framework</span>
                            <span className="font-headline text-lg font-black text-white uppercase italic mt-1">{calculateEstimatedTaxes().regulationName}</span>
                          </div>
                          
                          <p className="text-xs text-white/60 leading-relaxed font-normal mb-4">
                            {calculateEstimatedTaxes().eventAdjustmentText}
                          </p>

                          {calculateEstimatedTaxes().eventTaxAdjustment !== 0 ? (
                            <div className={`p-3 text-[10px] uppercase font-black tracking-widest flex items-center gap-2 ${calculateEstimatedTaxes().eventTaxAdjustment > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-secondary/15 text-secondary'}`}>
                              <span className="w-2 h-2 rounded-full animate-ping bg-current" />
                              Active Delta: {calculateEstimatedTaxes().eventTaxAdjustment > 0 ? '+' : ''}{calculateEstimatedTaxes().eventTaxAdjustment * 100}% on Base Municipal Rates
                            </div>
                          ) : (
                            <div className="p-3 bg-white/5 text-[10px] text-white/30 uppercase font-black tracking-widest">
                              No active variable adjustments mapped in this day cycle.
                            </div>
                          )}
                        </div>

                        {/* Deductions qualification list */}
                        <div className="bg-black/30 p-8 border border-white/5 relative etched-border">
                          <div className="flex items-center gap-3 mb-6">
                            <Shield size={18} className="text-primary" />
                            <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Qualified_Corporate_Offsets</h4>
                          </div>

                          <div className="space-y-4">
                            {calculateEstimatedTaxes().deductionsList.map((d) => (
                              <div key={d.id} className={`p-4 border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${d.qualified ? 'bg-secondary/5 border-secondary/20' : 'bg-white/[0.01] border-white/5 opacity-50'}`}>
                                <div className="max-w-md">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-sans text-xs font-black text-white uppercase">{d.name}</span>
                                    <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded ${d.qualified ? 'bg-secondary/20 text-secondary' : 'bg-white/10 text-white/30'}`}>
                                      {d.qualified ? 'QUALIFIED' : 'LOCKED'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-white/40 leading-relaxed font-normal">{d.desc}</p>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                  <span className={`font-mono text-sm font-black italic ${d.qualified ? 'text-secondary' : 'text-white/20'}`}>
                                    -{d.val * 100}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Black Hat AI avoidance console */}
                        <div className="bg-black/40 p-8 border border-red-500/10 relative overflow-hidden etched-border">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                              <Cpu size={18} className="text-red-400 animate-pulse" />
                              <h4 className="text-[12px] font-black text-white uppercase tracking-widest">Black_Hat_Sieve_Offset_OS</h4>
                            </div>
                            <span className="text-[8px] text-red-400 font-mono tracking-widest uppercase px-2 py-0.5 bg-red-500/10 rounded">BETA_SUBROUTINE</span>
                          </div>

                          <p className="text-xs text-white/60 leading-relaxed mb-6">
                            Install cybernetic proxy servers in autonomous sectors to safely route stock wins and ledger trades. Siphons <span className="text-red-400 font-black">-4.0% off tax rates</span> at the cost of a temporary processing fee of <span className="text-white font-black">$5,000</span>.
                          </p>

                          <div className="flex gap-4 items-center">
                            <button
                              onClick={() => {
                                if (aiAvoidanceActive) {
                                  setAiAvoidanceActive(false);
                                  onAction('Deactivating Black Hat Sieve Protocol...');
                                  setOptimizationConsole([]);
                                } else {
                                  if (playerData.bank.savings < 5000) {
                                    onAction('INSUFFICIENT_CREDITS: Cannot route tax nodes without $5,000 security reserve.');
                                    return;
                                  }
                                  setTaxOptimizing(true);
                                  onAction('Initiating cyber proxy network setup...');
                                  
                                  const steps = [
                                    '[INIT] Spawning asynchronous daemon processes...',
                                    '[OK] Tuning proxy relay in orbital sector 9...',
                                    '[OK] Tunneling ledger hashes via Ziggurat servers...',
                                    '[OK] Obfuscating transaction signatures with random salt...',
                                    '[SUCCESS] Sieve Subroutine Activated: -4.0% effective tax reduction applied.'
                                  ];
                                  
                                  let currentStep = 0;
                                  const interval = setInterval(() => {
                                    if (currentStep < steps.length) {
                                      setOptimizationConsole(prev => [...prev, steps[currentStep]]);
                                      currentStep++;
                                    } else {
                                      clearInterval(interval);
                                      setTaxOptimizing(false);
                                      setAiAvoidanceActive(true);
                                    }
                                  }, 600);
                                }
                              }}
                              disabled={taxOptimizing}
                              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border etched-border ${aiAvoidanceActive ? 'bg-red-500 text-black border-red-500 hover:bg-neutral-800 hover:text-white' : 'bg-red-500/10 hover:bg-red-500 hover:text-black text-red-300 border-red-500/20'}`}
                            >
                              {taxOptimizing ? 'OBFUSCATING...' : aiAvoidanceActive ? 'TERMINATE_RE-ROUTE' : 'ACTIVATE_AI_SIEVE_($5,000)'}
                            </button>

                            {aiAvoidanceActive && (
                              <span className="text-[10px] text-secondary font-black tracking-widest animate-pulse uppercase">🛡️ ACTIVE_BYPASS_ONLINE</span>
                            )}
                          </div>

                          {optimizationConsole.length > 0 && (
                            <div className="mt-6 bg-black p-4 border border-white/5 font-mono text-[9px] text-red-400 space-y-1.5 h-36 overflow-y-auto rounded shadow-inner custom-scrollbar">
                              {optimizationConsole.map((line, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <span className="text-white/20 select-none">[{idx + 1}]</span>
                                  <span>{line}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Right: Consolidated Tax Report Summary */}
                      <div className="col-span-12 lg:col-span-12 xl:col-span-5 space-y-8">
                        <div className="bg-[#0b0c10] border border-white/10 p-10 relative overflow-hidden etched-border">
                          <TechLines className="opacity-10" />
                          <h4 className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase mb-8">SIEVE_RECONCILIATION_REPORT</h4>
                          
                          <div className="space-y-6">
                            
                            <div>
                              <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Gross Annualized Income</span>
                              <div className="flex justify-between items-baseline">
                                <span className="font-headline text-2xl font-black text-white italic tracking-tighter">${calculateEstimatedTaxes().annualizedIncome.toLocaleString()}</span>
                                <span className="text-xs font-mono text-white/40">(${calculateEstimatedTaxes().cycleIncome.toLocaleString()} / cycle)</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                              <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Paper Capital Gains</span>
                              <span className="font-headline text-2xl font-black text-white italic tracking-tighter">${calculateEstimatedTaxes().totalInvestmentGains.toLocaleString()}</span>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                              <span className="text-[9px] text-white/30 uppercase tracking-widest block mb-1.5">Effective Sieve Rate</span>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-headline text-3xl font-black text-rose-400 italic tracking-tighter">{Math.round(calculateEstimatedTaxes().effectiveIncomeTaxRate * 100)}%</span>
                                <span className="text-[10px] text-white/30 font-mono">Base: {calculateEstimatedTaxes().baseIncomeTaxRate * 100}%</span>
                              </div>
                              <div className="h-2 bg-white/5 w-full overflow-hidden mb-1">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${calculateEstimatedTaxes().effectiveIncomeTaxRate * 100}%` }} 
                                  className="h-full bg-rose-500 shadow-neon" 
                                />
                              </div>
                              {calculateEstimatedTaxes().totalDeductions > 0 && (
                                <span className="text-[9px] text-secondary font-black uppercase tracking-widest block text-right mt-1.5">
                                  -{Math.round(calculateEstimatedTaxes().totalDeductions * 100)}% active offsets applied!
                                </span>
                              )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex flex-col justify-between">
                              <span className="text-[10px] text-rose-400/60 font-black tracking-[0.4em] uppercase block mb-1">TOTAL_ESTIMATED_TAXES</span>
                              <span className="font-headline text-5xl font-black text-white tracking-tighter italic drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                                ${calculateEstimatedTaxes().grossTaxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-[9px] text-white/30 uppercase tracking-widest mt-2 block italic">Consolidated cyber tax obligation.</span>
                            </div>

                            <button 
                              onClick={() => {
                                onAction(`Consolidated return filed! Locked in dynamic rate of ${Math.round(calculateEstimatedTaxes().effectiveIncomeTaxRate * 100)}% avoiding standard higher tiers!`);
                              }} 
                              className="w-full py-4 bg-rose-500/10 hover:bg-rose-500 hover:text-black hover:shadow-neon text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-rose-500/20 mt-4 etched-border"
                            >
                              LOCK-IN_RECONCILIATION
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'city' && (
                  <div className="space-y-10 text-left">
                    <div className="flex items-center justify-between mb-2">
                       <div>
                        <h3 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter">CITY_INFRASTRUCTURE</h3>
                        <p className="text-[10px] text-primary font-black tracking-[0.5em] uppercase mt-2 flex items-center gap-3">
                          <Activity size={14} className="animate-pulse" /> Real-time System Analytics // ACTIVE
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                       {[
                        { label: 'Traffic_Flow', val: 'HEAVY', icon: <Activity />, col: 'text-secondary', p: 85 },
                        { label: 'Energy_Grid', val: 'OPTIMAL', icon: <Zap />, col: 'text-primary', p: 42 },
                        { label: 'Neural_Net', val: '99.8%', icon: <Radio />, col: 'text-tertiary', p: 99 },
                      ].map((m, i) => (
                        <div key={i} className="bg-black/30 p-8 border border-white/5 etched-border">
                          <span className="text-[10px] text-white/20 font-black tracking-[0.4em] uppercase block mb-3">{m.label}</span>
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-3xl font-black italic tracking-tighter ${m.col}`}>{m.val}</span>
                            <span className={m.col}>{m.icon}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${m.p}%` }} className={`h-full ${m.col.replace('text-', 'bg-')}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <BuildingDashboard 
                      details={buildingDetails} 
                      statuses={buildingStatuses} 
                      activeUpgrades={activeUpgrades} 
                      purchasedUpgrades={purchasedUpgrades}
                      onUpgrade={onUpgrade}
                      onAction={onAction}
                      onInspect={(id) => { setActiveView('map'); setSelectedMapBuilding(id); onClose(); }} 
                    />
                  </div>
                )}
                {activeTab === 'vc_lab' && (
                  <div className="space-y-10 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter">VC_ACQUISITION_LAB</h2>
                        <p className="text-[10px] text-secondary font-black tracking-[0.5em] uppercase mt-2 flex items-center gap-3"><Zap size={14} /> PORTFOLIO_OPTIMIZATION_ENGINE</p>
                      </div>
                    </div>
                    <VCAIAssistant stats={stats} portfolio={investments} onAction={onAction} />
                  </div>
                )}
                {activeTab === 'syndicate' && (
                  <div className="space-y-10 text-left">
                    <SyndicateSystem 
                      stats={stats} 
                      onAction={onAction} 
                      syndicateHires={syndicateHires} 
                      setSyndicateHires={setSyndicateHires} 
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scrolling Ticker Tape Bar */}
        <div className="ticker-wrap relative z-[20] flex items-center h-12 shrink-0 select-none">
          <div className="bg-black border-r border-white/15 px-5 h-full flex items-center gap-2 shrink-0 z-30 relative shadow-[5px_0_15px_rgba(3,3,4,0.85)]">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-glow-primary text-primary font-mono">LIVE_METRICS</span>
          </div>
          
          <div className="ticker-content flex items-center gap-12 py-2">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm font-black text-white/40 tracking-widest font-mono">
                  {item.category}
                </span>
                <span className="font-extrabold text-white tracking-wider uppercase">
                  {item.label}
                </span>
                <span className="text-white/80 font-medium font-mono">
                  {item.value}
                </span>
                <span className={`flex items-center gap-0.5 font-black font-mono ${item.isHigh ? 'text-[#00fdc1]' : 'text-red-400'}`}>
                  {item.isHigh ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {item.change}
                </span>
                <span className="text-[9px] text-white/25 tracking-wider font-mono">
                  [{item.type}]
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
const SettingsModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-surface-container border-l-4 border-primary w-full max-w-md p-8 relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-primary"><X size={24} /></button>
      <h2 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter mb-6">APP_SETTINGS</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-surface-container-low border-b border-secondary/20">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-secondary" />
            <span className="font-headline text-sm font-bold">SOUND</span>
          </div>
          <div className="w-12 h-6 bg-secondary/20 relative cursor-pointer"><div className="absolute right-1 top-1 bottom-1 w-4 bg-secondary" /></div>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-low border-b border-primary/20">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-primary" />
            <span className="font-headline text-sm font-bold">VISUAL_QUALITY</span>
          </div>
          <span className="text-xs font-black text-primary">ULTRA</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-surface-container-low border-b border-tertiary/20">
          <div className="flex items-center gap-3">
            <Cpu size={20} className="text-tertiary" />
            <span className="font-headline text-sm font-bold">CONNECTION</span>
          </div>
          <span className="text-xs font-black text-tertiary">STABLE</span>
        </div>
        <button className="w-full py-4 border border-white/10 font-headline font-black text-white/40 hover:text-tertiary hover:border-tertiary transition-all uppercase text-xs flex items-center justify-center gap-2">
          <LogOut size={16} /> LOG_OUT
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const WalletModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-surface-container border-l-4 border-secondary w-full max-w-md p-8 relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-secondary"><X size={24} /></button>
      <h2 className="font-headline font-black text-2xl text-secondary uppercase tracking-tighter mb-6">DIGITAL_WALLET</h2>
      <div className="bg-black/40 p-6 mb-6 border border-secondary/10">
        <span className="text-[10px] text-white/40 font-black tracking-widest uppercase block mb-1">CURRENT_BALANCE</span>
        <span className="text-4xl font-headline font-black text-white">$2,412,890.00</span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 flex items-center justify-center"><ArrowUpRight size={16} className="text-secondary" /></div>
            <div>
              <p className="text-xs font-bold">Business Dividend</p>
              <p className="text-[9px] text-white/40">Health Diagnostics • 2h ago</p>
            </div>
          </div>
          <span className="text-xs font-black text-secondary">+$12.4K</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tertiary/10 flex items-center justify-center"><CreditCard size={16} className="text-tertiary" /></div>
            <div>
              <p className="text-xs font-bold">Office Maintenance</p>
              <p className="text-[9px] text-white/40">Main Tower • 5h ago</p>
            </div>
          </div>
          <span className="text-xs font-black text-tertiary">-$2.1K</span>
        </div>
      </div>
      <button className="w-full mt-6 bg-secondary py-4 font-headline font-black text-black hover:bg-white transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2">
        <Plus size={18} /> DEPOSIT_FUNDS
      </button>
    </motion.div>
  </motion.div>
);

const BankModal = ({ onClose, onInteract, playerData }: { onClose: () => void; onInteract: (type: string, id: string, payload?: any) => void; playerData: PlayerData }) => {
  const [exchangeAmount, setExchangeAmount] = useState(0);
  const exchangeRate = 1.24;

  useEffect(() => {
    playTerminalClick('transition');
  }, []);

  const handleSwap = () => {
    if (exchangeAmount <= 0) return;
    if (exchangeAmount > playerData.bank.neonCredits) {
      playTerminalClick('fail');
      return;
    }
    playTerminalClick('success');
    onInteract('bank', 'swap', { amount: exchangeAmount, rate: exchangeRate });
    setExchangeAmount(0);
  };

  const handleClose = () => {
    playTerminalClick('transition');
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container border-l-4 border-primary w-full max-w-2xl p-8 relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <TechLines className="opacity-10" />
        <button onClick={handleClose} className="absolute top-6 right-6 text-white/40 hover:text-primary z-10"><X size={24} /></button>
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary"><Landmark size={24} /></div>
          <div>
            <h2 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter">METRO_CENTRAL_BANK</h2>
            <p className="text-[10px] text-primary font-black tracking-widest uppercase">Clearance Level: GOLD</p>
          </div>
        </div>

        <BuildingInteriorScan type="bank" />

        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
          <div className="bg-surface-container-low p-6 border-b border-primary/20">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">LOAN_FACILITY</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/60">Credit Score</span>
                <span className="text-sm font-black text-secondary">782</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/60">Max Credit</span>
                <span className="text-sm font-black text-white">$5.0M</span>
              </div>
              <button 
                onClick={() => {
                  playTerminalClick('success');
                  onInteract('bank', 'loan');
                }} 
                className="w-full py-3 bg-primary text-black font-headline font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-neon"
              >
                Apply for Loan
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 border-b border-secondary/20">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">CURRENCY_EXCHANGE</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/60">Neon-Credits</span>
                <span className="text-sm font-black text-secondary">{playerData.bank.neonCredits.toLocaleString()} NC</span>
              </div>
              
              <div className="relative">
                <input 
                  type="number"
                  placeholder="AMOUNT_NC"
                  value={exchangeAmount || ''}
                  onChange={(e) => {
                    playTerminalClick('input');
                    setExchangeAmount(Math.max(0, parseInt(e.target.value) || 0));
                  }}
                  className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs text-secondary focus:border-secondary outline-none transition-all"
                />
                <button 
                  onClick={() => {
                    playTerminalClick('chirp');
                    setExchangeAmount(playerData.bank.neonCredits);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-white/20 hover:text-white"
                >
                  MAX
                </button>
              </div>

              <div className="flex justify-between items-center px-1">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/20 uppercase">Rate</span>
                  <span className="text-[10px] font-black text-white">{exchangeRate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black text-white/20 uppercase">Receiver</span>
                  <span className="text-[10px] font-black text-primary italic">+ ${(exchangeAmount * exchangeRate).toLocaleString()} USD</span>
                </div>
              </div>

              <button 
                onClick={handleSwap}
                disabled={exchangeAmount <= 0 || exchangeAmount > playerData.bank.neonCredits}
                className={`w-full py-3 border font-headline font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
                  exchangeAmount > 0 && exchangeAmount <= playerData.bank.neonCredits
                    ? 'border-secondary text-secondary hover:bg-secondary hover:text-black shadow-neon-secondary'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
              >
                <Repeat size={14} /> Swapping Node_Credits
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black/40 p-6 border border-white/5 relative z-10">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">SAFE_DEPOSIT_BOX</h3>
          <div className="flex items-center justify-between p-4 bg-surface-container-low border-l-2 border-tertiary">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-tertiary" />
              <div>
                <p className="text-sm font-bold">Secure Box #802</p>
                <p className="text-[10px] text-white/40 uppercase">Status: LOCKED • Key Required</p>
              </div>
            </div>
            <button 
              onClick={() => {
                playTerminalClick('chirp');
                onInteract('bank', 'access');
              }} 
              className="px-4 py-2 bg-tertiary/10 text-tertiary text-[10px] font-black uppercase tracking-widest hover:bg-tertiary hover:text-black transition-all"
            >
              Request Access
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


const SchoolModal = ({ onClose, onInteract }: { onClose: () => void; onInteract: (type: string, id: string) => void }) => {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-surface-container border-l-4 border-secondary w-full max-w-4xl p-0 relative shadow-2xl overflow-hidden flex h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <TechLines className="opacity-10 pointer-events-none" />
        
        {/* Sidebar Nav */}
        <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col p-8 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-secondary/10 text-secondary border border-secondary/20 shadow-neon-sm">
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="font-headline font-black text-xl text-white uppercase tracking-tighter italic">ACADEMY_OS</h2>
              <p className="text-[8px] text-secondary font-black tracking-widest uppercase opacity-60">Level_04_Node</p>
            </div>
          </div>

          <div className="mb-8 scale-90 origin-top">
            <BuildingInteriorScan type="school" />
          </div>

          <div className="space-y-1.5 flex-grow">
            {[
              { id: 'courses', label: 'COURSES', icon: <BookOpen size={18} /> },
              { id: 'archive', label: 'DATA_ARCHIVE', icon: <Database size={18} /> },
              { id: 'lab', label: 'BIO_LAB', icon: <FlaskConical size={18} /> },
              { id: 'link', label: 'NEURAL_LINK', icon: <Cpu size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                    : 'bg-transparent border-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                <div className={activeTab === tab.id ? 'animate-pulse' : ''}>{tab.icon}</div>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-white/5">
             <div className="flex justify-between items-end mb-2">
                <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">Neural_Sync</span>
                <span className="text-[10px] text-secondary font-mono font-black italic">82%</span>
             </div>
             <div className="h-1 bg-white/5 w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '82%' }} 
                  className="h-full bg-secondary shadow-neon" 
                />
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 h-full min-h-0 p-12 overflow-y-auto custom-scrollbar relative z-10 bg-surface-container/50">
          <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-secondary transition-colors z-20"><X size={28} /></button>
          
          <AnimatePresence mode="wait">
            {activeTab === 'courses' && (
              <motion.div 
                key="courses" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter mb-2">PROFESSIONAL_COURSES</h3>
                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Standard Neural Optimization Programs</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { id: 'iq', label: 'Advanced Management', icon: <Brain size={16} />, cost: '$120K', effect: '+5 IQ', color: 'text-primary' },
                    { id: 'hack', label: 'Cyber Security', icon: <Cpu size={16} />, cost: '$85K', effect: '+12 Hacking', color: 'text-secondary' },
                    { id: 'mgmt', label: 'Business Strategy', icon: <TrendingUp size={16} />, cost: '$200K', effect: '+8% Revenue', color: 'text-tertiary' },
                    { id: 'leadership', label: 'Leadership Training', icon: <Users size={16} />, cost: '$150K', effect: '+15% Morale', color: 'text-white' },
                  ].map(skill => (
                    <div key={skill.id} className="bg-white/[0.02] p-6 border border-white/5 group hover:bg-white/[0.04] transition-all relative overflow-hidden etched-border">
                      <div className="absolute top-0 left-0 w-1 h-full bg-secondary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-4 bg-black/40 border border-white/5 ${skill.color} shadow-inner`}>{skill.icon}</div>
                        <span className="text-xs font-black text-secondary font-mono tracking-tighter">{skill.cost}</span>
                      </div>
                      <h4 className="text-base font-bold mb-1 uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">{skill.label}</h4>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-6">{skill.effect}</p>
                      <button onClick={() => onInteract('school', skill.id)} className="w-full py-3.5 bg-secondary/5 text-secondary text-[10px] font-black uppercase tracking-[0.4em] border border-secondary/20 hover:bg-secondary hover:text-black transition-all shadow-neon-sm">Enroll_Now</button>
                    </div>
                  ))}
                </div>

                <div className="mt-16 mb-8 border-t border-white/5 pt-12">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter mb-2">COMMUNITY_&_FREE_NETWORKS</h3>
                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Low-barrier open-source academy nodes</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { id: 'edu_basic_hack', label: 'Backdoor Database Querying', icon: <Terminal size={16} />, cost: 'FREE', effect: '+1 IQ', color: 'text-primary' },
                    { id: 'edu_fin_basics', label: 'Personal Credit Routing', icon: <Coins size={16} />, cost: '$100', effect: '+1 IQ', color: 'text-secondary' },
                    { id: 'edu_cyber_hygiene', label: 'Cortex Node Cache Hygiene', icon: <Cpu size={16} />, cost: 'FREE', effect: '+2 Happiness', color: 'text-emerald-400' },
                    { id: 'edu_open_source', label: 'Open-Source Net Protocols', icon: <Globe size={16} />, cost: '$250', effect: '+2 IQ', color: 'text-sky-400' },
                    { id: 'edu_street_smarts', label: 'Underground Supply Arbitrage', icon: <TrendingUp size={16} />, cost: '$50', effect: '+1 IQ', color: 'text-amber-400' },
                    { id: 'edu_ai_fundamentals', label: 'Classic LLM Mechanics', icon: <Brain size={16} />, cost: 'FREE', effect: '+1 IQ', color: 'text-indigo-400' },
                    { id: 'edu_wellness_med', label: 'Sub-vocal Vibration Meditation', icon: <Coffee size={16} />, cost: '$10', effect: '+4 Happiness', color: 'text-pink-400' },
                    { id: 'edu_shell_scripting', label: 'Shell Automation Scripting', icon: <Terminal size={16} />, cost: '$500', effect: '+3 IQ', color: 'text-purple-400' },
                    { id: 'edu_hardware_tinker', label: 'Spare Node Board Hotwiring', icon: <Cpu size={16} />, cost: '$150', effect: '+1 IQ, +2 Happiness', color: 'text-teal-400' },
                    { id: 'edu_crypto_arbitrage', label: 'Distributed Ledgers basics', icon: <Coins size={16} />, cost: '$800', effect: '+4 IQ', color: 'text-yellow-400' },
                  ].map(skill => (
                    <div key={skill.id} className="bg-white/[0.01] p-6 border border-white/5 group hover:bg-white/[0.03] transition-all relative overflow-hidden etched-border">
                      <div className="absolute top-0 left-0 w-1 h-full bg-secondary scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-4 bg-black/40 border border-white/5 ${skill.color} shadow-inner`}>{skill.icon}</div>
                        <span className={`text-xs font-black font-mono tracking-tighter ${skill.cost === 'FREE' ? 'text-primary' : 'text-secondary'}`}>{skill.cost}</span>
                      </div>
                      <h4 className="text-base font-bold mb-1 uppercase tracking-tight text-white/90 group-hover:text-white transition-colors">{skill.label}</h4>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-6">{skill.effect}</p>
                      <button onClick={() => onInteract('school', skill.id)} className="w-full py-3.5 bg-secondary/5 text-secondary text-[10px] font-black uppercase tracking-[0.4em] border border-secondary/20 hover:bg-secondary hover:text-black transition-all shadow-neon-sm">Enroll_Now</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'archive' && (
              <motion.div 
                key="archive" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter mb-2">DATA_ARCHIVE</h3>
                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Historical Intelligence & Log Retrieval</p>
                </div>

                <div className="bg-black/60 border border-white/5 p-10 mb-10 flex items-center gap-10 etched-border relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <Database size={300} className="absolute -bottom-10 -right-20" />
                  </div>
                  <div className="w-24 h-24 bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10 shadow-[inset_0_0_20px_rgba(0,253,193,0.05)] relative z-10">
                    <Database size={48} className="animate-pulse" />
                  </div>
                  <div className="flex-grow relative z-10">
                    <p className="text-base text-white/70 italic leading-relaxed mb-6 max-w-xl">
                      Access encrypted historical data fragments from the Old City clusters. Information acquired may reveal market anomalies or strategic advantages.
                    </p>
                    <div className="flex items-center gap-6">
                       <div className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Archive_Protocol: STABLE</div>
                       <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-secondary shadow-neon" />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'query_market', label: 'Analyze Market Patterns', desc: 'Predict next market fluctuation cycle.', cost: '$5K', type: 'Intel' },
                    { id: 'query_history', label: 'Sync Historical Logs', desc: 'Acquire perspective on urban evolution.', cost: '$2K', type: 'Lore' },
                    { id: 'query_terminal', label: 'Terminal Decryption', desc: 'Unlock hidden network paths.', cost: '$25K', type: 'Access' },
                  ].map(action => (
                    <div key={action.id} className="flex items-center justify-between p-8 bg-white/[0.01] border border-white/5 hover:border-secondary/30 hover:bg-white/[0.03] transition-all group etched-border">
                      <div className="flex items-center gap-8">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:text-secondary group-hover:border-secondary/30 transition-all">
                           <Search size={20} />
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-secondary/60 uppercase tracking-[0.5em] mb-2 block">{action.type}</span>
                          <h4 className="text-lg font-bold text-white/90 mb-1">{action.label}</h4>
                          <p className="text-xs text-white/30 italic">{action.desc}</p>
                        </div>
                      </div>
                      <button onClick={() => onInteract('school', action.id)} className="px-8 py-3.5 border border-secondary/30 text-secondary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-black transition-all shadow-neon-sm">{action.cost}</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'lab' && (
              <motion.div 
                key="lab" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter mb-2">BIO_LAB // NEURAL_EXP</h3>
                  <p className="text-xs text-secondary/60 uppercase tracking-[0.3em]">Experimental Cognitive Enhancements</p>
                </div>

                <div className="relative h-48 overflow-hidden mb-10 etched-border border border-white/10 group">
                  <div className="absolute inset-0 bg-black/60 z-10" />
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-20" />
                  <img src="/src/assets/images/onboarding_background_1779238543970.png" className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 transition-transform duration-[2000ms]" alt="Bio Lab" />
                  <div className="absolute inset-0 z-30 flex flex-col justify-end p-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">PROTOCOL_X_LOADED</span>
                      </div>
                      <h4 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter leading-none mb-2">SYNAPTIC_OVERDRIVE</h4>
                      <p className="text-sm text-white/40 uppercase tracking-[0.3em] font-medium">Neural Integrity Checks Bypass: ACTIVE</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-8 bg-black/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all relative overflow-hidden etched-border">
                    <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                      <FlaskConical size={200} />
                    </div>
                    <div className="relative z-10 flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"><Dna size={28} /></div>
                        <div>
                          <h5 className="text-xl font-bold uppercase text-white/90 mb-1">Synaptic Rerouting</h5>
                          <p className="text-xs text-white/30 uppercase tracking-widest italic">Risk Level: CRITICAL • Outcome: STOCHASTIC (+/- IQ)</p>
                        </div>
                      </div>
                      <button onClick={() => onInteract('school', 'synaptic_boost')} className="py-4 px-10 bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-[0.3em] border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all shadow-neon-sm">Execute_$50K</button>
                    </div>
                    <div className="flex gap-1.5 px-1 pb-1 overflow-hidden">
                       {[...Array(32)].map((_, i) => (
                         <motion.div 
                           key={i} 
                           animate={{ 
                             opacity: [0.1, 0.4, 0.1],
                             height: [4, Math.random() * 8 + 4, 4] 
                           }}
                           transition={{ 
                             duration: Math.random() * 2 + 1, 
                             repeat: Infinity,
                             delay: i * 0.05
                           }}
                           className="w-1 bg-emerald-500/30" 
                         />
                       ))}
                    </div>
                  </div>

                  <div className="p-8 bg-black/40 border border-purple-500/10 hover:border-purple-500/30 transition-all relative overflow-hidden etched-border">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="p-5 bg-purple-500/5 text-purple-500 border border-purple-500/20"><Activity size={28} /></div>
                        <div>
                          <h5 className="text-xl font-bold uppercase text-white/90 mb-1">Endorphin Saturation</h5>
                          <p className="text-xs text-white/30 uppercase tracking-widest italic">Risk Level: MINIMAL • Outcome: +HAPPINESS, -IQ (TEMP)</p>
                        </div>
                      </div>
                      <button onClick={() => onInteract('school', 'endorphin_loop')} className="py-4 px-10 bg-purple-500/10 text-purple-500 text-xs font-black uppercase tracking-[0.3em] border border-purple-500/30 hover:bg-purple-500 hover:text-black transition-all shadow-neon-sm">Initiate_$15K</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'link' && (
              <motion.div 
                key="link" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="mb-10">
                  <h3 className="text-3xl font-headline font-black text-white uppercase italic tracking-tighter mb-2">NEURAL_LINK // SKILL_ACQ</h3>
                  <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Direct Cortex Implementation Modules</p>
                </div>
                
                <div className="flex flex-col gap-6">
                  {[
                    { id: 'skill_fast_learner', label: 'Hyper-Learning [v1]', icon: <Terminal size={24} />, stats: '+25% Education Coefficient', theme: 'border-blue-500/30 text-blue-400 bg-blue-500/5', cost: '$400K' },
                    { id: 'skill_market_eye', label: 'Analytical Eye [v1]', icon: <TrendingUp size={24} />, stats: 'Visualize Market Divergence', theme: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5', cost: '$750K' },
                    { id: 'skill_social_sync', label: 'Empathetic Link [v2]', icon: <Users size={24} />, stats: '+40% Social Network Gains', theme: 'border-pink-500/30 text-pink-400 bg-pink-500/5', cost: '$1.2M' },
                  ].map(skill => (
                    <div key={skill.id} className={`p-10 border-2 ${skill.theme} relative overflow-hidden flex items-center justify-between hover:bg-white/[0.04] transition-all group etched-border`}>
                      <div className="absolute top-0 right-0 p-4 opacity-[0.02] -translate-y-4 translate-x-4">
                        <Cpu size={180} />
                      </div>
                      <div className="relative z-10 flex items-center gap-10">
                        <div className="w-16 h-16 bg-black/40 border border-white/10 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                          {skill.icon}
                        </div>
                        <div>
                          <h4 className="text-2xl font-headline font-black uppercase tracking-tighter italic mb-1 group-hover:text-white transition-colors">{skill.label}</h4>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-4">{skill.stats}</p>
                          <div className="flex gap-1.5">
                             {[...Array(8)].map((_, i) => (
                               <div key={i} className={`w-4 h-1.5 rounded-full ${i < 3 ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-white/5'}`} />
                             ))}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => onInteract('school', skill.id)} className="px-12 py-5 bg-secondary text-black text-[10px] font-black uppercase tracking-[0.4em] font-headline hover:bg-white transition-all shadow-neon relative z-10 hover:scale-105 active:scale-95">Install_{skill.cost}</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BarModal = ({ 
  onClose, 
  onInteract,
  stats,
  setStats,
  playerData,
  setPlayerData,
  addNotification
}: { 
  onClose: () => void; 
  onInteract: (type: string, id: string) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  addNotification: (msg: string) => void;
}) => {
  const [gameState, setGameState] = useState<'lounge' | 'game_playing' | 'game_over' | 'brew_playing' | 'brew_over'>('lounge');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(1000);
  const [maxTime, setMaxTime] = useState(1000);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('cyber_arbitrage_high_score') || '0');
  });
  const [payoutResult, setPayoutResult] = useState<{ usd: number; nc: number; iq: number } | null>(null);
  const [clickedTarget, setClickedTarget] = useState<number | null>(null);
  const [wrongTarget, setWrongTarget] = useState<number | null>(null);

  // Tab state inside Lounge Game System: 'grid' or 'brew'
  const [activeGameTab, setActiveGameTab] = useState<'grid' | 'brew'>('grid');

  // NEON BREW SYNTH STATE
  const [brewScore, setBrewScore] = useState(0);
  const [brewLives, setBrewLives] = useState(3);
  const [brewStatusMsg, setBrewStatusMsg] = useState('Synthesizer online.');
  const [brewMixture, setBrewMixture] = useState({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
  const [brewPatience, setBrewPatience] = useState(10000);
  const [brewOrder, setBrewOrder] = useState<{
    name: string;
    description: string;
    formula: { caffeine: number; glow: number; ethanol: number; coolant: number };
    maxPatience: number;
  } | null>(null);
  const [brewHighscore, setBrewHighscore] = useState(() => {
    return parseInt(localStorage.getItem('neon_brew_synth_high_score') || '0');
  });
  const [brewPayoutResult, setBrewPayoutResult] = useState<{ usd: number; nc: number; iq: number } | null>(null);

  // Constants
  const BREW_RECIPES = [
    {
      name: 'GIGA_HACK',
      description: 'Cerebral catalyst for deep ledger runs. Standard high-priority order.',
      formula: { caffeine: 2, glow: 1, ethanol: 0, coolant: 1 },
      maxPatience: 16000
    },
    {
      name: 'OVERCLOCK_SOUR',
      description: 'High-temperature metabolic accelerant. Organic solvent base.',
      formula: { caffeine: 1, glow: 0, ethanol: 2, coolant: 1 },
      maxPatience: 14000
    },
    {
      name: 'NEURAL_CRUSH',
      description: 'High luminous energy focus blend. Intense neuron flare.',
      formula: { caffeine: 2, glow: 2, ethanol: 0, coolant: 0 },
      maxPatience: 12000
    },
    {
      name: 'FROST_BYTE',
      description: 'Thermal regulator to cool hot custom microchips under stack stress.',
      formula: { caffeine: 0, glow: 1, ethanol: 1, coolant: 2 },
      maxPatience: 15000
    }
  ];

  // Gameloop interval when playing the grid game
  useEffect(() => {
    if (gameState !== 'game_playing') return;

    if (activeNode === null) {
      const initNode = Math.floor(Math.random() * 9);
      setActiveNode(initNode);
      const initMax = Math.max(380, 1000 - score * 30);
      setTimeLeft(initMax);
      setMaxTime(initMax);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 20) {
          // Strike - time ran out
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('game_over');
              handleGameOver(score);
            } else {
              let nextNode = Math.floor(Math.random() * 9);
              while (nextNode === activeNode) {
                nextNode = Math.floor(Math.random() * 9);
              }
              setActiveNode(nextNode);
              const nextMax = Math.max(380, 1000 - score * 30);
              setMaxTime(nextMax);
              setTimeLeft(nextMax);
            }
            return nextL;
          });
          return 0;
        }
        return prev - 20;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [gameState, activeNode, score]);

  // Brew gameplay countdown interval
  useEffect(() => {
    if (gameState !== 'brew_playing' || !brewOrder) return;

    const interval = setInterval(() => {
      setBrewPatience(prev => {
        if (prev <= 100) {
          // Time expired
          setBrewLives(l => {
            const nextL = l - 1;
            setBrewStatusMsg('💥 LIMIT EXPIRED: Client impatient. Reputation damaged!');
            if (nextL <= 0) {
              setGameState('brew_over');
              handleBrewGameOver(brewScore);
            } else {
              // Next order
              const nextOrder = BREW_RECIPES[Math.floor(Math.random() * BREW_RECIPES.length)];
              setBrewOrder(nextOrder);
              setBrewMixture({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
              setBrewPatience(nextOrder.maxPatience);
            }
            return nextL;
          });
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, brewOrder, brewScore]);

  const handleGameOver = (finalScore: number) => {
    const totalUsd = finalScore === 0 ? 0 : (finalScore <= 5 ? finalScore * 150 : finalScore <= 12 ? finalScore * 250 : finalScore <= 20 ? finalScore * 400 : finalScore <= 30 ? finalScore * 600 : finalScore * 1000);
    const totalNc = finalScore === 0 ? 0 : (finalScore <= 5 ? finalScore * 2 : finalScore <= 12 ? finalScore * 5 : finalScore <= 20 ? finalScore * 10 : finalScore <= 30 ? finalScore * 20 : finalScore * 50);
    const iqGained = finalScore >= 31 ? 10 : finalScore >= 21 ? 3 : finalScore >= 13 ? 1 : 0;

    setPayoutResult({ usd: totalUsd, nc: totalNc, iq: iqGained });

    setStats(prev => ({
      ...prev,
      netWorth: prev.netWorth + totalUsd,
      iq: prev.iq + iqGained
    }));

    setPlayerData(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        savings: prev.bank.savings + totalUsd,
        neonCredits: prev.bank.neonCredits + totalNc,
        transactionHistory: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: 'deposit',
            amount: totalUsd,
            description: `Arbitrage Sync Payout: score ${finalScore}`
          },
          ...prev.bank.transactionHistory
        ]
      }
    }));

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('cyber_arbitrage_high_score', finalScore.toString());
      addNotification(`NEW HIGH SCORE! Grid synced at level ${finalScore}. Payout authorized.`);
    } else {
      addNotification(`Uplink closed. Score: ${finalScore}. Reward: $${totalUsd.toLocaleString()} USD and ${totalNc} Neon Credits synthetic yield.`);
    }
  };

  const handleBrewGameOver = (finalScore: number) => {
    const usdPerDrink = finalScore === 0 ? 0 : (finalScore <= 5 ? 200 : finalScore <= 12 ? 350 : finalScore <= 20 ? 550 : 800);
    const ncPerDrink = finalScore === 0 ? 0 : (finalScore <= 5 ? 0 : finalScore <= 12 ? 1 : finalScore <= 20 ? 2 : 3);

    const totalUsd = finalScore * usdPerDrink;
    const totalNc = finalScore * ncPerDrink;
    const iqGained = finalScore >= 20 ? 6 : finalScore >= 12 ? 2 : finalScore >= 5 ? 1 : 0;

    setBrewPayoutResult({ usd: totalUsd, nc: totalNc, iq: iqGained });

    setStats(prev => ({
      ...prev,
      netWorth: prev.netWorth + totalUsd,
      iq: prev.iq + iqGained
    }));

    setPlayerData(prev => ({
      ...prev,
      bank: {
        ...prev.bank,
        savings: prev.bank.savings + totalUsd,
        neonCredits: prev.bank.neonCredits + totalNc,
        transactionHistory: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            type: 'deposit',
            amount: totalUsd,
            description: `Neon Brew synthesis payout: Score ${finalScore}`
          },
          ...prev.bank.transactionHistory
        ]
      }
    }));

    if (finalScore > brewHighscore) {
      setBrewHighscore(finalScore);
      localStorage.setItem('neon_brew_synth_high_score', finalScore.toString());
      addNotification(`NEW HIGH REPUTATION! Synthesized ${finalScore} perfect neural brews!`);
    } else {
      addNotification(`Brew shift finished! Served ${finalScore} drinks. Authorized payout: +$${totalUsd.toLocaleString()}`);
    }
  };

  const handleGridClick = (index: number) => {
    if (gameState !== 'game_playing') return;

    if (index === activeNode) {
      // Hit
      setScore(s => s + 1);
      setClickedTarget(index);
      setTimeout(() => setClickedTarget(null), 120);

      let nextNode = Math.floor(Math.random() * 9);
      while (nextNode === activeNode) {
        nextNode = Math.floor(Math.random() * 9);
      }
      setActiveNode(nextNode);
      const nextMax = Math.max(380, 1000 - (score + 1) * 30);
      setMaxTime(nextMax);
      setTimeLeft(nextMax);
    } else {
      // Missed active target
      setWrongTarget(index);
      setTimeout(() => setWrongTarget(null), 120);
      setLives(l => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setGameState('game_over');
          handleGameOver(score);
        }
        return nextL;
      });
    }
  };

  const startToPlay = () => {
    if (stats.happiness < 10) {
      addNotification("WARNING: Neural synchronization requires at least 10 Happiness. Refresh your vitals with Premium Coffee first.");
      return;
    }
    setStats(prev => ({ ...prev, happiness: Math.max(0, stats.happiness - 10) }));
    setScore(0);
    setLives(3);
    setActiveNode(null);
    setGameState('game_playing');
    addNotification("Neural Uplink Initialized. Sync flashing grid nodes rapidly!");
  };

  const startToPlayBrew = () => {
    if (stats.happiness < 10) {
      addNotification("WARNING: Stimulant synthesis requires at least 10 Happiness. Refresh your vitals with Premium Coffee first.");
      return;
    }
    setStats(prev => ({ ...prev, happiness: Math.max(0, stats.happiness - 10) }));
    setBrewScore(0);
    setBrewLives(3);
    setBrewMixture({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
    setBrewStatusMsg('Synthesis matrix ready. Client line formed.');

    const firstRecipe = BREW_RECIPES[Math.floor(Math.random() * BREW_RECIPES.length)];
    setBrewOrder(firstRecipe);
    setBrewPatience(firstRecipe.maxPatience);
    setGameState('brew_playing');
    addNotification("Cyber Bartender Shift Started. Match chemical ratios to brew hacker staves.");
  };

  const handleAddIngredient = (ingredient: 'caffeine' | 'glow' | 'ethanol' | 'coolant') => {
    if (gameState !== 'brew_playing') return;
    setBrewMixture(prev => ({
      ...prev,
      [ingredient]: Math.min(prev[ingredient] + 1, 4)
    }));
    setBrewStatusMsg(`Added ${ingredient.toUpperCase()}`);
  };

  const handleDumpMixture = () => {
    if (gameState !== 'brew_playing') return;
    setBrewMixture({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
    setBrewStatusMsg('Purged synthesizer feedlines. Beaker empty.');
  };

  const handleServeStimulant = () => {
    if (gameState !== 'brew_playing' || !brewOrder) return;

    const req = brewOrder.formula;
    const cur = brewMixture;

    const correct = cur.caffeine === req.caffeine &&
                    cur.glow === req.glow &&
                    cur.ethanol === req.ethanol &&
                    cur.coolant === req.coolant;

    if (correct) {
      setBrewScore(s => s + 1);
      setBrewStatusMsg(`🚀 SYNTHESIS SUCCESS: Perfect ${brewOrder.name} served!`);
      const nextRecipe = BREW_RECIPES[Math.floor(Math.random() * BREW_RECIPES.length)];
      setBrewOrder(nextRecipe);
      setBrewMixture({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
      setBrewPatience(nextRecipe.maxPatience);
    } else {
      setBrewLives(l => {
        const nextL = l - 1;
        setBrewStatusMsg('💥 RATIO ERROR: Defective compound served. Reputation penalized!');
        if (nextL <= 0) {
          setGameState('brew_over');
          handleBrewGameOver(brewScore);
        } else {
          setBrewMixture({ caffeine: 0, glow: 0, ethanol: 0, coolant: 0 });
        }
        return nextL;
      });
    }
  };

  const getRankName = (sc: number) => {
    if (sc === 0) return 'UNREGISTERED';
    if (sc <= 5) return 'TIER_5 SCRUB';
    if (sc <= 12) return 'TIER_4 SCRIPT_KID';
    if (sc <= 20) return 'TIER_3 CORE_RUNNER';
    if (sc <= 30) return 'TIER_2 ELITE_OP';
    return 'TIER_1 QUANTUM_OVERLORD';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
         initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
         className="bg-surface-container border-l-4 border-tertiary w-full max-w-3xl p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto"
         onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-tertiary transition-colors"><X size={24} /></button>
         
        {/* Header Block always visible */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
          <div className="w-12 h-12 bg-tertiary/10 flex items-center justify-center text-tertiary shadow-[inset_0_0_15px_rgba(255,113,106,0.1)]"><Beer size={24} /></div>
          <div>
            <h2 className="font-headline font-black text-2xl text-tertiary uppercase tracking-tighter">THE_CITY_LOUNGE</h2>
            <p className="text-[10px] text-tertiary font-black tracking-widest uppercase">Where Business meets Reflexes • Happiness: {stats.happiness}% • IQ: {stats.iq}</p>
          </div>
        </div>

        {gameState === 'lounge' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Side: Original Drinks Refreshment Shop */}
              <div className="bg-surface-container-low p-6 border border-white/5 relative">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-white/20 uppercase">DECK-1</div>
                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
                  STIM_REFRESHMENTS
                </h3>
                <div className="space-y-4">
                  {[
                    { id: 'coffee', name: 'Premium Coffee', effect: '+10% Happiness', cost: '$150' },
                    { id: 'energy_drink', name: 'Energy Drink', effect: '+5% IQ (Temp)', cost: '$450' },
                    { id: 'networking', name: 'Networking Event', effect: 'Industry Intel', cost: '$1.2K' },
                  ].map(drink => (
                    <div key={drink.name} className="flex justify-between items-center group bg-black/20 p-2.5 border border-white/3">
                      <div>
                        <p className="text-sm font-bold group-hover:text-tertiary transition-colors">{drink.name}</p>
                        <p className="text-[9px] text-white/40 uppercase font-mono">{drink.effect}</p>
                      </div>
                      <button 
                        onClick={() => onInteract('bar', drink.id)} 
                        className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-black uppercase hover:bg-tertiary hover:text-black transition-all font-mono"
                      >
                        {drink.cost}
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[10px] text-white/40 uppercase font-mono mb-2">INDUSTRY_DECRYPTION</p>
                    <button 
                      onClick={() => onInteract('bar', 'intel')} 
                      className="w-full py-2 bg-secondary/5 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black transition-all font-mono"
                    >
                      Buy Intel ($5K)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Double Game Choice Tab */}
              <div className="bg-surface-container-low p-6 border border-tertiary/20 relative shadow-[0_0_20px_rgba(255,113,106,0.05)] flex flex-col justify-between">
                <div>
                  <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-tertiary uppercase">LOUNGE_CABINET_SYS</div>
                  
                  {/* Game Selector Tabs */}
                  <div className="flex gap-2 border-b border-white/5 pb-3 mb-4">
                    <button 
                      onClick={() => setActiveGameTab('grid')}
                      className={`flex-1 py-1.5 text-[10px] uppercase font-black tracking-wider transition-all border ${activeGameTab === 'grid' ? 'bg-tertiary text-black border-tertiary shadow-[0_0_10px_rgba(255,113,106,0.2)]' : 'bg-black/20 text-white/50 border-white/5 hover:bg-black/40 hover:text-white'}`}
                    >
                      Arbitrage_Grid
                    </button>
                    <button 
                      onClick={() => setActiveGameTab('brew')}
                      className={`flex-1 py-1.5 text-[10px] uppercase font-black tracking-wider transition-all border ${activeGameTab === 'brew' ? 'bg-secondary text-black border-secondary shadow-[0_0_10px_rgba(0,253,193,0.2)]' : 'bg-black/20 text-white/50 border-white/5 hover:bg-black/40 hover:text-white'}`}
                    >
                      Neon_Brew_Synth
                    </button>
                  </div>

                  {activeGameTab === 'grid' && (
                    <>
                      <h3 className="text-xs font-black text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                        <Gamepad2 size={14} />
                        CYBER_ARBITRAGE_GRID
                      </h3>
                      
                      <div className="bg-black/40 p-4 border border-white/5 rounded-sm mb-4 space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/50">
                          <span>SYSTEM_STATUS:</span>
                          <span className="text-[#00ff66] font-bold animate-pulse">● BROADCAST_LIVE</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/50">
                          <span>NEURAL STRAW_COST:</span>
                          <span className="text-rose-400 font-bold">-10 Happiness</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>NEURAL HIGH_SCORE:</span>
                          <span className="text-tertiary font-black tracking-widest">{highScore} Nodes Synced</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/50 leading-relaxed mb-4">
                        Synchronize active flashing nodes in sequence under diminishing cycle deadlines. The higher your sync level, the grander the synthetic financial payout.
                      </p>

                      <button 
                        onClick={startToPlay}
                        className="w-full py-2.5 bg-tertiary/15 text-tertiary border border-tertiary/40 uppercase text-xs font-black tracking-widest hover:bg-tertiary hover:text-black hover:shadow-[0_0_15px_rgba(255,113,106,0.3)] transition-all flex items-center justify-center gap-2 font-mono"
                      >
                        <Gamepad2 size={16} /> INITIALIZE LINK
                      </button>
                    </>
                  )}

                  {activeGameTab === 'brew' && (
                    <>
                      <h3 className="text-xs font-black text-secondary uppercase tracking-widest mb-3 flex items-center gap-2 font-mono">
                        <Coffee size={14} />
                        NEON_BREW_SYNTH
                      </h3>
                      
                      <div className="bg-black/40 p-4 border border-white/5 rounded-sm mb-4 space-y-2 font-mono text-[10px]">
                        <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/50">
                          <span>SYSTEM_STATUS:</span>
                          <span className="text-secondary font-bold animate-pulse">● READY_FOR_SYNTH</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/50">
                          <span>MATERIAL STRAW_COST:</span>
                          <span className="text-secondary font-bold">-10 Happiness</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>HIGH_REPUTATION:</span>
                          <span className="text-secondary font-black tracking-widest">{brewHighscore} Drinks Served</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-white/50 leading-relaxed mb-4">
                        Synthesize high-demand cyber stimulants matching client recipes. Precise combinations of additives award grand salary payout ratios and IQ credits!
                      </p>

                      <button 
                        onClick={startToPlayBrew}
                        className="w-full py-2.5 bg-secondary/15 text-secondary border border-secondary/40 uppercase text-xs font-black tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_15px_rgba(0,253,193,0.3)] transition-all flex items-center justify-center gap-2 font-mono"
                      >
                        <Coffee size={16} /> INITIALIZE BREWER
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Original Social/Expert Recruiting Block */}
            <div className="bg-black/40 p-6 border border-white/5">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">SOCIAL_CONNECTIVITY</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface-container-low gap-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-secondary" />
                  <div>
                    <p className="text-sm font-bold">Network with Specialists</p>
                    <p className="text-[10px] text-white/40 uppercase font-mono">Unlock advanced capabilities & specialist contracts // 4 Available</p>
                  </div>
                </div>
                <button 
                  onClick={() => onInteract('bar', 'talent')} 
                  className="w-full sm:w-auto px-6 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-black transition-all font-mono"
                >
                  View Talent
                </button>
              </div>
            </div>
          </>
        )}

        {/* ACTIVE GRID GAMEPLAY INTERFACE */}
        {gameState === 'game_playing' && (
          <div className="bg-black/50 p-6 border-2 border-tertiary/30 shadow-[0_0_40px_rgba(255,113,106,0.1)] rounded-sm font-mono relative overflow-hidden">
            <div className="absolute top-2 right-4 text-[8px] text-tertiary/40 uppercase tracking-[0.2em]">ARBITRAGE_CORE // DECK_MODE_RUNNING</div>
            
            {/* Metrix Bar */}
            <div className="grid grid-cols-3 gap-4 mb-4 border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[9px] text-white/40 uppercase block flex">SYNCED_CHANNELS</span>
                <span className="text-xl font-black text-white">{score}</span>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-white/40 uppercase block flex justify-center items-center gap-1">
                  SYSTEM_INTEGRITY
                </span>
                <span className="text-md font-black flex justify-center gap-1.5 mt-1">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center font-bold text-[10px] transition-all ${
                        idx < lives ? 'bg-rose-500 text-black shadow-[0_0_8px_#ff2a5f]' : 'bg-white/5 text-white/10'
                      }`}
                    >
                      ♥
                    </span>
                  ))}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-white/40 uppercase block p-0">SPEED_TIER</span>
                <span className="text-md font-black text-tertiary">{getRankName(score)}</span>
              </div>
            </div>

            {/* Countdown timer bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-6 relative">
              <div 
                className="h-full bg-gradient-to-r from-tertiary to-rose-500 duration-20"
                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
              />
            </div>

            {/* Game Matrix 3x3 Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-[340px] mx-auto mb-6">
              {Array.from({ length: 9 }).map((_, index) => {
                const isActive = activeNode === index;
                const isHit = clickedTarget === index;
                const isMiss = wrongTarget === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleGridClick(index)}
                    className={`aspect-square w-full rounded-sm border transition-all flex flex-col items-center justify-center relative select-none ${
                      isActive 
                        ? 'bg-tertiary/20 border-tertiary text-tertiary shadow-[0_0_20px_rgba(255,113,106,0.5)] scale-[1.03] z-10' 
                        : isHit 
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.02] z-10'
                        : isMiss 
                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-[0.98]'
                        : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-black/40 text-white/10'
                    }`}
                  >
                    {isActive ? (
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase tracking-wider animate-pulse text-tertiary">SYNC</span>
                        <div className="w-4 h-4 rounded-full border-2 border-dashed border-tertiary animate-spin mt-1" />
                      </div>
                    ) : (
                      <span className="text-[8px] font-semibold opacity-30">NODE_0{index + 1}</span>
                    )}

                    {/* Edge visual ticks */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white/5" />
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white/5" />
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/5" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/5" />
                  </button>
                );
              })}
            </div>

            {/* System logs scrolling mockup */}
            <div className="bg-black/60 p-3 h-20 text-[8px] text-white/30 text-left overflow-y-hidden border border-white/5 leading-normal select-none">
              <p className="text-tertiary font-bold">&gt;&gt; UPLINK_INTEGRATION: SUCCESSFUL</p>
              <p>&gt;&gt; SPEED_TOLERANCE: {Math.round(maxTime)}MS // DECAY_RATIO = 30MS/NODE</p>
              <p className="text-secondary">&gt;&gt; TARGET NODE PINNED &gt; AT INDEX_NODE: 0{activeNode !== null ? activeNode + 1 : 'X'}</p>
              <p>&gt;&gt; CURRENT ARBITRAGE LIQUIDITY: USD_YIELD +${(score * 150).toLocaleString()} // GEN_REVENUE_COEF = 1.0X</p>
            </div>
          </div>
        )}

        {/* NEON BREW_SYNTH ACTIVE GAMEPLAY COCKPIT */}
        {gameState === 'brew_playing' && brewOrder && (
          <div className="bg-black/60 p-6 border-2 border-secondary/30 shadow-[0_0_40px_rgba(0,253,193,0.15)] rounded-sm font-mono relative overflow-hidden text-left">
            <div className="absolute top-2 right-4 text-[8px] text-secondary/50 uppercase tracking-[0.2em]">BREW_SYNTH_CORE // MANUAL_FEED_MATRIX</div>

            {/* Recipe Info Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/10">
              <div className="bg-secondary/5 p-4 border border-secondary/20 relative rounded-sm">
                <span className="absolute top-1.5 right-2 px-1.5 py-0.5 bg-secondary/10 text-[7px] text-secondary tracking-widest uppercase rounded">INCOMING ORDER</span>
                <span className="text-[9px] text-white/40 block uppercase">CLIENT_WANTS_DRINK:</span>
                <h4 className="text-xl font-black text-secondary tracking-wider mt-1">{brewOrder.name}</h4>
                <p className="text-[10px] text-white/60 leading-normal mt-1.5">{brewOrder.description}</p>
              </div>

              {/* Status and Reputation */}
              <div className="flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-white/40 uppercase">Brew Shift Target Score:</span>
                  <span className="text-sm font-black text-white">{brewScore} PERFECTED</span>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] text-white/40 uppercase">CLIENT_REPUTATION:</span>
                  <span className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center font-bold text-[10px] transition-all ${
                          idx < brewLives ? 'bg-secondary text-black shadow-[0_0_8px_rgba(0,253,193,0.5)]' : 'bg-white/5 text-white/10'
                        }`}
                      >
                        ♥
                      </span>
                    ))}
                  </span>
                </div>

                {/* Patient countdown bar */}
                <div>
                  <div className="flex justify-between text-[8px] text-white/40 font-mono uppercase mb-1">
                    <span>Client Patience Level:</span>
                    <span className={brewPatience < brewOrder.maxPatience * 0.3 ? 'text-red-400 animate-pulse font-black' : 'text-secondary font-black'}>
                      {Math.ceil(brewPatience / 1000)}s remaining
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      key={brewOrder.name}
                      initial={{ width: '100%' }}
                      animate={{ width: `${(brewPatience / brewOrder.maxPatience) * 100}%` }}
                      transition={{ ease: 'linear', duration: 0.1 }}
                      className={`h-full ${brewPatience < brewOrder.maxPatience * 0.3 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-secondary to-cyan-500 shadow-[0_0_8px_rgba(0,253,193,0.4)]'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Synthesis Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
              
              {/* Formula Target vs Current Shaker */}
              <div className="md:col-span-7 bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                <h5 className="text-[10px] text-white/40 font-mono uppercase tracking-widest border-b border-white/5 pb-2 mb-3">CHEMICAL_RATIO_SYNCING</h5>
                
                <div className="space-y-3 font-mono text-xs">
                  {/* Caffeine */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[10px] uppercase w-20">CAFFEINE:</span>
                    <div className="flex-1 max-w-[120px] bg-white/5 h-2 rounded overflow-hidden mx-3 relative">
                      <div className="h-full bg-rose-500" style={{ width: `${Math.min((brewMixture.caffeine / Math.max(1, brewOrder.formula.caffeine)) * 100, 100)}%` }} />
                      <div className="absolute inset-y-0 right-0 w-[2px] bg-secondary" style={{ left: `${(brewOrder.formula.caffeine / 4) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-black ${brewMixture.caffeine === brewOrder.formula.caffeine ? 'text-secondary' : 'text-white/40'}`}>
                      {brewMixture.caffeine} / {brewOrder.formula.caffeine}U
                    </span>
                  </div>

                  {/* Bio-Glow */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[10px] uppercase w-20">BIO-GLOW:</span>
                    <div className="flex-1 max-w-[120px] bg-white/5 h-2 rounded overflow-hidden mx-3 relative">
                      <div className="h-full bg-emerald-400" style={{ width: `${Math.min((brewMixture.glow / Math.max(1, brewOrder.formula.glow)) * 100, 100)}%` }} />
                      <div className="absolute inset-y-0 right-0 w-[2px] bg-secondary" style={{ left: `${(brewOrder.formula.glow / 4) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-black ${brewMixture.glow === brewOrder.formula.glow ? 'text-secondary' : 'text-white/40'}`}>
                      {brewMixture.glow} / {brewOrder.formula.glow}U
                    </span>
                  </div>

                  {/* Ethanol */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[10px] uppercase w-20">ETHANOL:</span>
                    <div className="flex-1 max-w-[120px] bg-white/5 h-2 rounded overflow-hidden mx-3 relative">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.min((brewMixture.ethanol / Math.max(1, brewOrder.formula.ethanol)) * 100, 100)}%` }} />
                      <div className="absolute inset-y-0 right-0 w-[2px] bg-secondary" style={{ left: `${(brewOrder.formula.ethanol / 4) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-black ${brewMixture.ethanol === brewOrder.formula.ethanol ? 'text-secondary' : 'text-white/40'}`}>
                      {brewMixture.ethanol} / {brewOrder.formula.ethanol}U
                    </span>
                  </div>

                  {/* Coolant */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[10px] uppercase w-20">COOLANT:</span>
                    <div className="flex-1 max-w-[120px] bg-white/5 h-2 rounded overflow-hidden mx-3 relative">
                      <div className="h-full bg-blue-400" style={{ width: `${Math.min((brewMixture.coolant / Math.max(1, brewOrder.formula.coolant)) * 100, 100)}%` }} />
                      <div className="absolute inset-y-0 right-0 w-[2px] bg-secondary" style={{ left: `${(brewOrder.formula.coolant / 4) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-black ${brewMixture.coolant === brewOrder.formula.coolant ? 'text-secondary' : 'text-white/40'}`}>
                      {brewMixture.coolant} / {brewOrder.formula.coolant}U
                    </span>
                  </div>
                </div>
              </div>

              {/* Shaker controls */}
              <div className="md:col-span-5 flex flex-col gap-2.5">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1 font-mono">DISPENSE_VALVES:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleAddIngredient('caffeine')}
                    className="py-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-black border border-rose-500/20 text-[10px] font-black transition-all rounded-sm flex flex-col items-center"
                  >
                    <span>+ CAFFEINE</span>
                    <span className="text-[7px] text-white/40 block mt-0.5">CURRENT: {brewMixture.caffeine}U</span>
                  </button>
                  <button 
                    onClick={() => handleAddIngredient('glow')}
                    className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 text-[10px] font-black transition-all rounded-sm flex flex-col items-center"
                  >
                    <span>+ BIO-GLOW</span>
                    <span className="text-[7px] text-white/40 block mt-0.5">CURRENT: {brewMixture.glow}U</span>
                  </button>
                  <button 
                    onClick={() => handleAddIngredient('ethanol')}
                    className="py-2.5 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/20 text-[10px] font-black transition-all rounded-sm flex flex-col items-center"
                  >
                    <span>+ ETHANOL</span>
                    <span className="text-[7px] text-white/40 block mt-0.5">CURRENT: {brewMixture.ethanol}U</span>
                  </button>
                  <button 
                    onClick={() => handleAddIngredient('coolant')}
                    className="py-2.5 bg-blue-500/10 hover:bg-blue-500 hover:text-black border border-blue-500/20 text-[10px] font-black transition-all rounded-sm flex flex-col items-center"
                  >
                    <span>+ COOLANT</span>
                    <span className="text-[7px] text-white/40 block mt-0.5">CURRENT: {brewMixture.coolant}U</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Serving / Dump Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={handleDumpMixture}
                className="py-3 bg-red-500/10 hover:bg-red-500 hover:text-black border border-red-500/20 text-xs font-black uppercase tracking-widest rounded-sm transition-all"
              >
                🗑️ DUMP & PURGE BEAKER
              </button>

              <button 
                onClick={handleServeStimulant}
                className="py-3 bg-secondary text-black hover:bg-black hover:text-secondary border border-secondary text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(0,253,193,0.3)]"
              >
                🔮 TRANSMIT / SERVE
              </button>
            </div>

            {/* Scrolling console status logs */}
            <div className="bg-black/60 p-4 h-20 text-[8px] text-white/30 text-left overflow-y-hidden border border-white/5 leading-normal select-none uppercase">
              <p className="text-secondary font-bold">&gt;&gt; BREW_SYNTH_CORE // MANUAL_DISPENSE_ONLINE</p>
              <p>&gt;&gt; ACTIVE FORMULA SYNAPSE KEYWORDS: GIGA, CRUSH, SOUR, FROST_BYTE</p>
              <p className="text-white">&gt;&gt; BAR_DASHBOARD_MSG: {brewStatusMsg}</p>
            </div>
          </div>
        )}

        {/* NEON BREW_SYNTH SHIFT COMPLETED SCREEN */}
        {gameState === 'brew_over' && brewPayoutResult && (
          <div className="bg-gradient-to-b from-[#0b100d] to-[#040504] p-8 border border-secondary/30 rounded-sm font-mono text-center relative max-w-lg mx-auto">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-secondary/40 animate-pulse" />
            
            <h3 className="text-xl font-black text-secondary uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              🔮 SYNTHESIS_CYCLE_COMPLETE 🔮
            </h3>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] mb-6">Bar shift ended due to contract completion or reputation stress</p>

            <div className="space-y-4 mb-8 text-left bg-black/40 p-5 border border-white/5 rounded-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">DRINKS SERVED:</span>
                <span className="text-white font-black text-base">{brewScore} PERFECT STIMULANTS</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">USD SAVINGS GRANTED:</span>
                <span className="text-[#00ff66] font-black text-sm">+ ${brewPayoutResult.usd.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">NEON CREDITS SYNTHESIZED:</span>
                <span className="text-secondary font-black text-sm">+ {brewPayoutResult.nc} NC</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase text-[10px]">NEURAL IQ ENHANCEMENT:</span>
                <span className="text-amber-400 font-black text-sm">{brewPayoutResult.iq > 0 ? `+ ${brewPayoutResult.iq} IQ` : '0 (Score > 4 Required)'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={startToPlayBrew}
                className="py-2.5 bg-secondary/15 text-secondary border border-secondary/30 uppercase text-[10px] font-black tracking-widest hover:bg-secondary hover:text-black hover:shadow-[0_0_15px_rgba(0,253,193,0.3)] transition-all flex items-center justify-center gap-2 px-1 text-center"
              >
                <Coffee size={14} /> RE-ENGAGE (-10 Happiness)
              </button>
              
              <button 
                onClick={() => setGameState('lounge')}
                className="py-2.5 bg-white/5 border border-white/10 text-white/40 uppercase text-[10px] font-black tracking-widest hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                RETURN TO LOUNGE
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER SUMMARY */}
        {gameState === 'game_over' && payoutResult && (
          <div className="bg-gradient-to-b from-[#110c0d] to-[#040405] p-8 border border-red-500/30 rounded-sm font-mono text-center relative max-w-lg mx-auto">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-red-500/40 animate-pulse" />
            
            <h3 className="text-xl font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              ⚠️ NEURAL_UPLINK_TERMINATED ⚠️
            </h3>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] mb-6">Connection frame failed due to brain stress levels</p>

            <div className="space-y-4 mb-8 text-left bg-black/40 p-5 border border-white/5 rounded-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">SYNC_SCORE achieved:</span>
                <span className="text-white font-black text-base">{score} Nodes</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">USD SAVINGS GRANTED:</span>
                <span className="text-[#00ff66] font-black text-sm">+ ${payoutResult.usd.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-white/40 uppercase text-[10px]">NEON CREDITS SYNTHESIZED:</span>
                <span className="text-secondary font-black text-sm">+ {payoutResult.nc} NC</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/40 uppercase text-[10px]">NEURAL IQ ENHANCEMENT:</span>
                <span className="text-amber-400 font-black text-sm">{payoutResult.iq > 0 ? `+ ${payoutResult.iq} IQ` : '0 (Score > 12 Required)'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={startToPlay}
                className="py-2.5 bg-tertiary/15 text-tertiary border border-tertiary/30 uppercase text-[10px] font-black tracking-widest hover:bg-tertiary hover:text-black hover:shadow-[0_0_15px_rgba(255,113,106,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <Gamepad2 size={14} /> RE-ENGAGE (-10 Happiness)
              </button>
              
              <button 
                onClick={() => setGameState('lounge')}
                className="py-2.5 bg-white/5 border border-white/10 text-white/40 uppercase text-[10px] font-black tracking-widest hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                RETURN TO LOUNGE
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const FloatingLabel = ({ text, color, position }: { text: string; color: 'secondary' | 'tertiary'; position: string }) => (
  <div className={`absolute ${position} text-[9px] font-black tracking-[0.2em] animate-pulse flex items-center gap-2 ${color === 'secondary' ? 'text-secondary' : 'text-tertiary'}`}>
    <span className={`w-2 h-2 rounded-full ${color === 'secondary' ? 'bg-secondary shadow-[0_0_8px_#00fdc1]' : 'bg-tertiary shadow-[0_0_8px_#ff716a]'}`} />
    {text}
  </div>
);

// --- Main App ---

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameState, setGameState] = useState<'onboarding' | 'tutorial' | 'playing'>('onboarding');
  const [stats, setStats] = useState<UserStats>({
    name: '',
    netWorth: 0,
    happiness: 0,
    iq: 0,
    level: 1,
    careerPath: 'Tech'
  });
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<string | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [implants, setImplants] = useState<string[]>([]);
  const [syndicateHires, setSyndicateHires] = useState<string[]>([]);
  const [contraband, setContraband] = useState<Record<string, number>>({});
  const [nodesBreached, setNodesBreached] = useState<number>(0);
  const [activeView, setActiveView] = useState('map');
  const [activeTab, setActiveTab] = useState('market');
  const [day, setDay] = useState(1);
  const [netWorthHistory, setNetWorthHistory] = useState<{ day: number; value: number }[]>([]);
  const [notifications, setNotifications] = useState<{ id: number; msg: string }[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [activeUpgrades, setActiveUpgrades] = useState<Record<string, { title: string; progress: number; duration: number }>>({});
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<Record<string, string[]>>({});
  const [marketHistory, setMarketHistory] = useState<Record<string, number[]>>({
    'TECH': [150, 155, 152, 158, 162],
    'ENERGY': [80, 82, 79, 75, 78],
    'BIO': [210, 215, 220, 218, 225],
    'FIN': [120, 118, 122, 125, 128],
    'BTC': [62000, 63500, 61000, 64000, 65200]
  });

  // Mock Market API: Real-time price updates with drift and shocks
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketHistory(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const currentPrices = next[key];
          const lastPrice = currentPrices[currentPrices.length - 1];
          
          // Instrument-specific parameters for realistic behavior
          const config: Record<string, { vol: number; drift: number; shockRate: number }> = {
            'TECH': { vol: 0.012, drift: 0.0015, shockRate: 0.05 },
            'ENERGY': { vol: 0.008, drift: 0.0008, shockRate: 0.03 },
            'BIO': { vol: 0.022, drift: 0.002, shockRate: 0.07 },
            'FIN': { vol: 0.006, drift: 0.0012, shockRate: 0.02 },
            'BTC': { vol: 0.035, drift: 0.0025, shockRate: 0.10 }
          };

          const settings = config[key] || { vol: 0.015, drift: 0.001, shockRate: 0.05 };
          
          const shockRoll = Math.random();
          let shockValue = 0;
          
          // Occasional sharp drops (crashes) or spikes
          if (shockRoll < settings.shockRate * 0.4) { 
            // Negative shock: -4% to -12%
            shockValue = -0.04 - Math.random() * 0.08;
          } else if (shockRoll > 1 - (settings.shockRate * 0.2)) {
            // Positive spike: +5% to +15%
            shockValue = 0.05 + Math.random() * 0.1;
          }

          // Combined fluctuation: drift + random walk + occasional shock
          const noise = (Math.random() * settings.vol * 2 - settings.vol);
          const changeFactor = 1 + settings.drift + noise + shockValue;
          const newPrice = Math.max(0.01, lastPrice * changeFactor);
          
          // Limit history for performance and visual clarity
          const newHistory = [...currentPrices, newPrice].slice(-80);
          next[key] = newHistory;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const cityEvents: CityEvent[] = [
    {
      id: 'maintenance',
      title: 'SYSTEM_MAINTENANCE',
      description: 'Central GRID backbone undergoing mandatory firmware updates. All building operational efficiency reduced.',
      type: 'alert',
      impact: '-40%_OUTPUT',
      duration: 2
    },
    {
      id: 'surge',
      title: 'MARKET_DATA_SURGE',
      description: 'Incoming data packet density from off-world markets is peaking. Financial corridors are hypersensitive.',
      type: 'boost',
      impact: '+50%_BANK_REV',
      duration: 3
    },
    {
      id: 'blackout',
      title: 'SECTOR_7_BLACKOUT',
      description: 'Critical failure in the geothermal tap. Industrial sectors are drawing priority power.',
      type: 'alert',
      impact: 'GYM_OFFLINE',
      duration: 2
    },
    {
      id: 'boom',
      title: 'NEON_FESTIVAL',
      description: 'Annual bioluminescence celebration. High social engagement and increased local consumption.',
      type: 'boost',
      impact: '+30%_GENERAL_REV',
      duration: 5
    }
  ];

  const [activeCityEvent, setActiveCityEvent] = useState<CityEvent | null>(null);
  const [eventCyclesRemaining, setEventCyclesRemaining] = useState(0);

  // Handle City Events Cycle
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Tick down active event
    if (activeCityEvent) {
      if (eventCyclesRemaining > 0) {
        const interval = setInterval(() => {
          setEventCyclesRemaining(prev => prev - 1);
        }, 15000); // Game "cycle" duration
        return () => clearInterval(interval);
      } else {
        setActiveCityEvent(null);
        addNotification("EVENT_EXPIRED: System stability restored.");
      }
    } else {
      // Chance to trigger new event
      const interval = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 20s
          const randomEvent = cityEvents[Math.floor(Math.random() * cityEvents.length)];
          setActiveCityEvent(randomEvent);
          setEventCyclesRemaining(randomEvent.duration);
          addNotification(`NEW_EVENT: ${randomEvent.title}`);
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [gameState, activeCityEvent, eventCyclesRemaining]);

  const [playerData, setPlayerData] = useState<PlayerData>({
    inventory: {},
    vault: {},
    bank: {
      savings: 5000,
      neonCredits: 42500,
      creditLimit: 10000,
      creditUsed: 0,
      transactionHistory: []
    },
    portfolio: {},
    tasks: [
      { id: 't1', title: 'Process Sector 7 Data', completed: false, reward: 500, progress: 0 },
      { id: 't2', title: 'Optimize Mainframe', completed: false, reward: 800, progress: 0 }
    ],
    skills: { coding: 5, finance: 2, negotiation: 3 }
  });

  const [activeInteraction, setActiveInteraction] = useState<{ type: string; id: string } | null>(null);

  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [hasDismissedBriefing, setHasDismissedBriefing] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && !aiBriefing && !hasDismissedBriefing) {
      const fetchBriefing = async () => {
        try {
          const response = await fetch('/api/briefing', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stats, playerData, day })
          });
          const data = await response.json();
          if (data.briefing) setAiBriefing(data.briefing);
        } catch (err) {
          console.error("Briefing error:", err);
        }
      };
      fetchBriefing();
    }
  }, [gameState, day, hasDismissedBriefing]);

  useEffect(() => {
    // Reset dismissal on new day so we get a fresh briefing
    setHasDismissedBriefing(false);
    setAiBriefing(null);
  }, [day]);

  const [buildingStatuses, setBuildingStatuses] = useState<Record<string, 'idle' | 'active' | 'warning' | 'alert'>>({
    office: 'active', // Start with an active office
    bank: 'idle',
    school: 'idle',
    bar: 'idle',
    gym: 'idle'
  });
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [currentJob, setCurrentJob] = useState<Job>({
    title: 'Junior Associate',
    company: 'Startup Hub',
    salary: '$45K / Year',
    salaryNum: 45000,
    performance: 80,
    nextPromotion: 'Associate (Est. 3 months)'
  });

  const buildingCoords: Record<string, { x: number; y: number }> = {
    office: { x: 48, y: 42 },
    bank: { x: 25, y: 65 },
    school: { x: 50, y: 75 },
    bar: { x: 75, y: 65 },
    gym: { x: 35, y: 35 },
  };

  const buildingDetails: Record<string, {
    title: string;
    description: string;
    stats: string[];
    quickAction: string;
    icon: React.ReactNode;
    revenue: string;
    activeIssues: string[];
  }> = {
    office: {
      title: 'Corporate HQ',
      description: 'The nerve center of operations. High-intensity workflow and strategic meetings.',
      stats: ['Occupancy: 88%', 'Energy Usage: High', 'Work Hours: 24/7'],
      quickAction: 'Request Overtime',
      icon: <Briefcase size={20} />,
      revenue: '$12,400 / Cycle',
      activeIssues: ['Network latency in Sector 7', 'HVAC maintenance required']
    },
    bank: {
      title: 'Central Bank',
      description: 'Vaults containing the city\'s liquid assets and high-security trading floors.',
      stats: ['Interest Rate: 4.2%', 'Security: MAX', 'Liquidity: Stable'],
      quickAction: 'Check Balance',
      icon: <Landmark size={20} />,
      revenue: '0.45% APY Portfolio Yield',
      activeIssues: []
    },
    school: {
      title: 'Neural Academy',
      description: 'Where minds are optimized for the digital age through rapid neural linking.',
      stats: ['Efficiency: 99%', 'Enrollment: Full', 'Link Rate: 1.2 GB/s'],
      quickAction: 'Daily Log',
      icon: <GraduationCap size={20} />,
      revenue: '800 IQ Points / Batch',
      activeIssues: ['Sync desaturation in Level 2']
    },
    bar: {
      title: 'The Afterlife',
      description: 'Social hub for late-night networking and stress reduction under neon lights.',
      stats: ['Vibe: Chill', 'Music: Synthwave', 'Happy Hour: ON'],
      quickAction: 'Order Drink',
      icon: <GlassWater size={20} />,
      revenue: '-15% Stress / Session',
      activeIssues: ['Audio driver glitch (Static)']
    },
    gym: {
      title: 'Neon Pulse Gym',
      description: 'Ultra-modern fitness facility. Boost your physical and mental well-being.',
      stats: ['Capacity: 45/100', 'Gear: Pro-Line', 'Vibe: High Energy'],
      quickAction: 'Initiate Workout',
      icon: <Dumbbell size={24} />,
      revenue: '+10% Happiness / Session',
      activeIssues: []
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target && (
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable
        )
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Keyboard navigation of buildings on map
      if (activeView === 'map') {
        const buildingsList = ['gym', 'office', 'bank', 'school', 'bar'];
        
        if (e.key === 'Tab' || key === 'arrowright' || key === 'arrowdown') {
          e.preventDefault();
          const currentIndex = selectedMapBuilding ? buildingsList.indexOf(selectedMapBuilding) : -1;
          const nextIndex = e.shiftKey
            ? (currentIndex === -1 ? buildingsList.length - 1 : (currentIndex - 1 + buildingsList.length) % buildingsList.length)
            : (currentIndex === -1 ? 0 : (currentIndex + 1) % buildingsList.length);
          setSelectedMapBuilding(buildingsList[nextIndex]);
          return;
        }

        if (key === 'arrowleft' || key === 'arrowup') {
          e.preventDefault();
          const currentIndex = selectedMapBuilding ? buildingsList.indexOf(selectedMapBuilding) : -1;
          const prevIndex = currentIndex === -1 ? buildingsList.length - 1 : (currentIndex - 1 + buildingsList.length) % buildingsList.length;
          setSelectedMapBuilding(buildingsList[prevIndex]);
          return;
        }

        if (e.key === 'Enter' || e.key === ' ') {
          if (selectedMapBuilding) {
            e.preventDefault();
            moveToBuilding(selectedMapBuilding);
            setSelectedMapBuilding(null);
            return;
          }
        }
      }

      // Hotkey F: Toggle Financial Hub modal
      if (key === 'f') {
        e.preventDefault();
        setActiveModal(prev => prev === 'financial_hub' ? null : 'financial_hub');
        return;
      }

      // Hotkey A: Toggle AI Advisor / Tactical briefing
      if (key === 'a') {
        e.preventDefault();
        setActiveModal(prev => prev === 'ai_briefing' ? null : 'ai_briefing');
        setActiveTab('advisor');
        return;
      }

      // Escape key to navigate backward or close overlays
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeModal) {
          setActiveModal(null);
        } else if (selectedMapBuilding) {
          setSelectedMapBuilding(null);
        } else if (activeView !== 'map') {
          setActiveView('map');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, activeView, selectedMapBuilding, activeModal]);

  const handleOnboardingComplete = (initialStats: UserStats) => {
    setStats(initialStats);
    setNetWorthHistory([{ day: 1, value: initialStats.netWorth }]);
    setGameState('tutorial');
    addNotification(`Welcome, ${initialStats.name}. Simulation initialized.`);
  };

  const moveToBuilding = (building: string) => {
    const coords = buildingCoords[building];
    if (!coords) return;

    setIsMoving(true);
    setStats(prev => ({ ...prev, position: coords }));

    // Simulate walking time
    setTimeout(() => {
      setIsMoving(false);
      setActiveView(building);
    }, 1000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (gameState !== 'playing') return;
    // Prevent default browser zoom/scroll if needed, but here we just want to catch the delta
    const delta = e.deltaY;
    const zoomStep = 0.05;
    setZoom(prev => {
      const newZoom = delta > 0 ? prev - zoomStep : prev + zoomStep;
      return Math.max(0.3, Math.min(2, newZoom));
    });
  };

  const handleNextDay = () => {
    const nextDayVal = day + 1;
    setDay(nextDayVal);
    
    // Update building statuses based on random simulation events
    setBuildingStatuses(prev => {
      const next = { ...prev };
      const buildings = Object.keys(next);
      const statuses: ('idle' | 'active' | 'warning' | 'alert')[] = ['idle', 'active', 'warning', 'alert'];
      
      buildings.forEach(b => {
        const rand = Math.random();
        if (rand > 0.7) {
          next[b] = statuses[Math.floor(Math.random() * statuses.length)];
        }
      });
      return next;
    });

    setStats(prev => {
      let income = prev.careerPath === 'Finance' ? 4200 : prev.careerPath === 'Tech' ? 3100 : 2400;
      
      // Factoring building upgrades into income
      let buildingBonus = 0;
      Object.keys(purchasedUpgrades).forEach(bId => {
        purchasedUpgrades[bId].forEach(upg => {
          // Titles from BuildingDashboard: Uplink, Core, Labs, Stage, Pods etc.
          if (upg.includes('Uplink')) buildingBonus += 1500;
          if (upg.includes('Core')) buildingBonus += 2500;
          if (upg.includes('Labs') || upg.includes('Pods')) buildingBonus += 1000;
          if (upg.includes('Mixology') || upg.includes('Stage')) buildingBonus += 600;
          if (upg.includes('Scanners')) buildingBonus += 400;
        });
      });

      income += buildingBonus;

      const expenses = 1500; // Base living cost
      const newNetWorth = prev.netWorth + income - expenses;
      
      setNetWorthHistory(h => [...h, { day: nextDayVal, value: newNetWorth }]);

      // Level up every $50k net worth
      const newLevel = Math.floor(newNetWorth / 50000) + 1;
      
      if (newLevel > prev.level) {
        addNotification(`LEVEL UP: You are now Level ${newLevel}!`);
      }

      return {
        ...prev,
        netWorth: newNetWorth,
        happiness: Math.max(0, Math.min(100, prev.happiness - 2)), // Daily grind fatigue
        level: newLevel
      };
    });
    addNotification("Day cycle complete. Financials updated.");
  };

  const handleMarketResearch = async () => {
    addNotification('Initiating AI Market Analysis...');
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, playerData })
      });
      const data = await response.json();
      if (data.analysis) {
        setAiBriefing(data.analysis);
        setHasDismissedBriefing(false);
      }
    } catch (err) {
      console.error("Research error:", err);
      addNotification('ERROR: Research link failed.');
    }
  };

  const handleGameAction = (action: any) => {
    switch (action.type) {
      case 'BANK_WITHDRAW':
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings - action.amount,
            transactionHistory: [
              { id: Date.now().toString(), type: 'withdrawal', amount: action.amount, date: new Date().toISOString().split('T')[0], status: 'completed' },
              ...prev.bank.transactionHistory
            ]
          }
        }));
        // Cash is conceptually part of net worth already in this simple model, 
        // or we could track a 'cash' stat separately.
        break;
      case 'PURCHASE':
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: prev.bank.savings - action.amount
          }
        }));
        if (action.msg) addNotification(action.msg);
        break;
      case 'LOG':
        if (action.msg) addNotification(action.msg);
        break;
      case 'STATS_UPDATE':
        setStats(prev => ({
          ...prev,
          ...action.stats
        }));
        if (action.msg) addNotification(action.msg);
        break;
      case 'NOTIFY':
        if (action.msg) addNotification(action.msg);
        break;
    }
    if (action.msg) addNotification(action.msg);
  };

  const handleInteraction = (type: string, itemId: string, payload?: any) => {
    switch (type) {
      case 'office':
        if (itemId === 'desk') {
          setStats(prev => ({ ...prev, netWorth: prev.netWorth + 200, iq: prev.iq + 1, happiness: Math.max(0, prev.happiness - 2) }));
          addNotification("Shift completed. Data processed. Net Worth +$200, IQ +1");
        } else if (itemId === 'server') {
          setStats(prev => ({ ...prev, netWorth: prev.netWorth + 500, iq: prev.iq + 3, happiness: Math.max(0, prev.happiness - 5) }));
          addNotification("System optimization successful. Output scaled. Net Worth +$500, IQ +3");
        } else if (itemId === 'coffee') {
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - 50, happiness: Math.min(100, prev.happiness + 5) }));
          addNotification("Caffeine boost successful. Happiness +5");
        }
        break;
      case 'bank':
        if (itemId === 'loan') {
          setStats(prev => ({ ...prev, netWorth: prev.netWorth + 10000, happiness: Math.max(0, prev.happiness - 5) }));
          addNotification("Loan approved. $10,000 deposited. Debt cycle initialized.");
        } else if (itemId === 'swap') {
          const swapAmount = payload?.amount || 0;
          const swapRate = payload?.rate || 1.24;
          const usdValue = swapAmount * swapRate;
          
          if (swapAmount > 0 && playerData.bank.neonCredits >= swapAmount) {
            setPlayerData(prev => ({
              ...prev,
              bank: {
                ...prev.bank,
                neonCredits: prev.bank.neonCredits - swapAmount,
                savings: prev.bank.savings + usdValue,
                transactionHistory: [
                  { 
                    id: Date.now().toString(), 
                    type: 'swap', 
                    amount: usdValue, 
                    date: new Date().toISOString().split('T')[0], 
                    description: `Converted ${swapAmount.toLocaleString()} NC to USD` 
                  },
                  ...prev.bank.transactionHistory
                ]
              }
            }));
            setStats(prev => ({ ...prev, netWorth: prev.netWorth + usdValue }));
            addNotification(`NC Swap complete. $${usdValue.toLocaleString()} Credits synthesized.`);
          }
        } else if (itemId === 'invest') {
          const gain = Math.floor(stats.netWorth * (Math.random() * 0.1 - 0.02)); // -2% to +8%
          setStats(prev => ({ ...prev, netWorth: prev.netWorth + gain }));
          addNotification(gain >= 0 ? `Trade successful! Capital gains: $${gain.toLocaleString()}` : `Market fluctuation loss: $${Math.abs(gain).toLocaleString()}`);
        } else if (itemId === 'access') {
          addNotification("Access Denied: Keycard validation failed. Source: Sector 4.");
        }
        break;
      case 'school':
        if (itemId === 'iq') {
          const cost = 120000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Advanced Training ($${cost/1000}K)`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 5 }));
          addNotification("Neural expansion complete. IQ +5");
        } else if (itemId === 'hack') {
          const cost = 85000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Cyber Security ($${cost/1000}K)`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 3 }));
          addNotification("Firewall protocols internalized. IQ +3");
        } else if (itemId === 'mgmt') {
          const cost = 200000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Strategy Course ($${cost/1000}K)`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 10 }));
          addNotification("Strategic pathways mapped. IQ +10");
        } else if (itemId === 'leadership') {
          const cost = 150000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Leadership Training ($${cost/1000}K)`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, happiness: Math.min(100, prev.happiness + 15) }));
          addNotification("Leadership protocols established. Morale +15");
        } else if (itemId === 'query_market') {
          const cost = 5000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds for Market Analysis ($5K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost }));
          addNotification("Market volatility mapping complete. Sector 7 high-risk detected.");
        } else if (itemId === 'query_history') {
          const cost = 2000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds for History Sync ($2K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 1 }));
          addNotification("Lore decoded: The Great Crash of 2029 was a cascade failure. IQ +1");
        } else if (itemId === 'query_terminal') {
          const cost = 25000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds for Terminal Decryption ($25K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 5 }));
          addNotification("System kernel accessed. Strategic insight acquired. IQ +5");
        } else if (itemId === 'synaptic_boost') {
          const cost = 50000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds for Synaptic Boost ($50K)"); return; }
          const success = Math.random() > 0.4;
          if (success) {
            playTerminalClick('success');
            setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 15, happiness: Math.max(0, prev.happiness - 5) }));
            addNotification("SUCCESS: Synaptic pathways widened. IQ +15");
          } else {
            playTerminalClick('fail');
            setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: Math.max(0, prev.iq - 10), happiness: Math.max(0, prev.happiness - 10) }));
            addNotification("FAILURE: Neuro-static rebound detected. IQ -10, Happiness -10");
          }
        } else if (itemId === 'endorphin_loop') {
          const cost = 15000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds for Endorphin Loop ($15K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, happiness: Math.min(100, prev.happiness + 20), iq: Math.max(0, prev.iq - 5) }));
          addNotification("Euphoria protocol active. Happiness +20, IQ -5 (Temp fatigue).");
        } else if (itemId === 'skill_fast_learner') {
          const cost = 400000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds ($400K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 25 }));
          addNotification("Hyper-Learning installed. IQ permanently boosted by massive margin.");
        } else if (itemId === 'skill_market_eye') {
          const cost = 750000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds ($750K)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 30 }));
          addNotification("Analytical Eye installed. Market fluctuations are now transparent to you.");
        } else if (itemId === 'skill_social_sync') {
          const cost = 1200000;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification("Insufficient funds ($1.2M)"); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, happiness: Math.min(100, prev.happiness + 40) }));
          addNotification("Empathetic Link installed. Global social network synced to your cortex.");
        } else if (itemId === 'edu_basic_hack') {
          playTerminalClick('success');
          setStats(prev => ({ ...prev, iq: prev.iq + 1 }));
          addNotification("Querying tutorial complete: Decryption index updated. IQ +1");
        } else if (itemId === 'edu_fin_basics') {
          const cost = 100;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Credit Routing ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 1 }));
          addNotification("Credit routing protocols learned. IQ +1");
        } else if (itemId === 'edu_cyber_hygiene') {
          playTerminalClick('success');
          setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 2) }));
          addNotification("Cortical cache cleared. Happiness +2");
        } else if (itemId === 'edu_open_source') {
          const cost = 250;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Open-Source Protocols ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 2 }));
          addNotification("Urban repository protocols acquired. IQ +2");
        } else if (itemId === 'edu_street_smarts') {
          const cost = 50;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Street Smarts ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 1 }));
          addNotification("Metropolitan trade flow mapped. IQ +1");
        } else if (itemId === 'edu_ai_fundamentals') {
          playTerminalClick('success');
          setStats(prev => ({ ...prev, iq: prev.iq + 1 }));
          addNotification("Studied classic LLM structural paradigms. IQ +1");
        } else if (itemId === 'edu_wellness_med') {
          const cost = 10;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Sub-vocal Meditation ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, happiness: Math.min(100, prev.happiness + 4) }));
          addNotification("Vibration filtering integrated. Happiness +4");
        } else if (itemId === 'edu_shell_scripting') {
          const cost = 500;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Command Line Automation ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 3 }));
          addNotification("Terminal cron-chains established. IQ +3");
        } else if (itemId === 'edu_hardware_tinker') {
          const cost = 150;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Node Hotwiring ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 1, happiness: Math.min(100, prev.happiness + 2) }));
          addNotification("Logic boards re-soldered. IQ +1, Happiness +2");
        } else if (itemId === 'edu_crypto_arbitrage') {
          const cost = 800;
          if (stats.netWorth < cost) { playTerminalClick('fail'); addNotification(`Insufficient funds for Distribution Ledger basics ($${cost})`); return; }
          playTerminalClick('success');
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 4 }));
          addNotification("Arbitrage chains decoded. IQ +4");
        }
        break;
      case 'bar':
        if (itemId === 'coffee' || itemId === 'counter') {
          const cost = 150;
          if (stats.netWorth < cost) { addNotification("Insufficient funds for Premium Coffee ($150)"); return; }
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, happiness: Math.min(100, prev.happiness + 10) }));
          addNotification("Stress levels dropping. Happiness +10");
        } else if (itemId === 'energy_drink' || itemId === 'games') {
          const cost = 450;
          if (stats.netWorth < cost) { addNotification("Insufficient funds ($450)"); return; }
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 1, happiness: Math.min(100, prev.happiness + 5) }));
          addNotification("Cognitive sharpening detected. Happiness +5, IQ +1");
        } else if (itemId === 'networking' || itemId === 'talent') {
          const cost = 1200;
          if (stats.netWorth < cost) { addNotification("Insufficient funds ($1.2K)"); return; }
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost, iq: prev.iq + 2, happiness: Math.min(100, prev.happiness + 10) }));
          addNotification("Valuable connections made. Happiness +10, IQ +2");
        } else if (itemId === 'intel') {
          const cost = 5000;
          if (stats.netWorth < cost) { addNotification("Insufficient funds for Intel ($5K)"); return; }
          setStats(prev => ({ ...prev, netWorth: prev.netWorth - cost }));
          addNotification("Insider contacted. Market data stream established.");
        } else if (itemId === 'music') {
          setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 2) }));
          addNotification("Vibe check: Optimal. Happiness +2");
        }
        break;
      default:
        if (payload) addNotification(payload);
    }
  };

  const handleUpgrade = (buildingId: string, upgrade: { title: string; cost: string; effect: string }) => {
    if (activeUpgrades[buildingId]) return;

    const costNum = parseInt(upgrade.cost.replace(/[^0-9]/g, '')) * 1000;
    if (stats.netWorth < costNum) {
      addNotification(`Insufficient funds for ${upgrade.title}`);
      return;
    }

    setStats(prev => ({ ...prev, netWorth: prev.netWorth - costNum }));
    addNotification(`Construction started: ${upgrade.title} at ${buildingDetails[buildingId].title}`);
    
    const duration = 5000; // 5 seconds for demonstration
    const startTime = Date.now();

    setActiveUpgrades(prev => ({
      ...prev,
      [buildingId]: { title: upgrade.title, progress: 0, duration }
    }));

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      if (progress >= 100) {
        clearInterval(interval);
        setActiveUpgrades(prev => {
          const next = { ...prev };
          delete next[buildingId];
          return next;
        });
        // Add to permanent purchased upgrades
        setPurchasedUpgrades(prev => ({
          ...prev,
          [buildingId]: [...(prev[buildingId] || []), upgrade.title]
        }));

        addNotification(`UPGRADE COMPLETE: ${upgrade.title} is now operational! ${upgrade.effect}.`);
        
        // Dynamic effect: improving status
        setBuildingStatuses(prev => ({
          ...prev,
          [buildingId]: 'active'
        }));
      } else {
        setActiveUpgrades(prev => ({
          ...prev,
          [buildingId]: { ...prev[buildingId], progress }
        }));
      }
    }, 100);
  };

  const handleTaskProgress = (taskId: string, amount: number) => {
    setPlayerData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId && !task.completed) {
          const newProgress = Math.min(100, task.progress + amount);
          const isNowCompleted = newProgress === 100;
          
          if (isNowCompleted) {
            setStats(s => ({ ...s, netWorth: s.netWorth + task.reward }));
            addNotification(`Task Complete: ${task.title}. Reward: $${task.reward}`);
          }
          
          return { ...task, progress: newProgress, completed: isNowCompleted };
        }
        return task;
      })
    }));
  };

  const addNotification = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-[#0a0b10]"
      onWheel={handleWheel}
    >
      <VisualEffectsOverlay />
      
      {/* Global Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-secondary/5 to-transparent" />
      </div>

      <AnimatePresence>
        {gameState === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'tutorial' && <Tutorial onComplete={() => setGameState('playing')} />}
      </AnimatePresence>

      <AnimatePresence>
        {isLoaded && gameState === 'playing' && (
          <div className="relative h-full w-full">
            <div className="z-[150] relative">
              <Header stats={stats} onOpenModal={setActiveModal} />
              <Sidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onNewsClick={setSelectedNewsItem}
                stats={stats}
                playerData={playerData}
                marketData={marketHistory}
                activeCityEvent={activeCityEvent}
                day={day}
                syndicateHires={syndicateHires}
              />
            </div>

            <AnimatePresence>
              {aiBriefing && !hasDismissedBriefing && activeView === 'map' && (
                <GlobalAIBriefing 
                  briefing={aiBriefing} 
                  onDismiss={() => setHasDismissedBriefing(true)} 
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeView !== 'map' && (
                <BuildingInterior 
                  type={activeView} 
                  onBack={() => setActiveView('map')} 
                  stats={stats}
                  playerData={playerData}
                  marketData={marketHistory}
                  onAction={handleGameAction}
                  onTaskProgress={handleTaskProgress}
                  implants={implants}
                  setImplants={setImplants}
                  syndicateHires={syndicateHires}
                  setSyndicateHires={setSyndicateHires}
                  contraband={contraband}
                  setContraband={setContraband}
                  nodesBreached={nodesBreached}
                  setNodesBreached={setNodesBreached}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedMapBuilding && activeView === 'map' && (
                <BuildingInspector 
                  building={{ 
                    ...buildingDetails[selectedMapBuilding], 
                    name: selectedMapBuilding 
                  }}
                  status={buildingStatuses[selectedMapBuilding]}
                  activeUpgrade={activeUpgrades[selectedMapBuilding]}
                  onClose={() => setSelectedMapBuilding(null)}
                  onEnter={() => {
                    moveToBuilding(selectedMapBuilding);
                    setSelectedMapBuilding(null);
                  }}
                  onQuickAction={(action) => {
                    if (action === 'RESEARCH_MARKET_TRENDS') {
                      handleMarketResearch();
                    } else if (selectedMapBuilding === 'bank') setActiveModal('bank');
                    else if (selectedMapBuilding === 'school') setActiveModal('school');
                    else if (selectedMapBuilding === 'bar') setActiveModal('bar');
                    else if (selectedMapBuilding === 'office') {
                      setStats(prev => ({ ...prev, netWorth: prev.netWorth + 1000, happiness: Math.max(0, prev.happiness - 10) }));
                      addNotification('Overtime Authorized: $1,000 bonus, -10 Happiness.');
                    }
                    else if (selectedMapBuilding === 'gym') {
                      setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 20) }));
                      addNotification('Workout Complete: Neural endorphins released. +20 Happiness.');
                    }
                    else addNotification(`Action: ${action} initiated at ${buildingDetails[selectedMapBuilding].title}`);
                  }}
                />
              )}
            </AnimatePresence>
            
            {/* Zoom Controls */}
            {activeView === 'map' && (
              <div className="fixed bottom-32 right-6 z-[160] flex flex-col gap-2">
                <button 
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                  className="w-10 h-10 bg-surface-container border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all shadow-xl"
                >
                  <Plus size={20} />
                </button>
                <button 
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="w-10 h-10 bg-surface-container border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all shadow-xl"
                >
                  <div className="w-4 h-0.5 bg-current" />
                </button>
                <button 
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  className="w-10 h-10 bg-surface-container border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all shadow-xl text-[10px] font-black"
                >
                  RESET
                </button>
              </div>
            )}

            <motion.div 
              drag
              dragMomentum={false}
              onDrag={(e, info) => setPan(prev => ({ x: prev.x + info.delta.x, y: prev.y + info.delta.y }))}
              animate={{ 
                scale: zoom,
                x: pan.x,
                y: pan.y
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative w-[4000px] h-[3000px] flex-shrink-0">
                {/* Background Isometric City */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1dQInVco6U4RI9nTAWx79hVNPVf7sou49LmVK4Mwex2J141DMD05J2LfVt-Cn1OavOICYetkth64IuHq-lRxVyGBN52l46cqdswv8sHQyIE3_jJPnUbsa8Q_iT-f8uc_PfksTLG3pK_3JCi88ym5pPatgbhDbTzYXElpM71wLm5V4OkTPH9mbit7WSi5dKHLycvm_OJKcqa_bzKyyAZIO0yZTZpnVPraxCP7RfwaCh-qzKiGuAc90L5HcY1pCrTEg-E5nMJGSjtmD" 
                    alt="Isometric Cityscape" 
                    className="w-full h-full object-cover opacity-60 grayscale-[20%] contrast-[110%]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-transparent to-surface/60 pointer-events-none" />
                  
                  {/* Atmospheric Layers */}
                  <DistrictLabels />
                  <DataFlowLines />
                </div>

                <main className="relative h-full w-full">
                  {/* Selected Building Spotlight */}
                  {selectedMapBuilding && (
                    <motion.div
                      initial={false}
                      animate={{
                        top: (selectedMapBuilding === 'office' ? '42%' : 
                              selectedMapBuilding === 'bank' ? '65%' :
                              selectedMapBuilding === 'school' ? '75%' :
                              selectedMapBuilding === 'bar' ? '65%' :
                              selectedMapBuilding === 'gym' ? '35%' : '50%'),
                        left: (selectedMapBuilding === 'office' ? '48%' : 
                               selectedMapBuilding === 'bank' ? '25%' :
                               selectedMapBuilding === 'school' ? '50%' :
                               selectedMapBuilding === 'bar' ? '75%' :
                               selectedMapBuilding === 'gym' ? '35%' : '50%'),
                      }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      className="absolute z-10 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <div className="w-full h-full bg-primary/5 rounded-full blur-[80px]" />
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-[40px] animate-pulse" />
                      <div className="absolute inset-0 border-[0.5px] border-primary/20 rounded-full scale-[1.2]" />
                    </motion.div>
                  )}

                  {/* Building Zones */}
                  {activeView === 'map' && (
                    <>
                      <BuildingZone 
                        name="office" 
                        label="The Office HQ" 
                        icon={<Briefcase size={24} />} 
                        position="top-[42%] left-[48%]" 
                        status={buildingStatuses.office}
                        description={buildingDetails.office.description}
                        output={buildingDetails.office.revenue}
                        issues={buildingDetails.office.activeIssues}
                        isUpgrading={!!activeUpgrades.office}
                        selected={selectedMapBuilding === 'office'}
                        onClick={() => setSelectedMapBuilding('office')}
                        activeEvent={activeCityEvent}
                      />
                      <BuildingZone 
                        name="bank" 
                        label="Metro Central Bank" 
                        icon={<Landmark size={24} />} 
                        position="top-[65%] left-[25%]" 
                        status={buildingStatuses.bank}
                        description={buildingDetails.bank.description}
                        output={buildingDetails.bank.revenue}
                        issues={buildingDetails.bank.activeIssues}
                        isUpgrading={!!activeUpgrades.bank}
                        selected={selectedMapBuilding === 'bank'}
                        onClick={() => setSelectedMapBuilding('bank')}
                        activeEvent={activeCityEvent}
                      />
                      <BuildingZone 
                        name="school" 
                        label="Neural Academy" 
                        icon={<GraduationCap size={24} />} 
                        position="top-[75%] left-[50%]" 
                        status={buildingStatuses.school}
                        description={buildingDetails.school.description}
                        output={buildingDetails.school.revenue}
                        issues={buildingDetails.school.activeIssues}
                        isUpgrading={!!activeUpgrades.school}
                        selected={selectedMapBuilding === 'school'}
                        onClick={() => setSelectedMapBuilding('school')}
                        activeEvent={activeCityEvent}
                      />
                      <BuildingZone 
                        name="bar" 
                        label="The Afterlife Bar" 
                        icon={<GlassWater size={24} />} 
                        position="top-[65%] left-[75%]" 
                        status={buildingStatuses.bar}
                        description={buildingDetails.bar.description}
                        output={buildingDetails.bar.revenue}
                        issues={buildingDetails.bar.activeIssues}
                        isUpgrading={!!activeUpgrades.bar}
                        selected={selectedMapBuilding === 'bar'}
                        onClick={() => setSelectedMapBuilding('bar')}
                        activeEvent={activeCityEvent}
                      />
                      <BuildingZone 
                        name="gym" 
                        label="Neon Pulse Gym" 
                        icon={<Dumbbell size={24} />} 
                        position="top-[35%] left-[35%]" 
                        status={buildingStatuses.gym}
                        description={buildingDetails.gym.description}
                        output={buildingDetails.gym.revenue}
                        issues={buildingDetails.gym.activeIssues}
                        isUpgrading={!!activeUpgrades.gym}
                        selected={selectedMapBuilding === 'gym'}
                        onClick={() => setSelectedMapBuilding('gym')}
                        activeEvent={activeCityEvent}
                      />
                    </>
                  )}

                  {/* Character Visual */}
                  {activeView === 'map' && (
                    <>
                      {/* AI Advisor Beacon */}
                      <motion.div
                        animate={{ 
                          left: [`${stats.position.x + 5}%`, `${stats.position.x + 7}%`, `${stats.position.x + 5}%`],
                          top: [`${stats.position.y - 5}%`, `${stats.position.y - 7}%`, `${stats.position.y - 5}%`]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute z-50 cursor-pointer group"
                        onClick={() => setActiveTab('advisor')}
                      >
                        <div className="relative">
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border border-secondary/40 rounded-lg flex items-center justify-center etched-glass shadow-[0_0_15px_rgba(var(--secondary-rgb),0.3)] group-hover:border-secondary transition-all"
                          >
                            <Cpu size={16} className="text-secondary animate-pulse" />
                          </motion.div>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black px-2 py-1 border border-secondary/20 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 whitespace-nowrap shadow-2xl">
                            <span className="text-[10px] font-black text-secondary tracking-widest uppercase">STRATEGY_FEED_ACTIVE</span>
                          </div>
                          {/* Tether to character */}
                          <svg className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                            <motion.line 
                              x1="50%" y1="50%" 
                              x2="45%" y2="55%" 
                              stroke="currentColor" 
                              strokeWidth="1" 
                              className="text-secondary"
                              strokeDasharray="2 2"
                            />
                          </svg>
                        </div>
                      </motion.div>

                      <motion.div 
                        animate={{ 
                          left: `${stats.position.x}%`, 
                        top: `${stats.position.y}%` 
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.div 
                        className="relative"
                        animate={isMoving ? {
                          y: [0, -8, 0],
                          rotate: [-5, 5, -5],
                          scale: [1, 0.95, 1],
                        } : {
                          y: [0, -4, 0],
                          scale: [1, 1.02, 1],
                          rotate: 0,
                        }}
                        transition={{
                          duration: isMoving ? 0.4 : 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="w-14 h-14 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(251,209,45,0.5)] bg-surface-container overflow-hidden relative">
                          {/* Inner Shadow for depth */}
                          <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
                          <img 
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                              stats.avatar === 'Avatar_1' ? 'Felix' : 
                              stats.avatar === 'Avatar_2' ? 'Aneka' : 
                              stats.avatar === 'Avatar_3' ? 'Jasper' : 
                              stats.avatar === 'Avatar_4' ? 'Sasha' :
                              stats.avatar === 'Avatar_5' ? 'Luna' : 'Oliver'
                            }`}
                            alt="Character"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1 border border-white/10 whitespace-nowrap shadow-2xl">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{stats.name}</span>
                        </div>
                        {isMoving && (
                          <motion.div 
                            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-white/30"
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  </>
                )}

                  {/* Central Interaction Zone */}
                  {activeView === 'map' && (
                    <div className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="relative group">
                        {/* Beacon Effect */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-t from-primary to-transparent opacity-40 blur-[2px]" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-full blur-xl" 
                        />
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#fbd12d] z-30" />
                        
                        <HQCard 
                          stats={stats} 
                          onAction={addNotification} 
                          onOpenHub={() => setActiveModal('financial_hub')} 
                          onOpenJobs={() => setActiveModal('job_board')}
                        />
                      </div>
                    </div>
                  )}

                  {activeView === 'map' && (
                    <>
                      <VenturePulse activeTab={activeTab} onVentureClick={setSelectedVenture} onNewsClick={setSelectedNewsItem} />

                      {/* District Park Hub */}
                      <div className="absolute bottom-[20%] left-[15%] z-10">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="etched-glass p-6 border-b-2 border-tertiary flex items-center gap-6 min-w-[320px] cursor-pointer hover:bg-tertiary/10 transition-colors cyber-card group"
                          onClick={() => addNotification('District Park Hub: Food Truck coordinates updated')}
                        >
                          <div className="w-16 h-16 bg-surface-container flex items-center justify-center border border-tertiary/20 relative">
                             <div className="absolute inset-0 bg-tertiary/5 animate-pulse" />
                             <Utensils size={28} className="text-tertiary relative z-10" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-neon-tertiary" />
                               <p className="font-headline font-black text-sm text-tertiary uppercase tracking-wider">District_Park_Hub</p>
                            </div>
                            <p className="text-[9px] text-on-surface/40 font-mono tracking-widest uppercase">3_Trucks_Active • Happy_Hour: ON</p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Floating Status Labels */}
                      <FloatingLabel 
                        text="5TH AVE TRAFFIC: HEAVY" 
                        color="secondary" 
                        position="bottom-[22%] right-[28%]" 
                      />
                      <FloatingLabel 
                        text="SKYWAY AIR TRAFFIC: HEAVY" 
                        color="tertiary" 
                        position="top-[18%] left-[22%]" 
                      />
                    </>
                  )}
                </main>
              </div>
            </motion.div>
            <AnimatePresence>
              {activeView === 'map' && <CityHUDOverlay />}
            </AnimatePresence>
            <AnimatePresence>
              {activeCityEvent && <CityEventAlert event={activeCityEvent} />}
            </AnimatePresence>

            <BottomNav activeView={activeView} onViewChange={(v) => {
              playTerminalClick('transition');
              if (v === 'map') {
                setActiveView('map');
              } else {
                moveToBuilding(v);
              }
            }} />

            {/* Ambient Retro Cassette Synth Radio */}
            <div className="fixed bottom-24 left-6 z-[160] pointer-events-auto">
              <RadioVisualizerSystem />
            </div>

            {/* Chatbot Toggle */}
            <button 
              onClick={() => setActiveModal(activeModal === 'chatbot' ? null : 'chatbot')}
              className={`fixed bottom-24 right-6 z-[160] w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-neon-glow-primary ${
                activeModal === 'chatbot' ? 'bg-white text-black' : 'bg-primary text-black hover:scale-110'
              }`}
            >
              {activeModal === 'chatbot' ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
             {/* Notifications */}
            <div className="fixed top-24 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
              <AnimatePresence>
                {notifications.map(n => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-surface-container-highest border-l-2 border-primary p-4 shadow-xl flex items-center gap-3 min-w-[240px]"
                  >
                    <Bell size={16} className="text-primary animate-bounce" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{n.msg}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Modals */}
            <AnimatePresence>
              {selectedVenture && (
                <VentureModal 
                  venture={selectedVenture} 
                  onClose={() => setSelectedVenture(null)} 
                  onAction={(msg) => {
                    addNotification(msg);
                    setSelectedVenture(null);
                  }}
                />
              )}
              {selectedNewsItem && (
                <NewsModal 
                  item={selectedNewsItem} 
                  onClose={() => setSelectedNewsItem(null)} 
                  onAction={(msg) => {
                    addNotification(msg);
                    setSelectedNewsItem(null);
                  }}
                />
              )}
              {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal(null)} />}
              {activeModal === 'wallet' && <WalletModal onClose={() => setActiveModal(null)} />}
              {activeModal === 'ai_briefing' && (
                <AIBriefingModal 
                  isOpen={activeModal === 'ai_briefing'}
                  onClose={() => setActiveModal(null)}
                  stats={stats}
                  playerData={playerData}
                  day={day}
                  activeCityEvent={activeCityEvent}
                  implants={implants}
                  nodesBreached={nodesBreached}
                  syndicateHires={syndicateHires}
                  contraband={contraband}
                />
              )}
              {activeModal === 'next_day' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6" onClick={() => setActiveModal(null)}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-container border-l-4 border-primary p-8 max-w-sm w-full shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter italic mb-4">END_DAY_CYCLE</h2>
                    <p className="text-sm text-on-surface/60 mb-8 leading-relaxed">
                      Confirming the end of the current cycle will process your income, expenses, and market fluctuations.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-4 border border-white/10 font-headline font-black text-white/40 hover:text-white transition-all uppercase text-xs tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          handleNextDay();
                          setActiveModal(null);
                        }}
                        className="flex-1 bg-primary py-4 font-headline font-black text-black hover:bg-white transition-all uppercase text-xs tracking-widest"
                      >
                        Process
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
              {activeModal === 'financial_hub' && (
                <FinancialHubModal 
                  stats={stats} 
                  currentJob={currentJob} 
                  onClose={() => setActiveModal(null)} 
                  onAction={(msg) => {
                    if (msg === 'RESEARCH_MARKET_TRENDS') {
                      handleMarketResearch();
                    } else {
                      addNotification(msg);
                    }
                  }} 
                  history={netWorthHistory}
                  buildingDetails={buildingDetails}
                  buildingStatuses={buildingStatuses}
                  setActiveView={setActiveView}
                  setSelectedMapBuilding={setSelectedMapBuilding}
                  activeUpgrades={activeUpgrades}
                  purchasedUpgrades={purchasedUpgrades}
                  onUpgrade={handleUpgrade}
                  playerData={playerData}
                  setPlayerData={setPlayerData}
                  syndicateHires={syndicateHires}
                  setSyndicateHires={setSyndicateHires}
                  day={day}
                  activeCityEvent={activeCityEvent}
                  addNotification={addNotification}
                />
              )}
              {activeModal === 'bank' && <BankModal onClose={() => { setActiveModal(null); setActiveView('bank'); }} onInteract={handleInteraction} playerData={playerData} />}
              {activeModal === 'school' && <SchoolModal onClose={() => { setActiveModal(null); setActiveView('school'); }} onInteract={handleInteraction} />}
              {activeModal === 'bar' && (
                <BarModal 
                  stats={stats}
                  setStats={setStats}
                  playerData={playerData}
                  setPlayerData={setPlayerData}
                  addNotification={addNotification}
                  onClose={() => { setActiveModal(null); setActiveView('bar'); }} 
                  onInteract={handleInteraction} 
                />
              )}
              {activeModal === 'chatbot' && (
                <ChatbotModal 
                  stats={stats} 
                  setStats={setStats} 
                  playerData={playerData} 
                  setPlayerData={setPlayerData} 
                  marketHistory={marketHistory} 
                  addNotification={addNotification} 
                  onClose={() => setActiveModal(null)} 
                />
              )}
              {activeTab === 'advisor' && <AIAdvisorModal stats={stats} buildings={buildingStatuses} onClose={() => setActiveTab('market')} onAction={addNotification} />}
              {activeModal === 'job_board' && (
                <JobBoardModal 
                  stats={stats} 
                  onClose={() => setActiveModal(null)} 
                  onAction={addNotification}
                  onJobUpdate={(newJob) => {
                    setCurrentJob(newJob);
                    setActiveModal(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* Global Environmental Effects */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanline" />
      <div className="fixed inset-0 pointer-events-none z-[101] noise" />
      <div className="fixed inset-0 pointer-events-none z-[102] vignette md:shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      <div className="fixed inset-0 pointer-events-none z-[103] crt-flicker pointer-events-none bg-white/[0.01]" />

      {/* Atmospheric Startup Mask */}
    </div>
  );
}
