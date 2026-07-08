import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  RefreshCw, 
  Clock, 
  Activity, 
  ShieldAlert, 
  ShieldCheck,
  Cpu, 
  Database, 
  Globe, 
  Wallet,
  HelpCircle,
  BarChart3,
  Terminal,
  Server,
  Newspaper,
  Radio,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  prevPrice: number;
  change24h: number;
  ath: number;
  atl: number;
  volume24h: number;
  marketCap: number;
  hashrate: string;
  color: string;
  history: { time: string; price: number }[];
}

interface Transaction {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  asset: string;
  amount: number;
  price: number;
  total: number;
  hash: string;
}

export const CryptoPortfolioTracker = ({ 
  playerData, 
  setPlayerData, 
  onAction,
  addNotification,
  day = 1
}: { 
  playerData: any; 
  setPlayerData?: React.Dispatch<React.SetStateAction<any>>; 
  onAction: (msg: string) => void; 
  addNotification?: (msg: string) => void;
  day?: number;
}) => {
  // Local state for assets to drive live price feed updates
  const [assets, setAssets] = useState<Record<string, CryptoAsset>>({
    'OTTO_Coin': {
      symbol: 'OTTO',
      name: 'OTTO_Coin Ledger',
      price: 1.42,
      prevPrice: 1.38,
      change24h: 2.9,
      ath: 3.85,
      atl: 0.12,
      volume24h: 18240500,
      marketCap: 142000000,
      hashrate: '45.2 GH/s',
      color: '#ff007f', // Cyber Pink
      history: Array.from({ length: 120 }, (_, i) => ({
        time: `c-${120 - i}`,
        price: 1.20 + Math.sin(i * 0.1) * 0.15 + (i * 0.003)
      }))
    },
    'BTC': {
      symbol: 'BTC',
      name: 'Cybernetic Bitcoin Trust',
      price: 68450,
      prevPrice: 68120,
      change24h: 0.48,
      ath: 104250,
      atl: 3100,
      volume24h: 4210900000,
      marketCap: 1340000000000,
      hashrate: '682 EH/s',
      color: '#00e5ff', // Cyber Cyan
      history: Array.from({ length: 120 }, (_, i) => ({
        time: `c-${120 - i}`,
        price: 66000 + (Math.sin(i * 0.08) * 800) + (i * 25)
      }))
    }
  });

  const [selectedAssetKey, setSelectedAssetKey] = useState<string>('OTTO_Coin');
  const [timeRange, setTimeRange] = useState<'1H' | '24H' | '7D' | '1M'>('24H');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'STOP_LOSS'>('MARKET');
  const [stopLossFloorPrice, setStopLossFloorPrice] = useState<string>('');
  
  interface StopLossOrder {
    id: string;
    assetKey: string;
    symbol: string;
    floorPrice: number;
    quantity: number;
    createdAt: string;
  }

  const [stopLossOrders, setStopLossOrders] = useState<StopLossOrder[]>(() => {
    const saved = localStorage.getItem('city_crypto_stop_loss_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('city_crypto_stop_loss_orders', JSON.stringify(stopLossOrders));
  }, [stopLossOrders]);

  const [amountInput, setAmountInput] = useState<string>('');
  const [recentTXs, setRecentTXs] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'sentiment' | 'news' | 'correlation' | 'ledger' | 'metrics' | 'taxes'>('chart');
  const [taxSubTab, setTaxSubTab] = useState<'accounts' | 'strategy_lab'>('accounts');
  const [correlationLookback, setCorrelationLookback] = useState<number>(20);
  const [correlationMode, setCorrelationMode] = useState<'prices' | 'returns'>('prices');
  const [includeCashInAllocation, setIncludeCashInAllocation] = useState<boolean>(true);
  const [maxWeightThreshold, setMaxWeightThreshold] = useState<number>(40);
  const [priceTick, setPriceTick] = useState<Record<string, 'up' | 'down' | null>>({
    'OTTO_Coin': null,
    'BTC': null
  });

  // Persistent Tax Compliance system states
  const [taxBill, setTaxBill] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_tax_bill');
    return saved ? parseFloat(saved) : 0;
  });
  const [delinquentTaxes, setDelinquentTaxes] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_delinquent_taxes');
    return saved ? parseFloat(saved) : 0;
  });
  const [auditRisk, setAuditRisk] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_audit_risk');
    return saved ? parseFloat(saved) : 5; // standard safe starting baseline
  });
  const [totalTaxesPaid, setTotalTaxesPaid] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_total_taxes_paid');
    return saved ? parseFloat(saved) : 0;
  });
  const [taxRegime, setTaxRegime] = useState<'Standard' | 'Offshore'>(() => {
    const saved = localStorage.getItem('city_crypto_tax_regime');
    return (saved === 'Offshore') ? 'Offshore' : 'Standard';
  });
  const [lastAssessedDay, setLastAssessedDay] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_last_assessed_day');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Active Tax Shield strategies implemented in live cycle calculations
  const [activeEnergyDeduction, setActiveEnergyDeduction] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_active_energy_deduction');
    return saved ? parseFloat(saved) : 0;
  });
  const [activeRdCredit, setActiveRdCredit] = useState<number>(() => {
    const saved = localStorage.getItem('city_crypto_active_rd_credit');
    return saved ? parseFloat(saved) : 0;
  });
  const [activeIrishLoophole, setActiveIrishLoophole] = useState<boolean>(() => {
    const saved = localStorage.getItem('city_crypto_active_irish_loophole');
    return saved === 'true';
  });

  // Independent transient simulation states
  const [simulatedCryptoWorth, setSimulatedCryptoWorth] = useState<string>('');
  const [simulatedBalance, setSimulatedBalance] = useState<string>('');
  const [simulatedRegime, setSimulatedRegime] = useState<'Standard' | 'Offshore'>('Standard');
  const [simulatedEnergyDeduction, setSimulatedEnergyDeduction] = useState<string>('0');
  const [simulatedRdCredit, setSimulatedRdCredit] = useState<string>('0');
  const [simulatedIrishLoophole, setSimulatedIrishLoophole] = useState<boolean>(false);

  // Keep persistent states synchronized in browser memory
  useEffect(() => {
    localStorage.setItem('city_crypto_tax_bill', taxBill.toString());
  }, [taxBill]);

  useEffect(() => {
    localStorage.setItem('city_crypto_delinquent_taxes', delinquentTaxes.toString());
  }, [delinquentTaxes]);

  useEffect(() => {
    localStorage.setItem('city_crypto_audit_risk', auditRisk.toString());
  }, [auditRisk]);

  useEffect(() => {
    localStorage.setItem('city_crypto_total_taxes_paid', totalTaxesPaid.toString());
  }, [totalTaxesPaid]);

  useEffect(() => {
    localStorage.setItem('city_crypto_tax_regime', taxRegime);
  }, [taxRegime]);

  useEffect(() => {
    localStorage.setItem('city_crypto_last_assessed_day', lastAssessedDay.toString());
  }, [lastAssessedDay]);

  useEffect(() => {
    localStorage.setItem('city_crypto_active_energy_deduction', activeEnergyDeduction.toString());
  }, [activeEnergyDeduction]);

  useEffect(() => {
    localStorage.setItem('city_crypto_active_rd_credit', activeRdCredit.toString());
  }, [activeRdCredit]);

  useEffect(() => {
    localStorage.setItem('city_crypto_active_irish_loophole', activeIrishLoophole.toString());
  }, [activeIrishLoophole]);

  // Crypto News Feed & Interactive Ticker state
  interface CryptoNewsItem {
    id: number;
    type: 'ALERT' | 'NEWS' | 'TRADE' | 'GOV';
    symbol: 'OTTO' | 'BTC' | 'ALL';
    msg: string;
    time: string;
    color: string;
    impact: 'BULLISH' | 'BEARISH' | 'VOLATILE' | 'STABLE';
    context: string;
    actions: { label: string; effectId: string; effect: string }[];
  }

  const [cryptoNews, setCryptoNews] = useState<CryptoNewsItem[]>([
    {
      id: 1,
      type: 'ALERT',
      symbol: 'OTTO',
      msg: 'Core mining node guilds delay peer consensus fork patch due to yield debate.',
      time: '1m ago',
      color: 'text-[#ff007f]',
      impact: 'BEARISH',
      context: 'Two prominent outer-ring mining collectives have temporarily rejected the grid latency optimization fork, demanding an increase to block production gas limits. Core engineers are negotiating standard gas distribution ratios.',
      actions: [
        { label: 'Support Miner Guilds', effectId: 'guilds_side', effect: 'Secured +15% Mesh yield speeds. Capitalized on secondary pool transaction fees.' },
        { label: 'Force Core Fork Override', effectId: 'core_override', effect: 'Initiated independent validator override request. Local security buffer verified.' }
      ]
    },
    {
      id: 2,
      type: 'NEWS',
      symbol: 'BTC',
      msg: 'Institutional Sovereign Cyberbank authorizes retail Bitcoin Trust settlement indices.',
      time: '12m ago',
      color: 'text-[#00e5ff]',
      impact: 'BULLISH',
      context: 'A major Sovereign infrastructure treasury has completed final digital routing routes to settle physical BTC directly on regional bio-chips. This clears the way for a massive inflow of localized retail retail deposits.',
      actions: [
        { label: 'Frontrun Liquidity', effectId: 'frontrun_btc', effect: 'Dispatched algorithmic purchase triggers. Spot position hashrate aligned.' },
        { label: 'Hedge Exposure', effectId: 'hedge_btc', effect: 'Calculated safety brackets. Option spreads deployed to shield from fake-outs.' }
      ]
    },
    {
      id: 3,
      type: 'TRADE',
      symbol: 'OTTO',
      msg: 'On-chain security scanners flag outbound transaction of 850,000 OTTO to dark mix-pools.',
      time: '45m ago',
      color: 'text-yellow-400',
      impact: 'VOLATILE',
      context: 'An ancient pre-genesis ledger wallet associated with hacker coordinate "Dread-Cyber" suddenly initialized. 850,000 spot units were sent across several layer-3 mixing pools, signaling potential spot distribution or OTC transfers.',
      actions: [
        { label: 'Track Mixing Nodes', effectId: 'track_mixer', effect: 'Invoked node trace algorithms. Gathered extra ledger audit reports.' },
        { label: 'Set Aggressive Stops', effectId: 'stop_loss_otto', effect: 'Configured automated safety limits to liquidate before floor breakdown.' }
      ]
    },
    {
      id: 4,
      type: 'GOV',
      symbol: 'ALL',
      msg: 'Grid Core Sector assembly proposes strict compliance audits for non-validated P2P gateways.',
      time: '2h ago',
      color: 'text-indigo-400',
      impact: 'BEARISH',
      context: 'The Central Security Directive seeks to block decentralized peer-to-peer data pathways that lack formal cryptographic signature compliance. If passed, non-compliant peer relays will experience high route delays.',
      actions: [
        { label: 'Deploy Bypass Proxy', effectId: 'bypass_proxy', effect: 'Installed virtual sub-mesh proxy lines to bypass compliance filters.' },
        { label: 'Lobby Security Council', effectId: 'lobby_council', effect: 'Pledged support to decentralized lobby node. Political network stability secured.' }
      ]
    },
    {
      id: 5,
      type: 'NEWS',
      symbol: 'OTTO',
      msg: 'Creator "Otto-Zero" publishes zero-knowledge proof draft for infinite mesh scaling.',
      time: '4h ago',
      color: 'text-emerald-400',
      impact: 'BULLISH',
      context: 'A peer-to-peer cryptographic draft uploaded to the main research repository suggests combining zk-SNARKs and localized sub-channels. If implemented, network transactions will bypass standard physical limits with zero leakage.',
      actions: [
        { label: 'Support Mainnet Uplink', effectId: 'support_uplink', effect: 'Hosted the proof on local network servers. Boosted node reputation metrics.' },
        { label: 'Acquire Spot Reserve', effectId: 'accumulate_reserve', effect: 'Placed rapid market limit orders. Accumulated OTTO ahead of public release.' }
      ]
    }
  ]);

  const [expandedNewsId, setExpandedNewsId] = useState<number | null>(null);
  const [executedActions, setExecutedActions] = useState<Record<number, string>>({});
  const [newsFilter, setNewsFilter] = useState<'ALL' | 'OTTO' | 'BTC'>('ALL');

  // State to hold AI sentiment analytics
  interface SentimentData {
    sentiment: number;
    prediction: 'UP' | 'DOWN';
    probability: number;
    technicalAnalysis: string;
    hashrateMetric: number;
    socialMetric: number;
    whaleMetric: number;
    tacticalRecommendation: string;
  }

  const [sentimentData, setSentimentData] = useState<Record<string, SentimentData>>({});
  const [loadingSentiment, setLoadingSentiment] = useState<Record<string, boolean>>({});

  // Pearson correlation formula
  const calculatePearson = (x: number[], y: number[]) => {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    let num = 0;
    let denX = 0;
    let denY = 0;
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      num += diffX * diffY;
      denX += diffX * diffX;
      denY += diffY * diffY;
    }
    if (denX === 0 || denY === 0) return 0;
    return num / Math.sqrt(denX * denY);
  };

  const getCorrelationValue = (lookback: number, mode: 'prices' | 'returns') => {
    const ottoHist = assets['OTTO_Coin']?.history || [];
    const btcHist = assets['BTC']?.history || [];
    const minLen = Math.min(ottoHist.length, btcHist.length);
    if (minLen < 3) return 0.65; // fallback default positive beta correlation

    const oSliced = ottoHist.slice(-lookback);
    const bSliced = btcHist.slice(-lookback);
    const currentLen = Math.min(oSliced.length, bSliced.length);

    const oPrices = oSliced.slice(0, currentLen).map(item => item.price);
    const bPrices = bSliced.slice(0, currentLen).map(item => item.price);

    if (mode === 'prices') {
      return calculatePearson(oPrices, bPrices);
    } else {
      const oReturns: number[] = [];
      const bReturns: number[] = [];
      for (let i = 1; i < currentLen; i++) {
        if (oPrices[i - 1] !== 0) {
          oReturns.push((oPrices[i] - oPrices[i - 1]) / oPrices[i - 1]);
        } else {
          oReturns.push(0);
        }
        if (bPrices[i - 1] !== 0) {
          bReturns.push((bPrices[i] - bPrices[i - 1]) / bPrices[i - 1]);
        } else {
          bReturns.push(0);
        }
      }
      return calculatePearson(oReturns, bReturns);
    }
  };

  const getNormalizedPathData = (lookback: number) => {
    const ottoHist = assets['OTTO_Coin']?.history || [];
    const btcHist = assets['BTC']?.history || [];
    const minLen = Math.min(ottoHist.length, btcHist.length);
    if (minLen === 0) return [];

    const oSliced = ottoHist.slice(-lookback);
    const bSliced = btcHist.slice(-lookback);
    const currentLen = Math.min(oSliced.length, bSliced.length);

    const oStart = oSliced[0]?.price || 1;
    const bStart = bSliced[0]?.price || 1;

    return Array.from({ length: currentLen }).map((_, index) => {
      const oVal = oSliced[index]?.price || oStart;
      const bVal = bSliced[index]?.price || bStart;
      return {
        tick: index + 1,
        'OTTO_Norm': Number(((oVal / oStart) * 100).toFixed(2)),
        'BTC_Norm': Number(((bVal / bStart) * 100).toFixed(2)),
      };
    });
  };

  const triggerSentimentFetch = async (assetKey: string) => {
    if (loadingSentiment[assetKey]) return;
    setLoadingSentiment(prev => ({ ...prev, [assetKey]: true }));
    
    try {
      const symbol = assetKey === 'OTTO_Coin' ? 'OTTO' : 'BTC';
      const currentPrice = assets[assetKey]?.price || 1.42;
      const change24h = assets[assetKey]?.change24h || 0;
      const playerIQ = playerData?.stats?.iq || 100;

      const res = await fetch("/api/crypto-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, currentPrice, change24h, playerIQ })
      });

      if (res.ok) {
        const data = await res.json();
        setSentimentData(prev => ({ ...prev, [assetKey]: data }));
      } else {
        throw new Error("Neural response disruption.");
      }
    } catch (err) {
      console.error("AI sentiment synthesis offline. Initializing local fail-safe calculations:", err);
      // Cybernetic local prediction fallback based on dynamic drift trends
      const isUp = (assets[assetKey]?.change24h || 0) >= 0;
      setSentimentData(prev => ({
        ...prev,
        [assetKey]: {
          sentiment: isUp ? 62 + Math.floor(Math.random() * 15) : 38 - Math.floor(Math.random() * 12),
          prediction: isUp ? "UP" : "DOWN",
          probability: 65 + Math.floor(Math.random() * 15),
          technicalAnalysis: assetKey === 'OTTO_Coin'
            ? "Secondary sub-grid mesh activity shows steady background transactions. Speculative spot demand supports micro consolidation."
            : "Institutional storage buffers indicate structural consolidation. Whale order block balances are neutral.",
          hashrateMetric: 70 + Math.floor(Math.random() * 18),
          socialMetric: 68 + Math.floor(Math.random() * 22),
          whaleMetric: 58 + Math.floor(Math.random() * 25),
          tacticalRecommendation: isUp
            ? "Deploy progressive spot acquisition strategies with tight risk stops."
            : "Conserve liquid cash reserves. Wait for whale order boards to establish a clear drift direction."
        }
      }));
    } finally {
      setLoadingSentiment(prev => ({ ...prev, [assetKey]: false }));
    }
  };

  // Trigger initial fetches on mount
  useEffect(() => {
    triggerSentimentFetch('OTTO_Coin');
    triggerSentimentFetch('BTC');
  }, []);

  // Sync sentiment calculations if state changes
  useEffect(() => {
    if (selectedAssetKey && !sentimentData[selectedAssetKey]) {
      triggerSentimentFetch(selectedAssetKey);
    }
  }, [selectedAssetKey]);

  // Monitor correlation for major market structural shifts (< 0.2)
  const lastAlertCorrelationRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof addNotification !== 'function') return;

    const corrValue = getCorrelationValue(correlationLookback, correlationMode);
    
    if (corrValue < 0.2) {
      if (!lastAlertCorrelationRef.current) {
        addNotification(`MARKET SHIFT: OTTO & BTC correlation fell to ${corrValue.toFixed(3)} (< 0.200)! Major asset decoupling in progress.`);
        onAction(`SYSTEM_ALERT: Market correlation drop detected: ${corrValue.toFixed(3)}. Decentralized decoupling triggered.`);
        lastAlertCorrelationRef.current = true;
      }
    } else if (corrValue >= 0.25) {
      // Small hysteresis to avoid spam/flashing alerts on noise
      lastAlertCorrelationRef.current = false;
    }
  }, [assets, correlationLookback, correlationMode, addNotification]);

  // Automated volatility threshold monitor service (Trigger alert at absolute 24h change > 5%)
  const alerted5PercentAssetsRef = useRef<Record<string, { exceeded: boolean; lastNotifiedPrice: number; lastChangeVal: number }>>({});

  useEffect(() => {
    if (typeof addNotification !== 'function') return;

    Object.keys(assets).forEach(key => {
      const asset = assets[key];
      const change24h = asset.change24h;
      const absChange = Math.abs(change24h);
      
      const prevAlertState = alerted5PercentAssetsRef.current[key] || { exceeded: false, lastNotifiedPrice: asset.price, lastChangeVal: 0 };
      
      if (absChange >= 5.0) {
        if (!prevAlertState.exceeded) {
          // Newly exceeded 5% change threshold
          const direction = change24h >= 0 ? "Surged" : "Plummeted";
          const sign = change24h >= 0 ? "+" : "";
          const msg = `⚠️ VOLATILITY ALERT: ${asset.symbol} has ${direction.toLowerCase()} past the 5% threshold! Current 24h Change: ${sign}${change24h.toFixed(2)}% | Price: $${asset.price.toLocaleString(undefined, { minimumFractionDigits: key === 'OTTO_Coin' ? 4 : 2 })}`;
          
          addNotification(msg);
          if (typeof onAction === 'function') {
            onAction(`VOLATILITY_TRIGGER: ${asset.symbol} 24h change crossed 5% threshold at ${sign}${change24h.toFixed(2)}%`);
          }
          
          alerted5PercentAssetsRef.current[key] = {
            exceeded: true,
            lastNotifiedPrice: asset.price,
            lastChangeVal: change24h
          };
        } else {
          // Keep state up to date
          alerted5PercentAssetsRef.current[key] = {
            exceeded: true,
            lastNotifiedPrice: asset.price,
            lastChangeVal: change24h
          };
        }
      } else {
        // Returned within safe 5% zone
        if (prevAlertState.exceeded) {
          const msg = `✓ VOLATILITY STABILIZED: ${asset.symbol} has returned within normal thresholds (< 5.0%). Current 24h Change: ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`;
          addNotification(msg);
          if (typeof onAction === 'function') {
            onAction(`VOLATILITY_RESET: ${asset.symbol} 24h change stabilized at ${change24h.toFixed(2)}%`);
          }
        }
        alerted5PercentAssetsRef.current[key] = {
          exceeded: false,
          lastNotifiedPrice: asset.price,
          lastChangeVal: change24h
        };
      }
    });
  }, [assets, addNotification, onAction]);

  // Load custom holdings from localStorage so player's efforts persist
  const [holdings, setHoldings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('city_crypto_holdings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      'OTTO_Coin': 1250,
      'BTC': 0.45
    };
  });

  // Keep holdings in localStorage
  useEffect(() => {
    localStorage.setItem('city_crypto_holdings', JSON.stringify(holdings));
  }, [holdings]);

  // Live price feed updates simulated with slight random walks to feel truly live!
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => {
        const next = { ...prev };
        const tickUpdate: Record<string, 'up' | 'down' | null> = {};

        Object.keys(next).forEach(key => {
          const asset = next[key];
          // Volatility factor
          const volatility = key === 'OTTO_Coin' ? 0.012 : 0.003; 
          const direction = Math.random() > 0.45 ? 1 : -1; // slight upward drift
          const percentageChange = (Math.random() * volatility) * direction;
          
          const newPrice = Number((asset.price * (1 + percentageChange)).toFixed(key === 'OTTO_Coin' ? 4 : 2));
          const isUp = newPrice >= asset.price;
          tickUpdate[key] = isUp ? 'up' : 'down';

          // Update history chain
          const currentHistory = [...asset.history];
          currentHistory.shift();
          currentHistory.push({
            time: `c-${Date.now()}`,
            price: newPrice
          });

          // Calculate 24h change relatively
          const startPrice = currentHistory[0]?.price || asset.prevPrice;
          const change24h = ((newPrice - startPrice) / startPrice) * 100;

          next[key] = {
            ...asset,
            price: newPrice,
            prevPrice: asset.price,
            change24h,
            ath: Math.max(asset.ath, newPrice),
            history: currentHistory
          };
        });

        // Flashing update feedback state
        setPriceTick(tickUpdate);
        setTimeout(() => {
          setPriceTick({ 'OTTO_Coin': null, 'BTC': null });
        }, 1000);

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Automatic Stop-Loss Liquidation Engine
  useEffect(() => {
    if (stopLossOrders.length === 0) return;

    const triggeredOrders: StopLossOrder[] = [];
    const remainingOrders: StopLossOrder[] = [];

    stopLossOrders.forEach(order => {
      const asset = assets[order.assetKey];
      if (asset && asset.price <= order.floorPrice) {
        triggeredOrders.push(order);
      } else {
        remainingOrders.push(order);
      }
    });

    if (triggeredOrders.length > 0) {
      // Update state to remove triggered orders immediately
      setStopLossOrders(remainingOrders);

      triggeredOrders.forEach(order => {
        const asset = assets[order.assetKey];
        if (!asset) return;

        const currentPrice = asset.price;

        setHoldings(prevHoldings => {
          const held = prevHoldings[order.assetKey] || 0;
          const qtyToLiquidate = Math.min(held, order.quantity);

          if (qtyToLiquidate <= 0) {
            if (typeof addNotification === 'function') {
              addNotification(`⚠️ STOP LOSS EXPIRED: Order #${order.id.slice(0, 6)} for ${order.symbol} triggered at $${currentPrice.toLocaleString()}, but you held no shares to liquidate.`);
            }
            return prevHoldings;
          }

          const payout = Number((qtyToLiquidate * currentPrice).toFixed(2));

          if (setPlayerData) {
            setPlayerData((prevPlayer: any) => ({
              ...prevPlayer,
              bank: {
                ...prevPlayer.bank,
                savings: Number((prevPlayer.bank.savings + payout).toFixed(2)),
                transactionHistory: [
                  {
                    id: 'tx-sl-' + Math.random().toString(36).substr(2, 9),
                    date: new Date().toISOString().split('T')[0],
                    type: 'CREDIT',
                    amount: payout,
                    description: `Stop Loss Liquidate [AUTOTRADE]: ${qtyToLiquidate} ${order.symbol} @ $${currentPrice.toLocaleString()}`
                  },
                  ...(prevPlayer.bank.transactionHistory || [])
                ]
              }
            }));
          }

          if (typeof addNotification === 'function') {
            addNotification(`🛑 STOP LOSS TRIGGERED: Automatically liquidated ${qtyToLiquidate} ${order.symbol} at $${currentPrice.toLocaleString()} (Floor: $${order.floorPrice.toLocaleString()}) which secured $${payout.toLocaleString()} cash!`);
          }

          if (typeof onAction === 'function') {
            onAction(`STOP_LOSS_EXECUTED: Auto liquidated ${qtyToLiquidate} ${order.symbol} at $${currentPrice}`);
          }

          // Add transaction record
          setRecentTXs(prevTx => [
            {
              id: Math.random().toString(),
              time: new Date().toLocaleTimeString(),
              type: 'SELL',
              asset: order.assetKey,
              amount: qtyToLiquidate,
              price: currentPrice,
              total: payout,
              hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
            },
            ...prevTx
          ]);

          return {
            ...prevHoldings,
            [order.assetKey]: Number((held - qtyToLiquidate).toFixed(6))
          };
        });
      });
    }
  }, [assets, stopLossOrders, setPlayerData, addNotification, onAction]);

  // Generate fake live global trades in ledger tab to boost telemetry feel
  const [meshNetworkTrades, setMeshNetworkTrades] = useState<{ id: string; msg: string; type: string }[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const symbols = ['OTTO', 'BTC', 'NEON', 'GRID'];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      const isBuy = Math.random() > 0.45;
      const amount = (Math.random() * (sym === 'BTC' ? 0.15 : 150) + 0.01).toFixed(3);
      const hash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const newTrade = {
        id: hash,
        msg: `BLOCK_NODE_${Math.floor(Math.random() * 900 + 100)} processed: ${isBuy ? 'BUY' : 'SELL'} ${amount} ${sym} @ hash ${hash}`,
        type: isBuy ? 'buy' : 'sell'
      };

      setMeshNetworkTrades(prev => [newTrade, ...prev.slice(0, 7)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const selectedAsset = assets[selectedAssetKey];
  const userBalance = playerData?.bank?.savings || 0; // standard cash
  const heldQuantity = holdings[selectedAssetKey] || 0;
  const currentAssetPrice = selectedAsset.price;
  const estimatedCostValue = Number((heldQuantity * currentAssetPrice).toFixed(2));

  // Compute total aggregate cryptocurrency worth
  const totalCryptoWorth = Object.keys(holdings).reduce((sum, key) => {
    const assetPrice = assets[key]?.price || 0;
    return sum + (holdings[key] * assetPrice);
  }, 0);

  // Monitor when the game "day" (cycle) increases to calculate property/income tax
  const lastKnownDayRef = useRef<number>(day);

  useEffect(() => {
    if (day > lastKnownDayRef.current) {
      const endedDay = lastKnownDayRef.current;
      lastKnownDayRef.current = day;

      const totalAssetsVal = totalCryptoWorth + userBalance;
      
      // Calculate allowable deductions based on active strategies
      // Energy deductions are capped at 40% of standard asset valuation
      const maxAllowedEnergy = totalAssetsVal * 0.40;
      const appliedEnergyDed = Math.min(activeEnergyDeduction, maxAllowedEnergy);
      const taxableAssetsVal = Math.max(0, totalAssetsVal - appliedEnergyDed);

      const pRate = taxRegime === 'Standard' ? 0.0020 : 0.0005;
      const iRate = taxRegime === 'Standard' ? 0.0080 : 0.0015;

      const calculatedPropertyTax = taxableAssetsVal * pRate;
      const calculatedIncomeTax = taxableAssetsVal * iRate;
      const subtotalTaxes = calculatedPropertyTax + calculatedIncomeTax;

      // Allowable R&D credits can offset up to 25% of the standard pre-credit tax subtotal
      const maxAllowedRd = subtotalTaxes * 0.25;
      const appliedRd = Math.min(activeRdCredit, maxAllowedRd);
      const taxesAfterRd = Math.max(0, subtotalTaxes - appliedRd);

      // Double Irish Loophole gives a flat 50% discount but severely increases audit risks
      const cycleTaxTotal = activeIrishLoophole ? (taxesAfterRd * 0.50) : taxesAfterRd;

      // Report via addNotification
      if (typeof addNotification === 'function') {
        const regimeLabel = taxRegime === 'Standard' ? 'STANDARD_COMPLIANCE' : 'OFFSHORE_SHADOW_LEDGER';
        let detailStr = `📋 TAX ASSESSMENT: Day ${endedDay} cycle complete. Base assets: $${totalAssetsVal.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`;
        if (appliedEnergyDed > 0) detailStr += ` [Energy Ded: -$${appliedEnergyDed.toFixed(2)}]`;
        if (appliedRd > 0) detailStr += ` [R&D Credit: -$${appliedRd.toFixed(2)}]`;
        if (activeIrishLoophole) detailStr += ` [Double Irish Loophole: -50%]`;
        detailStr += ` Generated Liability: $${cycleTaxTotal.toFixed(2)} [LEDGER: ${regimeLabel}]`;
        addNotification(detailStr);
      }

      // Check if previous day tax went unpaid (taxBill > 0)
      setDelinquentTaxes(prevDel => {
        let nextDel = prevDel;
        if (taxBill > 0) {
          const penalty = taxBill * 0.15;
          nextDel = prevDel + taxBill + penalty;
          if (typeof addNotification === 'function') {
            addNotification(`🚨 TAX INTEREST PENALTY: Unpaid taxes of $${taxBill.toFixed(2)} from Day ${endedDay} carried forward. Back Taxes with 15% penalty (+$${penalty.toFixed(2)}) is now $${nextDel.toFixed(2)}.`);
          }
          // Increment Audit Risk
          setAuditRisk(prev => {
            let extraRisk = taxRegime === 'Standard' ? 15 : 35;
            if (activeIrishLoophole) extraRisk += 15;
            if (activeEnergyDeduction > 0) extraRisk += 5;
            return Math.min(100, prev + extraRisk);
          });
        }
        return nextDel;
      });

      // Update current outstanding taxBill
      setTaxBill(cycleTaxTotal);
      setLastAssessedDay(day);

      // Offshore regime daily penalty & active deduction risk multipliers
      setAuditRisk(prev => {
        let addedRisk = 0;
        if (taxRegime === 'Offshore') {
          addedRisk += 10;
        }
        if (activeEnergyDeduction > 0) addedRisk += 2;
        if (activeRdCredit > 0) addedRisk += 3;
        if (activeIrishLoophole) addedRisk += 12;

        if (addedRisk > 0 && typeof addNotification === 'function') {
          addNotification(`🛡️ AUDIT RISK INCREASE: Active ledger strategies incurred an additional +${addedRisk}% audit susceptibility penalty for Day ${day}.`);
        }
        return Math.min(100, prev + addedRisk);
      });
    }
  }, [day, totalCryptoWorth, userBalance, taxRegime, taxBill, addNotification, activeEnergyDeduction, activeRdCredit, activeIrishLoophole]);

  // Handle high Audit Risk Trigger (>= 100%)
  useEffect(() => {
    if (auditRisk >= 100) {
      const totalOwed = taxBill + delinquentTaxes;
      const seizeCap = totalOwed > 0 ? totalOwed * 1.25 : 3500; // standard flat penalty if they didn't owe but was under audit
      
      const realSavingsSeize = Math.min(userBalance, seizeCap);
      const remainingDeficit = seizeCap - realSavingsSeize;

      // Deduct from savings via setPlayerData
      if (setPlayerData) {
        setPlayerData((prev: any) => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: Number(Math.max(0, prev.bank.savings - seizeCap).toFixed(2))
          }
        }));
      }

      let holdingsLiquidationMsg = "";
      if (remainingDeficit > 0) {
        // Seize crypto holdings
        setHoldings(prev => {
          const next = { ...prev };
          const ottoPrice = assets['OTTO_Coin']?.price || 1.42;
          const btcPrice = assets['BTC']?.price || 68450;
          
          let deficit = remainingDeficit;
          const ottoVal = (next['OTTO_Coin'] || 0) * ottoPrice;
          if (ottoVal >= deficit) {
            const liquidatedQty = deficit / ottoPrice;
            next['OTTO_Coin'] = Number(((next['OTTO_Coin'] || 0) - liquidatedQty).toFixed(2));
            holdingsLiquidationMsg += `Forced liquidated ${liquidatedQty.toFixed(1)} OTTO at $${ottoPrice.toFixed(2)}. `;
            deficit = 0;
          } else {
            next['OTTO_Coin'] = 0;
            deficit -= ottoVal;
            holdingsLiquidationMsg += `Fully liquidated OTTO holdings keys. `;

            const btcVal = (next['BTC'] || 0) * btcPrice;
            if (btcVal >= deficit) {
              const liquidatedQty = deficit / btcPrice;
              next['BTC'] = Number(((next['BTC'] || 0) - liquidatedQty).toFixed(5));
              holdingsLiquidationMsg += `Forced liquidated ${liquidatedQty.toFixed(4)} BTC at $${btcPrice.toLocaleString()}. `;
              deficit = 0;
            } else {
              next['BTC'] = 0;
              holdingsLiquidationMsg += `Fully liquidated BTC holdings keys. `;
              deficit -= btcVal;
            }
          }
          return next;
        });
      }

      if (typeof addNotification === 'function') {
        addNotification(`🚨 IMMINENT AUDIT SEIZURE: Revenue agents have intervened! Seized $${realSavingsSeize.toFixed(2)} from bank savings to satisfy outstanding liabilities with a 25% audit surcharge. ${holdingsLiquidationMsg}`);
        if (typeof onAction === 'function') {
          onAction(`AUDIT_LIQUIDATION: Back tax enforcement liquidated holdings to secure $${seizeCap.toFixed(2)}`);
        }
      }

      // Reset tax liabilities and return risk to baseline
      setTaxBill(0);
      setDelinquentTaxes(0);
      setAuditRisk(15);
    }
  }, [auditRisk, taxBill, delinquentTaxes, userBalance, setPlayerData, assets, addNotification, onAction]);

  // Calculate allocation values for PieChart
  const getPieData = () => {
    const data = [];
    const btcHoldings = holdings['BTC'] || 0;
    const btcPrice = assets['BTC']?.price || 0;
    const btcVal = btcHoldings * btcPrice;

    const ottoHoldings = holdings['OTTO_Coin'] || 0;
    const ottoPrice = assets['OTTO_Coin']?.price || 0;
    const ottoVal = ottoHoldings * ottoPrice;

    const totalCrypto = btcVal + ottoVal;
    const cashVal = includeCashInAllocation ? userBalance : 0;
    const totalAllocVal = totalCrypto + cashVal;

    if (totalAllocVal > 0) {
      if (ottoVal > 0) {
        data.push({
          name: 'OTTO_Coin',
          symbol: 'OTTO',
          value: ottoVal,
          color: '#ff007f',
          percentage: (ottoVal / totalAllocVal) * 100
        });
      }
      if (btcVal > 0) {
        data.push({
          name: 'Cybernetic_BTC',
          symbol: 'BTC',
          value: btcVal,
          color: '#00e5ff',
          percentage: (btcVal / totalAllocVal) * 100
        });
      }
      if (includeCashInAllocation && cashVal > 0) {
        data.push({
          name: 'Liquid_USD',
          symbol: 'USD',
          value: cashVal,
          color: '#8b5cf6',
          percentage: (cashVal / totalAllocVal) * 100
        });
      }
    }

    // Fallback if everything is literally empty (e.g. 0 cash and 0 crypto)
    if (data.length === 0) {
      return {
        chartData: [
          { name: 'OTTO_Coin', symbol: 'OTTO', value: 0, color: '#ff007f', percentage: 0 },
          { name: 'Cybernetic_BTC', symbol: 'BTC', value: 0, color: '#00e5ff', percentage: 0 },
          { name: 'Liquid_USD', symbol: 'USD', value: 1, color: '#8b5cf6', percentage: 100 }
        ],
        total: 0,
        isEmpty: true
      };
    }

    return {
      chartData: data,
      total: totalAllocVal,
      isEmpty: false
    };
  };

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(amountInput);
    if (isNaN(qty) || qty <= 0) {
      onAction('CRYPTO_ERROR: Enter a valid, non-zero numeric volume.');
      return;
    }

    const tradeCost = qty * currentAssetPrice;

    if (tradeType === 'BUY') {
      // Check if player has enough money in savings
      if (userBalance < tradeCost) {
        onAction(`DECRYPTION_ABORTED: Insufficient credit levels in bank reserves. Missing $${(tradeCost - userBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}.`);
        return;
      }

      // Execute buy! Deduct from parent balance
      if (setPlayerData) {
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: Number((prev.bank.savings - tradeCost).toFixed(2)),
            transactionHistory: [
              {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString().split('T')[0],
                type: 'DEBIT',
                amount: tradeCost,
                description: `Crypto Purchase: ${qty} ${selectedAsset.symbol}`
              },
              ...(prev.bank.transactionHistory || [])
            ]
          }
        }));
      }

      // Increase local holdings count
      setHoldings(prev => ({
        ...prev,
        [selectedAssetKey]: Number((prev[selectedAssetKey] + qty).toFixed(6))
      }));

      onAction(`SECURE_LEDGER: Finalized acquisition of ${qty} ${selectedAsset.symbol} @ $${currentAssetPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}/unit.`);
      
      // Save local transaction info
      const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setRecentTXs(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          type: 'BUY',
          asset: selectedAssetKey,
          amount: qty,
          price: currentAssetPrice,
          total: tradeCost,
          hash: txHash
        },
        ...prev
      ]);

    } else {
      // Execute sell! Check if they hold enough
      if (heldQuantity < qty) {
        onAction(`DECRYPTION_ABORTED: Insufficient ${selectedAsset.symbol} ledger inventory. Current held: ${heldQuantity}.`);
        return;
      }

      // Execute sell! Reimburse parent balance
      const saleCredit = tradeCost;
      if (setPlayerData) {
        setPlayerData(prev => ({
          ...prev,
          bank: {
            ...prev.bank,
            savings: Number((prev.bank.savings + saleCredit).toFixed(2)),
            transactionHistory: [
              {
                id: 'tx-' + Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString().split('T')[0],
                type: 'CREDIT',
                amount: saleCredit,
                description: `Crypto Liquidation: ${qty} ${selectedAsset.symbol}`
              },
              ...(prev.bank.transactionHistory || [])
            ]
          }
        }));
      }

      // Decrease local holdings count
      setHoldings(prev => ({
        ...prev,
        [selectedAssetKey]: Number((prev[selectedAssetKey] - qty).toFixed(6))
      }));

      onAction(`SECURE_LEDGER: Finalized liquidation of ${qty} ${selectedAsset.symbol} @ $${currentAssetPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}/unit.`);

      // Save local transaction info
      const txHash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setRecentTXs(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          type: 'SELL',
          asset: selectedAssetKey,
          amount: qty,
          price: currentAssetPrice,
          total: tradeCost,
          hash: txHash
        },
        ...prev
      ]);
    }

    setAmountInput('');
  };

  const handleStopLossSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(amountInput);
    const floor = parseFloat(stopLossFloorPrice);

    if (isNaN(qty) || qty <= 0) {
      if (typeof onAction === 'function') {
        onAction('CRYPTO_ERROR: Enter a valid, non-zero numeric volume.');
      }
      return;
    }

    if (isNaN(floor) || floor <= 0) {
      if (typeof onAction === 'function') {
        onAction('CRYPTO_ERROR: Enter a valid, non-zero trigger floor price.');
      }
      return;
    }

    if (floor >= currentAssetPrice) {
      if (typeof onAction === 'function') {
        onAction(`STOP_LOSS_ABORTED: Floor price ($${floor.toLocaleString()}) must be lower than current market price ($${currentAssetPrice.toLocaleString()}) to establish an effective downside boundary.`);
      }
      return;
    }

    if (heldQuantity < qty) {
      if (typeof onAction === 'function') {
        onAction(`STOP_LOSS_ABORTED: Insufficient inventory space. You hold ${heldQuantity} ${selectedAsset.symbol}, but attempted to set a stop loss for ${qty} ${selectedAsset.symbol}.`);
      }
      return;
    }

    const newOrder: StopLossOrder = {
      id: 'sl-' + Math.random().toString(36).substr(2, 9),
      assetKey: selectedAssetKey,
      symbol: selectedAsset.symbol,
      floorPrice: floor,
      quantity: qty,
      createdAt: new Date().toLocaleTimeString()
    };

    setStopLossOrders(prev => [...prev, newOrder]);
    
    if (typeof addNotification === 'function') {
      addNotification(`🛑 STOP LOSS REGISTERED: Protect ${qty} ${selectedAsset.symbol} with a downside floor of $${floor.toLocaleString()}.`);
    }

    if (typeof onAction === 'function') {
      onAction(`STOP_LOSS_PLACED: Set downside boundary for ${qty} ${selectedAsset.symbol} at $${floor}`);
    }

    // Clear forms
    setAmountInput('');
    setStopLossFloorPrice('');
  };

  const setMaxAmount = () => {
    if (tradeType === 'BUY') {
      const maxQty = userBalance / currentAssetPrice;
      setAmountInput(maxQty > 0 ? maxQty.toFixed(selectedAssetKey === 'OTTO_Coin' ? 1 : 4) : '0');
    } else {
      setAmountInput(heldQuantity.toString());
    }
  };

  const getFilteredPriceHistory = () => {
    const rawHistory = selectedAsset.history || [];
    let sliceLen = 45;
    let timeFormatter: (idx: number, len: number) => string;

    if (timeRange === '1H') {
      sliceLen = 15;
      timeFormatter = (idx, len) => {
        const minsAgo = (len - 1 - idx) * 4;
        return minsAgo === 0 ? 'NOW' : `${minsAgo}m ago`;
      };
    } else if (timeRange === '24H') {
      sliceLen = 45;
      timeFormatter = (idx, len) => {
        const hoursAgo = (len - 1 - idx) * 0.5;
        if (hoursAgo === 0) return 'NOW';
        const wholeHours = Math.floor(hoursAgo);
        const mins = hoursAgo % 1 === 0 ? '00' : '30';
        return `${wholeHours}h ${mins}m ago`;
      };
    } else if (timeRange === '7D') {
      sliceLen = 85;
      timeFormatter = (idx, len) => {
        const hoursAgo = (len - 1 - idx) * 2;
        if (hoursAgo === 0) return 'NOW';
        const days = Math.floor(hoursAgo / 24);
        const remainingHours = hoursAgo % 24;
        if (days > 0) {
          return `${days}d ${remainingHours}h ago`;
        }
        return `${remainingHours}h ago`;
      };
    } else {
      sliceLen = 120; // 1M
      timeFormatter = (idx, len) => {
        const hoursAgo = (len - 1 - idx) * 6;
        if (hoursAgo === 0) return 'NOW';
        const days = Math.floor(hoursAgo / 24);
        const remainingHours = hoursAgo % 24;
        if (days > 0) {
          return `${days}d ${remainingHours}h ago`;
        }
        return `${remainingHours}h ago`;
      };
    }

    const sliced = rawHistory.slice(-sliceLen);
    return sliced.map((item, idx) => ({
      ...item,
      displayTime: timeFormatter(idx, sliced.length)
    }));
  };

  // Custom chart tooltip
  const CryptoChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const displayTime = payload[0].payload.displayTime || 'Ledger Time Tick';
      return (
        <div className="bg-black/50 backdrop-blur-[12px] border border-white/15 p-3.5 rounded-sm shadow-2xl font-mono text-left">
          <div className="text-[8px] text-white/40 uppercase tracking-widest border-b border-white/5 pb-1 mb-1.5 font-bold flex justify-between items-center gap-2">
            <span>TIMETICK ANALYSIS</span>
            <span className="text-[#00fdc1]">{displayTime}</span>
          </div>
          <div className="flex justify-between items-center gap-4 text-xs font-black">
            <span style={{ color: selectedAsset.color }}>{selectedAsset.symbol}/USD</span>
            <span className="text-white">
              ${Number(payload[0].value).toLocaleString(undefined, { minimumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 4 : 2, maximumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 4 : 2 })}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Overview Card */}
      <div className="bg-[#0a0a0c] border border-white/5 p-6 relative overflow-hidden etched-border">
        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff007f]/40" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]/40" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]/40" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff007f]/40" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-500 rounded-sm">
                <Coins size={14} />
              </span>
              <div>
                <h4 className="font-headline font-black text-lg text-white uppercase italic tracking-tighter leading-none">
                  DESTRUCTIVE_speculative_matrix
                </h4>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.25em] mt-1 font-mono">
                  Decentralized Mesh Wallet • Live Grid Node Link-Up 
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-left font-mono border-l border-white/10 pl-4">
              <span className="text-[8px] text-white/30 block tracking-widest uppercase font-bold">TOTAL CRYPTO VALUE</span>
              <span className="text-xl font-bold text-[#00fdc1] tracking-tight">
                ${totalCryptoWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="text-left font-mono border-l border-white/10 pl-4">
              <span className="text-[8px] text-white/30 block tracking-widest uppercase font-bold">AVAILABLE LIQUID FUNDS</span>
              <span className="text-xl font-bold text-white tracking-tight">
                ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Scrolling News Ticker Tape */}
      <div className="bg-[#060608] border border-[#ff007f]/5 py-2.5 px-4 flex items-center gap-4 overflow-hidden text-xs font-mono relative rounded-sm shadow-inner select-none">
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#ff007f]/50" />
        <div className="flex items-center gap-2 text-[#ff007f] font-black text-[9px] uppercase tracking-widest shrink-0 border-r border-[#ff007f]/10 pr-4">
          <Radio size={12} className="text-[#ff007f] animate-pulse" />
          <span>CYBERNETIC NEWS FLASH</span>
        </div>
        <div className="w-full overflow-hidden relative h-5 flex items-center font-mono">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ ease: "linear", duration: 35, repeat: Infinity }}
            className="flex gap-16 whitespace-nowrap absolute pl-4"
          >
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-[#ff007f] rounded-full inline-block animate-ping" /> OTTO COIN SPOT: ${assets['OTTO_Coin']?.price.toFixed(4) || '1.4200'} // HASHRATE STREAMING AT {assets['OTTO_Coin']?.hashrate || '45.2 GH/s'} // CONCURRENT CONSENSUS ACTIVE</span>
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full inline-block" /> CYBER BITCOIN INDEX: ${assets['BTC']?.price.toLocaleString() || '68,450'} // WHALE ACCUMULATION SPANS BLOCK 1,029,482</span>
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block" /> MESH PROTOCOL STRAY RATE AT 0.4% // TRANSACTION ACCURACY REPORT COMPLIANT WITH SECTOR-9 DIREX</span>
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> DATA LINKING: ZERO-KNOWLEDGE PROOFS RELEASED IN ACCORDANCE WITH SUB-MESH v2.5 STANDARD</span>
            {/* Clone for seamless loop wrap */}
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-[#ff007f] rounded-full inline-block animate-ping" /> OTTO COIN SPOT: ${assets['OTTO_Coin']?.price.toFixed(4) || '1.4200'} // HASHRATE STREAMING AT {assets['OTTO_Coin']?.hashrate || '45.2 GH/s'} // CONCURRENT CONSENSUS ACTIVE</span>
            <span className="text-white/60 flex items-center gap-2 text-[10px] uppercase font-bold"><span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full inline-block" /> CYBER BITCOIN INDEX: ${assets['BTC']?.price.toLocaleString() || '68,450'} // WHALE ACCUMULATION SPANS BLOCK 1,029,482</span>
          </motion.div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Asset selectors cards list */}
        <div className="lg:col-span-3 space-y-4">
          <h5 className="font-mono text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">
            LIVE_ASSET_UNITS
          </h5>
          
          <div className="space-y-3">
            {Object.keys(assets).map(key => {
              const asset = assets[key];
              const isSelected = selectedAssetKey === key;
              const isTickUp = priceTick[key] === 'up';
              const isTickDown = priceTick[key] === 'down';
              const heldAmount = holdings[key] || 0;
              const heldValue = heldAmount * asset.price;

              return (
                <div 
                  key={key}
                  onClick={() => setSelectedAssetKey(key)}
                  className={`p-4 border cursor-pointer relative overflow-hidden transition-all group ${
                    isSelected 
                      ? 'bg-white/[0.03] border-white/20' 
                      : 'bg-[#060608] border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Neon border focus bars */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-[3px]" style={{ backgroundColor: asset.color }} />
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: asset.color }} 
                        />
                        <span className="text-xs font-black text-white tracking-wide uppercase font-mono">
                          {asset.symbol}
                        </span>
                      </div>
                      <p className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wider font-mono">
                        {asset.name}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <div className={`text-sm font-black transition-all duration-300 ${
                        isTickUp ? 'text-[#00fdc1] scale-105' : isTickDown ? 'text-red-400 scale-105' : 'text-white'
                      }`}>
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: key === 'OTTO_Coin' ? 4 : 2 })}
                      </div>
                      
                      <div className={`text-[9px] font-black flex items-center justify-end gap-0.5 mt-0.5 ${
                        asset.change24h >= 0 ? 'text-[#00fdc1]' : 'text-red-400'
                      }`}>
                        {asset.change24h >= 0 ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Holdings in mini display */}
                  <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-white/40">
                    <div>
                      <span>HELD: </span>
                      <span className="text-white/80 font-bold">{heldAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}</span>
                    </div>
                    <div>
                      <span>VALUE: </span>
                      <span className="text-[#00fdc1] font-bold">${heldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Informational / Warning Terminal Panel */}
          <div className="p-4 bg-yellow-550/5 border border-yellow-500/10 rounded-sm font-mono text-[10px] space-y-2 text-white/60">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <ShieldAlert size={12} className="animate-pulse" />
              <span>HIGH_SPECULATION_INDEX_NOTICE</span>
            </div>
            <p className="leading-relaxed leading-5">
              Speculative asset ledgers are subject to dynamic network resets. Holding OTTO_Coin grants access to custom digital underground markets but holds extreme correction risk. Diversify immediately.
            </p>
          </div>
        </div>

        {/* Column 2: Detailed Analysis & Analytics (Charts, Sentiment, etc) */}
        <div className="lg:col-span-5 xl:col-span-6 space-y-6">
          
          {/* Chart Card */}
          <div className="bg-[#060608] border border-white/5 p-6 relative flex flex-col justify-between">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 mb-6 gap-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: selectedAsset.color }} 
                />
                <div>
                  <h4 className="font-headline font-black text-md text-white uppercase italic tracking-tighter">
                    {selectedAsset.name} PRICE ANALYSIS
                  </h4>
                  <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] mt-0.5">
                    Live dynamic analytics matrix feed // Tick Stream Active
                  </p>
                </div>
              </div>

              {/* Chart inner sub-component links */}
              <div className="flex bg-white/[0.02] border border-white/10 p-0.5 rounded-sm flex-wrap gap-0.5 sm:gap-0">
                {[
                  { id: 'chart', label: 'Price Chart' },
                  { id: 'sentiment', label: 'Sentiment AI' },
                  { id: 'news', label: 'News Feed' },
                  { id: 'correlation', label: 'Correlation' },
                  { id: 'metrics', label: 'Network stats' },
                  { id: 'ledger', label: 'Block log' },
                  { id: 'taxes', label: 'Taxes (Compliance)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 font-mono text-[9px] font-black uppercase tracking-wider transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white/10 text-white' 
                        : 'text-white/35 hover:text-white/70'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT: Price Chart */}
            {activeTab === 'chart' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.01] border border-white/5 p-3 rounded-sm gap-3">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00fdc1] animate-pulse" />
                    <span className="text-[9px] font-mono font-black text-white/35 tracking-widest uppercase">
                      VIEWPORT SCANNER WINDOW: {timeRange} LAPSE
                    </span>
                  </div>
                  <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xs">
                    {(['1H', '24H', '7D', '1M'] as const).map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-[9px] font-mono font-black uppercase tracking-widest transition-all rounded-xs cursor-pointer ${
                          timeRange === range
                            ? 'bg-[#00fdc1] text-black shadow-[0_0_10px_rgba(0,253,193,0.3)]'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[200px] w-full chart-scan-container">
                  {/* Glow Scanner Beam */}
                  <div className={selectedAssetKey === 'OTTO_Coin' ? "chart-scanner-beam-primary" : "chart-scanner-beam-secondary"} />
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getFilteredPriceHistory()} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`colorPrice-${selectedAssetKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedAsset.color} stopOpacity={0.25}/>
                          <stop offset="95%" stopColor={selectedAsset.color} stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis dataKey="time" hide={true} />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={8} 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 2 : 0 })}`}
                      />
                      <Tooltip content={<CryptoChartTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke={selectedAsset.color} 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill={`url(#colorPrice-${selectedAssetKey})`} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Performance stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  <div className="font-mono text-left">
                    <span className="text-[8px] text-white/30 block uppercase tracking-wider">ALL-TIME HIGH</span>
                    <span className="text-xs font-bold text-white">
                      ${selectedAsset.ath.toLocaleString(undefined, { minimumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 4 : 2 })}
                    </span>
                  </div>
                  <div className="font-mono text-left opacity-80">
                    <span className="text-[8px] text-white/30 block uppercase tracking-wider">ALL-TIME LOW</span>
                    <span className="text-xs font-bold text-white">
                      ${selectedAsset.atl.toLocaleString(undefined, { minimumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 4 : 2 })}
                    </span>
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[8px] text-white/30 block uppercase tracking-wider">24H MARKET VOLUME</span>
                    <span className="text-xs font-bold text-white">
                      ${(selectedAsset.volume24h / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="font-mono text-left">
                    <span className="text-[8px] text-white/30 block uppercase tracking-wider">NETWORK HASHRATE</span>
                    <span className="text-xs font-bold text-[#00fdc1]">
                      {selectedAsset.hashrate}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Sentiment AI */}
            {activeTab === 'sentiment' && (
              <div className="space-y-4 font-mono text-xs">
                {loadingSentiment[selectedAssetKey] || !sentimentData[selectedAssetKey] ? (
                  <div className="h-[230px] flex flex-col items-center justify-center space-y-3 text-center border border-white/5 bg-white/[0.01] p-6 rounded-sm">
                    <RefreshCw className="w-8 h-8 text-[#ff007f] animate-spin" />
                    <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] animate-pulse">
                      ESTABLISHING NEURAL UPLINK... GENERATING SENTIMENT INDEX MODEL
                    </p>
                    <p className="text-[8px] text-white/20 uppercase tracking-[0.2em]">
                      Querying sub-mesh pools // Loading 24h ledger trends via AI
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border border-white/5 bg-white/[0.01] p-4 rounded-sm relative overflow-hidden">
                    {/* Background glow matrix lines */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff007f]/5 rounded-full filter blur-xl pointer-events-none" />

                    {/* Gauges Column */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-2 border-r border-white/5 md:pr-4">
                      {/* Semicircular SVG Gauge */}
                      <div className="relative w-40 h-24 flex flex-col justify-end items-center mb-1 overflow-hidden">
                        <svg className="w-40 h-40 -rotate-180 absolute bottom-0" viewBox="0 0 120 120">
                          {/* Background Track Arc */}
                          <path
                            d="M 15 70 A 45 45 0 0 1 105 70"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          {/* Colored Active Arc */}
                          <path
                            d="M 15 70 A 45 45 0 0 1 105 70"
                            fill="none"
                            stroke={sentimentData[selectedAssetKey].sentiment >= 50 ? "#00fdc1" : "#f87171"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="141.37"
                            strokeDashoffset={141.37 - (sentimentData[selectedAssetKey].sentiment / 100) * 141.37}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        {/* Gauge Value Text */}
                        <div className="relative z-10 text-center pb-1">
                          <span className={`text-3xl font-black tracking-tighter ${sentimentData[selectedAssetKey].sentiment >= 50 ? 'text-[#00fdc1]' : 'text-rose-500'}`}>
                            {sentimentData[selectedAssetKey].sentiment}
                          </span>
                          <span className="text-[8px] text-white/30 block tracking-widest uppercase font-bold mt-1 font-mono">QUANT INDEX</span>
                        </div>
                      </div>

                      {/* Direction and Certainty indicators */}
                      <div className="flex gap-4 items-center justify-center w-full pt-3 mt-1 border-t border-white/5">
                        <div className="text-center">
                          <span className="text-[8px] text-white/40 block uppercase tracking-wider mb-1">24H PREDICTION</span>
                          <div className={`text-[10px] font-black px-2.5 py-1 rounded-sm flex items-center justify-center gap-1 uppercase tracking-widest leading-none ${
                            sentimentData[selectedAssetKey].prediction === 'UP' 
                              ? 'bg-[#00fdc1]/10 text-[#00fdc1] border border-[#00fdc1]/20 shadow-[0_0_10px_rgba(0,253,193,0.15)]' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {sentimentData[selectedAssetKey].prediction === 'UP' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {sentimentData[selectedAssetKey].prediction}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] text-white/40 block uppercase tracking-wider mb-1">CERTAINTY</span>
                          <span className="text-[10px] font-black text-white px-2 py-1 bg-white/[0.03] border border-white/5 rounded-sm tracking-wider block">
                            {sentimentData[selectedAssetKey].probability}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Indicators and analysis column */}
                    <div className="md:col-span-7 space-y-3">
                      {/* Technical Analysis Rationale Terminal */}
                      <div className="p-3 bg-[#0a0a0c] border border-white/5 text-left font-mono">
                        <div className="text-[8px] text-white/20 uppercase tracking-widest border-b border-white/5 pb-1 mb-2 font-bold flex justify-between items-center">
                          <span>AI_QUANT_SYNTHESIS_REPORT</span>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); triggerSentimentFetch(selectedAssetKey); }}
                            className="text-[#ff007f] hover:text-[#ff3399] flex items-center gap-1 active:scale-95 transition-all"
                            title="Re-run machine learning sentiment models"
                          >
                            <RefreshCw size={10} className={`${loadingSentiment[selectedAssetKey] ? 'animate-spin' : 'animate-pulse'}`} /> RE_MODEL_UPLINK
                          </button>
                        </div>
                        <p className="text-[10.5px] text-white/80 leading-relaxed font-normal italic">
                          "{sentimentData[selectedAssetKey].technicalAnalysis}"
                        </p>
                      </div>

                      {/* Dimensions Metrics Horizontal Progress bars */}
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between items-center text-[8px] mb-0.5">
                            <span className="text-white/40 uppercase font-bold">⚙️ NODE HASHRATE HEALTH</span>
                            <span className="text-indigo-400 font-bold">{sentimentData[selectedAssetKey].hashrateMetric}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                              style={{ width: `${sentimentData[selectedAssetKey].hashrateMetric}%` }} 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[8px] mb-0.5">
                            <span className="text-white/40 uppercase font-bold">💬 SOCIAL FORUM DENSITY</span>
                            <span className="text-[#ff007f] font-bold">{sentimentData[selectedAssetKey].socialMetric}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#ff007f] transition-all duration-1000 ease-out" 
                              style={{ width: `${sentimentData[selectedAssetKey].socialMetric}%` }} 
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[8px] mb-0.5">
                            <span className="text-white/40 uppercase font-bold">🐋 WHALE TRANSIT WEIGHT</span>
                            <span className="text-[#00e5ff] font-bold">{sentimentData[selectedAssetKey].whaleMetric}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/[0.02] border border-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#00e5ff] transition-all duration-1000 ease-out" 
                              style={{ width: `${sentimentData[selectedAssetKey].whaleMetric}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Recommend box */}
                      <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-left">
                        <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 font-black uppercase tracking-wider rounded-xs whitespace-nowrap">
                          TACTICAL_GUIDE
                        </span>
                        <span className="text-[10px] text-white/60 leading-tight">
                          {sentimentData[selectedAssetKey].tacticalRecommendation}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: News Feed */}
            {activeTab === 'news' && (
              <div className="space-y-4 font-mono text-xs">
                {/* News Filtering bar */}
                <div className="flex gap-2 border-b border-white/5 pb-3">
                  <button
                    type="button"
                    onClick={() => setNewsFilter('ALL')}
                    className={`px-3 py-1 border text-[9px] font-black uppercase tracking-wider rounded-xs transition-all ${
                      newsFilter === 'ALL'
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-transparent text-white/40 border-white/5 hover:text-white/70'
                    }`}
                  >
                    All Assets
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsFilter('OTTO')}
                    className={`px-3 py-1 border text-[9px] font-black uppercase tracking-wider rounded-xs transition-all ${
                      newsFilter === 'OTTO'
                        ? 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]/20'
                        : 'bg-transparent text-white/40 border-white/5 hover:text-white/70'
                    }`}
                  >
                    OTTO Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewsFilter('BTC')}
                    className={`px-3 py-1 border text-[9px] font-black uppercase tracking-wider rounded-xs transition-all ${
                      newsFilter === 'BTC'
                        ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/20'
                        : 'bg-transparent text-white/40 border-white/5 hover:text-white/70'
                    }`}
                  >
                    BTC Only
                  </button>
                </div>

                {/* News items list */}
                <div className="space-y-3 max-h-[268px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10">
                  {cryptoNews
                    .filter(item => newsFilter === 'ALL' || item.symbol === newsFilter || item.symbol === 'ALL')
                    .map(item => {
                      const isExpanded = expandedNewsId === item.id;
                      const hasExecuted = executedActions[item.id];
                      
                      return (
                        <div
                          key={item.id}
                          className={`border transition-all duration-200 ${
                            isExpanded 
                              ? 'bg-white/[0.03] border-white/20 p-4' 
                              : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-white/[0.01] p-3'
                          } rounded-sm cursor-pointer`}
                          onClick={() => setExpandedNewsId(isExpanded ? null : item.id)}
                        >
                          <div className="flex justify-between items-center mb-1 bg-transparent">
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black tracking-widest ${item.color} uppercase px-1.5 py-0.5 bg-white/[0.02] border border-white/5 rounded-xs`}>
                                {item.type}
                              </span>
                              <span className="text-[8px] text-white/30 uppercase tracking-wider font-bold">
                                {item.symbol === 'ALL' ? 'GLOBAL CRYPTO' : `${item.symbol}_COIN`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[8px] text-white/30">
                              <span>{item.time}</span>
                              <ChevronRight 
                                size={12} 
                                className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white/70' : 'text-white/20'}`} 
                              />
                            </div>
                          </div>

                          <p className="text-[10px] text-white/80 leading-normal font-sans font-medium text-left">
                            {item.msg}
                          </p>

                          {/* Expanded content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-3 pt-3 border-t border-white/5 font-mono text-[9.5px] text-left text-white/60 space-y-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div>
                                  <span className="text-[8px] text-white/30 block mb-1 uppercase font-bold">CORE REPORT</span>
                                  <p className="leading-relaxed text-white/70 font-sans">
                                    {item.context}
                                  </p>
                                </div>

                                <div className="flex justify-between items-center text-[8px] pt-1">
                                  <span className="text-white/30 uppercase font-bold">HISTORIC_MARKET_IMPACT</span>
                                  <span className={`font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide ${
                                    item.impact === 'BULLISH' ? 'bg-[#00fdc1]/10 text-[#00fdc1] border border-[#00fdc1]/20' :
                                    item.impact === 'BEARISH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                  }`}>
                                    {item.impact}
                                  </span>
                                </div>

                                {/* Active decisions or status */}
                                {hasExecuted ? (
                                  <div className="p-2.5 bg-[#00fdc1]/5 border border-[#00fdc1]/10 rounded-sm text-xs font-sans text-[#00fdc1] flex items-center gap-1.5 animate-fade-in">
                                    <Zap size={11} className="text-[#00fdc1] animate-pulse" />
                                    <span>{executedActions[item.id]}</span>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <span className="text-[8px] text-white/30 block uppercase font-bold">CHOOSE RESPONSE ACTION</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {item.actions.map((act) => (
                                        <button
                                          key={act.effectId}
                                          type="button"
                                          onClick={() => {
                                            setExecutedActions(prev => ({
                                              ...prev,
                                              [item.id]: act.effect
                                            }));
                                            onAction(`Executing Tactical Option: "${act.label}" for Event ID #${item.id}`);
                                          }}
                                          className="text-left p-2.5 bg-white/[0.02] border border-white/5 hover:border-[#ff007f]/40 hover:bg-[#ff007f]/5 transition-all rounded-sm text-[9.5px] text-white/80 font-sans font-medium flex items-center justify-between group active:scale-[0.98]"
                                        >
                                          <span>{act.label}</span>
                                          <ArrowUpRight size={10} className="text-[#ff007f]/50 group-hover:text-[#ff007f] transition-colors" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Network statistics */}
            {activeTab === 'metrics' && (
              <div className="h-[268px] flex flex-col justify-center space-y-4 font-mono text-xs">
                <div className="border border-white/5 bg-white/[0.01] p-5 rounded-sm">
                  <div className="text-[10px] font-black text-secondary tracking-widest uppercase mb-4 flex items-center gap-1.5">
                    <Cpu size={14} /> SECURITY & LEDGER INTELLIGENCE
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Consensus Engine:</span>
                      <span className="font-bold text-white uppercase">{selectedAssetKey === 'OTTO_Coin' ? 'Mesh-Proof-of-Stake' : 'Proof-of-Work'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Market Cap Rank:</span>
                      <span className="font-bold text-white">{selectedAssetKey === 'OTTO_Coin' ? '#328' : '#1'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Total Grid Nodes:</span>
                      <span className="font-bold text-white">{selectedAssetKey === 'OTTO_Coin' ? '1,840 Active' : '45,200 Active'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Ledger Block Time:</span>
                      <span className="font-bold text-white">{selectedAssetKey === 'OTTO_Coin' ? '4 sec (Instant)' : '10 min average'}</span>
                    </div>
                    <div className="flex justify-between pb-1 col-span-2">
                      <span className="text-white/40">Ledger Contract Address:</span>
                      <span className="font-bold text-white select-all text-[10px] break-all">{selectedAssetKey === 'OTTO_Coin' ? '0x8f2d57c2a59e0aefe009ce514d232a58b5bd4e01' : 'Core Bitcoin Genesis UTXO'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Correlation Matrix */}
            {activeTab === 'correlation' && (() => {
              const corrValue = getCorrelationValue(correlationLookback, correlationMode);
              const pathData = getNormalizedPathData(correlationLookback);
              
              // Dynamic interpretation text
              let interpretation = '';
              let statusColor = 'text-indigo-400';
              if (corrValue > 0.75) {
                interpretation = 'Systematic link detected. OTTO and BTC move in robust synchronicity, showing macro institutional synchronization.';
                statusColor = 'text-emerald-400';
              } else if (corrValue > 0.4) {
                interpretation = 'Moderate positive coupling. OTTO tracks standard market moves but maintains minor system variance.';
                statusColor = 'text-cyan-400';
              } else if (corrValue > -0.1 && corrValue <= 0.4) {
                interpretation = 'Slight decoupling. Localized sub-mesh network events dictate unique price dynamics independent of BTC.';
                statusColor = 'text-amber-400';
              } else {
                interpretation = 'Inverse drift. Ideal hedge conditions. Divergent liquidity routes are pulling assets in opposing channels.';
                statusColor = 'text-[#ff007f]';
              }

              return (
                <div className="h-[268px] overflow-y-auto pr-1 select-none scrollbar-thin scrollbar-thumb-white/10 space-y-4 font-mono text-[10px]">
                  {/* Top explanation label */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 text-left">
                    <span className="text-white/40 uppercase">LEDGER VALUE CORRELATION REGIME</span>
                    <span className={`${statusColor} font-black animate-pulse flex items-center gap-1`}>
                      <Activity size={10} /> R = {corrValue.toFixed(3)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Visual 2x2 Heatmap Matrix Grid */}
                    <div className="md:col-span-5 flex flex-col justify-center bg-black/30 border border-white/5 p-3 rounded-sm">
                      <div className="text-[9px] font-black text-white/30 tracking-widest uppercase mb-2 text-center">
                        PEARSON_CORR_HEATMAP
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1.5 text-center items-center">
                        {/* Row 0: Header labels */}
                        <div />
                        <div className="text-[8px] font-bold text-white/40 uppercase">OTTO</div>
                        <div className="text-[8px] font-bold text-white/40 uppercase">BTC</div>

                        {/* Row 1: OTTO Row */}
                        <div className="text-[8px] font-bold text-[#ff007f] uppercase text-left pl-1">OTTO</div>
                        <div className="bg-[#ff007f]/5 border border-[#ff007f]/20 hover:bg-[#ff007f]/10 p-2 rounded-xs transition-colors cursor-help" title="Asset identity relationship (perfect correlation)">
                          <span className="text-[10px] font-black text-[#ff007f]">1.00</span>
                        </div>
                        <div className={`p-2 rounded-xs border transition-all duration-300 cursor-help ${
                          corrValue > 0.75 ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15' :
                          corrValue > 0.4 ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15' :
                          corrValue > -0.1 ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15' :
                          'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/15'
                        }`} title="Calculated live correlation coefficient between OTTO and BTC">
                          <span className={`text-[10px] font-black ${
                            corrValue > 0.75 ? 'text-emerald-400' :
                            corrValue > 0.4 ? 'text-cyan-400' :
                            corrValue > -0.1 ? 'text-amber-400' :
                            'text-[#ff007f]'
                          }`}>{corrValue.toFixed(3)}</span>
                        </div>

                        {/* Row 2: BTC Row */}
                        <div className="text-[8px] font-bold text-[#00e5ff] uppercase text-left pl-1">BTC</div>
                        <div className={`p-2 rounded-xs border transition-all duration-300 cursor-help ${
                          corrValue > 0.75 ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15' :
                          corrValue > 0.4 ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15' :
                          corrValue > -0.1 ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15' :
                          'bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/15'
                        }`} title="Calculated live correlation coefficient between BTC and OTTO">
                          <span className={`text-[10px] font-black ${
                            corrValue > 0.75 ? 'text-emerald-400' :
                            corrValue > 0.4 ? 'text-cyan-400' :
                            corrValue > -0.1 ? 'text-amber-400' :
                            'text-[#ff007f]'
                          }`}>{corrValue.toFixed(3)}</span>
                        </div>
                        <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 hover:bg-[#00e5ff]/10 p-2 rounded-xs transition-colors cursor-help" title="Asset identity relationship (perfect correlation)">
                          <span className="text-[10px] font-black text-[#00e5ff]">1.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive controls & dynamic description */}
                    <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                      {/* Controls Row */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-white/[0.01] border border-white/5 p-2 rounded-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-white/30 text-[8px] uppercase font-bold">MODE:</span>
                          <div className="flex bg-black p-0.5 rounded-sm border border-white/5">
                            <button
                              type="button"
                              onClick={() => setCorrelationMode('prices')}
                              className={`px-1.5 py-0.5 rounded-xs font-mono text-[8px] font-black uppercase tracking-wider ${
                                correlationMode === 'prices' ? 'bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20' : 'text-white/40 hover:text-white/70'
                              }`}
                            >
                              Prices
                            </button>
                            <button
                              type="button"
                              onClick={() => setCorrelationMode('returns')}
                              className={`px-1.5 py-0.5 rounded-xs font-mono text-[8px] font-black uppercase tracking-wider ${
                                correlationMode === 'returns' ? 'bg-[#ff007f]/10 text-[#ff007f] border border-[#ff007f]/20' : 'text-white/40 hover:text-white/70'
                              }`}
                            >
                              Returns
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-grow">
                          <span className="text-white/30 text-[8px] uppercase font-bold">LOOKBACK:</span>
                          <input
                            type="range"
                            min="5"
                            max="20"
                            value={correlationLookback}
                            onChange={(e) => setCorrelationLookback(parseInt(e.target.value))}
                            className="h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff007f] flex-grow inline-block"
                          />
                          <span className="text-white/80 text-[8px] font-black w-6 text-right font-mono">{correlationLookback}T</span>
                        </div>
                      </div>

                      {/* Descriptive narrative */}
                      <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-sm flex items-start gap-2 text-left">
                        <span className="text-yellow-400 font-extrabold shrink-0 text-[10px]">ANALYSIS:</span>
                        <p className="text-[9.5px] leading-relaxed text-white/60 font-sans">
                          {interpretation}
                        </p>
                      </div>

                      {/* Mini AreaChart overlay */}
                      <div className="h-[75px] w-full border border-white/5 bg-black/40 rounded-sm relative overflow-hidden p-1">
                        <div className="absolute top-1 left-2 text-[7px] text-white/30 uppercase tracking-widest pointer-events-none font-bold">
                          NORMALIZED OVERLAY GRAPH ({correlationLookback} TICKS, STARTPOINT = 100%)
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={pathData} margin={{ top: 12, right: 2, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="normOtto" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff007f" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#ff007f" stopOpacity={0.0}/>
                              </linearGradient>
                              <linearGradient id="normBtc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="tick" hide={true} />
                            <YAxis domain={['auto', 'auto']} fontSize={7} stroke="rgba(255,255,255,0.1)" />
                            <Area type="monotone" dataKey="OTTO_Norm" stroke="#ff007f" strokeWidth={1.5} fill="url(#normOtto)" />
                            <Area type="monotone" dataKey="BTC_Norm" stroke="#00e5ff" strokeWidth={1.5} fill="url(#normBtc)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TAB CONTENT: Global Log */}
            {activeTab === 'ledger' && (
              <div className="h-[268px] overflow-y-auto font-mono text-[10px] space-y-2.5 scrollbar-thin scrollbar-thumb-white/10 pr-2">
                <div className="p-3 bg-white/[0.01] border border-white/5 flex justify-between items-center text-white/40 text-[9px] mb-2 font-black tracking-wider uppercase">
                  <span>NETWORK TELEMETRY EVENT STREAM</span>
                  <span className="text-[#00fdc1] animate-pulse">● BROADCAST ACTIVE</span>
                </div>
                
                {meshNetworkTrades.length === 0 ? (
                  <div className="text-center text-white/20 py-16">
                    Awaiting mesh broadcast packets...
                  </div>
                ) : (
                  meshNetworkTrades.map((item) => (
                    <div 
                      key={item.id} 
                      className="border-b border-white/5 pb-2 last:border-none flex items-center justify-between gap-4 text-left font-mono"
                    >
                      <span className="text-[10px] uppercase text-white/50 tracking-wide line-clamp-1">{item.msg}</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm ${
                        item.type === 'buy' ? 'bg-[#00fdc1]/10 text-[#00fdc1]' : 'bg-red-400/10 text-red-400'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: Taxes and Compliance Center */}
            {activeTab === 'taxes' && (() => {
              const sCrypto = simulatedCryptoWorth === '' ? totalCryptoWorth : (parseFloat(simulatedCryptoWorth) || 0);
              const sBalance = simulatedBalance === '' ? userBalance : (parseFloat(simulatedBalance) || 0);
              const sBase = sCrypto + sBalance;

              // Energy deduction caps at 40% of standard capital
              const maxSimulatedEnergy = sBase * 0.40;
              const appliedSimEnergy = Math.min(parseFloat(simulatedEnergyDeduction) || 0, maxSimulatedEnergy);
              const simulatedTaxableBase = Math.max(0, sBase - appliedSimEnergy);

              const sPRate = simulatedRegime === 'Standard' ? 0.0020 : 0.0005;
              const sIRate = simulatedRegime === 'Standard' ? 0.0080 : 0.0015;

              const simPropertyTax = simulatedTaxableBase * sPRate;
              const simIncomeTax = simulatedTaxableBase * sIRate;
              const simSubtotal = simPropertyTax + simIncomeTax;

              // R&D credits offsets up to 25% of pre-credit tax subtotal
              const maxSimAllowedRd = simSubtotal * 0.25;
              const appliedSimRd = Math.min(parseFloat(simulatedRdCredit) || 0, maxSimAllowedRd);
              const simTaxAfterRd = Math.max(0, simSubtotal - appliedSimRd);

              // Double Irish Loophole discount index
              const simTotalTax = simulatedIrishLoophole ? (simTaxAfterRd * 0.50) : simTaxAfterRd;

              // original baseline tax before any active shield/deductions
              const originalRate = taxRegime === 'Standard' ? 0.0100 : 0.0020;
              const originalBaseVal = totalCryptoWorth + userBalance;
              const originalTotalTax = originalBaseVal * originalRate;

              const simulatedSavings = Math.max(0, originalTotalTax - simTotalTax);
              const savingsPercent = originalTotalTax > 0 ? (simulatedSavings / originalTotalTax) * 100 : 0;

              // Estimated Daily Suspicious Alert Penalty Per Day Cycle
              let simCycleSuspRate = 0;
              if (simulatedRegime === 'Offshore') {
                simCycleSuspRate += 10;
              }
              if (appliedSimEnergy > 0) simCycleSuspRate += 2;
              if (appliedSimRd > 0) simCycleSuspRate += 3;
              if (simulatedIrishLoophole) simCycleSuspRate += 12;

              return (
                <div className="h-[285px] overflow-y-auto font-mono text-[10.5px] space-y-4 pr-1 text-left scrollbar-thin scrollbar-thumb-white/10">
                  {/* Header telemetry band */}
                  <div className="p-2.5 bg-[#ff0055]/5 border border-[#ff0055]/15 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <span className="font-black text-white text-[10px] tracking-widest uppercase flex items-center gap-1.5 grayscale-0">
                        <span className="w-1.5 h-1.5 bg-[#ff0055] rounded-full animate-ping" />
                        INTERNAL_REVENUE_SERVICE // LEDGER_COMPLIANCE
                      </span>
                      <p className="text-[7.5px] text-white/40 uppercase tracking-widest mt-0.5">
                        Cycle-based Audit Protection Protocol // Code GL-2A
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[7.5px] text-white/35 font-bold uppercase tracking-wide">LAST_VERIFIED_CYCLE:</span>
                      <strong className="text-white ml-2 font-black">DAY {lastAssessedDay}</strong>
                    </div>
                  </div>

                  {/* Sub-tab switcher */}
                  <div className="flex bg-white/[0.02] border border-white/5 p-0.5 rounded-sm gap-1 w-full">
                    <button
                      type="button"
                      onClick={() => setTaxSubTab('accounts')}
                      className={`flex-1 py-1.5 px-2 font-mono text-[8px] font-black uppercase tracking-wider transition-all rounded-xs text-center cursor-pointer ${
                        taxSubTab === 'accounts'
                          ? 'bg-[#ff0055]/15 text-[#ff0055] border border-[#ff0055]/30 shadow-[0_0_8px_rgba(255,0,85,0.15)]'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      Accounts & Settlement
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaxSubTab('strategy_lab')}
                      className={`flex-1 py-1.5 px-2 font-mono text-[8px] font-black uppercase tracking-wider transition-all rounded-xs text-center cursor-pointer ${
                        taxSubTab === 'strategy_lab'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/35 shadow-[0_0_8px_rgba(99,102,241,0.2)]'
                          : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      🛡️ Strategy Lab & Calculator
                    </button>
                  </div>

                  {taxSubTab === 'accounts' ? (
                    <div className="space-y-4">
                      {/* Active deduction strategies status pill */}
                      {(activeEnergyDeduction > 0 || activeRdCredit > 0 || activeIrishLoophole) && (
                        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xs flex flex-wrap gap-x-4 gap-y-1 items-center justify-between text-[8px] font-black tracking-widest text-indigo-300 uppercase">
                          <span>DEPLOYED SHIELDS:</span>
                          <div className="flex flex-wrap gap-2">
                            {activeEnergyDeduction > 0 && (
                              <span className="bg-indigo-950/40 border border-indigo-500/20 px-1 py-0.5 rounded-sm">ENERGY: -${activeEnergyDeduction.toFixed(0)}</span>
                            )}
                            {activeRdCredit > 0 && (
                              <span className="bg-indigo-950/40 border border-indigo-500/20 px-1 py-0.5 rounded-sm">R&D: -${activeRdCredit.toFixed(0)}</span>
                            )}
                            {activeIrishLoophole && (
                              <span className="bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-[#a78bfa] px-1 py-0.5 rounded-sm">🇮🇪 DOUBLE-IRISH: 50% DISC</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tax Regime Selector Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div 
                          onClick={() => {
                            setTaxRegime('Standard');
                            if (typeof addNotification === 'function') {
                              addNotification(`💼 REGIME CHANGED: Enrolled in Standard Tax Compliance. Rates: 0.20% Property / 0.80% Income. Baseline suspicion established.`);
                            }
                          }}
                          className={`p-3 border transition-all cursor-pointer rounded-xs select-none relative ${
                            taxRegime === 'Standard' 
                              ? 'bg-[#00fdc1]/5 border-[#00fdc1]/35 shadow-[0_0_15px_rgba(0,253,193,0.04)]' 
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <strong className="text-[9.5px] text-white uppercase tracking-wider">STANDARD REGIME</strong>
                            {taxRegime === 'Standard' && (
                              <span className="text-[7px] font-black text-[#00fdc1] bg-[#00fdc1]/10 px-1 py-0.5 rounded-xs">ACTIVE</span>
                            )}
                          </div>
                          <p className="text-[8.5px] text-white/60 leading-relaxed mb-2">
                            Standard corporate reporting metrics. Lower default audit suspicion speed.
                          </p>
                          <div className="flex justify-between text-[7.5px] font-bold text-white/35">
                            <span>Total: 1.00% / Cycle</span>
                            <span>Suspect rate: +0%</span>
                          </div>
                        </div>

                        <div 
                          onClick={() => {
                            setTaxRegime('Offshore');
                            if (typeof addNotification === 'function') {
                              addNotification(`🔒 REGIME CHANGED: Switched to Shadow Offshore Ledger. Rates: 0.05% Property / 0.15% Income. Caution: passive daily Audit Risk now increases by +10%.`);
                            }
                          }}
                          className={`p-3 border transition-all cursor-pointer rounded-xs select-none relative ${
                            taxRegime === 'Offshore' 
                              ? 'bg-[#8b5cf6]/5 border-[#8b5cf6]/35 shadow-[0_0_15px_rgba(139,92,246,0.04)]' 
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <strong className="text-[9.5px] text-white uppercase tracking-wider">OFFSHORE SHADOW</strong>
                            {taxRegime === 'Offshore' && (
                              <span className="text-[7px] font-black text-[#8b5cf6] bg-[#8b5cf6]/10 px-1 py-0.5 rounded-xs">SHIELDED</span>
                            )}
                          </div>
                          <p className="text-[8.5px] text-white/60 leading-relaxed mb-2">
                            Channels ledger through untraceable proxy networks. Reduces tax burden by 80%.
                          </p>
                          <div className="flex justify-between text-[7.5px] font-bold text-white/35">
                            <span>Total: 0.20% / Cycle</span>
                            <span>Suspect rate: +10%/Cycle</span>
                          </div>
                        </div>
                      </div>

                      {/* Audit suspicion risk assessment gauge */}
                      <div className="p-3 bg-black/50 border border-white/5 rounded-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] font-black tracking-widest text-white/40 uppercase">AUDIT SUSCEPTIBILITY OVERVIEW</span>
                          <strong className={`font-black uppercase text-[10px] tracking-wider ${
                            auditRisk >= 80 ? 'text-red-500 animate-pulse' : auditRisk >= 55 ? 'text-amber-500' : 'text-[#00fdc1]'
                          }`}>
                            {auditRisk >= 80 ? '⚠️ SEVERE ALERT STATE' : auditRisk >= 55 ? '⚠️ MODERATE SUSPICION' : '✓ SECURE PROFILE'} ({auditRisk.toFixed(0)}%)
                          </strong>
                        </div>
                        
                        {/* Gauge bar */}
                        <div className="h-2 bg-white/[0.02] border border-white/5 rounded-xs overflow-hidden relative">
                          <div 
                            className={`h-full rounded-xs transition-all duration-500 ${
                              auditRisk >= 80 ? 'bg-red-500' : auditRisk >= 55 ? 'bg-amber-500' : 'bg-[#00fdc1]'
                            }`}
                            style={{ width: `${auditRisk}%` }}
                          />
                        </div>
                        
                        <p className="text-[8px] text-white/40 uppercase tracking-tight leading-relaxed select-none">
                          Delinquencies in liability payments increase risk index. Reaching <strong className="text-white font-bold">100%</strong> triggers immediate revenue audits with asset enforcement seizure!
                        </p>
                      </div>

                      {/* Outstanding Liabilities Breakdown Rows */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Ledger Accounts panel */}
                        <div className="bg-[#0c0c0f]/80 p-3.5 border border-white/5 rounded-xs space-y-2 text-left">
                          <span className="text-[7.5px] text-white/30 font-black tracking-widest uppercase block border-b border-white/5 pb-1.5 mb-2">LIABILITY ACCOUNTS LEDGER</span>
                          
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/60 font-medium font-mono">Current Cycle Tax:</span>
                            <strong className="text-white font-black font-mono">${taxBill.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>

                          <div className="flex justify-between items-center py-1">
                            <span className="text-rose-400 font-medium font-mono">Delinquent Back Taxes:</span>
                            <strong className="text-rose-400 font-black font-mono">${delinquentTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>

                          <div className="border-t border-white/5 pt-1.5 mt-2 flex justify-between items-center text-[10.5px]">
                            <span className="text-white/85 font-black uppercase font-mono">Aggregate Due Balance:</span>
                            <strong className="text-[#00fdc1] font-black font-mono">${(taxBill + delinquentTaxes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                          </div>
                        </div>

                        {/* Discharge Terminals (Payment interactive) */}
                        <div className="bg-[#0c0c0f]/80 p-3.5 border border-white/5 rounded-xs space-y-2.5 text-left flex flex-col justify-between">
                          <div>
                            <span className="text-[7.5px] text-white/30 font-black tracking-widest uppercase block border-b border-white/5 pb-1.5 mb-2">COMPLIANCE SETTLEMENT DEBIT</span>
                            <div className="flex justify-between items-center font-black text-[9px] mb-2 text-white/50">
                              <span>AVAILABLE BANK SAVINGS:</span>
                              <span className="text-[#00fdc1] font-black">${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {/* Button to Settle Current Tax */}
                            <button
                              type="button"
                              disabled={taxBill <= 0 || userBalance < taxBill}
                              onClick={() => {
                                if (!setPlayerData) return;
                                
                                // Deduct from bank savings
                                setPlayerData((prev: any) => ({
                                  ...prev,
                                  bank: {
                                    ...prev.bank,
                                    savings: Number((prev.bank.savings - taxBill).toFixed(2))
                                  }
                                }));

                                setTotalTaxesPaid(prev => prev + taxBill);
                                if (typeof addNotification === 'function') {
                                  addNotification(`✓ COMPLIANCE ACKNOWLEDGED: Authorized payment of $${taxBill.toFixed(2)} standard taxes. Discharged current cycle obligations.`);
                                }
                                setTaxBill(0);
                                setAuditRisk(prev => Math.max(0, prev - (taxRegime === 'Standard' ? 4 : 1)));
                              }}
                              className="w-full py-1.5 rounded-xs font-black text-[9px] uppercase transition-all tracking-wider flex items-center justify-between px-2 text-left shadow-sm border border-[#00fdc1]/20 bg-[#00fdc1]/10 hover:bg-[#00fdc1]/20 text-[#00fdc1] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <span>Settle Cycle Tax</span>
                              <span>-${taxBill.toFixed(2)}</span>
                            </button>

                            {/* Button to Settle Delinquent Taxes */}
                            <button
                              type="button"
                              disabled={delinquentTaxes <= 0 || userBalance < delinquentTaxes}
                              onClick={() => {
                                if (!setPlayerData) return;

                                // Deduct from bank savings
                                setPlayerData((prev: any) => ({
                                  ...prev,
                                  bank: {
                                    ...prev.bank,
                                    savings: Number((prev.bank.savings - delinquentTaxes).toFixed(2))
                                  }
                                }));

                                setTotalTaxesPaid(prev => prev + delinquentTaxes);
                                if (typeof addNotification === 'function') {
                                  addNotification(`✓ BACK COMPLIANCE ACKNOWLEDGED: Authorized payment of $${delinquentTaxes.toFixed(2)} delinquent taxes. Cleaned administrative records.`);
                                }
                                setDelinquentTaxes(0);
                                setAuditRisk(prev => Math.max(0, prev - 15));
                              }}
                              className="w-full py-1.5 rounded-xs font-black text-[9px] uppercase transition-all tracking-wider flex items-center justify-between px-2 text-left shadow-sm border border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <span>Settle Back Taxes</span>
                              <span>-${delinquentTaxes.toFixed(2)}</span>
                            </button>

                            {/* Button to Settle Everything */}
                            <button
                              type="button"
                              disabled={(taxBill + delinquentTaxes) <= 0 || userBalance < (taxBill + delinquentTaxes)}
                              onClick={() => {
                                if (!setPlayerData) return;

                                const grandTotal = taxBill + delinquentTaxes;
                                // Deduct from bank savings
                                setPlayerData((prev: any) => ({
                                  ...prev,
                                  bank: {
                                    ...prev.bank,
                                    savings: Number((prev.bank.savings - grandTotal).toFixed(2))
                                  }
                                }));

                                setTotalTaxesPaid(prev => prev + grandTotal);
                                if (typeof addNotification === 'function') {
                                  addNotification(`👑 FULL COMPLIANCE CODES UNLOCKED: Settle total Outstanding taxes of $${grandTotal.toFixed(2)}. Administrative clearing nominal.`);
                                }
                                setTaxBill(0);
                                setDelinquentTaxes(0);
                                setAuditRisk(prev => Math.max(0, prev - 25));
                              }}
                              className="w-full py-2 rounded-xs font-black text-[9.5px] uppercase transition-all tracking-wider flex items-center justify-between px-2.5 text-left shadow-md border border-indigo-500/35 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            >
                              <span>Full Settlement</span>
                              <span>-${(taxBill + delinquentTaxes).toFixed(2)}</span>
                            </button>
                          </div>

                          {userBalance < (taxBill + delinquentTaxes) && (
                            <p className="text-[7.5px] text-amber-400 font-extrabold uppercase animate-pulse leading-normal select-none">
                              ⚠️ LIQUID ASSET DEFICIT: Please manual-sell crypto items in the panel below to satisfy public obligations immediately.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* STRATEGY LAB & CALCULATOR SIMULATOR */
                    <div className="space-y-3.5">
                      <div className="p-2 border border-dashed border-white/10 bg-white/[0.01] rounded-xs">
                        <span className="text-[8px] font-black text-indigo-300 tracking-wider uppercase block">⚙️ STRATEGY LEDGER LAB EXPERIMENT_LOG</span>
                        <p className="text-[7.5px] text-white/50 leading-normal mt-0.5">
                          Tweak company valuation parameters to preview deductions. Configure active corporate shields below to deploy savings offsets dynamically.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SIMULATOR INPUTS */}
                        <div className="space-y-3 p-3 bg-black/40 border border-white/5 rounded-xs">
                          {/* Sync buttons */}
                          <button
                            type="button"
                            onClick={() => {
                              setSimulatedCryptoWorth(totalCryptoWorth.toFixed(2));
                              setSimulatedBalance(userBalance.toFixed(2));
                              setSimulatedRegime(taxRegime);
                              setSimulatedEnergyDeduction(activeEnergyDeduction.toString());
                              setSimulatedRdCredit(activeRdCredit.toString());
                              setSimulatedIrishLoophole(activeIrishLoophole);
                              if (typeof addNotification === 'function') {
                                addNotification(`⚡ SIMULATOR PACKETS LOADED: Synchronized with active company records.`);
                              }
                            }}
                            className="w-full py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 rounded-xs text-[8px] font-black uppercase tracking-widest transition-all cursor-pointer"
                          >
                            [ SYNC REAL COMP_METRICS ]
                          </button>

                          {/* Asset Fields */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[7px] text-white/40 uppercase font-black block">Simulated Crypto ($)</label>
                              <input
                                type="text"
                                value={simulatedCryptoWorth}
                                onChange={(e) => setSimulatedCryptoWorth(e.target.value)}
                                placeholder={totalCryptoWorth.toFixed(0)}
                                className="w-full bg-black/40 border border-white/10 px-2 py-1 text-white text-[9px] rounded-xs font-mono font-bold focus:border-indigo-400 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[7px] text-white/40 uppercase font-black block">Simulated Cash ($)</label>
                              <input
                                type="text"
                                value={simulatedBalance}
                                onChange={(e) => setSimulatedBalance(e.target.value)}
                                placeholder={userBalance.toFixed(0)}
                                className="w-full bg-black/40 border border-white/10 px-2 py-1 text-white text-[9px] rounded-xs font-mono font-bold focus:border-indigo-400 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Regime Selector Switch */}
                          <div className="space-y-1">
                            <label className="text-[7px] text-white/40 uppercase font-black block">Provisional Regime</label>
                            <div className="flex bg-black/50 border border-white/5 p-0.5 rounded-xs w-full">
                              {(['Standard', 'Offshore'] as const).map(reg => (
                                <button
                                  key={reg}
                                  type="button"
                                  onClick={() => setSimulatedRegime(reg)}
                                  className={`flex-1 py-0.5 px-2 text-[7.5px] font-bold uppercase transition-all rounded-xs cursor-pointer text-center ${
                                    simulatedRegime === reg
                                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                      : 'text-white/35 hover:text-white/50'
                                  }`}
                                >
                                  {reg}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Energy Expense Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[7.5px] font-black uppercase">
                              <span className="text-white/40">Energy deductions</span>
                              <span className="text-white/80">${appliedSimEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.max(10, sBase * 0.40)}
                              value={parseFloat(simulatedEnergyDeduction) || 0}
                              onChange={(e) => setSimulatedEnergyDeduction(e.target.value)}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                            />
                            <p className="text-[6.5px] text-white/30 uppercase leading-none">Max Code-Energy Shield (40%): ${maxSimulatedEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          </div>

                          {/* R&D Credit Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[7.5px] font-black uppercase">
                              <span className="text-white/40">Research Credit</span>
                              <span className="text-white/80">${appliedSimRd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.max(10, simSubtotal * 0.25)}
                              value={parseFloat(simulatedRdCredit) || 0}
                              onChange={(e) => setSimulatedRdCredit(e.target.value)}
                              className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                            />
                            <p className="text-[6.5px] text-white/30 uppercase leading-none">Max Research Credit (25%): ${maxSimAllowedRd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                          </div>

                          {/* Loophole checkbox toggle */}
                          <div className="flex items-center gap-2 bg-indigo-950/20 border border-indigo-500/10 p-1.5 rounded-xs">
                            <input
                              type="checkbox"
                              id="simIrishCheckbox"
                              checked={simulatedIrishLoophole}
                              onChange={(e) => setSimulatedIrishLoophole(e.target.checked)}
                              className="rounded border-white/10 text-indigo-500 focus:ring-0 focus:ring-offset-0 bg-black cursor-pointer w-3 h-3"
                            />
                            <div className="text-left leading-tight">
                              <label htmlFor="simIrishCheckbox" className="text-[8px] text-white font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5">
                                Double-Irish Arrangement
                              </label>
                              <p className="text-[6.5px] text-slate-400 leading-normal">Halves ledger dues (-50%), but increases audit risk by +12% per cycle.</p>
                            </div>
                          </div>
                        </div>

                        {/* OUTCOME DOCKET COMPILER */}
                        <div className="border border-dashed border-white/15 bg-black/60 p-3 flex flex-col justify-between rounded-xs space-y-2 select-none">
                          <div className="space-y-2 text-left">
                            <span className="text-[8px] font-black tracking-widest text-[#00fdc1] uppercase block text-center border-b border-white/10 pb-1.5">★ PROVISIONAL INVOICE PACKET ★</span>
                            
                            <div className="space-y-1 text-[8.5px] leading-relaxed">
                              <div className="flex justify-between">
                                <span className="text-white/40">Gross Capital Valuation:</span>
                                <span className="text-white/70">${sBase.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              {appliedSimEnergy > 0 && (
                                <div className="flex justify-between text-indigo-300">
                                  <span>↳ Allowable Energy Shield:</span>
                                  <span>-${appliedSimEnergy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              )}
                              <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white/40">Simulation Taxable Capital:</span>
                                <span className="text-white font-black">${simulatedTaxableBase.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>

                              <div className="flex justify-between pt-1">
                                <span className="text-white/40">Provisional Base Dues ({((sPRate + sIRate) * 100).toFixed(2)}%):</span>
                                <span className="text-white/70">${simSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              {appliedSimRd > 0 && (
                                <div className="flex justify-between text-indigo-300">
                                  <span>↳ Research Direct Offset:</span>
                                  <span>-${appliedSimRd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              )}
                              {simulatedIrishLoophole && (
                                <div className="flex justify-between text-purple-400 font-bold">
                                  <span>↳ Double-Irish Loophole (50%):</span>
                                  <span>-${(simTaxAfterRd * 0.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                              )}
                              
                              <div className="border-t border-white/10 pt-1.5 flex justify-between items-center text-[10px]">
                                <span className="text-white/80 font-black uppercase">Projected Cycle Tax:</span>
                                <strong className="text-[#00fdc1] font-black">${simTotalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                              </div>

                              {simulatedSavings > 0 && (
                                <div className="flex justify-between text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                                  <span>Estimated Loophole Savings:</span>
                                  <span>-{savingsPercent.toFixed(0)}% (-${simulatedSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                                </div>
                              )}

                              <div className="flex justify-between items-center border-t border-white/5 pt-1 mt-1 text-[8px]">
                                <span className="text-white/40 uppercase">Audit Suspicion Multiplier:</span>
                                <strong className={`font-black ${
                                  simCycleSuspRate >= 25 ? 'text-red-400' : simCycleSuspRate >= 15 ? 'text-amber-400' : 'text-indigo-400'
                                }`}>
                                  +{simCycleSuspRate}% / Day
                                </strong>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveEnergyDeduction(appliedSimEnergy);
                              setActiveRdCredit(appliedSimRd);
                              setActiveIrishLoophole(simulatedIrishLoophole);
                              setTaxRegime(simulatedRegime);
                              
                              if (typeof addNotification === 'function') {
                                addNotification(`🛡️ STRATEGY CODES DEPLOYED: Deployed Energy Shield of $${appliedSimEnergy.toFixed(0)} and Research Credits of $${appliedSimRd.toFixed(0)} into active memory. DOUBLE-IRISH loophole: ${simulatedIrishLoophole ? 'ACTIVE' : 'DEACTIVATED'}. Expected Day-End Tax is $${simTotalTax.toFixed(2)}.`);
                              }
                            }}
                            className="w-full py-1.5 bg-[#00fdc1] hover:bg-emerald-400 transition-colors text-black text-[9px] font-black uppercase tracking-widest rounded-xs shadow-[0_0_12px_rgba(0,253,193,0.2)] cursor-pointer flex items-center justify-center gap-1"
                          >
                            <span>Deploy Strategy Shields</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Extra metrics history banner */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-white/[0.01] border border-white/5 rounded-xs text-[8.5px] text-white/40">
                    <span className="uppercase tracking-wider">Audit Security Surcharge Protocol: Active </span>
                    <span className="uppercase tracking-wider">Total Compliance Fees Paid To-Date: <strong className="text-[#00fdc1] font-bold">${totalTaxesPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>

        {/* Column 3: Quick Exchange Terminal & Recent Transaction Log */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">

          {/* Dedicated Sentiment Analysis Gauge Card */}
          <div className="bg-[#060608] border border-white/5 p-6 font-mono text-left relative overflow-hidden">
            {/* Corner tech indicators */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff007f]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff007f]/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff007f]/40" />

            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="font-mono text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">
                  AI_SENTIMENT_ENGINE // FEED
                </h5>
                <p className="text-[10px] text-white font-black uppercase tracking-wider mt-0.5">
                  {selectedAsset.symbol} 24H PREDICTOR
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); triggerSentimentFetch(selectedAssetKey); }}
                disabled={loadingSentiment[selectedAssetKey]}
                className="text-[#ff007f] hover:text-[#ff3399] disabled:opacity-40 flex items-center gap-1 active:scale-95 transition-all text-[8px] font-black border border-[#ff007f]/20 bg-[#ff007f]/5 px-2 py-1 rounded-xs cursor-pointer"
                title="Synchronize and refine neural predictions"
              >
                <RefreshCw size={10} className={`${loadingSentiment[selectedAssetKey] ? 'animate-spin' : ''}`} />
                UPLINK
              </button>
            </div>

            {loadingSentiment[selectedAssetKey] || !sentimentData[selectedAssetKey] ? (
              <div className="h-[210px] flex flex-col items-center justify-center space-y-3 text-center border border-white/5 bg-white/[0.01] p-4 rounded-sm">
                <RefreshCw className="w-5 h-5 text-[#ff007f] animate-spin" />
                <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] animate-pulse">
                  ESTABLISHING NEURAL LINK...
                </p>
                <p className="text-[8px] text-white/25 uppercase tracking-[0.1em]">
                  Simulating sub-grid models
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Gauge Container */}
                <div className="flex items-center justify-around gap-2 bg-white/[0.01] border border-white/5 p-3 rounded-sm">
                  {/* Circular visual Dial SVG */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Grey dial background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="7"
                        fill="transparent"
                      />
                      {/* Moving filled accent ring */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke={sentimentData[selectedAssetKey].sentiment >= 50 ? "#00fdc1" : "#f87171"}
                        strokeWidth="7"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={(2 * Math.PI * 38) * (1 - sentimentData[selectedAssetKey].sentiment / 100)}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Concentric internal indicator */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xl font-black tracking-tight leading-none ${
                        sentimentData[selectedAssetKey].sentiment >= 50 ? 'text-[#00fdc1]' : 'text-red-400'
                      }`}>
                        {sentimentData[selectedAssetKey].sentiment}
                      </span>
                      <span className="text-[7px] text-white/30 tracking-widest uppercase mt-0.5">INDEX</span>
                    </div>
                  </div>

                  {/* Summary of 24h Prediction */}
                  <div className="space-y-2 font-mono flex-1 text-left pl-2">
                    <div>
                      <span className="text-[8px] text-white/30 block uppercase tracking-wider">24H DIRECTION VECTOR</span>
                      <div className={`text-[10px] font-black inline-flex items-center gap-1 px-2.5 py-1 rounded-sm mt-0.5 uppercase tracking-widest ${
                        sentimentData[selectedAssetKey].prediction === 'UP'
                          ? 'bg-[#00fdc1]/10 text-[#00fdc1] border border-[#00fdc1]/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {sentimentData[selectedAssetKey].prediction === 'UP' ? <TrendingUp size={10} className="animate-pulse" /> : <TrendingDown size={10} />}
                        {sentimentData[selectedAssetKey].prediction}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-white/30 block uppercase tracking-wider">STRENGTH</span>
                      <span className="text-xs font-black text-white/90">
                        {sentimentData[selectedAssetKey].probability}% CERTAINTY
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cyber Technical Summary */}
                <div className="p-3 bg-black/40 border border-white/5 text-[10px] text-white/70 leading-normal font-sans font-normal italic text-left">
                  "{sentimentData[selectedAssetKey].technicalAnalysis}"
                </div>

                {/* Dimension Levels */}
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between items-center text-[8px] mb-0.5">
                      <span className="text-white/40 uppercase">NODE HASHRATE HEALTH</span>
                      <span className="text-indigo-400 font-bold">{sentimentData[selectedAssetKey].hashrateMetric}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${sentimentData[selectedAssetKey].hashrateMetric}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[8px] mb-0.5">
                      <span className="text-white/40 uppercase font-bold">SOCIAL FORUM DENSITY</span>
                      <span className="text-[#ff007f] font-bold">{sentimentData[selectedAssetKey].socialMetric}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff007f] rounded-full" style={{ width: `${sentimentData[selectedAssetKey].socialMetric}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[8px] mb-0.5">
                      <span className="text-white/40 uppercase font-bold">WHALE ACCUMULATION</span>
                      <span className="text-[#00e5ff] font-bold">{sentimentData[selectedAssetKey].whaleMetric}%</span>
                    </div>
                    <div className="h-1 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00e5ff] rounded-full" style={{ width: `${sentimentData[selectedAssetKey].whaleMetric}%` }} />
                    </div>
                  </div>
                </div>

                {/* Bottom actionable advice marquee / label */}
                <div className="text-[8px] flex items-start gap-1 uppercase text-white/30 font-bold tracking-widest pt-2 border-t border-white/5">
                  <span className="shrink-0 text-amber-400">TACTICAL PROC:</span>
                  <span className="text-white/60 normal-case font-sans font-medium text-[9.5px] leading-tight text-left">
                    {sentimentData[selectedAssetKey].tacticalRecommendation}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Standalone Correlation Matrix Heatmap Card */}
          <div className="bg-[#060608] border border-white/5 p-6 font-mono text-left relative overflow-hidden">
            {/* Tech line decorations */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-400/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00e5ff]/40" />

            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="font-mono text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">
                  AI_CORRELATION_MATRIX // OVERLAY
                </h5>
                <p className="text-[10px] text-white font-black uppercase tracking-wider mt-0.5">
                  OTTO & BTC DUAL REGIME (20T)
                </p>
              </div>
              <div className="flex bg-black p-0.5 rounded-sm border border-white/5 gap-0.5">
                <button
                  type="button"
                  onClick={() => setCorrelationMode('prices')}
                  className={`px-1.5 py-0.5 rounded-xs text-[8px] font-black uppercase transition-all ${
                    correlationMode === 'prices' ? 'bg-[#ff007f]/15 text-[#ff007f] border border-[#ff007f]/25' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  PRICES
                </button>
                <button
                  type="button"
                  onClick={() => setCorrelationMode('returns')}
                  className={`px-1.5 py-0.5 rounded-xs text-[8px] font-black uppercase transition-all ${
                    correlationMode === 'returns' ? 'bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/25' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  RETURNS
                </button>
              </div>
            </div>

            {(() => {
              const liveCorr = getCorrelationValue(20, correlationMode);
              const heatmapPathData = getNormalizedPathData(20);
              const isBelowThreshold = liveCorr < 0.2;

              // Map Pearson correlation live coefficient to detailed heatmap styles
              const getCorrStyles = (val: number) => {
                if (val >= 0.75) {
                  return {
                    bgClass: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 shadow-[inset_0_0_8px_rgba(16,185,129,0.15)]',
                    textClass: 'text-emerald-400 font-extrabold',
                    label: 'STRONG POSITIVE',
                    intensityLabel: 'MAX (R >= 0.75)',
                    accentBorder: 'border-l-4 border-l-emerald-500'
                  };
                } else if (val >= 0.4) {
                  return {
                    bgClass: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/30 shadow-[inset_0_0_6px_rgba(6,182,212,0.1)]',
                    textClass: 'text-cyan-400 font-bold',
                    label: 'MODERATE POSITIVE',
                    intensityLabel: 'MED (0.40 - 0.74)',
                    accentBorder: 'border-l-4 border-l-cyan-500'
                  };
                } else if (val >= 0.2) {
                  return {
                    bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/25',
                    textClass: 'text-indigo-400 font-semibold',
                    label: 'WEAK POSITIVE',
                    intensityLabel: 'LOW (0.20 - 0.39)',
                    accentBorder: 'border-l-2 border-l-indigo-400'
                  };
                } else if (val >= -0.1) {
                  return {
                    bgClass: 'bg-slate-500/[0.04] hover:bg-slate-500/[0.08] border-white/5',
                    textClass: 'text-slate-400 font-normal',
                    label: 'DECOUPLED DRIVER',
                    intensityLabel: 'NEUTRAL (-0.10 - 0.19)',
                    accentBorder: 'border-l border-l-slate-600'
                  };
                } else {
                  return {
                    bgClass: 'bg-rose-500/20 hover:bg-rose-500/30 border-rose-500/35 shadow-[inset_0_0_8px_rgba(244,63,94,0.1)]',
                    textClass: 'text-rose-400 font-extrabold',
                    label: 'INVERSE BIAS',
                    intensityLabel: 'REVERSED (R < -0.10)',
                    accentBorder: 'border-l-4 border-l-rose-500'
                  };
                }
              };

              const dynamicStyles = getCorrStyles(liveCorr);

              return (
                <div className="space-y-4">
                  {/* Axis Labeling Header */}
                  <div className="text-center text-[7.5px] font-black tracking-[0.25em] text-[#00e5ff]/40 uppercase mt-1">
                    COLUMNS: MARKET VARIABLES (X)
                  </div>

                  <div className="relative">
                    {/* Y-Axis Labeling on left */}
                    <div className="absolute -left-3 top-1/2 -rotate-90 origin-left -translate-y-1/2 text-[7.5px] font-black tracking-[0.25em] text-[#ff007f]/40 uppercase whitespace-nowrap hidden sm:block">
                      ROWS: REFERENCE (Y)
                    </div>

                    {/* Heatmap Grid Layout */}
                    <div className="grid grid-cols-5 gap-2 items-center bg-white/[0.01] border border-white/5 p-2 rounded-sm select-none sm:ml-4">
                      {/* Header axis indicators */}
                      <div className="col-span-1 text-[7px] font-extrabold text-white/20 tracking-wider text-right pr-2">
                        Y \ X
                      </div>
                      <div className="col-span-2 text-center text-[8px] text-[#ff007f] tracking-widest uppercase font-black py-1 bg-[#ff007f]/5 border-b border-white/5">
                        OTTO_COIN (X)
                      </div>
                      <div className="col-span-2 text-center text-[8px] text-[#00e5ff] tracking-widest uppercase font-black py-1 bg-[#00e5ff]/5 border-b border-white/5">
                        CYBER_BTC (X)
                      </div>

                      {/* Row 1: OTTO Coin */}
                      <div className="col-span-1 text-[7.5px] font-black text-[#ff007f] uppercase font-mono tracking-tight text-right pr-2 border-r border-white/5 py-2">
                        OTTO (Y)
                      </div>
                      {/* Cell: OTTO vs OTTO */}
                      <div className="col-span-2 bg-[#ff007f]/5 border border-[#ff007f]/20 p-2.5 rounded-sm text-center flex flex-col justify-center items-center hover:bg-[#ff007f]/10 transition-all duration-300">
                        <span className="text-[11px] font-black text-[#ff007f]">1.00</span>
                        <span className="text-[6px] text-white/20 uppercase tracking-tighter mt-0.5">IDENTITY</span>
                      </div>
                      {/* Cell: OTTO vs BTC */}
                      <div className={`col-span-2 border p-2.5 rounded-sm text-center flex flex-col justify-center items-center transition-all duration-300 ${dynamicStyles.bgClass}`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={correlationMode}
                            initial={{ opacity: 0, scale: 0.96, filter: 'blur(1px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.96, filter: 'blur(1px)' }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="flex flex-col justify-center items-center w-full"
                          >
                            <span className={`text-[11px] font-black tracking-tight ${dynamicStyles.textClass}`}>{liveCorr.toFixed(3)}</span>
                            <span className="text-[6px] text-white/35 uppercase tracking-tighter mt-0.5 font-bold">{dynamicStyles.label}</span>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Row 2: BTC */}
                      <div className="col-span-1 text-[7.5px] font-black text-[#00e5ff] uppercase font-mono tracking-tight text-right pr-2 border-r border-white/5 py-2">
                        BTC (Y)
                      </div>
                      {/* Cell: BTC vs OTTO */}
                      <div className={`col-span-2 border p-2.5 rounded-sm text-center flex flex-col justify-center items-center transition-all duration-300 ${dynamicStyles.bgClass}`}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={correlationMode}
                            initial={{ opacity: 0, scale: 0.96, filter: 'blur(1px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.96, filter: 'blur(1px)' }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="flex flex-col justify-center items-center w-full"
                          >
                            <span className={`text-[11px] font-black tracking-tight ${dynamicStyles.textClass}`}>{liveCorr.toFixed(3)}</span>
                            <span className="text-[6px] text-white/35 uppercase tracking-tighter mt-0.5 font-bold">{dynamicStyles.label}</span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      {/* Cell: BTC vs BTC */}
                      <div className="col-span-2 bg-[#00e5ff]/5 border border-[#00e5ff]/20 p-2.5 rounded-sm text-center flex flex-col justify-center items-center hover:bg-[#00e5ff]/10 transition-all duration-300">
                        <span className="text-[11px] font-black text-[#00e5ff]">1.00</span>
                        <span className="text-[6px] text-white/20 uppercase tracking-tighter mt-0.5">IDENTITY</span>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Legend Bar detailing distinct intensities */}
                  <div className="bg-black/60 border border-white/5 p-2 rounded-sm space-y-1.5 font-mono select-none sm:ml-4">
                    <div className="text-[7.5px] font-black text-white/40 uppercase tracking-widest text-center">
                      PEARSON COEFFICIENT R // COLOR INTENSITY SCALE
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-center">
                      <div className="bg-rose-500/20 border border-rose-500/35 p-1 rounded-xs flex flex-col justify-center hover:bg-rose-500/25 transition-colors">
                        <span className="text-rose-400 text-[8px] font-black">&lt; -0.10</span>
                        <span className="text-[5.5px] text-white/30 uppercase tracking-tighter font-bold">REVERSED</span>
                      </div>
                      <div className="bg-slate-500/[0.04] border border-white/5 p-1 rounded-xs flex flex-col justify-center hover:bg-slate-500/[0.08] transition-colors">
                        <span className="text-slate-400 text-[8px] font-extrabold">-0.1 to 0.2</span>
                        <span className="text-[5.5px] text-white/30 uppercase tracking-tighter font-bold">NEUTRAL</span>
                      </div>
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-1 rounded-xs flex flex-col justify-center hover:bg-indigo-500/15 transition-colors">
                        <span className="text-indigo-400 text-[8px] font-extrabold">0.2 to 0.4</span>
                        <span className="text-[5.5px] text-white/30 uppercase tracking-tighter font-bold">WEAK</span>
                      </div>
                      <div className="bg-cyan-500/15 border border-cyan-500/25 p-1 rounded-xs flex flex-col justify-center hover:bg-cyan-500/20 transition-colors">
                        <span className="text-cyan-400 text-[8px] font-extrabold">0.4 to 0.75</span>
                        <span className="text-[5.5px] text-white/30 uppercase tracking-tighter font-bold">MUT_MOD</span>
                      </div>
                      <div className="bg-emerald-500/20 border border-emerald-500/35 p-1 rounded-xs flex flex-col justify-center hover:bg-emerald-500/25 transition-colors">
                        <span className="text-emerald-400 text-[8px] font-black">&gt;= 0.75</span>
                        <span className="text-[5.5px] text-white/30 uppercase tracking-tighter font-bold">STRONG</span>
                      </div>
                    </div>
                  </div>

                  {/* Core insight narration */}
                  <div className="p-3 bg-black/40 border border-white/5 flex gap-2 items-start text-[9.5px] leading-relaxed text-white/70 font-sans">
                    <span className="text-[#00e5ff] font-bold uppercase tracking-wider shrink-0 mt-0.5 font-mono text-[8.5px]">INSIGHT:</span>
                    <p className="text-left font-normal">
                      Over the last <strong className="text-white font-bold">20 ticks</strong>, assets show {Math.abs(liveCorr) > 0.75 ? "powerful lockstep trend integration" : Math.abs(liveCorr) > 0.4 ? "moderate index tie" : "high system divergence"} (live R = <span className={`font-mono font-bold ${dynamicStyles.textClass}`}>{liveCorr.toFixed(3)}</span>).
                      {isBelowThreshold ? (
                        <span className="text-rose-400 font-extrabold block mt-1 uppercase tracking-wider text-[8px] border border-rose-500/20 bg-rose-500/5 px-1.5 py-0.5 rounded-xs w-fit">
                          ⚠️ STRUCTURAL DECOUPLING ACTIVE {"(< 0.20)"}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold block mt-1 uppercase tracking-wider text-[8px] select-none">
                          ✓ SYSTEM INDEX SYNCHRONIZED {"(>= 0.20)"}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Dual overlay sparkline */}
                  <div className="h-16 w-full border border-white/5 bg-black/40 rounded-sm relative overflow-hidden p-1">
                    <div className="absolute top-1 left-2 text-[7px] text-white/40 uppercase tracking-widest pointer-events-none font-black flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-[#ff007f] rounded-full animate-pulse" /> OTTO
                      <span className="inline-block w-1.5 h-1.5 bg-[#00e5ff] rounded-full" /> BTC OVERLAY (20 TICK PROFILE)
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={heatmapPathData} margin={{ top: 12, right: 2, left: -25, bottom: 0 }}>
                        <XAxis dataKey="tick" hide={true} />
                        <YAxis domain={['auto', 'auto']} fontSize={6} stroke="rgba(255,255,255,0.05)" />
                        <Area type="monotone" dataKey="OTTO_Norm" stroke="#ff007f" strokeWidth={1} fill="transparent" />
                        <Area type="monotone" dataKey="BTC_Norm" stroke="#00e5ff" strokeWidth={1} fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Portfolio Asset Allocation PieChart Card */}
          <div className="bg-[#060608] border border-white/5 p-6 font-mono text-left relative overflow-hidden">
            {/* Corner styling accents */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#8b5cf6]/5 rounded-bl-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-400/40" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8b5cf6]/40" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h5 className="font-mono text-[9px] font-black text-white/30 tracking-[0.3em] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-pulse" />
                  PORTFOLIO_ALLOCATION_MATRIX // SYSTEM_WEIGHTS
                </h5>
                <h4 className="text-[10px] text-white font-black uppercase tracking-wider mt-0.5">
                  Live Asset Weights Gauge
                </h4>
              </div>

              {/* Toggle for Cash Include */}
              <div className="flex bg-black p-0.5 rounded-sm border border-white/5 gap-0.5">
                <button
                  type="button"
                  onClick={() => setIncludeCashInAllocation(false)}
                  className={`px-1.5 py-0.5 rounded-xs text-[8px] font-black uppercase transition-all ${
                    !includeCashInAllocation ? 'bg-[#ff007f]/15 text-[#ff007f] border border-[#ff007f]/25' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  Crypto Only
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeCashInAllocation(true)}
                  className={`px-1.5 py-0.5 rounded-xs text-[8px] font-black uppercase transition-all ${
                    includeCashInAllocation ? 'bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/25' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  With Cash
                </button>
              </div>
            </div>

            {/* Threshold custom limit slider */}
            <div className="bg-black/40 border border-white/5 p-3 rounded-sm space-y-2 mb-4">
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-white/40 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  OVERWEIGHT RISK THRESHOLD: <strong className="text-white">{maxWeightThreshold}%</strong>
                </span>
                <span className="text-white/20 select-none">PEER PROTOCOL GL-40</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={maxWeightThreshold}
                onChange={(e) => setMaxWeightThreshold(Number(e.target.value))}
                className="w-full accent-[#8b5cf6] bg-white/5 h-1 rounded-sm cursor-pointer border border-white/5"
              />
              <div className="flex justify-between text-[7px] text-white/30 font-bold uppercase tracking-tight">
                <span>10% Low Alert</span>
                <span>Balanced Default (40%)</span>
                <span>90% Max Squeeze</span>
              </div>
            </div>

            {(() => {
              const { chartData, total, isEmpty } = getPieData();
              const overweightAssets = chartData.filter(item => item.percentage > maxWeightThreshold && item.symbol !== 'USD');
              const isOverweightActive = overweightAssets.length > 0;

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Visual PieChart container */}
                    <div className="col-span-1 md:col-span-5 flex flex-col justify-center items-center relative bg-white/[0.01] border border-white/5 p-3 rounded-sm min-h-[140px] select-none">
                      <div className="w-[125px] h-[125px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={36}
                              outerRadius={52}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const payloadData = payload[0].payload;
                                  return (
                                    <div className="bg-black/50 backdrop-blur-[12px] border border-white/10 p-3 font-mono text-[9px] select-none text-left shadow-2xl rounded-xs">
                                      <div className="font-black uppercase text-[10px]" style={{ color: payloadData.color }}>
                                        {payloadData.name} ({payloadData.symbol})
                                      </div>
                                      <div className="text-white font-extrabold mt-1">
                                        VALUE: ${payloadData.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </div>
                                      <div className="text-[#00fdc1] font-bold">
                                        WEIGHT: {payloadData.percentage.toFixed(1)}%
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Center overlay of total portfolio capital */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                          <span className="text-[11px] font-black text-white leading-none">
                            ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-[6.5px] text-white/35 uppercase tracking-widest mt-0.5 font-bold">
                            Total Net
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Weight Details Breakdown columns */}
                    <div className="col-span-1 md:col-span-7 space-y-2">
                      <div className="text-[8px] font-black tracking-widest text-white/30 uppercase pb-1 border-b border-white/5">
                        VARIABLE WEIGHT RATIOS
                      </div>
                      
                      {chartData.map((item) => {
                        const isOver = item.percentage > maxWeightThreshold && item.symbol !== 'USD';
                        const progressPct = Math.min(100, item.percentage);
                        
                        return (
                          <div 
                            key={item.name} 
                            className={`p-2 border transition-all duration-300 rounded-sm ${
                              isOver 
                                ? 'bg-rose-500/[0.04] border-rose-500/25 shadow-[inset_0_0_6px_rgba(244,63,94,0.05)]' 
                                : 'bg-[#0a0a0c] border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-center text-[9px]">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-white font-black">{item.symbol}</span>
                                <span className="text-white/35 font-bold uppercase text-[7px]">Holdings Weight</span>
                              </div>
                              <div className="text-right flex items-center gap-1.5">
                                <span className="text-white/60">${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                <span className={`font-black ${isOver ? 'text-rose-400' : 'text-[#00fdc1]'}`}>
                                  {item.percentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Bar representing weight visually */}
                            <div className="h-1 bg-white/[0.02] border border-white/5 mt-1.5 rounded-full overflow-hidden relative">
                              <div 
                                className="h-full rounded-full transition-all duration-500" 
                                style={{ 
                                  backgroundColor: item.color, 
                                  width: `${progressPct}%` 
                                }} 
                              />
                              {/* Overlay indicator for risk limit */}
                              <div 
                                className="absolute top-0 bottom-0 border-l border-rose-500/55 pointer-events-none" 
                                style={{ left: `${maxWeightThreshold}%` }}
                                title="Overweight threshold boundary line"
                              />
                            </div>

                            {/* Alert state banner display inline */}
                            {isOver && (
                              <div className="mt-1 flex items-center gap-1 text-[7.5px] font-black text-rose-400 uppercase tracking-wide animate-pulse">
                                <span>⚠️ OVERWEIGHT RISK LIMIT EXCEEDED</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Core insight advice message depending on exposure states */}
                  <div className="p-2.5 bg-black/40 border border-white/5 flex gap-2 items-start text-[9px] leading-relaxed text-white/70 font-sans">
                    <span className="text-[#8b5cf6] font-bold uppercase tracking-wider shrink-0 mt-0.5 font-mono text-[8px]">STRATEGY:</span>
                    <p className="text-left font-normal select-none">
                      {isOverweightActive ? (
                        <span>
                          Concentration risk active. <strong className="text-white font-bold">{overweightAssets.map(a => a.symbol).join(', ')}</strong> is currently overexposed relative to your max risk management parameters (<strong className="text-rose-400 font-extrabold">{maxWeightThreshold}%</strong> cap threshold). Consider utilizing the exchange form below to rebalance risks.
                        </span>
                      ) : (
                        <span>
                          System balanced. All cryptographic system weight allocations remain safely optimized below the configured alert risk cap limit of <strong className="text-white font-bold">{maxWeightThreshold}%</strong>. Good risk governance.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Interactive Buy/Sell Form Area */}
          <div className="bg-black/40 backdrop-blur-[12px] border border-white/5 p-6 font-mono text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full filter blur-xl pointer-events-none" />
            
            <h5 className="font-mono text-[9px] font-black text-white/30 tracking-[0.3em] uppercase mb-3">
              QUICK_EXCHANGE_TERMINAL
            </h5>

            {/* Order Type Toggle Switcher */}
            <div className="flex bg-white/[0.01] border border-white/5 p-0.5 rounded-xs mb-4">
              <button
                type="button"
                onClick={() => {
                  setOrderType('MARKET');
                  setTradeType('BUY');
                }}
                className={`flex-1 py-1.5 font-mono text-[8.5px] font-black uppercase tracking-wider transition-all rounded-xs cursor-pointer text-center ${
                  orderType === 'MARKET'
                    ? 'bg-white/10 text-white font-black'
                    : 'text-white/35 hover:text-white/70'
                }`}
              >
                Market Order
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderType('STOP_LOSS');
                  setTradeType('SELL'); // Stop-loss triggers sales
                }}
                className={`flex-1 py-1.5 font-mono text-[8.5px] font-black uppercase tracking-wider transition-all rounded-xs cursor-pointer text-center ${
                  orderType === 'STOP_LOSS'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/10'
                    : 'text-white/35 hover:text-white/70'
                }`}
              >
                Stop Loss Order
              </button>
            </div>

            {orderType === 'MARKET' ? (
              <form onSubmit={handleTradeSubmit} className="space-y-4">
                {/* Buy/Sell toggler */}
                <div className="flex border border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                      tradeType === 'BUY' 
                        ? 'bg-[#00fdc1] text-black shadow-[0_0_15px_rgba(0,253,193,0.35)]' 
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    BUY {selectedAsset.symbol}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                      tradeType === 'SELL' 
                        ? 'bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.35)]' 
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    SELL {selectedAsset.symbol}
                  </button>
                </div>

                {/* Amount Inputs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-white/40">
                    <span>VOLUME ({selectedAsset.symbol})</span>
                    <span>
                      {tradeType === 'BUY' 
                        ? `Est. Max: ${(userBalance / currentAssetPrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}` 
                        : `Held: ${heldQuantity} ${selectedAsset.symbol}`}
                    </span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="any"
                      min="0.000001"
                      placeholder={`0.00 ${selectedAsset.symbol}`}
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-white/10 px-4 py-3.5 text-white font-mono text-sm focus:outline-none focus:border-white/20 pr-16"
                    />
                    <button
                      type="button"
                      onClick={setMaxAmount}
                      className="absolute right-3 px-2 py-1 border border-white/15 hover:border-white/30 text-[9px] font-black uppercase text-white/50 hover:text-white"
                    >
                      MAX
                    </button>
                  </div>

                  {/* Quick Buy Percentage Allocation Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('BUY');
                        const qty = (userBalance * 0.10) / currentAssetPrice;
                        setAmountInput(qty > 0 ? qty.toFixed(selectedAssetKey === 'OTTO_Coin' ? 1 : 4) : '0');
                      }}
                      className="py-2.5 border border-[#00fdc1]/10 bg-[#00fdc1]/[0.02] hover:bg-[#00fdc1]/5 hover:border-[#00fdc1]/30 text-[#00fdc1]/70 hover:text-[#00fdc1] text-[9px] font-black uppercase tracking-wider transition-all rounded-xs text-center flex items-center justify-center gap-1 shadow-[inset_0_0_6px_rgba(0,253,193,0.02)]"
                    >
                      <span>BUY 10%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('BUY');
                        const qty = (userBalance * 0.50) / currentAssetPrice;
                        setAmountInput(qty > 0 ? qty.toFixed(selectedAssetKey === 'OTTO_Coin' ? 1 : 4) : '0');
                      }}
                      className="py-2.5 border border-[#00fdc1]/15 bg-[#00fdc1]/[0.04] hover:bg-[#00fdc1]/8 hover:border-[#00fdc1]/40 text-[#00fdc1]/80 hover:text-[#00fdc1] text-[9px] font-black uppercase tracking-wider transition-all rounded-xs text-center flex items-center justify-center gap-1 shadow-[inset_0_0_8px_rgba(0,253,193,0.03)]"
                    >
                      <span>BUY 50%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTradeType('BUY');
                        const qty = (userBalance * 1.0) / currentAssetPrice;
                        setAmountInput(qty > 0 ? qty.toFixed(selectedAssetKey === 'OTTO_Coin' ? 1 : 4) : '0');
                      }}
                      className="py-2.5 border border-[#00fdc1]/25 bg-[#00fdc1]/[0.08] hover:bg-[#00fdc1]/15 hover:border-[#00fdc1]/50 text-[#00fdc1] text-[9px] font-black uppercase tracking-wider transition-all rounded-xs text-center flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(0,253,193,0.08)]"
                    >
                      <span>BUY 100%</span>
                    </button>
                  </div>
                </div>

                {/* Total Summary */}
                {amountInput && Number(amountInput) > 0 && (
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-sm flex justify-between items-center text-[11px] font-mono">
                    <span className="text-white/30 uppercase tracking-wider">
                      {tradeType === 'BUY' ? 'ESTIMATED OUTFLOW CASH' : 'ESTIMATED PROCEEDS'}
                    </span>
                    <span className={`font-black text-sm ${tradeType === 'BUY' ? 'text-amber-400' : 'text-[#00fdc1]'}`}>
                      ${(Number(amountInput) * currentAssetPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="submit"
                  className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                    tradeType === 'BUY'
                      ? 'bg-[#00fdc1]/10 text-[#00fdc1] border-[#00fdc1]/20 hover:bg-[#00fdc1] hover:text-black hover:border-transparent'
                      : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-black hover:border-transparent'
                  }`}
                >
                  <Zap size={13} className="animate-pulse" />
                  EXECUTE_MESH_BROADCAST_{tradeType === 'BUY' ? 'BUY' : 'SELL'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleStopLossSubmit} className="space-y-4">
                <div className="p-3 bg-rose-500/[0.03] border border-rose-500/15 rounded-xs space-y-1.5 text-left leading-normal">
                  <div className="flex items-center gap-1.5 font-bold text-[8.5px] text-rose-400 uppercase tracking-widest">
                    <span>🛡️ DOWNSIDE CONTAINER SHIELD</span>
                  </div>
                  <p className="text-[7.5px] text-white/45 uppercase leading-normal">
                    Automatically triggers a standard liquidation of specified inventory units if current price falls strictly to/below your requested trigger floor level.
                  </p>
                </div>

                {/* Floor Trigger Input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-white/40">
                    <span>FLOOR TRIGGER PRICE (USD)</span>
                    <span className="font-extrabold text-white/60">
                      CURRENT: ${currentAssetPrice.toLocaleString(undefined, { minimumFractionDigits: selectedAssetKey === 'OTTO_Coin' ? 4 : 2 })}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0.0001"
                      placeholder={`0.00 USD`}
                      value={stopLossFloorPrice}
                      onChange={(e) => setStopLossFloorPrice(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>

                {/* Volume Input */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-white/40">
                    <span>LIQUIDATION VOLUME ({selectedAsset.symbol})</span>
                    <span>Held: {heldQuantity} {selectedAsset.symbol}</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="any"
                      min="0.000001"
                      placeholder={`0.00 ${selectedAsset.symbol}`}
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-white/20 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setAmountInput(heldQuantity.toString())}
                      className="absolute right-3 px-2 py-1 border border-white/15 hover:border-white/30 text-[9px] font-black uppercase text-white/50 hover:text-white"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Estimate proceeds at execution */}
                {amountInput && stopLossFloorPrice && Number(amountInput) > 0 && Number(stopLossFloorPrice) > 0 && (
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-sm flex justify-between items-center text-[10.5px] font-mono leading-none">
                    <span className="text-white/30 uppercase tracking-wider">SECURED PROCEEDS FLOOR</span>
                    <strong className="text-[#00fdc1] font-black">
                      ${(Number(amountInput) * Number(stopLossFloorPrice)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                )}

                {/* Establish Order Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500 hover:text-black hover:border-transparent text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={14} /> ESTABLISH COMPLIANCE SHIELD
                </button>
              </form>
            )}

            {/* Active Stop Loss List */}
            {stopLossOrders.length > 0 && (
              <div className="mt-5 pt-4.5 border-t border-white/5 space-y-2">
                <div className="text-[8.5px] text-rose-400 uppercase tracking-widest font-black flex items-center justify-between">
                  <span>● ACTIVE PROTECTION SYSTEMS ({stopLossOrders.length})</span>
                </div>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {stopLossOrders.map((order: any) => (
                    <div key={order.id} className="p-2.5 bg-rose-500/[0.01] border border-rose-500/10 flex justify-between items-center text-[9px]">
                      <div>
                        <div className="font-extrabold text-white">
                          SEWING_BOUNDS: {order.quantity} {order.symbol}
                        </div>
                        <div className="text-[7.5px] text-white/40 leading-none mt-1">
                          Floor Level Trigger: <strong className="text-rose-400 font-black">${order.floorPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStopLossOrders(prev => prev.filter(o => o.id !== order.id));
                          if (typeof addNotification === 'function') {
                            addNotification(`✓ STOP LOSS DEACTIVATED: Dismantled auto-liquidation order for ${order.symbol}.`);
                          }
                        }}
                        className="px-2 py-1 border border-white/10 hover:border-rose-500/35 text-[7px] text-white/40 hover:text-rose-400 font-extrabold uppercase transition-all rounded-xs cursor-pointer bg-white/[0.01]"
                      >
                        Dismantle
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom transaction ledger inside tab */}
            {recentTXs.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3 font-black">
                  YOUR RECENT TRANSACTIONS
                </div>
                <div className="space-y-2 text-[10px] font-mono max-h-[120px] overflow-y-auto">
                  {recentTXs.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-none">
                      <div className="flex items-center gap-2">
                        <span className={`font-black uppercase px-1 py-0.5 rounded-xs text-[8px] ${
                          tx.type === 'BUY' ? 'bg-[#ff007f]/10 text-[#ff007f]' : 'bg-[#00e5ff]/10 text-[#00e5ff]'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="text-white">{tx.amount} {assets[tx.asset]?.symbol}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white/60">${tx.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        <span className="text-[8px] text-white/20 hover:text-white/40 block leading-tight cursor-pointer font-bold mt-0.5 uppercase tracking-tighter shadow-sm">HASH {tx.hash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
