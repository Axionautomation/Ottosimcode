import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, X, Zap, Award, Target, DollarSign, ShieldAlert, ChevronRight } from 'lucide-react';

export interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
}

interface Operative {
  id: string;
  name: string;
  codename: string;
  specialty: string;
  hiringFee: number;
  salary: number;
  perk: string;
  avatar: string;
  successBoost: number;
}

interface Operation {
  id: string;
  name: string;
  difficulty: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  cost: number;
  successBase: number;
  minIq: number;
  payout: number;
}

export const SyndicateSystem = ({
  stats,
  onAction,
  syndicateHires,
  setSyndicateHires
}: {
  stats: UserStats;
  onAction: (update: any) => void;
  syndicateHires: string[];
  setSyndicateHires: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'ops'>('roster');
  const [runningOpId, setRunningOpId] = useState<string | null>(null);
  const [opResult, setOpResult] = useState<{ id: string; success: boolean; log: string } | null>(null);

  const operativesList: Operative[] = [
    {
      id: 'nix_zero',
      name: 'Nix Null',
      codename: 'N0_COOL',
      specialty: 'Matrix Security',
      hiringFee: 3500,
      salary: 400,
      perk: 'Automates advanced coding diagnostics (+1 IQ / cycle) and speeds up Hacknet decrypt traces.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NixNull',
      successBoost: 12
    },
    {
      id: 'vector_prime',
      name: 'Dr. John Vector',
      codename: 'VECT0R_PRIME',
      specialty: 'High-Freq Arbitrage',
      hiringFee: 7500,
      salary: 800,
      perk: 'Increases capital trading yields by 15% and reduces Stock Risk indices.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=JohnVector',
      successBoost: 8
    },
    {
      id: 'maverick_sly',
      name: 'Clara Maverick',
      codename: 'SLY_DYNAMICS',
      specialty: 'Industrial Espionage',
      hiringFee: 12000,
      salary: 1100,
      perk: 'Unlocks tactical operations and triggers 25% larger workspace commission bonuses.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClaraMaverick',
      successBoost: 20
    }
  ];

  const operationsList: Operation[] = [
    {
      id: 'op_leverage',
      name: 'Corporate Mainframe Infiltration',
      difficulty: 'MEDIUM',
      description: 'Infiltrate NetSec Corp database nodes and download high-priority tactical intellectual property.',
      cost: 1500,
      successBase: 65,
      minIq: 110,
      payout: 4800
    },
    {
      id: 'op_sabotage',
      name: 'District Industrial Sabotage',
      difficulty: 'HIGH',
      description: 'Remotely bottleneck power grid relays in Sector-07 Corporate competitor divisions to yield client conversions.',
      cost: 4000,
      successBase: 45,
      minIq: 130,
      payout: 12500
    },
    {
      id: 'op_liquidity',
      name: 'Decentralized High-Tier Heist',
      difficulty: 'CRITICAL',
      description: 'Leverage multi-node syndication arrays to compromise the offshore liquid capital reserve ledger.',
      cost: 10000,
      successBase: 25,
      minIq: 160,
      payout: 35000
    }
  ];

  const handleHire = (op: Operative) => {
    if (stats.netWorth < op.hiringFee) {
      onAction({ type: 'NOTIFY', msg: `SYNDICATE: INSUFFICIENT INITIATION FUNDS ($${op.hiringFee.toLocaleString()})` });
      return;
    }
    setSyndicateHires(prev => [...prev, op.id]);
    
    // Process transaction fee
    onAction({
      type: 'STATS_UPDATE',
      stats: { netWorth: stats.netWorth - op.hiringFee }
    });
    
    onAction({ 
      type: 'NOTIFY', 
      msg: `CONTRACT FILED: ${op.codename} INITIALIZED ON ROSTER. DAILY SALARY: $${op.salary}` 
    });
  };

  const handleRunOperation = (operation: Operation) => {
    if (stats.netWorth < operation.cost) {
      onAction({ type: 'NOTIFY', msg: `SYNDICATE: INSUFFICIENT OPERATIONAL BUDGET` });
      return;
    }
    if (stats.iq < operation.minIq) {
      onAction({ type: 'NOTIFY', msg: `OPERATION LOCKOUT: SYNDICATE NETWORK COMPROMISED. IQ REQUIREMENT NOT MET.` });
      return;
    }

    setRunningOpId(operation.id);
    setOpResult(null);

    // Calculate dynamic success odds from hired active runners
    const operativeBonus = syndicateHires.reduce((sum, hireId) => {
      const opObj = operativesList.find(o => o.id === hireId);
      return sum + (opObj ? opObj.successBoost : 0);
    }, 0);

    const actualOdds = Math.min(95, operation.successBase + operativeBonus);

    // Dynamic delay simulated task execution
    setTimeout(() => {
      const roll = Math.random() * 100;
      const success = roll <= actualOdds;

      if (success) {
        setOpResult({
          id: operation.id,
          success: true,
          log: `OPERATION ACCESS GRANTED: BYPASS COMPLETED SECURELY. NET FORWARD PAYOUT: +$${operation.payout.toLocaleString()}`
        });

        // Mutate stats with reward payout deducting cost
        onAction({
          type: 'STATS_UPDATE',
          stats: { netWorth: stats.netWorth + operation.payout - operation.cost }
        });
        
        onAction({ 
          type: 'NOTIFY', 
          msg: `TACTICAL OPERATION SUCCESSFUL: LEDGER COMPROMISED. Payout: $${operation.payout}` 
        });
      } else {
        setOpResult({
          id: operation.id,
          success: false,
          log: `OPERATION TERMINATED: SYNDICATE SIGNAL INTERCEPTED BY NETSEC FIREWALL. TRACE CONFIRMED.`
        });
        
        onAction({
          type: 'STATS_UPDATE',
          stats: { netWorth: stats.netWorth - operation.cost }
        });

        onAction({ 
          type: 'NOTIFY', 
          msg: `SYNDICATE LOSS: SIGNAL COLLAPSED. LOSS LOGGED.` 
        });
      }
      setRunningOpId(null);
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-black text-4xl text-white uppercase italic tracking-tighter">
            SYNDICATE_OPERATIONS_HUB
          </h2>
          <p className="text-[10px] text-primary font-black tracking-[0.5em] uppercase mt-2 flex items-center gap-3">
            <Users size={14} className="animate-pulse" /> MERCEP-NET RECRUITMENT & CORPO TACTICS // ACTIVE
          </p>
        </div>

        {/* Tab switcher options */}
        <div className="flex bg-black p-1 border border-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-6 py-2.5 text-[10px] uppercase font-black tracking-widest transition-all ${
              activeTab === 'roster' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Runner_Roster
          </button>
          <button
            onClick={() => setActiveTab('ops')}
            className={`px-6 py-2.5 text-[10px] uppercase font-black tracking-widest transition-all ${
              activeTab === 'ops' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            Tactical_Operations
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'roster' ? (
          <motion.div 
            key="roster"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-3 gap-8"
          >
            {operativesList.map(op => {
              const bIsHired = syndicateHires.includes(op.id);

              return (
                <div 
                  key={op.id} 
                  className={`bg-black/30 p-8 border hover:border-white/15 transition-all relative flex flex-col justify-between overflow-hidden group etched-border ${
                    bIsHired ? 'border-primary/40 p-glow shadow-neon-glow-sm' : 'border-white/5'
                  }`}
                >
                  <div>
                    {/* Head Header operative */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={op.avatar} 
                          alt="avatar" 
                          className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl"
                        />
                        <div>
                          <p className="font-headline font-black text-sm text-white uppercase tracking-wider">{op.name}</p>
                          <span className="text-[8px] font-mono text-primary uppercase block mt-0.5">{op.codename}</span>
                        </div>
                      </div>
                      
                      <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest">
                        {op.specialty}
                      </span>
                    </div>

                    <div className="h-[1px] bg-white/5 w-full mb-6" />

                    <div className="space-y-4 mb-8">
                      <div>
                        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] block font-mono">
                          OPERATING PERK CODE
                        </span>
                        <p className="text-[10px] text-white/50 leading-relaxed font-semibold uppercase">
                          {op.perk}
                        </p>
                      </div>

                      <div className="flex justify-between text-xs font-mono font-bold text-white/30">
                        <span>Success Modifier:</span>
                        <span className="text-primary">+{op.successBoost}% Ops Grid</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div>
                    {bIsHired ? (
                      <div className="bg-primary/10 border border-primary/20 text-center py-4 text-[9px] font-mono font-black text-primary uppercase tracking-widest">
                        ACTIVE ON MISSION DECK
                      </div>
                    ) : (
                      <button
                        onClick={() => handleHire(op)}
                        disabled={stats.netWorth < op.hiringFee}
                        className="w-full bg-white/5 hover:bg-white text-white hover:text-black py-4 text-[10px] font-headline font-black uppercase tracking-[0.2em] border border-white/10 hover:border-transparent transition-all cursor-pointer"
                      >
                        Hire Contract: ${op.hiringFee.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="ops"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {operationsList.map(item => {
              const bIsRunning = runningOpId === item.id;
              
              // Calculate real operative success odds
              const totalBonus = syndicateHires.reduce((sum, hireId) => {
                const opObj = operativesList.find(o => o.id === hireId);
                return sum + (opObj ? opObj.successBoost : 0);
              }, 0);
              const totalOdds = Math.min(95, item.successBase + totalBonus);

              return (
                <div 
                  key={item.id} 
                  className="bg-black/40 border border-white/5 p-8 flex justify-between items-center group relative overflow-hidden etched-border"
                >
                  <div className="max-w-xl space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-[8px] font-black tracking-widest border px-2 py-0.5 rounded-sm font-mono ${
                        item.difficulty === 'CRITICAL' ? 'border-red-500 text-red-500 animate-pulse' :
                        item.difficulty === 'HIGH' ? 'border-orange-400 text-orange-400' : 'border-primary text-primary'
                      }`}>
                        DIFFICULTY: {item.difficulty}
                      </span>
                      <h3 className="font-headline font-black text-lg text-white uppercase group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider">
                      {item.description}
                    </p>

                    <div className="flex gap-8 text-[9px] font-mono text-white/30 uppercase font-black">
                      <span>BUDGET COMP: <span className="text-white">${item.cost.toLocaleString()}</span></span>
                      <span>POTENTIAL NET PAYOUT: <span className="text-primary">${item.payout.toLocaleString()}</span></span>
                      <span>REQUIRES INTELLECT: <span className="text-white">{item.minIq} IQ</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[200px]">
                    <div className="text-right">
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-mono block mb-1">
                        SUCCESS ODDS RATE
                      </span>
                      <div className="text-2xl font-headline font-black italic tracking-tighter text-primary">
                        {totalOdds}%
                      </div>
                      <span className="text-[7px] font-mono text-white/30 uppercase mt-0.5 block">
                        Base: {item.successBase}% + Agents: +{totalBonus}%
                      </span>
                    </div>

                    {bIsRunning ? (
                      <div className="w-full bg-white/5 py-4 border border-white/10 flex items-center justify-center gap-2">
                        <Zap size={10} className="text-primary animate-spin" />
                        <span className="text-[9px] font-mono font-black text-white/40 uppercase tracking-widest animate-pulse">
                          TRANSMITTING_LINK...
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRunOperation(item)}
                        disabled={stats.netWorth < item.cost || stats.iq < item.minIq}
                        className="w-full bg-primary text-black py-4 text-[10px] font-headline font-black tracking-[0.2em] uppercase shadow-neon hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        LAUNCH_CORPORATE_OP <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Results Logs panel */}
            <AnimatePresence>
              {opResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-6 border flex items-start gap-4 ${
                    opResult.success ? 'bg-primary/10 border-primary' : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  {opResult.success ? <Award className="text-primary shrink-0" /> : <ShieldAlert className="text-red-500 shrink-0" />}
                  <div>
                    <span className="text-[8px] font-mono font-black uppercase tracking-[0.4em] block mb-1">
                      TACTICAL_SYS_REPORT_UPLINK
                    </span>
                    <p className={`text-xs font-mono font-bold uppercase ${
                      opResult.success ? 'text-primary' : 'text-red-500'
                    }`}>
                      {opResult.log}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
