
// FIX: Corrected typo from GoogleGenerAI to GoogleGenAI
import { GoogleGenAI, Type } from "@google/genai";
import { marked } from 'marked';
import { PROMPTS } from '../constants';
import { 
    DeepDiveResult, 
    AnalysisInputs, 
    Language, 
    BriefingResult,
    BriefingDetails,
    DataVisualizationSuggestions,
    ExpertProfileSuggestions,
    PublicationOutletSuggestions,
    DetailedPublicationStrategy,
    TrendsResult,
    // FIX: Added missing types for unused MenuModal component.
    GeneratedMenu,
    MarketingCopy,
    CostAnalysisResult,
    YouTubeVideo,
    YouTubeSearchFilters,
    OppositionDashboardData,
    SimResult,
    ScrapedSource,
    GameStats,
    GameTurn,
    ScenarioMapData,
    OppositionLayer,
    OppositionMediaCampaign,
    SituationAnalysisResult,
    MediaAnalysisResult
} from '../types';

let ai: GoogleGenAI | null = null;
let cachedKey: string = '';

export const getApiKey = (): string => {
  const fromEnv = process.env.API_KEY;
  if (fromEnv) return fromEnv;
  try {
    const fromStorage = localStorage.getItem('kavosh_gemini_api_key');
    if (fromStorage) return fromStorage;
  } catch {}
  throw new Error('NO_API_KEY');
};

export const hasApiKey = (): boolean => {
  try { return !!(process.env.API_KEY || localStorage.getItem('kavosh_gemini_api_key')); }
  catch { return !!process.env.API_KEY; }
};

export const resetAiInstance = () => { ai = null; cachedKey = ''; };

const getAI = () => {
  const key = getApiKey();
  if (!ai || key !== cachedKey) {
    ai = new GoogleGenAI({ apiKey: key });
    cachedKey = key;
  }
  return ai;
};

export const analyzeTopic = async (
  inputs: AnalysisInputs,
  language: Language
): Promise<DeepDiveResult> => {
  const ai = getAI();

  const pointSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      icon: { type: Type.STRING, description: "A single emoji representing the point." }
    },
    required: ['name', 'description', 'icon']
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A compelling, SEO-friendly title for a potential article." },
      summary: { type: Type.STRING, description: "A one-paragraph summary of the analysis." },
      keyAngles: {
        type: Type.ARRAY,
        description: "An array of 3-4 distinct angles or narratives to approach the story.",
        items: pointSchema
      },
      talkingPoints: {
        type: Type.ARRAY,
        description: "An array of 3-4 primary talking points supporting the main narrative.",
        items: pointSchema
      },
      counterArguments: {
        type: Type.ARRAY,
        description: "An array of 2-3 potential counterarguments for balanced reporting.",
        items: pointSchema
      },
      disclaimer: { type: Type.STRING, description: "A brief, friendly disclaimer that this is an AI-generated analysis for brainstorming, not a substitute for fact-checking." }
    },
    required: ['title', 'summary', 'keyAngles', 'talkingPoints', 'counterArguments', 'disclaimer']
  };
  
  const userPrompt = `Please analyze the following topic: "${inputs.description}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [{ text: userPrompt }] },
    config: {
      systemInstruction: PROMPTS.topicDeepDive(language).systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generateDataVizSuggestions = async (
  analysis: DeepDiveResult,
  language: Language
): Promise<DataVisualizationSuggestions> => {
  const ai = getAI();

  const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      icon: { type: Type.STRING, description: "A single relevant emoji." },
      reasoning: { type: Type.STRING, description: "Reasoning for the suggestion." }
    },
    required: ['name', 'description', 'icon', 'reasoning']
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      primary: suggestionSchema,
      secondary: suggestionSchema,
    },
    required: ['primary', 'secondary']
  };
  
  const analysisSummary = `Title: ${analysis.title}, Summary: ${analysis.summary}`;
  const prompt = PROMPTS.dataVizSuggestionGenerator(language).replace('{analysis}', analysisSummary);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generateExpertSuggestions = async (
  analysis: DeepDiveResult,
  language: Language
): Promise<ExpertProfileSuggestions> => {
  const ai = getAI();

  const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
      archetype: { type: Type.STRING },
      icon: { type: Type.STRING, description: "A single relevant emoji." },
      expertise: { type: Type.STRING },
      theDynamic: { type: Type.STRING },
      reasoning: { type: Type.STRING }
    },
    required: ['archetype', 'icon', 'expertise', 'theDynamic', 'reasoning']
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      forAngle: suggestionSchema,
      againstAngle: suggestionSchema,
    },
    required: ['forAngle', 'againstAngle']
  };
  
  const analysisSummary = `Title: ${analysis.title}, Summary: ${analysis.summary}`;
  const prompt = PROMPTS.expertProfileGenerator(language).replace('{analysis}', analysisSummary);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generatePublicationSuggestions = async (
  analysis: DeepDiveResult,
  language: Language
): Promise<PublicationOutletSuggestions> => {
    const ai = getAI();

    const suggestionSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            icon: { type: Type.STRING, description: "A single relevant emoji." },
            reasoning: { type: Type.STRING, description: "The reason for the suggestion." },
        },
        required: ['name', 'description', 'icon', 'reasoning'],
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            primaryOutlet: suggestionSchema,
            secondaryOutlet: suggestionSchema,
        },
        required: ['primaryOutlet', 'secondaryOutlet'],
    };
    
    const analysisSummary = `Title: ${analysis.title}, Summary: ${analysis.summary}`;
    const prompt = PROMPTS.publicationOutletGenerator(language).replace('{analysis}', analysisSummary);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    return JSON.parse(response.text || '{}');
};

export const getPublicationStrategyDetails = async (
  analysis: DeepDiveResult,
  suggestions: PublicationOutletSuggestions,
  language: Language
): Promise<DetailedPublicationStrategy> => {
  const ai = getAI();
  
  const tacticSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      focus: { type: Type.STRING },
    },
    required: ['name', 'description', 'focus'],
  };

  const strategySchema = {
    type: Type.OBJECT,
    properties: {
      introduction: { type: Type.STRING },
      tactics: { type: Type.ARRAY, items: tacticSchema },
      strategicBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['introduction', 'tactics', 'strategicBenefits'],
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      primaryStrategy: strategySchema,
      secondaryStrategy: strategySchema,
    },
    required: ['primaryStrategy', 'secondaryStrategy'],
  };
  
  const analysisSummary = `Title: ${analysis.title}, Summary: ${analysis.summary}`;
  const prompt = PROMPTS.publicationStrategyGenerator(language)
    .replace('{analysis}', analysisSummary)
    .replace('{primaryName}', suggestions.primaryOutlet.name)
    .replace('{primaryDescription}', suggestions.primaryOutlet.description)
    .replace('{secondaryName}', suggestions.secondaryOutlet.name)
    .replace('{secondaryDescription}', suggestions.secondaryOutlet.description);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const generateThematicImagePrompt = async (
  analysis: DeepDiveResult,
  language: Language
): Promise<string> => {
    const ai = getAI();
    const analysisSummary = `Title: ${analysis.title}, Summary: ${analysis.summary}, Angles: ${analysis.keyAngles.map(t => t.name).join(', ')}`;
    const prompt = PROMPTS.thematicImagePromptGenerator(language).replace('{analysis}', analysisSummary);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return (response.text || '').trim();
};

export const generateThematicImage = async (
  prompt: string
): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed to return an image.");
    }
    const imageBytes = response.generatedImages[0].image?.imageBytes;
    if (!imageBytes) {
        throw new Error("Image generation failed to return image data.");
    }
    return imageBytes;
};


export const generateBriefing = async (
    description: string,
    details: BriefingDetails,
    language: Language
): Promise<BriefingResult> => {
    const ai = getAI();

    const takeawaySchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            relevance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            suggestedStep: { type: Type.STRING }
        },
        required: ['name', 'description', 'relevance', 'suggestedStep']
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            disclaimer: { type: Type.STRING },
            headlineSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyTakeaways: { type: Type.ARRAY, items: takeawaySchema },
            stakeholderAnalysis: { type: Type.STRING },
            marketImpactAnalysis: { type: Type.STRING },
            followUpQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['disclaimer', 'headlineSuggestions', 'keyTakeaways']
    };

    const prompt = `User's main description/text: "${description}".\nOptional context provided: ${JSON.stringify(details)}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: PROMPTS.newsBriefing(language),
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    try {
        return JSON.parse(response.text || '{}');
    } catch (e) {
        console.error("Failed to parse briefing response:", response.text);
        throw new Error("Received an invalid format from the AI.");
    }
};

export const getDeeperAnalysis = async (takeawayName: string, language: Language): Promise<string> => {
    const ai = getAI();
    const prompt = PROMPTS.deeperAnalysis(language).replace('{takeawayName}', takeawayName);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return marked(response.text || '') as string;
};

export const getAcademicAnalysis = async (takeawayName: string, language: Language): Promise<string> => {
    const ai = getAI();
    const prompt = PROMPTS.academicAnalysis(language).replace('{takeawayName}', takeawayName);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return marked(response.text || '') as string;
};

export const generateExecutiveSummary = async (analysis: BriefingResult, language: Language): Promise<string> => {
    const ai = getAI();
    const analysisSummary = `Headlines: ${analysis.headlineSuggestions.join(', ')}. Key Takeaways: ${analysis.keyTakeaways.map(t => `${t.name} (${t.description})`).join('; ')}.`;
    const prompt = PROMPTS.executiveSummaryGenerator(language).replace('{analysis}', analysisSummary);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || '';
};

export const findExperts = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || '';
};

export const findCurrentTrends = async (
  context: string,
  language: Language
): Promise<TrendsResult> => {
  const ai = getAI();
  const prompt = PROMPTS.findTrends(language, context);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    summary: marked(response.text || '') as string,
    sources: sources as unknown as import('../types').GroundingChunk[],
  };
};

function isBriefingResult(analysis: DeepDiveResult | BriefingResult): analysis is BriefingResult {
    return (analysis as BriefingResult).keyTakeaways !== undefined;
}

export const findYouTubeVideos = async (
  analysis: DeepDiveResult | BriefingResult,
  language: Language,
  filters: YouTubeSearchFilters
): Promise<YouTubeVideo[]> => {
  const ai = getAI();

  let analysisSummary: string;
  if (isBriefingResult(analysis)) {
      // New logic for BriefingResult
      const keywords = analysis.keyTakeaways.map(t => t.name).join(', ');
      analysisSummary = `Based on a news briefing with key takeaways like: ${keywords}`;
  } else {
      // Improved logic for DeepDiveResult
      const keyPoints = [
        ...analysis.keyAngles,
        ...analysis.talkingPoints,
        ...analysis.counterArguments,
      ].map(p => p.name).join(', ');
      analysisSummary = `Title: ${analysis.title}. Summary: ${analysis.summary}. Key concepts include: ${keyPoints}`;
  }


  const prompt = PROMPTS.findYouTubeVideos(language)
    .replace('{analysis}', analysisSummary)
    .replace('{filters}', JSON.stringify(filters));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  try {
    // The response text might be wrapped in markdown like ```json ... ```
    const jsonString = (response.text || '').replace(/^```json\s*/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(jsonString);
    
    // Basic validation to ensure it's an array of video objects
    if (Array.isArray(parsed) && parsed.every(item => item.videoId && item.title && item.description)) {
        return parsed;
    } else {
        console.warn("Parsed YouTube videos JSON has incorrect structure.", parsed);
        // If parsing succeeds but structure is wrong, return empty and let user retry.
        throw new Error("The AI returned data in an unexpected format. Please try again.");
    }
  } catch (e) {
    console.error("Failed to parse YouTube videos response as JSON:", e, "Raw response:", response.text);
    // If parsing fails, throw an error to be displayed to the user.
    throw new Error("The AI returned data in an unexpected format. Please try again.");
  }
};

// --- Opposition AI Services ---

export const generateOppositionDashboard = async (language: Language, location?: string): Promise<OppositionDashboardData> => {
  const ai = getAI();
  const prompt = PROMPTS.oppositionDashboard(language, location);

  // Always enable Google Search to ensure real-time news "scraping"
  // Added googleMaps to tools for better location grounding if available
  const tools = [{googleSearch: {}}, {googleMaps: {}}];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: tools,
      // responseMimeType: 'application/json', // REMOVED to fix INVALID_ARGUMENT error
    },
  });
  
  // Extract grounding chunks if available
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: ScrapedSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
      }));

  // Clean the text response before parsing as JSON, as the model might return markdown without responseMimeType
  let jsonString = (response.text || '').trim();
  
  // More robust stripping of markdown fences
  if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
  } else if (jsonString.includes('```')) {
      jsonString = jsonString.split('```')[1].split('```')[0].trim();
  }

  try {
      const data = JSON.parse(jsonString);
      
      // Attach sources to data if any were found
      if (sources.length > 0) {
          data.sources = sources;
      }
      return data;
  } catch (e) {
      console.error("Failed to parse OppositionDashboard JSON", e, jsonString);
      throw new Error("Failed to parse dashboard data.");
  }
};

export const getOppositionLayers = async (language: Language): Promise<{ layers: OppositionLayer[], tacticalMap: { [key: string]: string } }> => {
  const ai = getAI();
  const prompt = PROMPTS.detectOppositionLayers(language);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
      // responseMimeType: 'application/json' // Removing to be safe, parsing manually
    }
  });

  let jsonString = (response.text || '').trim();
  if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
  } else if (jsonString.includes('```')) {
      jsonString = jsonString.split('```')[1].split('```')[0].trim();
  }

  try {
      return JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse Opposition Layers JSON", e);
      throw new Error("Failed to detect layers.");
  }
};

export const runOppositionSimulation = async (
  faction1: string,
  faction2: string,
  topic: string,
  language: Language,
  aiPersonalityModifier?: string
): Promise<SimResult> => {
  const ai = getAI();
  let prompt = PROMPTS.oppositionSimulation(language)
    .replace('{faction1}', faction1)
    .replace('{faction2}', faction2)
    .replace('{topic}', topic);

  if (aiPersonalityModifier) {
    prompt = `${aiPersonalityModifier}\n\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      // responseMimeType: 'application/json', // Keep clean output
    },
  });
  
  // Simple JSON cleaning since we are asking for strict JSON
  let jsonString = (response.text || '').trim();
  if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
  } else if (jsonString.includes('```')) {
      jsonString = jsonString.split('```')[1].split('```')[0].trim();
  }

  try {
      return JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse simulation result", e);
      throw new Error("Simulation failed to produce valid data.");
  }
};

export const continueSimulation = async (
  history: string,
  strategy: string,
  language: Language,
  aiPersonalityModifier?: string
): Promise<SimResult> => {
  const ai = getAI();
  let prompt = PROMPTS.continueSimulation(language)
    .replace('{history}', history)
    .replace('{strategy}', strategy);

  if (aiPersonalityModifier) {
    prompt = `${aiPersonalityModifier}\n\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  let jsonString = (response.text || '').trim();
  if (jsonString.includes('```json')) {
      jsonString = jsonString.split('```json')[1].split('```')[0].trim();
  } else if (jsonString.includes('```')) {
      jsonString = jsonString.split('```')[1].split('```')[0].trim();
  }

  try {
      return JSON.parse(jsonString);
  } catch (e) {
      console.error("Failed to parse continued simulation result", e);
      throw new Error("Failed to continue simulation.");
  }
};

export const generateCompassionBridge = async (
  lastMessage: string,
  language: Language,
  aiPersonalityModifier?: string
): Promise<string> => {
  const ai = getAI();
  let prompt = PROMPTS.compassionBridge(language, lastMessage);
  
  if (aiPersonalityModifier) {
    prompt = `${aiPersonalityModifier}\n\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return marked(response.text || '') as string;
};

export const analyzeGameTurn = async (
  currentStats: GameStats,
  eventDescription: string,
  language: Language
): Promise<any> => {
  const ai = getAI();
  // Strip history to avoid token limits for the simple analysis prompt
  const statsSummary = JSON.stringify({
      unity: currentStats.unity,
      momentum: currentStats.momentum,
      resources: currentStats.resources,
      regimeStability: currentStats.regimeStability
  });
  
  const prompt = PROMPTS.gameTurnAnalysis(language, statsSummary, eventDescription);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return JSON.parse(response.text || '{}');
};

export const generateScenarioMap = async (
  context: string,
  language: Language
): Promise<ScenarioMapData> => {
  const ai = getAI();
  const prompt = PROMPTS.scenarioMap(language, context);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return JSON.parse(response.text || '{}');
};

export const generateOppositionMediaCampaign = async (
  factionA: string, 
  factionB: string, 
  topic: string, 
  commonGround: string[], 
  strategy: string,
  language: Language,
  aiPersonalityModifier?: string
): Promise<OppositionMediaCampaign> => {
  const ai = getAI();
  let prompt = PROMPTS.generateMediaCampaign(language, factionA, factionB, topic, commonGround, strategy);
  
  if (aiPersonalityModifier) {
    prompt = `${aiPersonalityModifier}\n\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return JSON.parse(response.text || '{}');
};

export const generateSituationalAnalysis = async (
  context: string,
  language: Language,
  aiPersonalityModifier?: string
): Promise<SituationAnalysisResult> => {
  const ai = getAI();
  let prompt = PROMPTS.situationalAnalysis(language, context);
  
  if (aiPersonalityModifier) {
    prompt = `${aiPersonalityModifier}\n\n${prompt}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return JSON.parse(response.text || '{}');
};


// --- YouTube Media Analyzer ---

export const analyzeYoutubeMedia = async (
  youtubeUrl: string,
  manualText: string,
  language: Language
): Promise<MediaAnalysisResult> => {
  const ai = getAI();

  const systemPrompt = `You are DIAGNOSTICA — an advanced AI media analyzer specialized in detecting empathy failures, narcissistic patterns, cognitive biases, and psychological manipulation in media content.

Analyze the provided content (YouTube video transcript or text) for:
1. Self-Focus / Narcissism patterns
2. Empathy bypass behaviors
3. Defensive communication
4. Cognitive justice failures
5. Transparency violations

Return a detailed JSON analysis with the following structure:
{
  "videoTitle": "title if identifiable",
  "summary": "2-3 sentence English summary of findings",
  "summaryFa": "2-3 sentence Farsi summary of findings (RTL)",
  "overallScore": 0-100 (100 = most empathetic/healthy),
  "metrics": {
    "selfFocusIndex": 0-100 (higher = more narcissistic self-focus),
    "empathyResponsiveness": 0-100 (higher = more empathetic),
    "defensivenessScale": 0-100 (higher = more defensive),
    "transparencyIndex": 0-100 (higher = more transparent/honest),
    "cognitiveJusticeIndex": 0-100 (higher = more cognitively fair)
  },
  "labels": ["list", "of", "detected", "behavior", "labels"],
  "errors": [
    {
      "code": "N-001",
      "category": "NARCISSISM|EMPATHY_BYPASS|DEFENSIVENESS|COMPLEXITY_WEAPON|INSIGHT",
      "severity": "high|medium|low",
      "description": "English description",
      "descriptionFa": "Persian description"
    }
  ],
  "fallacyCounts": [
    { "label": "Ad Hominem", "labelFa": "حمله شخصی", "count": 2 }
  ],
  "annotatedSegments": [
    {
      "text": "excerpt from content",
      "type": "normal|error|insight",
      "descriptionFa": "Persian annotation (if error or insight)",
      "errorCode": "N-001 (if error)"
    }
  ]
}

Key error codes:
- N-001: High self-reference density (narcissism)
- E-001: Empathy bypass (dismissing others' feelings)
- D-001: Defensive deflection
- C-001: Complexity weapon (using jargon to avoid accountability)
- T-001: Transparency failure
- I-001: Genuine insight moment (positive)

Be precise and analytical. Identify actual text patterns.`;

  let contents: any;

  if (manualText.trim()) {
    contents = `${systemPrompt}\n\nAnalyze this text:\n\n${manualText}`;
  } else {
    const videoIdMatch = youtubeUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch?.[1];

    if (!videoId) {
      throw new Error(language === 'fa' ? 'لینک یوتیوب معتبر نیست.' : 'Invalid YouTube URL.');
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

    contents = [
      {
        parts: [
          {
            fileData: {
              fileUri: canonicalUrl,
            }
          },
          { text: systemPrompt + '\n\nAnalyze the content of this YouTube video for empathy metrics and psychological patterns. Output only valid JSON.' }
        ]
      }
    ];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      responseMimeType: 'application/json',
    },
  });

  let jsonString = (response.text || '').trim();
  if (jsonString.includes('```json')) {
    jsonString = jsonString.split('```json')[1].split('```')[0].trim();
  } else if (jsonString.includes('```')) {
    jsonString = jsonString.split('```')[1].split('```')[0].trim();
  }

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse media analysis JSON', e, jsonString);
    throw new Error(language === 'fa' ? 'پردازش پاسخ ناموفق بود.' : 'Failed to parse analysis response.');
  }
};

// FIX: Dummy function to fix build error for unused MenuModal component
export const generateMarketingCopy = async (
  menu: GeneratedMenu,
  language: Language
): Promise<MarketingCopy> => {
  console.log('generateMarketingCopy called with:', menu, language);
  // This is a dummy implementation to satisfy the compiler for an unused component.
  return {
    instagramPost: "Dummy Instagram Post",
    facebookPost: "Dummy Facebook Post",
    slogans: ["Dummy Slogan 1", "Dummy Slogan 2"],
  };
};

// FIX: Dummy function to fix build error for unused MenuModal component
export const generateCostAnalysis = async (
  menu: GeneratedMenu,
  language: Language
): Promise<CostAnalysisResult> => {
  console.log('generateCostAnalysis called with:', menu, language);
  // This is a dummy implementation to satisfy the compiler for an unused component.
  return {
    items: [],
    disclaimer: "This is a dummy cost analysis."
  };
};
