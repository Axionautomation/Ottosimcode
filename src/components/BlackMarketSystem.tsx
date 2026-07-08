import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, X, Zap, Coins, Box, AlertTriangle, EyeOff } from 'lucide-react';

export interface UserStats {
  name: string;
  netWorth: number;
  happiness: number;
  iq: number;
}

interface Commodity {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: string;
  useEffect: string;
}

export const BlackMarketSystem = ({
  onClose,
  stats,
  onAction,
  contraband,
  setContraband
}: {
  onClose: () => void;
  stats: UserStats;
  onAction: (update: any) => void;
  contraband: Record<string, number>;
  setContraband: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) => {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>('corp_ledger');

  const commodities: Commodity[] = [
    {
      id: 'corp_ledger',
      name: 'Offshore Database Ledger',
      description: 'Encrypted corporate financial receipts. Smuggle and sell when the black market price spikes, or consume to study. Gives +4 IQ on consume.',
      basePrice: 5500,
      icon: '📁',
      useEffect: 'STUDY_LEDGER'
    },
    {
      id: 'ai_module',
      name: 'Prototype AI Chipset',
      description: 'Restricted neural processor nodes containing learning reinforcement models. Consume to permanently expand neural intelligence, offering immediate +8 IQ.',
      basePrice: 8000,
      icon: '🧠',
      useEffect: 'CONSUME_CHIP'
    },
    {
      id: 'stim_core',
      name: 'Neural Stimulant Core v9',
      description: 'Chemical neural synthesizer which flushes toxic neuro-transmitters. Restores cognitive sanity and clears all stress, adding +40 happiness.',
      basePrice: 2200,
      icon: '🧪',
      useEffect: 'INJECT_STIM'
    },
    {
      id: 'cyber_inhibitor',
      name: 'Military Cyber-Inhibitor',
      description: 'Heavy dampener shield preventing cybernetic friction buildup. Grants defensive mental fortitude, giving permanent +10 happiness ceiling and immunity to negative hacks.',
      basePrice: 4200,
      icon: '⚡',
      useEffect: 'INJECT_INHIBITOR'
    }
  ];

  // Randomize market rates on loading Smuggler
  const randomizePrices = () => {
    const nextPrices: Record<string, number> = {};
    commodities.forEach(item => {
      const shift = 0.7 + Math.random() * 0.8; // 70% to 150% fluctuation value
      nextPrices[item.id] = Math.floor(item.basePrice * shift);
    });
    setMarketPrices(nextPrices);
  };

  useEffect(() => {
    randomizePrices();
  }, []);

  const handleBuy = (item: Commodity) => {
    const activePrice = marketPrices[item.id] || item.basePrice;

    if (stats.netWorth < activePrice) {
      onAction({ type: 'NOTIFY', msg: `BLACK_MARKET: INSIGNIFICANT CREDIT RESERVES` });
      return;
    }

    setContraband(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));

    // Deduct cost from stats net worth
    onAction({
      type: 'STATS_UPDATE',
      stats: { netWorth: stats.netWorth - activePrice }
    });

    onAction({ 
      type: 'NOTIFY', 
      msg: `CONTRABAND SECURED: ${item.name.toUpperCase()} ACQUIRED FOR $${activePrice.toLocaleString()}` 
    });
  };

  const handleSell = (item: Commodity) => {
    const holds = contraband[item.id] || 0;
    if (holds <= 0) {
      onAction({ type: 'NOTIFY', msg: `BLACK_MARKET: CARGO IS EMPTY` });
      return;
    }

    const activePrice = marketPrices[item.id] || item.basePrice;

    setContraband(prev => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
    }));

    // Add cash amount to stats net worth
    onAction({
      type: 'STATS_UPDATE',
      stats: { netWorth: stats.netWorth + activePrice }
    });

    onAction({ 
      type: 'NOTIFY', 
      msg: `CARGO SOLD: ${item.name.toUpperCase()} LIQUIDATED FOR $${activePrice.toLocaleString()}` 
    });
  };

  const handleConsume = (item: Commodity) => {
    const holds = contraband[item.id] || 0;
    if (holds <= 0) {
      onAction({ type: 'NOTIFY', msg: `BLACK_MARKET: INSUFFICIENT CONTRABAND IN INVENTORY` });
      return;
    }

    setContraband(prev => ({
      ...prev,
      [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
    }));

    // Consume advantages
    if (item.useEffect === 'STUDY_LEDGER') {
      onAction({
        type: 'STATS_UPDATE',
        stats: { iq: stats.iq + 4 }
      });
      onAction({ type: 'NOTIFY', msg: `CONTRABAND USED: REVERSED LEDGER SECURITY ALGORITHMS (+4 IQ)` });
    } else if (item.useEffect === 'CONSUME_CHIP') {
      onAction({
        type: 'STATS_UPDATE',
        stats: { iq: stats.iq + 8 }
      });
      onAction({ type: 'NOTIFY', msg: `CONTRABAND USED: INTEGRATED EXPANSIVE CHIPSET (+8 IQ)` });
    } else if (item.useEffect === 'INJECT_STIM') {
      onAction({
        type: 'STATS_UPDATE',
        stats: { happiness: Math.min(100, stats.happiness + 40) }
      });
      onAction({ type: 'NOTIFY', msg: `CONTRABAND USED: ADRENAL BUFFERS STABILIZED (+40 MORALE)` });
    } else if (item.useEffect === 'INJECT_INHIBITOR') {
      onAction({
        type: 'STATS_UPDATE',
        stats: { happiness: Math.min(100, stats.happiness + 15), iq: stats.iq + 3 }
      });
      onAction({ type: 'NOTIFY', msg: `CONTRABAND USED: SHIELD ACTIVE (+15 MORALE, +3 IQ)` });
    }
  };

  const activeItem = commodities.find(c => c.id === selectedItemId);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[220] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
    >
      <div className="relative w-full max-w-5xl h-[80vh] bg-black border border-red-500/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)] flex flex-col">
        {/* Shady crimson grid style */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.1),transparent_60%)] pointer-events-none" />

        {/* Top bar header */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-white/5 bg-red-500/[0.01]">
          <div className="flex items-center gap-4">
            <Skull size={24} className="text-red-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.3em] font-mono">SECTOR_09_SHADOW_BEACON</span>
              </div>
              <h1 className="font-headline font-black text-2xl text-white uppercase italic tracking-tighter">
                CONTRABAND_BLACK_MARKET
              </h1>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main buy/sell interface split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Commodities catalog list */}
          <div className="w-1/2 p-10 border-r border-white/5 overflow-y-auto space-y-4">
            <h3 className="text-[9px] font-mono font-black text-red-500 uppercase tracking-[0.3em] mb-4">
              SHADOW_CARGO_ASSETS
            </h3>

            {commodities.map(item => {
              const activePrice = marketPrices[item.id] || item.basePrice;
              const hasSelected = selectedItemId === item.id;
              const holds = contraband[item.id] || 0;

              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-5 border cursor-pointer transition-all flex items-center justify-between group ${
                    hasSelected 
                      ? 'bg-red-500/5 border-red-500/35 shadow-[0_0_30px_rgba(239,68,68,0.05)]' 
                      : 'bg-white/[0.01] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-headline font-black text-white text-sm uppercase tracking-wider">{item.name}</h4>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest font-mono">
                        Holds: {holds} units in Cargo
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] font-black text-white/20 uppercase block font-mono">MARKET PRICE</span>
                    <span className="text-xs font-mono font-black text-red-400">
                      ${activePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Commodity bartering detail tools (Right pane) */}
          <div className="w-1/2 p-10 flex flex-col justify-between bg-white/[0.01]">
            {activeItem ? (
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-6">
                  {/* Holographic glowing scan icon */}
                  <div className="aspect-video bg-red-500/[0.02] border border-red-500/10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 inset-0 scanline opacity-30 pointer-events-none" />
                    <div className="text-4xl animate-bounce mb-3">{activeItem.icon}</div>
                    
                    <span className="text-[8px] font-mono font-black text-red-500 uppercase tracking-[0.2em]">
                      SECURITY_INDEX_CLASSIFIED
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline font-black text-xl text-white uppercase tracking-wide">
                      {activeItem.name}
                    </h3>
                    <p className="text-[11px] text-white/40 leading-relaxed uppercase tracking-wider mt-2">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Pricing dynamics comparison */}
                  <div className="grid grid-cols-2 gap-4 border border-white/5 p-4 bg-black">
                    <div>
                      <span className="text-[8px] font-mono font-bold text-white/30 uppercase block">CURRENT PRICE</span>
                      <span className="text-md font-mono font-black text-red-400">
                        ${(marketPrices[activeItem.id] || activeItem.basePrice).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono font-bold text-white/30 uppercase block">HELD QUANTITY</span>
                      <span className="text-md font-mono font-black text-white">
                        {contraband[activeItem.id] || 0} UNITS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operations options buy, sell, consume */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <button
                    onClick={() => handleBuy(activeItem)}
                    disabled={stats.netWorth < (marketPrices[activeItem.id] || activeItem.basePrice)}
                    className="bg-red-500 text-white font-headline font-black py-4 text-[10px] uppercase tracking-wider hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:grayscale cursor-pointer"
                  >
                    BUY_CARGO
                  </button>

                  <button
                    onClick={() => handleSell(activeItem)}
                    disabled={!contraband[activeItem.id]}
                    className="bg-white/5 hover:bg-white hover:text-black border border-white/10 text-white font-headline font-black py-4 text-[10px] uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
                  >
                    SELL_CARGO
                  </button>

                  <button
                    onClick={() => handleConsume(activeItem)}
                    disabled={!contraband[activeItem.id]}
                    className="bg-red-500/10 hover:bg-white hover:text-black border border-red-500/35 text-red-400 font-headline font-black py-4 text-[10px] uppercase tracking-wider transition-all disabled:opacity-30 cursor-pointer"
                  >
                    CONSUME_USE
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Box size={40} className="text-white mb-3" />
                <span className="text-xs font-mono font-black text-white uppercase tracking-widest">
                  SELECT_SHADOW_CARGO
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
