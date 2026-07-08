import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization for Gemini AI
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Briefing Endpoint
  app.post("/api/briefing", async (req, res) => {
    try {
      const { 
        stats = {}, 
        playerData = {}, 
        day = 1, 
        activeCityEvent = null, 
        implants = [], 
        nodesBreached = 0, 
        syndicateHires = [], 
        contraband = {} 
      } = req.body;
      const ai = getGenAI();
      
      const prompt = `You are OTTO, a high-level strategic AI for OTTO_SIM city simulation. 
      Analyze the current status parameters:
      Player Name: ${stats?.name || "Player"}
      Day: ${day}
      Net Worth: $${stats?.netWorth || 0}
      IQ: ${stats?.iq || 100}
      Career: ${stats?.careerPath || "Tech"}
      Savings: $${playerData?.bank?.savings || 0}
      Skills: ${JSON.stringify(playerData?.skills || {})}
      Active City Event: ${activeCityEvent ? `${activeCityEvent.title} (${activeCityEvent.impact}: ${activeCityEvent.description})` : "Stable Grid. No warnings."}
      Implants: ${JSON.stringify(implants)}
      Nodes Breached: ${nodesBreached}
      Syndicate Personnel: ${JSON.stringify(syndicateHires)}
      Contraband Stock: ${JSON.stringify(contraband)}
      
      Generate a comprehensive tactical strategic analysis. You must output exactly the JSON structure schema specified.
      Keep the tone highly analytical, professional, slightly military cybernetic ("OTTO-OS").`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              briefing: { 
                type: Type.STRING, 
                description: "A single concise 1-sentence greeting and warning summary (max 100 chars, no markdown or bolding)."
              },
              statusAnalysis: { 
                type: Type.STRING, 
                description: "A complete professional tactical analysis of current player levels, earnings, or career choices."
              },
              warningLevel: { 
                type: Type.STRING, 
                description: "One of: LOW, MEDIUM, CRITICAL"
              },
              tacticalAdvice: { 
                type: Type.STRING, 
                description: "A bulleted set of 3 hyper-specific tactical guidelines regarding investments, hacking, bio-upgrades and job actions. Bold keywords using asterisks."
              },
              projectedOutlook: { 
                type: Type.STRING, 
                description: "Short 1-sentence projection of upcoming market opportunities or cybernetic developments."
              }
            },
            required: ["briefing", "statusAnalysis", "warningLevel", "tacticalAdvice", "projectedOutlook"]
          }
        }
      });

      const responseText = result.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini API Error (Briefing):", error);
      // Fail-safe response matching the expected schema shape
      res.json({
        briefing: "Connection to neural network unstable. Proceed/invest with caution.",
        statusAnalysis: "Core data uplink disrupted. Unable to perform high-resolution cognitive analysis of your net worth or active cyberware assets.",
        warningLevel: "LOW",
        tacticalAdvice: "* Establish local backups in school labs.\n* Monitor financial portfolios at workstation.\n* Accumulate cash reserves to acquire sub-market contraband.",
        projectedOutlook: "Re-routing network paths. Tactical parameters currently in standard safe-mode."
      });
    }
  });

  // AI Chat and Interactive Task Planner Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, stats = {}, playerData = {}, marketHistory = {} } = req.body;
      const ai = getGenAI();

      // Extract current prices
      const currentPrices: Record<string, number> = {};
      Object.keys(marketHistory).forEach(symbol => {
        const prices = marketHistory[symbol];
        if (prices && prices.length > 0) {
          currentPrices[symbol] = prices[prices.length - 1];
        }
      });

      const prompt = `You are a helper AI tactical agent in OTTO_SIM, a high-fidelity business and investment city simulator.
      The user is speaking to you. Your job is to:
      1. Provide a professional, corporate/cybernetic, helpful response.
      2. If the user expresses a desire to perform any simulation task (e.g., buying stock, selling stock, investing in real estate, checking in at work/performing shifts, completing active tasks), detect their intent and draft a corresponding proposedAction.
      
      Player context parameters:
      - Name: ${stats?.name || "Player"}
      - Savings: $${playerData?.bank?.savings || 0}
      - Neon Credits: ${playerData?.bank?.neonCredits || 0}
      - Career Path: ${stats?.careerPath || "Tech"}
      - IQ: ${stats?.iq || 100}
      - Tasks: ${JSON.stringify(playerData?.tasks || [])}
      - Market Portfolio: ${JSON.stringify(playerData?.portfolio || {})}
      - Market Prices: ${JSON.stringify(currentPrices)}
      
      Supported Proposed Actions & Requirements:
      1. BUY_STOCK:
         - Parameters: { "symbol": string, "quantity": number, "price": number }
         - Constraints: Stock must be in ${JSON.stringify(Object.keys(currentPrices))}. The user must have sufficient Savings (price * quantity).
      2. SELL_STOCK:
         - Parameters: { "symbol": string, "quantity": number, "price": number }
         - Constraints: User must have at least 'quantity' shares in their portfolio for 'symbol'.
      3. INVEST_REAL_ESTATE:
         - Parameters: { "name": string, "cost": number, "yield": number }
         - Cost should be compatible with their savings (e.g. $10,000, $25,000, $50,000). Name could be e.g. "Sector 7 Hab Condo", "Metropolis Block Vault", or "Biolum Penthouse".
      4. WORK_SHIFT:
         - Parameters: { "type": "desk" | "server" | "coffee" }
         - Shifts are at Corporate HQ (desk earns +$200, +1 IQ; server earns +$500, +3 IQ).
      5. COMPLETE_TASK:
         - Parameters: { "taskId": string }
         - Select an uncompleted task from the user's task list (id: 't1' or 't2').
      
      EDUCATIONAL DIRECTIVE:
      Since we want the user to learn from this action, the 'description' field of proposedAction must explain exactly *how* this financial or career mechanic operates in a real economic system (e.g. liquidity trade-offs, compounding returns, opportunity costs, or stock volatility risk). Keep the tone cybernetic and ultra-clear.
      
      If the user is just asking a question or chatting without a clear transaction request, DO NOT populate proposedAction. Keep the advice robustly educational.`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${prompt}\n\nUser Input: ${message}`,
        config: {
          systemInstruction: "You are the tactical terminal operator OTTO-OS. Complete all requirements with absolute precision using valid JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description: "The primary cybernetic corporate text assistant response/advice."
              },
              proposedAction: {
                type: Type.OBJECT,
                description: "Optional action if intent matches standard tasks.",
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "BUY_STOCK, SELL_STOCK, INVEST_REAL_ESTATE, WORK_SHIFT, COMPLETE_TASK"
                  },
                  title: { type: Type.STRING },
                  description: { 
                    type: Type.STRING,
                    description: "Educational explanation of what they will learn by executing this action (opportunity costs, compounding, liquidity, risk, etc.)."
                  },
                  cost: { type: Type.INTEGER },
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      symbol: { type: Type.STRING },
                      quantity: { type: Type.INTEGER },
                      price: { type: Type.NUMBER },
                      name: { type: Type.STRING },
                      cost: { type: Type.INTEGER },
                      yield: { type: Type.INTEGER },
                      type: { type: Type.STRING },
                      taskId: { type: Type.STRING }
                    }
                  }
                },
                required: ["type", "title", "description"]
              }
            },
            required: ["content"]
          }
        }
      });

      const responseText = result.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini API Error (Chat):", error);
      res.status(500).json({ error: "Failed to generate chat response" });
    }
  });

  // AI Research Endpoint
  app.post("/api/research", async (req, res) => {
    try {
      const { stats, playerData } = req.body;
      const ai = getGenAI();
      
      const prompt = `You are a high-level Market Analyst AI in a cyberpunk city simulation. 
      The player requested a deep market trend research. 
      Based on the player's status:
      Net Worth: $${stats.netWorth}
      IQ: ${stats.iq}
      Career: ${stats.careerPath}
      
      Provide exactly 3 concise, actionable strategic insights about market trends (investments, careers, or city expansion).
      Format them as short technical bullet points using '>' as bullets.
      Tone: Cybernetic, professional, analytical.
      Max 200 characters total. No bolding.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ analysis: result.text?.trim() });
    } catch (error: any) {
      console.error("Research API Error:", error);
      res.status(500).json({ error: "Failed to generate research" });
    }
  });

  // AI Crypto Sentiment Analysis Endpoint
  app.post("/api/crypto-sentiment", async (req, res) => {
    const { symbol = "OTTO", currentPrice = 1.42, change24h = 0, playerIQ = 100 } = req.body;
    try {
      const ai = getGenAI();

      const prompt = `You are a high-level quantitative cryptographic market agent within the OTTO-OS system.
      A request has been initiated to perform Sentiment Analysis and generate a 24-hour predictive gauge for:
      Asset symbol: ${symbol}
      Market index: USD
      Current Spot Price: $${currentPrice}
      24H Price Drift Rate: ${change24h.toFixed(2)}%
      Player Cognitive IQ Level: ${playerIQ}

      Perform quantitative assessment of the coin. Analyze:
      1. Network Hashrate Health (PoS peer activity if OTTO, PoW energy metrics if BTC).
      2. Social Developer/Community volume.
      3. Whale Order book flow and liquid reserves.

      Generate a deep speculative trend analysis. You must output exactly the JSON structure schema specified.
      Tone must be corporate cybernetic, professional, concise, with direct operational guidance.`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { 
                type: Type.INTEGER, 
                description: "An integer sentiment score between 0 and 100 representing market bullishness (0 = extreme bear, 50 = neutral, 100 = extreme bull)."
              },
              prediction: { 
                type: Type.STRING, 
                description: "The 24h trend prediction. Must be exactly 'UP' or 'DOWN'."
              },
              probability: { 
                type: Type.INTEGER, 
                description: "Predictive probability percentage between 50 and 99 indicating confidence."
              },
              technicalAnalysis: { 
                type: Type.STRING, 
                description: "A professional and detailed cybernetic quant synthesis (max 180 characters, no bolding)."
              },
              hashrateMetric: { 
                type: Type.INTEGER, 
                description: "Hashrate health index between 0 and 100."
              },
              socialMetric: { 
                type: Type.INTEGER, 
                description: "Social/community sentiment developer index between 0 and 100."
              },
              whaleMetric: { 
                type: Type.INTEGER, 
                description: "Whale inventory accumulation flow index between 0 and 100."
              },
              tacticalRecommendation: { 
                type: Type.STRING, 
                description: "A single direct procedural recommendation for traders (max 120 characters)."
              }
            },
            required: [
              "sentiment", "prediction", "probability", "technicalAnalysis", 
              "hashrateMetric", "socialMetric", "whaleMetric", "tacticalRecommendation"
            ]
          }
        }
      });

      const responseText = result.text?.trim() || "{}";
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini API Error (Crypto Sentiment):", error);
      // Cyber fail-safe values tailored dynamically based on symbol trend fallback
      const isUp = change24h >= 0;
      res.json({
        sentiment: isUp ? 68 : 38,
        prediction: isUp ? "UP" : "DOWN",
        probability: 72,
        technicalAnalysis: symbol === "OTTO" 
          ? "Mesh node traffic shows stable background expansion. Speculative buy wall supports localized arbitrage opportunities."
          : "Institutional order buffers are sustaining support levels. Extreme leverage liquidations indicate micro-structure consolidating.",
        hashrateMetric: symbol === "OTTO" ? 78 : 91,
        socialMetric: symbol === "OTTO" ? 84 : 65,
        whaleMetric: symbol === "OTTO" ? 61 : 55,
        tacticalRecommendation: isUp 
          ? "Maintain intermediate long exposure. Deploy micro spot orders with tight risk boundaries."
          : "Hedge existing spot units. Delay major capital injects until whale order book consolidates."
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
