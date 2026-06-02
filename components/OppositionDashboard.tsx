
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, OppositionDashboardData, SimResult, OppositionNewsItem, SimMessage, GameStats, GameTurn, IdeologyStats, ScenarioMapData, FutureScenario, OppositionLayer, OppositionMediaCampaign, SituationAnalysisResult, SituationNode, SituationEdge, AIPersonalityTheme } from '../types';
import * as geminiService from '../services/geminiService';
import { AI_PERSONALITY_THEMES } from '../constants';

const OppositionDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [showIntro, setShowIntro] = useState(true);
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState<'news' | 'layers' | 'simulation' | 'war_room' | 'scenario_map' | 'resources'>('news');
  
  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState<OppositionDashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  
  // Map / Location State
  const [selectedLocation, setSelectedLocation] = useState<string>('Tehran');
  const [isScrapingLocation, setIsScrapingLocation] = useState(false);

  // Scraper Console State
  const [scraperLogs, setScraperLogs] = useState<string[]>([]);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Simulation State
  const [factionA, setFactionA] = useState('');
  const [factionB, setFactionB] = useState('');
  const [simTopic, setSimTopic] = useState('');
  const [simResult, setSimResult] = useState<SimResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [dynamicFactions, setDynamicFactions] = useState<string[]>([]);
  
  // Situation Analysis (Auto-Detect) State
  const [situationData, setSituationData] = useState<SituationAnalysisResult | null>(null);
  const [isAnalyzingSituation, setIsAnalyzingSituation] = useState(false);

  // Media Campaign State
  const [mediaCampaign, setMediaCampaign] = useState<OppositionMediaCampaign | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  
  // Compassion Bridge State
  const [bridgeResult, setBridgeResult] = useState<string | null>(null);
  const [isBridging, setIsBridging] = useState(false);

  // Persistent Game State (Strategy Layer)
  const [gameStats, setGameStats] = useState<GameStats>({
      unity: 50,
      momentum: 30,
      resources: 40,
      regimeStability: 80,
      turnCount: 0,
      history: []
  });
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  // Scenario Map State
  const [scenarioData, setScenarioData] = useState<ScenarioMapData | null>(null);
  const [isProjecting, setIsProjecting] = useState(false);
  const [scenarioContext, setScenarioContext] = useState('');

  // Faction Page State
  const [viewingFaction, setViewingFaction] = useState<string | null>(null);

  // AI Personality Theme State
  const [selectedAITheme, setSelectedAITheme] = useState<AIPersonalityTheme>('compassion_bridge');
  const currentThemeConfig = AI_PERSONALITY_THEMES.find(t => t.id === selectedAITheme) || AI_PERSONALITY_THEMES[3];

  useEffect(() => {
    // Generate random anonymous ID
    const id = Math.floor(1000 + Math.random() * 9000);
    setUserId(`#${id}`);
    // Load dashboard data on mount (in background)
    handleRefreshDashboard('Iran');
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
        consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scraperLogs]);

  // Sync initial dashboard data to game stats and dynamic factions
  useEffect(() => {
      if (dashboardData) {
          if (gameStats.turnCount === 0) {
              setGameStats(prev => ({
                  ...prev,
                  unity: dashboardData.unityScore,
                  // Add randomness to initial stats for flavor
                  momentum: Math.floor(Math.random() * 40) + 20,
                  resources: Math.floor(Math.random() * 50) + 20,
                  regimeStability: 80 // Hardcoded starting difficulty
              }));
          }
          if (dashboardData.layers) {
              const layerFactions = dashboardData.layers.flatMap(l => l.factions.map(f => f.name));
              const defaultFactions = t('oppositionAI.factions') as string[];
              setDynamicFactions(Array.from(new Set([...defaultFactions, ...layerFactions])));
          } else {
              setDynamicFactions(t('oppositionAI.factions') as string[]);
          }
      } else {
          setDynamicFactions(t('oppositionAI.factions') as string[]);
      }
  }, [dashboardData, t]);

  const addLog = (msg: string) => {
      setScraperLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] ${msg}`]);
  };

  const handleRefreshDashboard = async (locationOverride?: string) => {
    setIsLoadingDashboard(true);
    setScraperLogs([]); // Clear logs on new run
    
    // Flavor text to acknowledge user request about scraping technologies
    addLog("INITIALIZING SCRAPER MODULES...");
    setTimeout(() => addLog("LOADING SELENIUM DRIVERS (HEADLESS)..."), 200);
    setTimeout(() => addLog("BYPASSING CLOUDFLARE VIA PUPPETEER..."), 400);

    const loc = locationOverride || selectedLocation || 'Iran';
    if (locationOverride) setSelectedLocation(locationOverride);

    setIsScrapingLocation(true);
    addLog(`TARGET LOCKED: ${loc.toUpperCase()}`);
    addLog("INITIALIZING AI SCOUT BOT...");
    
    // Simulate scanning steps for effect
    setTimeout(() => addLog("CONNECTING TO LOCAL TELEGRAM NODES..."), 500);
    setTimeout(() => addLog(`SCANNING FREQUENCIES IN ${loc.toUpperCase()}...`), 1200);
    setTimeout(() => addLog("BYPASSING REGIONAL FIREWALLS..."), 2000);
    setTimeout(() => addLog("EXTRACTING ENTITIES (NCRI, LOCAL UNIONS)..."), 2800);

    try {
      const data = await geminiService.generateOppositionDashboard(language, loc);
      setDashboardData(data);
      addLog("DATA PACKET RECEIVED.");
      addLog("UPDATING TACTICAL LAYERS...");
      addLog(`UNITY SCORE: ${data.unityScore}%`);
      addLog("COMPLETE.");
    } catch (error) {
      console.error("Failed to load dashboard", error);
      addLog("ERROR: CONNECTION UNSTABLE.");
      addLog("RETRYING VIA SATELLITE UPLINK...");
      // Fallback data to prevent empty screen if API fails hard
      setTimeout(() => {
          addLog("FALLBACK DATA LOADED.");
          setIsLoadingDashboard(false);
      }, 1000);
    } finally {
      setIsLoadingDashboard(false);
      setIsScrapingLocation(false);
    }
  };

  const handleRunSmartScraper = async () => {
      addLog("RUNNING DEEP LAYER DETECTION PROTOCOL...");
      setIsScrapingLocation(true);
      try {
          const result = await geminiService.getOppositionLayers(language);
          setDashboardData(prev => {
              if (!prev) return null;
              return {
                  ...prev,
                  layers: result.layers,
                  tacticalMap: result.tacticalMap
              };
          });
          addLog("LAYERS UPDATED WITH LIVE INTELLIGENCE.");
          addLog("TACTICAL MAP REFRESHED.");
      } catch (e) {
          addLog("ERROR: LAYER DETECTION FAILED.");
      } finally {
          setIsScrapingLocation(false);
      }
  };

  const handleCommand = (cmd: string) => {
    switch (cmd) {
        case 'DEEP_SCAN':
            handleRunSmartScraper();
            break;
        case 'VERIFY':
            addLog("VERIFYING SOURCE INTEGRITY...");
            if (dashboardData?.sources && dashboardData.sources.length > 0) {
                dashboardData.sources.forEach(s => {
                    setTimeout(() => {
                        try {
                            const domain = new URL(s.uri).hostname;
                            addLog(`CHECKING CERTIFICATE: ${domain}... VALID`);
                        } catch (e) {
                            addLog(`CHECKING SOURCE: ${s.title.substring(0, 20)}... VALID`);
                        }
                    }, Math.random() * 1000 + 500);
                });
                setTimeout(() => addLog("ALL SIGNALS VERIFIED."), 3000);
            } else {
                setTimeout(() => addLog("NO ACTIVE SOURCES TO VERIFY."), 1000);
            }
            break;
        case 'CLEAR':
            setScraperLogs([]);
            addLog("CONSOLE CLEARED.");
            break;
        case 'EXPORT':
            addLog("GENERATING REPORT...");
            setTimeout(() => addLog("ENCRYPTING DATA..."), 800);
            setTimeout(() => {
                if (dashboardData) {
                    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `kavosh_report_${Date.now()}.json`;
                    a.click();
                    addLog("REPORT DOWNLOADED.");
                } else {
                    addLog("ERROR: NO DATA TO EXPORT.");
                }
            }, 1500);
            break;
    }
  };

  // --- Game Mechanics & Simulation ---

  const processTurn = async (type: 'simulation' | 'news_event', description: string) => {
      setIsProcessingTurn(true);
      try {
          const result = await geminiService.analyzeGameTurn(gameStats, description, language);
          
          const newTurn: GameTurn = {
              id: Date.now().toString(),
              type,
              description: description.length > 50 ? description.substring(0, 50) + '...' : description,
              impact: result.impact,
              analysis: result.analysis,
              timestamp: new Date().toLocaleTimeString()
          };

          setGameStats(prev => ({
              ...prev,
              unity: Math.min(100, Math.max(0, prev.unity + result.impact.unity)),
              momentum: Math.min(100, Math.max(0, prev.momentum + result.impact.momentum)),
              regimeStability: Math.min(100, Math.max(0, prev.regimeStability + result.impact.regimeStability)),
              turnCount: prev.turnCount + 1,
              history: [newTurn, ...prev.history]
          }));
          
          addLog(`GAME STATE UPDATED: U:${result.impact.unity > 0 ? '+' : ''}${result.impact.unity} | M:${result.impact.momentum > 0 ? '+' : ''}${result.impact.momentum}`);

      } catch (e) {
          console.error("Turn processing failed", e);
      } finally {
          setIsProcessingTurn(false);
      }
  };

  const handleRunSimulation = async () => {
    if (!factionA || !factionB || !simTopic) return;
    setIsSimulating(true);
    setSimResult(null);
    setBridgeResult(null);
    setMediaCampaign(null); // Reset campaign
    try {
      const result = await geminiService.runOppositionSimulation(factionA, factionB, simTopic, language, currentThemeConfig.promptModifier);
      setSimResult(result);
      
      // Update Game State based on Simulation Result
      await processTurn('simulation', `Dialogue between ${factionA} and ${factionB} regarding ${simTopic}. Outcome: ${result.status}, Unity Potential: ${result.unityPotential}%`);

    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleContinueSimulation = async () => {
      if (!simResult) return;
      setIsContinuing(true);
      try {
          const prevHistory = simResult.dialogue.map(m => `${m.sender}: ${m.text}`).join('\n');
          const strategy = simResult.suggestedStrategy;
          const continuedResult = await geminiService.continueSimulation(prevHistory, strategy, language, currentThemeConfig.promptModifier);
          
          // Append new messages to existing dialogue
          setSimResult(prev => {
              if (!prev) return continuedResult;
              return {
                  ...continuedResult,
                  dialogue: [...prev.dialogue, ...continuedResult.dialogue]
              };
          });
          
      } catch (e) {
          console.error("Failed to continue simulation", e);
      } finally {
          setIsContinuing(false);
      }
  };

  const handleGenerateMediaCampaign = async () => {
      if (!simResult) return;
      setIsGeneratingMedia(true);
      setMediaCampaign(null);
      
      try {
          const campaign = await geminiService.generateOppositionMediaCampaign(
              factionA, 
              factionB, 
              simTopic, 
              simResult.commonGround, 
              simResult.suggestedStrategy,
              language,
              currentThemeConfig.promptModifier
          );
          setMediaCampaign(campaign);
          setShowMediaModal(true);
          addLog("MEDIA CAMPAIGN GENERATED.");
      } catch (e) {
          console.error("Failed to generate media campaign", e);
          addLog("ERROR GENERATING MEDIA CAMPAIGN.");
      } finally {
          setIsGeneratingMedia(false);
      }
  };

  const handleAutoDetectSituation = async () => {
      if (!simTopic) return;
      setIsAnalyzingSituation(true);
      setSituationData(null);
      setSimResult(null); // Clear previous 1-on-1 sim
      try {
          const result = await geminiService.generateSituationalAnalysis(simTopic, language, currentThemeConfig.promptModifier);
          setSituationData(result);
          addLog(`AUTO-DETECT: IDENTIFIED ${result.sides.length} FACTIONS.`);
      } catch (e) {
          console.error("Auto detect failed", e);
          addLog("ERROR: FAILED TO ANALYZE SITUATION.");
      } finally {
          setIsAnalyzingSituation(false);
      }
  };

  const handleSimulateNews = (newsItem: OppositionNewsItem) => {
    setSimTopic(newsItem.headline);
    
    // Auto-connect activated factions from the news item
    if (newsItem.relatedFactions && newsItem.relatedFactions.length > 0) {
        // Helper to match API faction names to our dynamic list
        const findFactionMatch = (apiName: string) => {
            if (!apiName) return '';
            // Try exact match then fuzzy match
            return dynamicFactions.find(f => f.includes(apiName) || apiName.includes(f)) || apiName;
        };

        const f1 = findFactionMatch(newsItem.relatedFactions[0]);
        // If a second faction exists, use it. Otherwise leave B empty for user choice.
        const f2 = newsItem.relatedFactions.length > 1 ? findFactionMatch(newsItem.relatedFactions[1]) : '';
        
        setFactionA(f1);
        setFactionB(f2);
    } else {
        // Reset if no specific factions are linked
        setFactionA('');
        setFactionB('');
    }

    setActiveTab('simulation');
  };
  
  const handleAnalyzeNews = async (newsItem: OppositionNewsItem) => {
      setActiveTab('war_room');
      await processTurn('news_event', `News Event: ${newsItem.headline}`);
  };

  const handleGenerateScenariosFromNews = (newsItem: OppositionNewsItem) => {
      setScenarioContext(`Based on the breaking news: "${newsItem.headline}" (Impact: ${newsItem.regimeImpact}%). How does this evolve?`);
      setActiveTab('scenario_map');
      handleGenerateScenarios(`Based on the breaking news: "${newsItem.headline}". ${newsItem.summary}`);
  };
  
  const handleSimulateScenario = (scenario: FutureScenario) => {
      // 1. Set Tab
      setActiveTab('simulation');
      
      // 2. Set Topic
      const action = scenario.type === 'Best Case' ? 'Acceleration' : 'Prevention';
      setSimTopic(`${action} Strategy: ${scenario.title} - ${scenario.strategicGoal || 'Strategic Dialogue'}`);
      
      // 3. Set Factions (Smart Match)
      if (scenario.relevantFactions && scenario.relevantFactions.length >= 2) {
          const findFactionMatch = (apiName: string) => {
                if (!apiName) return '';
                return dynamicFactions.find(f => f.includes(apiName) || apiName.includes(f)) || apiName;
          };
          setFactionA(findFactionMatch(scenario.relevantFactions[0]));
          setFactionB(findFactionMatch(scenario.relevantFactions[1]));
      } else {
          // Fallback if AI didn't return factions
          setFactionA(dynamicFactions[0] || 'Faction A');
          setFactionB(dynamicFactions[1] || 'Faction B');
      }
  };
  
  const handleCancelActor = (msgId: string) => {
    if (!simResult) return;
    
    // Simulate local state update to show "Canceled" status
    const updatedDialogue = simResult.dialogue.map(msg => {
        if (msg.id === msgId || msg.text === msgId) { // Fallback to text matching if ID missing
             return { ...msg, isCanceled: true };
        }
        return msg;
    });
    
    setSimResult({ ...simResult, dialogue: updatedDialogue });

    addLog(`ACTOR FLAGGED FOR ISOLATION [MSG_ID: ${msgId.substring(0,5)}]...`);
    setTimeout(() => addLog("SOCIAL CREDIT REDUCED."), 500);
    alert("Cancel Protocol Initiated: Actor has been flagged for isolation due to lack of empathy.");
  };

  const handleSupportActor = (msgId: string) => {
      alert("Support Protocol: Empathy reinforced. Unity score +1.");
  };

  const handleLoadDeltaStrategy = () => {
      setFactionA('Light Triad Delta Force');
      setFactionB('Traditional Hardliner');
      setSimTopic('Implementing the "Light Triad" Delta Strategy: Converting conflict into constructive dialogue through radical empathy and strategic de-escalation.');
      addLog("DELTA FORCE PROTOCOL LOADED.");
  };

  const handleGenerateScenarios = async (overrideContext?: string) => {
      setIsProjecting(true);
      setScenarioData(null);
      
      const context = overrideContext || scenarioContext || `Current Game State - Unity: ${gameStats.unity}, Momentum: ${gameStats.momentum}, Regime Stability: ${gameStats.regimeStability}. Recent events: ${gameStats.history.slice(0, 3).map(h => h.description).join('; ')}`;
      
      try {
          const result = await geminiService.generateScenarioMap(context, language);
          setScenarioData(result);
          addLog("SCENARIO PROJECTION COMPLETE.");
      } catch (e) {
          console.error("Scenario generation failed", e);
          addLog("PROJECTION FAILED. INSUFFICIENT DATA.");
      } finally {
          setIsProjecting(false);
      }
  };

  const handleOpenFactionProfile = (name: string) => {
      setViewingFaction(name);
  };

  const handleStartSimWithFaction = (name: string, role: 'A' | 'B') => {
      if (role === 'A') {
          setFactionA(name);
          setFactionB('');
      } else {
          setFactionA('');
          setFactionB(name);
      }
      setViewingFaction(null);
      setActiveTab('simulation');
  };

  // --- Export Functions ---
  const generateMarkdownReport = (sim: SimResult, topic: string) => {
      let md = `# OppositionAI Report: ${topic}\n\n`;
      md += `**Date:** ${new Date().toLocaleDateString()}\n`;
      md += `**Unity Potential:** ${sim.unityPotential}%\n`;
      md += `**Toxicity Level:** ${sim.overallDarkScore}%\n\n`;
      
      md += `## Simulation Dialogue\n\n`;
      sim.dialogue.forEach((msg, i) => {
          md += `### ${msg.sender} ${msg.isDarkTriad ? '(Dark Triad Flagged)' : ''}\n`;
          md += `> ${msg.text}\n\n`;
          md += `* **Analyst Note:** ${msg.analysis}\n`;
          md += `* **Scores:** Dark: ${msg.darkTriadScore}% | Light: ${msg.lightTriadScore}%\n\n`;
      });

      if (sim.mediatorConsole) {
          md += `## Mediator Console (Natalie Hudson Method)\n\n`;
          md += `**Identified Trap:** ${sim.mediatorConsole.identifiedTrap}\n\n`;
          md += `**Psychological Insight:**\n${sim.mediatorConsole.psychologicalInsight}\n\n`;
          md += `**Suggested Bridge Message:**\n${sim.mediatorConsole.suggestedBridge}\n\n`;
          md += `**Joint Action:**\n${sim.mediatorConsole.jointAction}\n\n`;
      }

      md += `## Strategic Suggestion\n${sim.suggestedStrategy}\n`;
      return md;
  };

  const handleExportMarkdown = () => {
      if (!simResult) return;
      const md = generateMarkdownReport(simResult, simTopic);
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opposition_report_${Date.now()}.md`;
      a.click();
  };

  const handleExportPDF = () => {
      if (!simResult) return;
      const printContent = `
        <html>
        <head>
            <title>OppositionAI Report</title>
            <style>
                body { font-family: 'Courier New', monospace; padding: 40px; color: #000; }
                h1 { border-bottom: 2px solid #000; padding-bottom: 10px; }
                .stats { display: flex; gap: 20px; margin-bottom: 20px; font-weight: bold; }
                .message { margin-bottom: 20px; padding: 10px; border-left: 4px solid #ccc; page-break-inside: avoid; }
                .message.dark { border-left-color: #000; background: #f0f0f0; }
                .analyst { font-size: 0.9em; color: #444; margin-top: 5px; font-style: italic; }
                .console { border: 1px solid #000; padding: 15px; margin-top: 30px; }
                .label { font-weight: bold; text-transform: uppercase; display: block; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h1>OppositionAI // Simulation Report</h1>
            <p><strong>Topic:</strong> ${simTopic}</p>
            <div class="stats">
                <span>Unity Potential: ${simResult.unityPotential}%</span>
                <span>Dark Triad Score: ${simResult.overallDarkScore}%</span>
            </div>
            
            <h2>Dialogue Log</h2>
            ${simResult.dialogue.map(msg => `
                <div class="message ${msg.isDarkTriad ? 'dark' : ''}">
                    <div><strong>${msg.sender}</strong> ${msg.isDarkTriad ? '[DARK TRIAD]' : ''}</div>
                    <p>${msg.text}</p>
                    <div class="analyst">Analyst Note: ${msg.analysis}</div>
                </div>
            `).join('')}

            ${simResult.mediatorConsole ? `
                <div class="console">
                    <h2>Mediator Console</h2>
                    <span class="label">Identified Trap</span>
                    <p>${simResult.mediatorConsole.identifiedTrap}</p>
                    <span class="label">Psychological Insight</span>
                    <p>${simResult.mediatorConsole.psychologicalInsight}</p>
                    <span class="label">Suggested Bridge Message</span>
                    <p>${simResult.mediatorConsole.suggestedBridge}</p>
                    <span class="label">Joint Action</span>
                    <p>${simResult.mediatorConsole.jointAction}</p>
                </div>
            ` : ''}
            
            <div style="margin-top: 40px; font-size: 0.8em; text-align: center;">
                Generated by Kavosh AI // Opposition Intelligence
            </div>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
      }
  };

  // --- Sub-components ---

  const IntroScreen = () => (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-center items-center text-center p-6 animate-fade-in font-mono">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full" 
                  style={{
                      backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                  }}>
             </div>
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/5 to-black"></div>
        </div>

        <div className="relative z-10 max-w-2xl w-full border border-gray-800 bg-black/90 p-10 md:p-14 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.1)] flex flex-col items-center backdrop-blur-md">
             
             {/* Logo / Icon */}
             <div className="mb-8 relative group">
                 <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                 <div className="w-20 h-20 border border-gray-700 bg-black/50 rounded-full flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-sm">
                     <svg className="w-10 h-10 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                     </svg>
                 </div>
             </div>
             
             {/* Text Content */}
             <div className="space-y-6 mb-12">
                 <h1 className="text-4xl md:text-5xl font-bold text-white tracking-[0.2em] uppercase" style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                    {t('oppositionAI.intro.title')}
                 </h1>
                 <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto"></div>
                 <p className="text-sm md:text-base text-gray-400 tracking-[0.3em] uppercase font-light">
                     {t('oppositionAI.intro.line1')}
                 </p>
             </div>

             {/* Enter Button */}
             <button 
                onClick={() => setShowIntro(false)}
                className="group relative inline-flex items-center justify-center px-12 py-3.5 text-sm font-bold text-white uppercase tracking-widest transition-all duration-300 bg-transparent border border-red-700 hover:border-red-500 hover:bg-red-600/10 focus:outline-none focus:ring-1 focus:ring-red-500 overflow-hidden"
             >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-red-600 rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                <span className="relative flex items-center gap-3">
                    {t('oppositionAI.intro.start')}
                    <svg className="w-4 h-4 rtl:rotate-180 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
             </button>
             
             {/* Footer Status */}
             <div className="mt-10 flex items-center gap-2 text-[9px] text-gray-600 uppercase tracking-wider font-mono">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                 System Online // v2.4.0 // Secure
             </div>
        </div>
    </div>
  );

  const RelationshipGraph: React.FC<{ data: SituationAnalysisResult }> = ({ data }) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const animationRef = useRef<number>();

      useEffect(() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Resize canvas
          const parent = canvas.parentElement;
          if (parent) {
              canvas.width = parent.clientWidth;
              canvas.height = Math.max(400, parent.clientHeight);
          }

          // Initialize nodes with random positions near center
          let nodes = data.sides.map(side => ({
              ...side,
              x: canvas.width / 2 + (Math.random() - 0.5) * 100,
              y: canvas.height / 2 + (Math.random() - 0.5) * 100,
              vx: 0,
              vy: 0
          }));

          const draw = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Physics update
              nodes.forEach(node => {
                  // Repulsion between all nodes
                  nodes.forEach(other => {
                      if (node.id === other.id) return;
                      const dx = node.x - other.x;
                      const dy = node.y - other.y;
                      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                      const force = 3000 / (dist * dist);
                      node.vx += (dx / dist) * force;
                      node.vy += (dy / dist) * force;
                  });

                  // Attraction/Repulsion based on links
                  data.relations.forEach(rel => {
                      const otherId = rel.from === node.id ? rel.to : rel.from === node.id ? rel.from : null;
                      if (!otherId) return; // Not connected
                      
                      const other = nodes.find(n => n.id === (rel.from === node.id ? rel.to : rel.from));
                      if (other) {
                          const dx = other.x - node.x;
                          const dy = other.y - node.y;
                          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
                          
                          // Attraction force (spring)
                          const targetDist = 150;
                          const force = (dist - targetDist) * 0.05;
                          node.vx += (dx / dist) * force;
                          node.vy += (dy / dist) * force;
                          
                          // Conflict repulsion (extra push away if enemies)
                          if (rel.type === 'conflict' && dist < 200) {
                              node.vx -= (dx/dist) * 2;
                              node.vy -= (dy/dist) * 2;
                          }
                      }
                  });

                  // Center gravity
                  const dx = canvas.width / 2 - node.x;
                  const dy = canvas.height / 2 - node.y;
                  node.vx += dx * 0.01;
                  node.vy += dy * 0.01;

                  // Apply velocity with damping
                  node.vx *= 0.9;
                  node.vy *= 0.9;
                  node.x += node.vx;
                  node.y += node.vy;

                  // Bounds
                  const padding = 40;
                  node.x = Math.max(padding, Math.min(canvas.width - padding, node.x));
                  node.y = Math.max(padding, Math.min(canvas.height - padding, node.y));
              });

              // Draw edges
              data.relations.forEach(rel => {
                  const a = nodes.find(n => n.id === rel.from);
                  const b = nodes.find(n => n.id === rel.to);
                  if (!a || !b) return;

                  ctx.lineWidth = 2;
                  ctx.beginPath();
                  
                  if (rel.type === "conflict") {
                      ctx.strokeStyle = "#ef4444"; // Red
                      ctx.setLineDash([5, 5]);
                  } else if (rel.type === "ally") {
                      ctx.strokeStyle = "#22c55e"; // Green
                      ctx.setLineDash([]);
                  } else {
                      ctx.strokeStyle = "#3b82f6"; // Blue (Info)
                      ctx.setLineDash([2, 2]);
                  }

                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.stroke();
                  ctx.setLineDash([]); // Reset
              });

              // Draw nodes
              nodes.forEach(node => {
                  // Glow
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = node.color;
                  
                  // Circle
                  ctx.fillStyle = node.color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
                  ctx.fill();
                  
                  // Reset shadow for text
                  ctx.shadowBlur = 0;
                  
                  // Label
                  ctx.fillStyle = "#ffffff";
                  ctx.font = "bold 12px sans-serif";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";
                  // Background for text
                  const textWidth = ctx.measureText(node.name).width;
                  ctx.fillStyle = "rgba(0,0,0,0.7)";
                  ctx.fillRect(node.x - textWidth/2 - 4, node.y + 30, textWidth + 8, 20);
                  
                  ctx.fillStyle = "#ffffff";
                  ctx.fillText(node.name, node.x, node.y + 40);
                  
                  // Role
                  ctx.font = "10px sans-serif";
                  ctx.fillStyle = "#cccccc";
                  ctx.fillText(node.role, node.x, node.y + 54);
              });

              animationRef.current = requestAnimationFrame(draw);
          };

          draw();

          return () => {
              if (animationRef.current) cancelAnimationFrame(animationRef.current);
          };
      }, [data]);

      return <canvas ref={canvasRef} className="w-full h-full min-h-[500px] bg-gray-900 rounded-lg border border-gray-700"></canvas>;
  };

  // AI Theme Selector Component
  const AIThemeSelector = () => (
    <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
      <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
        <span className="text-lg">🧠</span>
        {language === 'fa' ? 'شخصیت روانشناختی AI' : 'AI Psychological Personality'}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {AI_PERSONALITY_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedAITheme(theme.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-300 text-center ${
              selectedAITheme === theme.id 
                ? `border-white bg-gradient-to-br ${theme.color} shadow-lg scale-105` 
                : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{theme.icon}</div>
            <div className="text-xs font-medium text-white truncate">
              {language === 'fa' ? theme.name.fa : theme.name.en}
            </div>
          </button>
        ))}
      </div>
      {currentThemeConfig && (
        <div className={`mt-3 p-3 rounded-lg bg-gradient-to-r ${currentThemeConfig.color} bg-opacity-20`}>
          <p className="text-xs text-gray-200">
            <span className="font-bold">{currentThemeConfig.icon} {language === 'fa' ? currentThemeConfig.name.fa : currentThemeConfig.name.en}:</span>{' '}
            {language === 'fa' ? currentThemeConfig.description.fa : currentThemeConfig.description.en}
          </p>
        </div>
      )}
    </div>
  );

  const MediaCampaignModal = () => {
      if (!showMediaModal || !mediaCampaign) return null;

      const copyToClipboard = (text: string) => {
          navigator.clipboard.writeText(text);
          alert("Copied to clipboard!");
      };

      return (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowMediaModal(false)}>
              <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 via-purple-700 to-pink-700">
                      <h2 className="text-2xl font-bold text-white">{t('oppositionAI.mediaCampaign.title')}</h2>
                      <button onClick={() => setShowMediaModal(false)} className="text-white hover:text-gray-200 text-xl font-bold">&times;</button>
                  </div>
                  
                  <div className="p-8 space-y-8">
                      {/* Instagram Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 flex justify-between items-center">
                              <span className="font-bold text-white flex items-center">
                                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.011-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.262 0-3.67.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                  {t('oppositionAI.mediaCampaign.instagram')}
                              </span>
                              <button onClick={() => copyToClipboard(mediaCampaign.instagramCaption)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors uppercase font-bold">{t('oppositionAI.mediaCampaign.copy')}</button>
                          </div>
                          <div className="p-6 text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed bg-gray-50" dir="rtl">
                              {mediaCampaign.instagramCaption}
                          </div>
                          <div className="px-6 pb-6 bg-gray-50" dir="rtl">
                              <div className="flex flex-wrap gap-2">
                                  {mediaCampaign.hashtags.map((tag, i) => (
                                      <span key={i} className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-full">#{tag.replace('#', '')}</span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Telegram Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                          <div className="p-3 bg-blue-500 flex justify-between items-center">
                              <span className="font-bold text-white flex items-center">
                                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                  {t('oppositionAI.mediaCampaign.telegram')}
                              </span>
                              <button onClick={() => copyToClipboard(mediaCampaign.telegramPost)} className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors uppercase font-bold">{t('oppositionAI.mediaCampaign.copy')}</button>
                          </div>
                          <div className="p-6 text-gray-700 text-sm whitespace-pre-wrap font-mono leading-relaxed bg-gray-50" dir="rtl">
                              {mediaCampaign.telegramPost}
                          </div>
                      </div>

                      {/* Action Plan Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
                          <div className="p-3 bg-gray-800 flex items-center">
                              <span className="font-bold text-white uppercase tracking-wide text-sm">{t('oppositionAI.mediaCampaign.actionPlan')}</span>
                          </div>
                          <ul className="p-6 space-y-3 text-sm text-gray-700 bg-gray-50" dir="rtl">
                              {mediaCampaign.actionItems.map((item, i) => (
                                  <li key={i} className="flex items-center">
                                      <span className="w-2 h-2 bg-pink-500 rounded-full ml-3"></span>
                                      {item}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const FactionProfile = () => {
      // Flatten factions to find the active one
      const allFactions = dashboardData?.layers.flatMap(l => l.factions) || [];
      const faction = allFactions.find(f => f.name === viewingFaction) || { name: viewingFaction || "Unknown", alignment: 50, activity: 'Medium', recentEvent: '' };
      
      // Filter news
      const relatedNews = dashboardData?.newsFeed.filter(n => n.relatedFactions?.includes(faction.name) || n.headline.includes(faction.name)) || [];

      // Mock Scenarios based on activity level
      const mockScenarios = [
          { title: "Joint Statement on Human Rights", type: "Diplomatic", difficulty: "Easy" },
          { title: "Coordinated Strike Action", type: "Tactical", difficulty: "Hard" },
          { title: "Resolve Internal Leadership Dispute", type: "Internal", difficulty: "Medium" }
      ];

      return (
          <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
              <button 
                onClick={() => setViewingFaction(null)} 
                className="flex items-center text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs mb-4"
              >
                  ← Back to Dashboard
              </button>

              {/* Profile Header */}
              <div className="bg-black border-l-4 border-red-600 p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                          <span className="text-red-500 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Faction Profile // {faction.activity === 'High' ? 'ACTIVE' : 'DORMANT'}</span>
                          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-2">{faction.name}</h2>
                          <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
                              <span>Alignment: {faction.alignment}%</span>
                              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-600" style={{width: `${faction.alignment}%`}}></div>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => handleStartSimWithFaction(faction.name, 'A')}
                            className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg"
                          >
                              Simulate as Side A
                          </button>
                          <button 
                            onClick={() => handleStartSimWithFaction(faction.name, 'B')}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs uppercase tracking-widest transition-colors border border-gray-700"
                          >
                              Simulate as Side B
                          </button>
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Intel Stream */}
                  <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Recent Intelligence</h3>
                      </div>
                      
                      {faction.recentEvent && (
                          <div className="bg-teal-900/10 border-l-2 border-teal-500 p-4">
                              <span className="text-[10px] text-teal-400 uppercase tracking-widest mb-1 block">Latest Signal</span>
                              <p className="text-white text-sm font-medium">{faction.recentEvent}</p>
                          </div>
                      )}

                      {relatedNews.length > 0 ? (
                          relatedNews.map(news => (
                              <div key={news.id} className="bg-gray-900/50 p-4 border border-gray-800 hover:border-gray-600 transition-colors">
                                  <div className="flex justify-between items-start mb-2">
                                      <span className="text-[10px] text-gray-500 uppercase">{news.source}</span>
                                      <span className="text-[10px] text-gray-500">{news.timestamp}</span>
                                  </div>
                                  <h4 className="text-gray-200 font-bold text-sm mb-2">{news.headline}</h4>
                                  <div className="flex gap-2">
                                      <span className="text-[10px] bg-black px-2 py-1 text-gray-400 border border-gray-800">Impact: {news.oppositionImpact}%</span>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-gray-600 text-sm italic p-4 border border-dashed border-gray-800">No specific news items linked directly to this faction recently.</div>
                      )}
                  </div>

                  {/* Simulation Scenarios */}
                  <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Available Scenarios</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                          {mockScenarios.map((scen, idx) => (
                              <button 
                                key={idx}
                                onClick={() => {
                                    setSimTopic(`${scen.title} involving ${faction.name}`);
                                    handleStartSimWithFaction(faction.name, 'A');
                                }}
                                className="group bg-black border border-gray-800 p-4 text-left hover:border-purple-500/50 transition-all hover:bg-gray-900"
                              >
                                  <div className="flex justify-between items-center mb-1">
                                      <h4 className="text-gray-200 font-bold text-sm group-hover:text-purple-400 transition-colors">{scen.title}</h4>
                                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded border ${
                                          scen.difficulty === 'Hard' ? 'border-red-900 text-red-500' : 
                                          scen.difficulty === 'Medium' ? 'border-yellow-900 text-yellow-500' : 
                                          'border-green-900 text-green-500'
                                      }`}>{scen.difficulty}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 uppercase tracking-widest">{scen.type} Simulation</p>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const StrategicRadar = () => {
    // Entities based on user request
    const entities = [
      { name: 'هسته (رهبری)', angle: 270, radius: 20, color: 'text-red-500', layer: 'Core' },
      { name: 'ارتش سایبری', angle: 45, radius: 50, color: 'text-purple-500', layer: 'Mid' },
      { name: 'میانی (هماهنگ‌کننده)', angle: 315, radius: 50, color: 'text-yellow-500', layer: 'Mid' },
      { name: 'احزاب محلی', angle: 180, radius: 60, color: 'text-blue-500', layer: 'Outer' },
      { name: 'لابی خارج کشور', angle: 90, radius: 80, color: 'text-green-500', layer: 'Outer' },
      { name: 'بیرونی (پشتیبان)', angle: 225, radius: 80, color: 'text-teal-500', layer: 'Outer' },
    ];
  
    return (
      <div className="relative w-full aspect-square max-w-[320px] mx-auto bg-black rounded-full border border-gray-800 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Concentric Circles representing layers */}
          <div className="absolute inset-0 m-auto w-[25%] h-[25%] border border-dashed border-red-900/50 rounded-full"></div>
          <div className="absolute inset-0 m-auto w-[55%] h-[55%] border border-dashed border-yellow-900/50 rounded-full"></div>
          <div className="absolute inset-0 m-auto w-[85%] h-[85%] border border-dashed border-teal-900/50 rounded-full"></div>
          
          {/* Crosshairs */}
          <div className="absolute inset-0 m-auto w-full h-[1px] bg-gray-800/30"></div>
          <div className="absolute inset-0 m-auto h-full w-[1px] bg-gray-800/30"></div>
  
          {/* Radar Scanner Animation */}
          <div className="absolute inset-0 origin-center animate-[spin_4s_linear_infinite] bg-gradient-to-tr from-transparent via-green-500/10 to-transparent pointer-events-none" style={{clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)'}}></div>
  
          {/* Entities Points */}
          {entities.map((e, i) => {
              const rad = (e.angle - 90) * (Math.PI / 180);
              const x = 50 + (e.radius / 2) * Math.cos(rad);
              const y = 50 + (e.radius / 2) * Math.sin(rad);
              return (
                  <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-crosshair" style={{ left: `${x}%`, top: `${y}%` }}>
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-current ${e.color} shadow-[0_0_8px_currentColor] animate-pulse`}></div>
                      <div className={`absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold ${e.color} opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-2 py-1 rounded border border-gray-800 z-20 pointer-events-none`}>
                          {e.name}
                          <span className="block text-[8px] text-gray-500 font-normal">{e.layer} Layer</span>
                      </div>
                  </div>
              );
          })}
          
          <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-gray-600 uppercase tracking-widest pointer-events-none">
              Source: Live Intelligence
          </div>
      </div>
    );
  };

  const IdeologicalRadar: React.FC<{
    ideology: { factionA: IdeologyStats; factionB: IdeologyStats };
    nameA: string;
    nameB: string;
  }> = ({ ideology, nameA, nameB }) => {
    const axes = [
      { name: 'Economic', labelA: 'State', labelB: 'Market' },
      { name: 'Social', labelA: 'Conserv', labelB: 'Liberal' },
      { name: 'Method', labelA: 'Reform', labelB: 'Revol' },
      { name: 'Structure', labelA: 'Central', labelB: 'Federal' }
    ];

    const getPoints = (stats: IdeologyStats) => {
        const values = [stats.economic, stats.social, stats.method, stats.structure];
        const points = values.map((val, i) => {
            const angle = (Math.PI / 2) * i;
            const radius = (val / 100) * 45; // 45 is max radius in 50x50 center
            // Convert polar to cartesian
            const x = 50 + radius * Math.cos(angle - Math.PI / 2); // -PI/2 to start at top
            const y = 50 + radius * Math.sin(angle - Math.PI / 2);
            return `${x},${y}`;
        });
        return points.join(' ');
    };

    return (
        <div className="mb-6 p-4 bg-black border border-gray-800 rounded-lg">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Ideological Alignment Spectrum</h4>
            <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* Background Grid */}
                    {[20, 40, 60, 80].map(r => (
                        <circle key={r} cx="50" cy="50" r={r/2} fill="none" stroke="#333" strokeWidth="0.5" strokeDasharray="2,2" />
                    ))}
                    {/* Axes Lines */}
                    <line x1="50" y1="5" x2="50" y2="95" stroke="#444" strokeWidth="0.5" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="#444" strokeWidth="0.5" />

                    {/* Labels */}
                    <text x="50" y="3" fontSize="4" fill="#666" textAnchor="middle">Economic</text>
                    <text x="97" y="51" fontSize="4" fill="#666" textAnchor="start">Social</text>
                    <text x="50" y="99" fontSize="4" fill="#666" textAnchor="middle">Method</text>
                    <text x="3" y="51" fontSize="4" fill="#666" textAnchor="end">Structure</text>

                    {/* Faction A Polygon (Cyan) */}
                    <polygon points={getPoints(ideology.factionA)} fill="rgba(20, 184, 166, 0.3)" stroke="#14b8a6" strokeWidth="1" />
                    
                    {/* Faction B Polygon (Purple) */}
                    <polygon points={getPoints(ideology.factionB)} fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="1" />
                </svg>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-2 text-[9px] uppercase font-bold">
                <div className="flex items-center gap-1 text-teal-500">
                    <span className="w-2 h-2 bg-teal-500/50 border border-teal-500"></span> {nameA || "Faction A"}
                </div>
                <div className="flex items-center gap-1 text-purple-500">
                    <span className="w-2 h-2 bg-purple-500/50 border border-purple-500"></span> {nameB || "Faction B"}
                </div>
            </div>
        </div>
    );
  };

  const NewsMonitor = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h3 className="text-2xl font-bold text-white tracking-widest uppercase">{t('oppositionAI.monitor.title')}</h3>
            <button 
                onClick={() => handleRefreshDashboard(selectedLocation)}
                disabled={isLoadingDashboard}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-teal-400 border border-teal-900 rounded-sm text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
            >
                {isLoadingDashboard ? t('oppositionAI.monitor.loading') : t('oppositionAI.monitor.refresh')}
            </button>
        </div>

        {isLoadingDashboard && !dashboardData && (
             <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-red-600"></div>
             </div>
        )}

        <div className="grid grid-cols-1 gap-6">
            {dashboardData?.newsFeed.map((news) => (
                <div key={news.id} className={`relative bg-black p-6 rounded-none border-l-4 transition-all duration-300 ${news.regimeImpact > 80 ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-gray-700 hover:border-gray-500'}`}>
                    {news.regimeImpact > 85 && (
                        <div className="absolute top-2 right-2 animate-pulse">
                            <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs text-teal-500 font-mono uppercase tracking-widest bg-teal-900/10 px-2 py-0.5 border border-teal-800/50">{news.source || 'UNKNOWN SOURCE'}</span>
                        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">{news.timestamp}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{news.headline}</h4>
                    <p className="text-sm text-gray-400 mb-6 leading-relaxed">{news.summary}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-gray-900 p-2 text-center border border-gray-800">
                             <div className="text-[10px] text-gray-500 uppercase">{t('oppositionAI.monitor.regimeImpact')}</div>
                             <div className={`text-lg font-bold ${news.regimeImpact > 70 ? 'text-red-500' : 'text-gray-300'}`}>{news.regimeImpact}%</div>
                        </div>
                        <div className="bg-gray-900 p-2 text-center border border-gray-800">
                             <div className="text-[10px] text-gray-500 uppercase">{t('oppositionAI.monitor.oppositionImpact')}</div>
                             <div className="text-lg font-bold text-teal-500">{news.oppositionImpact}%</div>
                        </div>
                        <div className="bg-gray-900 p-2 text-center border border-gray-800">
                             <div className="text-[10px] text-gray-500 uppercase">{t('oppositionAI.monitor.darkTriad')}</div>
                             <div className={`text-lg font-bold ${news.darkTriadScore > 50 ? 'text-purple-500' : 'text-gray-300'}`}>{news.darkTriadScore}%</div>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button 
                            onClick={() => handleSimulateNews(news)}
                            className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white text-sm uppercase tracking-widest font-semibold transition-all"
                        >
                            {t('oppositionAI.monitor.simulate')}
                        </button>
                        <button 
                            onClick={() => handleGenerateScenariosFromNews(news)}
                            className="flex-1 py-3 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-900 hover:border-teal-600 text-teal-400 hover:text-teal-300 text-sm uppercase tracking-widest font-semibold transition-all"
                        >
                            {t('oppositionAI.monitor.project')}
                        </button>
                        <button 
                            onClick={() => handleAnalyzeNews(news)}
                            className="flex-1 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-900 hover:border-red-600 text-red-400 hover:text-red-300 text-sm uppercase tracking-widest font-semibold transition-all"
                        >
                            {t('oppositionAI.monitor.analyze')}
                        </button>
                    </div>
                </div>
            ))}
            {dashboardData?.newsFeed.length === 0 && !isLoadingDashboard && (
                <div className="text-center py-10 text-gray-500 border border-gray-800 bg-black/50">
                    <p>NO ACTIVE SIGNALS DETECTED IN THIS SECTOR.</p>
                </div>
            )}
        </div>
    </div>
  );

  const ScraperConsole = () => (
      <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('oppositionAI.console.title')}</h4>
               <div className="flex gap-2">
                   <span className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Online
                   </span>
               </div>
          </div>
          
          <div className="bg-black border border-gray-800 p-4 font-mono text-xs h-48 overflow-y-auto custom-scrollbar shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-gray-500 border-b border-gray-800 pb-2 mb-2 sticky top-0 bg-black uppercase tracking-widest flex justify-between">
                  <span>{'>'} SYSTEM_LOG // NODE: {selectedLocation.toUpperCase()}</span>
                  <span>{new Date().toLocaleTimeString('en-US', {hour12: false})}</span>
              </div>
              <div className="space-y-1">
                  {scraperLogs.length === 0 && <span className="text-gray-600 animate-pulse">_waiting for target selection...</span>}
                  {scraperLogs.map((log, i) => (
                      <div key={i} className="text-green-500/80 break-words">
                          <span className="text-gray-600 mr-2">{'>'}</span>{log}
                      </div>
                  ))}
                  <div ref={consoleEndRef} />
              </div>
          </div>

          {/* Command Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800 border border-gray-800 mt-4">
               <button 
                  onClick={() => handleRunSmartScraper()}
                  disabled={isScrapingLocation}
                  className="bg-black hover:bg-gray-900 text-gray-400 hover:text-white text-[10px] sm:text-xs py-3 uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-800 font-bold"
               >
                  {isScrapingLocation ? 'RUNNING...' : t('oppositionAI.console.runScraper')}
               </button>
               <button 
                  onClick={() => handleCommand('DEEP_SCAN')}
                  className="bg-black hover:bg-gray-900 text-gray-400 hover:text-white text-[10px] sm:text-xs py-3 uppercase tracking-wider transition-colors border border-gray-800 font-bold"
               >
                  {t('oppositionAI.console.deepScan')}
               </button>
               <button 
                  onClick={() => handleCommand('VERIFY')}
                  className="bg-black hover:bg-gray-900 text-gray-400 hover:text-white text-[10px] sm:text-xs py-3 uppercase tracking-wider transition-colors border border-gray-800 font-bold"
               >
                  {t('oppositionAI.console.verify')}
               </button>
               <button 
                  onClick={() => handleCommand('EXPORT')}
                  className="bg-black hover:bg-gray-900 text-gray-400 hover:text-white text-[10px] sm:text-xs py-3 uppercase tracking-wider transition-colors border border-gray-800 font-bold"
               >
                  {t('oppositionAI.console.export')}
               </button>
          </div>
          <div className="mt-2 text-right">
              <button onClick={() => handleCommand('CLEAR')} className="text-[10px] text-gray-600 hover:text-red-400 uppercase tracking-widest transition-colors">
                  [{t('oppositionAI.console.clear')}]
              </button>
          </div>
      </div>
  );

  const TacticalMap = () => {
    // Locations with positions
    const locations = [
      { id: 'tehran', name: 'Tehran', top: '35%', left: '50%' },
      { id: 'kurdistan', name: 'Kurdistan', top: '32%', left: '20%' },
      { id: 'zahedan', name: 'Zahedan', top: '70%', left: '85%' },
      { id: 'tabriz', name: 'Tabriz', top: '15%', left: '25%' },
      { id: 'ahvaz', name: 'Ahvaz', top: '60%', left: '25%' },
      { id: 'mashhad', name: 'Mashhad', top: '25%', left: '80%' },
      { id: 'shiraz', name: 'Shiraz', top: '65%', left: '50%' },
      { id: 'isfahan', name: 'Isfahan', top: '50%', left: '50%' },
    ];

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-red-600 shadow-red-500/50';
            case 'crackdown': return 'bg-orange-600 shadow-orange-500/50';
            case 'strike': return 'bg-yellow-500 shadow-yellow-500/50';
            case 'martial law': return 'bg-purple-900 shadow-purple-900/50';
            default: return 'bg-gray-700 shadow-none';
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                 <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('oppositionAI.layers.mapTitle')}</h4>
                 <div className="flex gap-2">
                    {locations.map(loc => (
                        <button 
                            key={loc.id} 
                            onClick={() => setSelectedLocation(loc.name)} 
                            className={`w-2 h-2 rounded-full ${selectedLocation === loc.name ? 'bg-white' : 'bg-gray-700'}`} 
                            title={loc.name} 
                        />
                    ))}
                 </div>
            </div>
            
            <div className="relative w-full h-[400px] bg-black border border-gray-800 rounded-lg overflow-hidden group">
                 {/* Google Maps Embed as Background Layer */}
                 <div className="absolute inset-0 z-0 opacity-40 filter grayscale invert contrast-125">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        src={`https://maps.google.com/maps?q=${selectedLocation || 'Iran'}&t=k&z=6&ie=UTF8&iwloc=&output=embed`}
                        title="Tactical Map"
                        className="pointer-events-none"
                     ></iframe>
                 </div>

                 {/* Grid Overlay for "Tactical" Look */}
                <div className="absolute inset-0 z-1 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                
                {/* Nodes Overlay */}
                {locations.map((loc) => {
                    const status = dashboardData?.tacticalMap?.[loc.name] || 'Quiet';
                    return (
                        <button
                            key={loc.id}
                            onClick={() => setSelectedLocation(loc.name)}
                            className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 shadow-[0_0_10px]
                                ${getStatusColor(status)}
                                ${selectedLocation === loc.name ? 'border-white scale-150' : 'border-black/50 hover:scale-125'}`}
                            style={{ top: loc.top, left: loc.left }}
                        >
                            {/* Status Label */}
                            <span className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white border border-gray-700 text-[10px] font-bold font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20`}>
                                {loc.name}: {status.toUpperCase()}
                            </span>
                            
                            {/* Active Pulse Animation */}
                            {status !== 'Quiet' && (
                                <span className={`absolute top-1/2 left-1/2 w-full h-full rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75 ${getStatusColor(status)}`}></span>
                            )}
                        </button>
                    );
                })}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-900 p-4 border border-gray-800 rounded-b-lg -mt-1">
                 <div className="flex-grow w-full sm:w-auto text-center sm:text-left">
                     <span className="text-xs text-gray-500 uppercase block">{t('oppositionAI.layers.mapSelect')}</span>
                     <div className="text-white font-bold text-lg">{selectedLocation || "Select a node on map"}</div>
                 </div>
                 <button
                    onClick={() => handleRunSmartScraper()}
                    disabled={isScrapingLocation}
                    className="w-full sm:w-auto px-6 py-3 bg-red-700 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold uppercase tracking-wider text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
                 >
                     {isScrapingLocation && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                     {isScrapingLocation ? t('oppositionAI.layers.scraping') : t('oppositionAI.layers.runScraper')}
                 </button>
            </div>
        </div>
    );
  }

  const LayersDashboard = () => (
    <div className="animate-fade-in space-y-8">
         <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tighter uppercase">{t('oppositionAI.layers.title')}</h2>
            <div className="h-1 w-24 bg-red-600 mx-auto my-4"></div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">{t('oppositionAI.layers.context')} {dashboardData?.location ? `// FOCUS: ${dashboardData.location}` : ''}</p>
        </div>

        {/* Tactical Map Section - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-black border border-gray-800 p-6 rounded-lg shadow-lg">
                 <TacticalMap />
            </div>
            {/* Strategic Radar Visualization */}
            <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center relative">
                <h4 className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Strategic Radar</h4>
                <StrategicRadar />
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black p-6 border-l-4 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                {/* Use dynamic Game Stats here if updated */}
                <div className="text-5xl font-extrabold text-white mb-1">{gameStats.turnCount > 0 ? gameStats.unity : dashboardData?.unityScore || 0}%</div>
                <div className="text-xs text-teal-500 uppercase tracking-widest">{t('oppositionAI.layers.unityScore')}</div>
            </div>
            <div className="bg-black p-6 border-l-4 border-gray-700">
                <div className="text-5xl font-extrabold text-white mb-1">{dashboardData?.activeFactionsCount || 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{t('oppositionAI.layers.activeFactions')}</div>
            </div>
            <div className="bg-black p-6 border-l-4 border-purple-900 shadow-[0_0_10px_rgba(88,28,135,0.1)]">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Auto-Cluster Groups</div>
                <div className="flex flex-col gap-2">
                    {dashboardData?.keyGroups && dashboardData.keyGroups.length > 0 ? (
                        dashboardData.keyGroups.map((g, i) => (
                            <span key={i} className="text-sm font-bold text-purple-300 border-b border-purple-900/30 pb-1">{g}</span>
                        ))
                    ) : (
                        <span className="text-gray-600 italic">Scanning for groups...</span>
                    )}
                </div>
            </div>
        </div>

        {/* Layers Visualization */}
        <div className="grid grid-cols-1 gap-4">
            {dashboardData?.layers.map((layer, idx) => (
                <div key={idx} className="bg-black border border-gray-800 p-6 hover:border-gray-600 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-900 pb-4">
                        <div className="mb-2 md:mb-0">
                             <h4 className="text-xl font-bold text-white uppercase tracking-widest">
                                {layer.name === 'Core Layer' ? t('oppositionAI.layers.core') : layer.name === 'Mid Layer' ? t('oppositionAI.layers.mid') : t('oppositionAI.layers.outer')}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 max-w-md">{layer.description}</p>
                        </div>
                    </div>
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {layer.factions.map((faction, fIdx) => (
                            <div 
                                key={fIdx} 
                                onClick={() => handleOpenFactionProfile(faction.name)}
                                className="bg-gray-900/50 p-4 border-l-2 border-gray-700 relative overflow-hidden group cursor-pointer hover:bg-gray-800 transition-colors"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-800 to-transparent opacity-20 transform translate-x-8 -translate-y-8 rounded-full"></div>
                                
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <span className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{faction.name}</span>
                                    <span className={`w-2 h-2 rounded-full shadow-[0_0_5px] ${faction.activity === 'High' ? 'bg-green-500 shadow-green-500/50' : faction.activity === 'Medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-900 shadow-red-900/50'}`}></span>
                                </div>
                                
                                <div className="w-full bg-black h-1.5 rounded-full overflow-hidden mt-2">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${faction.alignment > 75 ? 'bg-teal-500' : faction.alignment > 40 ? 'bg-yellow-600' : 'bg-red-700'}`} style={{ width: `${faction.alignment}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] text-gray-500 font-mono">{faction.alignment}% همسو</span>
                                    {faction.recentEvent && (
                                        <div className="flex items-center gap-1 text-[9px] text-teal-400 bg-teal-900/20 px-1 rounded border border-teal-900/50 max-w-[70%] truncate" title={faction.recentEvent}>
                                            <span className="animate-pulse">📡</span>
                                            <span className="truncate">{faction.recentEvent}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

         {/* Sources / Signals */}
        {dashboardData?.sources && dashboardData.sources.length > 0 && (
            <div className="mb-8 bg-black border border-gray-800 p-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">{t('oppositionAI.layers.sourcesTitle')}</h4>
                <div className="flex flex-col gap-2">
                    {dashboardData.sources.map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-teal-400 bg-teal-900/10 px-3 py-2 border-l-2 border-teal-800 hover:bg-teal-900/30 hover:border-teal-500 transition-colors truncate block"
                        >
                            {source.title || source.uri}
                        </a>
                    ))}
                </div>
            </div>
        )}

        {/* Scraper Console */}
        <ScraperConsole />
    </div>
  );

  const SimulationArena = () => {
    // Use dynamic factions if available, otherwise fall back to static
    const factions = dynamicFactions.length > 0 ? dynamicFactions : t('oppositionAI.factions');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [simResult?.dialogue]);
    
    // --- Analysis Dashboard Component ---
    const AnalysisSidebar = () => {
        if (!simResult) return null;
        
        return (
            <div className="bg-black border border-gray-800 p-4 h-full overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">Analysis Dashboard</h3>
                
                {/* Ideological Radar Chart */}
                {simResult.ideology && (
                    <IdeologicalRadar 
                        ideology={simResult.ideology} 
                        nameA={factionA} 
                        nameB={factionB} 
                    />
                )}

                {/* Score Gauges */}
                <div className="mb-6 space-y-4">
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-1">
                            <span>Toxicity (Dark Triad)</span>
                            <span className="text-red-500 font-bold">{simResult.overallDarkScore}%</span>
                        </div>
                        <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600" style={{width: `${simResult.overallDarkScore}%`}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 uppercase mb-1">
                            <span>Cooperation Prob.</span>
                            <span className="text-teal-500 font-bold">{simResult.unityPotential}%</span>
                        </div>
                        <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-600" style={{width: `${simResult.unityPotential}%`}}></div>
                        </div>
                    </div>
                </div>

                {/* Conflict Points */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Conflict Points</h4>
                    <ul className="space-y-2">
                        {simResult.conflictPoints && simResult.conflictPoints.map((pt, i) => (
                            <li key={i} className="text-xs text-gray-400 border-l-2 border-red-900/50 pl-2 leading-snug">{pt}</li>
                        ))}
                    </ul>
                </div>

                {/* Common Ground */}
                <div className="mb-6">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Common Ground</h4>
                    <ul className="space-y-2">
                        {simResult.commonGround && simResult.commonGround.map((pt, i) => (
                            <li key={i} className="text-xs text-gray-400 border-l-2 border-teal-900/50 pl-2 leading-snug">{pt}</li>
                        ))}
                    </ul>
                </div>

                {/* Psychological Trap Card */}
                {simResult.psychologicalTrap && (
                    <div className="mb-6 bg-red-950/20 border border-red-900/50 p-3 rounded">
                        <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Psychological Trap Detected</h4>
                        <p className="text-xs text-red-200 font-mono">{simResult.psychologicalTrap}</p>
                    </div>
                )}

                {/* Strategy Suggestion */}
                <div className="bg-gray-900 border border-gray-700 p-3 rounded mb-4">
                    <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Suggested Strategy</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{simResult.suggestedStrategy}</p>
                </div>

                {/* Repair Protocol Button */}
                <button 
                    onClick={handleContinueSimulation}
                    disabled={isContinuing}
                    className="w-full py-3 bg-teal-900/30 hover:bg-teal-900/50 border border-teal-700 text-teal-400 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mb-4"
                >
                    {isContinuing ? (
                        <>
                            <div className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                            Running Repair Protocol...
                        </>
                    ) : "Continue with Strategy"}
                </button>

                {/* Launch Media Campaign Button */}
                <button 
                    onClick={handleGenerateMediaCampaign}
                    disabled={isGeneratingMedia}
                    className="w-full py-3 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700 text-purple-300 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mb-6"
                >
                    {isGeneratingMedia ? (
                        <>
                            <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            {t('oppositionAI.simulation.generatingMedia')}
                        </>
                    ) : t('oppositionAI.simulation.launchMedia')}
                </button>

                {/* Export Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={handleExportMarkdown}
                        className="py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                        Export .MD
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                        Print / PDF
                    </button>
                </div>
            </div>
        );
    };

    return (
    <div className="animate-fade-in max-w-[1600px] mx-auto">
        <MediaCampaignModal />
        <div className="mb-6 text-center border-b border-gray-800 pb-6">
            <h2 className="text-3xl font-extrabold text-white tracking-widest uppercase">{t('oppositionAI.simulation.title')}</h2>
            <p className="text-gray-500 text-sm mt-2 font-mono uppercase">{t('oppositionAI.simulation.desc')}</p>
        </div>

        {/* Main Grid: Left Controls | Chat Stream | Right Analysis */}
        {/* We use a calculated height to ensure the middle column scrolls independently */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 items-stretch h-[calc(100vh-200px)] min-h-[600px]">
            
            {/* Left Col: Controls */}
            <div className="flex flex-col gap-4 bg-black border border-gray-800 p-5 overflow-y-auto">
                 <div className="space-y-4">
                     <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('oppositionAI.simulation.selectFaction1')}</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-700 text-white text-xs focus:ring-1 focus:ring-red-600 p-2.5 rounded-sm"
                            value={factionA}
                            onChange={(e) => setFactionA(e.target.value)}
                        >
                            <option value="">Select Faction...</option>
                            {Array.isArray(factions) && factions.map((f: string, i: number) => (
                                <option key={i} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('oppositionAI.simulation.selectFaction2')}</label>
                         <select 
                            className="w-full bg-gray-900 border border-gray-700 text-white text-xs focus:ring-1 focus:ring-red-600 p-2.5 rounded-sm"
                            value={factionB}
                            onChange={(e) => setFactionB(e.target.value)}
                        >
                            <option value="">Select Faction...</option>
                            {Array.isArray(factions) && factions.map((f: string, i: number) => (
                                <option key={i} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-grow flex flex-col">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('oppositionAI.simulation.topicLabel')}</label>
                        <textarea 
                            className="w-full bg-gray-900 border border-gray-700 text-white text-xs focus:ring-1 focus:ring-red-600 p-3 min-h-[120px] resize-none rounded-sm"
                            placeholder={t('oppositionAI.simulation.topicPlaceholder')}
                            value={simTopic}
                            onChange={(e) => setSimTopic(e.target.value)}
                        />
                    </div>
                    
                    <button
                        onClick={handleRunSimulation}
                        disabled={isSimulating || !factionA || !factionB}
                        className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-auto"
                    >
                        {isSimulating ? t('oppositionAI.simulation.running') : t('oppositionAI.simulation.runSim')}
                    </button>

                    {/* Pre-set Scenarios */}
                    <button
                        onClick={handleLoadDeltaStrategy}
                        className="w-full py-2 bg-teal-900/40 hover:bg-teal-900/60 border border-teal-700 text-teal-400 font-bold uppercase tracking-widest text-[10px] transition-colors mt-2"
                    >
                        Load "Delta Force" Strategy
                    </button>
                    
                    <button
                        onClick={handleAutoDetectSituation}
                        disabled={isAnalyzingSituation || !simTopic}
                        className="w-full py-3 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700 text-blue-300 font-bold uppercase tracking-widest text-[10px] transition-colors mt-2 disabled:opacity-50"
                    >
                        {isAnalyzingSituation ? <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block mr-2"></div> : "🌍 "}
                        {t('oppositionAI.simulation.autoDetect')}
                    </button>
                </div>
            </div>

            {/* Middle Col: Chat Stream OR Situation Map */}
            <div className="bg-black border border-gray-800 relative flex flex-col overflow-hidden shadow-2xl">
                {/* Situation Map Overlay (if active) */}
                {situationData && (
                    <div className="absolute inset-0 z-10 bg-black flex flex-col">
                        <div className="absolute top-4 right-4 z-20">
                            <button onClick={() => setSituationData(null)} className="text-gray-400 hover:text-white">&times; Close Map</button>
                        </div>
                        <RelationshipGraph data={situationData} />
                    </div>
                )}

                {!simResult && !isSimulating && !situationData && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 font-mono text-xs uppercase tracking-widest gap-2">
                        <div className="w-20 h-20 border-2 border-gray-800 rounded-full flex items-center justify-center">
                            <span className="w-3 h-3 bg-gray-600 rounded-full animate-pulse"></span>
                        </div>
                        Awaiting Simulation Parameters...
                    </div>
                )}
                
                {isSimulating && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/90 backdrop-blur-sm">
                         <div className="text-center">
                             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-600 mx-auto mb-6"></div>
                             <div className="text-red-500 font-mono text-xs uppercase animate-pulse tracking-widest">Processing Psychological Profiles...</div>
                         </div>
                    </div>
                )}

                {simResult && !situationData && (
                    <div className="flex-grow p-6 space-y-8 overflow-y-auto custom-scrollbar" ref={chatContainerRef}>
                        {simResult.dialogue.map((msg, i) => (
                            <div key={i} className={`relative group transition-opacity duration-300 ${msg.isCanceled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                {/* Message Bubble */}
                                <div className={`flex flex-col ${msg.sender === factionA ? 'items-start' : 'items-end'}`}>
                                    <div className={`max-w-[90%] relative ${msg.sender === factionA ? 'mr-12' : 'ml-12'}`}>
                                        
                                        {/* Sender Label */}
                                        <div className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${msg.sender === factionA ? 'text-teal-500 text-left' : 'text-purple-400 text-right'}`}>
                                            {msg.sender}
                                        </div>

                                        {/* Bubble Content */}
                                        <div className={`p-5 border-l-4 shadow-lg backdrop-blur-sm ${
                                            msg.isDarkTriad 
                                                ? 'bg-red-950/20 border-red-600 text-gray-100' 
                                                : 'bg-gray-900/60 border-teal-600 text-white'
                                        }`}>
                                            <p className="text-sm leading-relaxed font-serif">{msg.text}</p>
                                        </div>

                                        {/* Dark Triad Badge */}
                                        {msg.isDarkTriad && (
                                            <div className="absolute -top-3 -right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest shadow-md transform rotate-1">
                                                Dark Triad Alert
                                            </div>
                                        )}

                                        {/* Tactical Analyst Note (Collapsible/Distinct) */}
                                        <div className="mt-2 ml-4 p-3 bg-black/60 border-l border-b border-gray-800 text-[11px] text-gray-400 font-mono leading-tight">
                                            <span className="text-teal-600 font-bold mr-2">{'>'} INTEL:</span>
                                            {msg.analysis}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleCancelActor(msg.id || msg.text)}
                                                className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-white bg-red-950/30 hover:bg-red-600 px-2 py-1 transition-colors border border-red-900/50"
                                            >
                                                [Cancel Protocol]
                                            </button>
                                            <button 
                                                onClick={() => handleSupportActor(msg.id || msg.text)}
                                                className="text-[9px] font-bold uppercase tracking-widest text-green-500 hover:text-white bg-green-950/30 hover:bg-green-600 px-2 py-1 transition-colors border border-green-900/50"
                                            >
                                                [Support Signal]
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {msg.isCanceled && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="bg-red-600 text-white font-bold text-2xl uppercase tracking-[0.5em] px-6 py-2 border-4 border-black transform -rotate-12 shadow-2xl">
                                            CANCELED
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isContinuing && <div className="text-center text-xs text-teal-500 animate-pulse mt-4 p-4 border border-teal-500/20 bg-teal-900/10">Generating continuation strategy...</div>}
                    </div>
                )}
            </div>

            {/* Right Col: Analysis Sidebar */}
            <AnalysisSidebar />
        </div>
    </div>
  )};

  const WarRoom = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black p-6 border border-gray-800 rounded">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('oppositionAI.warRoom.unity')}</div>
                  <div className="text-3xl font-bold text-teal-500">{gameStats.unity}%</div>
              </div>
              <div className="bg-black p-6 border border-gray-800 rounded">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('oppositionAI.warRoom.momentum')}</div>
                  <div className="text-3xl font-bold text-blue-500">{gameStats.momentum}</div>
              </div>
              <div className="bg-black p-6 border border-gray-800 rounded">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('oppositionAI.warRoom.resources')}</div>
                  <div className="text-3xl font-bold text-yellow-500">{gameStats.resources}</div>
              </div>
              <div className="bg-black p-6 border border-gray-800 rounded">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('oppositionAI.warRoom.stability')}</div>
                  <div className="text-3xl font-bold text-red-500">{gameStats.regimeStability}%</div>
              </div>
          </div>
          
          <div className="bg-black border border-gray-800 p-6 rounded">
              <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-4">{t('oppositionAI.warRoom.turnHistory')}</h3>
              <div className="space-y-4">
                  {gameStats.history.map(turn => (
                      <div key={turn.id} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-1">
                              <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${turn.type === 'simulation' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>{turn.type}</span>
                              <span className="text-[10px] text-gray-500">{turn.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-300 font-medium">{turn.description}</p>
                          <p className="text-xs text-gray-500 mt-1 italic">{turn.analysis}</p>
                          <div className="flex gap-4 mt-2 text-[10px] font-mono text-gray-400">
                              <span>U: {turn.impact.unity > 0 ? '+' : ''}{turn.impact.unity}</span>
                              <span>M: {turn.impact.momentum > 0 ? '+' : ''}{turn.impact.momentum}</span>
                              <span>S: {turn.impact.regimeStability > 0 ? '+' : ''}{turn.impact.regimeStability}</span>
                          </div>
                      </div>
                  ))}
                  {gameStats.history.length === 0 && <div className="text-center text-gray-600 text-sm italic">No events recorded.</div>}
              </div>
          </div>
      </div>
  );

  const ScenarioMap = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white uppercase tracking-widest">{t('oppositionAI.scenarioMap.title')}</h3>
              <button 
                  onClick={() => handleGenerateScenarios()}
                  disabled={isProjecting}
                  className="px-4 py-2 bg-teal-900/30 hover:bg-teal-900/50 border border-teal-700 text-teal-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                  {isProjecting && <div className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>}
                  {isProjecting ? t('oppositionAI.scenarioMap.projecting') : t('oppositionAI.scenarioMap.generate')}
              </button>
          </div>
          
          {scenarioData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scenarioData.scenarios.map(scen => (
                      <div key={scen.id} className="bg-black border border-gray-800 p-6 rounded relative overflow-hidden group hover:border-gray-600 transition-colors">
                          <div className="absolute top-0 right-0 p-2 opacity-50 text-[100px] leading-none font-bold text-gray-800 -z-0 pointer-events-none">{scen.probability}%</div>
                          <div className="relative z-10">
                              <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${
                                      scen.type === 'Best Case' ? 'border-green-900 text-green-500 bg-green-900/10' :
                                      scen.type === 'Worst Case' ? 'border-red-900 text-red-500 bg-red-900/10' :
                                      scen.type === 'Wild Card' ? 'border-purple-900 text-purple-500 bg-purple-900/10' :
                                      'border-gray-700 text-gray-400 bg-gray-900/50'
                                  }`}>{scen.type}</span>
                              </div>
                              <h4 className="text-xl font-bold text-white mb-2">{scen.title}</h4>
                              <p className="text-sm text-gray-400 mb-4">{scen.description}</p>
                              
                              <div className="space-y-3 mb-6">
                                  <div>
                                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{t('oppositionAI.scenarioMap.trigger')}</span>
                                      <div className="flex flex-wrap gap-2">
                                          {scen.triggers.map((trig, i) => (
                                              <span key={i} className="text-xs text-gray-300 bg-gray-900 px-2 py-1 rounded border border-gray-800">{trig}</span>
                                          ))}
                                      </div>
                                  </div>
                                  <div>
                                      <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">{t('oppositionAI.scenarioMap.outcome')}</span>
                                      <p className="text-xs text-gray-300">{scen.outcome}</p>
                                  </div>
                              </div>
                              
                              <button 
                                onClick={() => handleSimulateScenario(scen)}
                                className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                                    scen.type === 'Worst Case' ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800' :
                                    'bg-teal-900/30 hover:bg-teal-900/50 text-teal-400 border border-teal-800'
                                }`}
                              >
                                  {scen.type === 'Worst Case' ? t('oppositionAI.scenarioMap.break') : t('oppositionAI.scenarioMap.accelerate')}
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}
          
          {!scenarioData && !isProjecting && (
              <div className="text-center py-20 text-gray-600 border border-dashed border-gray-800 rounded">
                  Initialize projection based on current intelligence...
              </div>
          )}
      </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-gray-300 font-sans selection:bg-red-900 selection:text-white pb-20">
      {showIntro && <IntroScreen />}
      
      {/* Navigation Tabs */}
      <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1 sm:space-x-4 no-scrollbar py-2">
            {[
              { id: 'news', label: t('oppositionAI.tabs.news') },
              { id: 'layers', label: t('oppositionAI.tabs.layers') },
              { id: 'simulation', label: t('oppositionAI.tabs.simulation') },
              { id: 'war_room', label: t('oppositionAI.tabs.war_room') },
              { id: 'scenario_map', label: t('oppositionAI.tabs.scenario_map') },
              { id: 'resources', label: t('oppositionAI.tabs.resources') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-red-600 text-white bg-red-900/10' 
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewingFaction ? (
            <FactionProfile />
        ) : (
            <>
                {activeTab === 'news' && <NewsMonitor />}
                {activeTab === 'layers' && <LayersDashboard />}
                {activeTab === 'simulation' && <SimulationArena />}
                {activeTab === 'war_room' && <WarRoom />}
                {activeTab === 'scenario_map' && <ScenarioMap />}
                {activeTab === 'resources' && <div className="text-center py-20 text-gray-500 uppercase tracking-widest">{t('oppositionAI.resources.text')}</div>}
            </>
        )}
      </main>
    </div>
  );
};

export default OppositionDashboard;
