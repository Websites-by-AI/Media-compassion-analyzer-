
// types.ts

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from './constants';

export type Language = 'en' | 'fa';
export type Page = 'home' | 'topic_deep_dive' | 'news_briefing' | 'saved_reports' | 'case_studies' | 'subscriptions' | 'hugging_face_guide' | 'deployment_guide' | 'opposition_ai' | 'youtube_analyzer';

export interface User {
  name: string;
  avatarUrl?: string;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = (key: string, replacements: { [key: string]: string } = {}): any => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    if (typeof result === 'string') {
      return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
        return acc.replace(new RegExp(`{${placeholder}}`, 'g'), value);
      }, result);
    }
    
    return result;
  };

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// --- Kavosh AI Types ---

export interface AnalysisInputs {
  description: string;
}

// --- Topic Deep Dive Types ---

export interface Point {
  name: string;
  description: string;
  icon: string; // Emoji
}

export interface DeepDiveResult {
  title: string;
  summary: string;
  keyAngles: Point[];
  talkingPoints: Point[];
  counterArguments: Point[];
  disclaimer: string;
}


// --- News Briefing Types ---
export interface BriefingDetails {
  sourceURL: string;
  keyFigures: string;
  specificQuestions: string;
  audience: string;
  tone: string;
}

export interface BriefingInputs {
  description: string;
  details: BriefingDetails;
}

export interface Takeaway {
  name: string;
  description: string;
  relevance: 'High' | 'Medium' | 'Low';
  suggestedStep: string; // Actionable insight for the editor
  details?: string;
  isLoadingDetails?: boolean;
  detailsError?: string | null;
  furtherReading?: string;
  isLoadingFurtherReading?: boolean;
  furtherReadingError?: string | null;
}

export interface DataPoint {
    title: string;
    icon: string;
    description: string;
}

export interface BriefingResult {
  disclaimer: string;
  headlineSuggestions: string[];
  keyTakeaways: Takeaway[];
  stakeholderAnalysis?: string;
  marketImpactAnalysis?: string;
  followUpQuestions?: string[];
}

// --- Saved Report Types ---

export type SavedReportState = {
  type: 'deep_dive';
  inputs: AnalysisInputs;
  result: DeepDiveResult | null;
} | {
  type: 'briefing';
  inputs: BriefingInputs;
  result: BriefingResult | null;
};

export interface SavedReport {
  id: string;
  name: string;
  type: 'deep_dive' | 'briefing';
  timestamp: number;
  state: SavedReportState;
}

// --- Grounding/Trends Types ---
export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: WebSource;
}

export interface TrendsResult {
  summary: string; // HTML content
  sources: GroundingChunk[];
}


// --- Repurposed Types ---

// Data Visualization Suggestions (was DatingPairings)
export interface DataVizSuggestion {
  name: string; // e.g., "Line Chart", "Bar Graph"
  description: string; // What data to plot
  icon: string; // emoji
  reasoning: string; // Why this visualization is effective
}
export interface DataVisualizationSuggestions {
  primary: DataVizSuggestion;
  secondary: DataVizSuggestion;
}

// Expert Profile Suggestions (was PartnerSuggestions)
export interface ExpertSuggestion {
    archetype: string; // e.g., "The Skeptical Economist", "The Optimistic Technologist"
    icon: string;
    expertise: string; // "Macroeconomics", "Solar Technology"
    theDynamic: string; // The role they play in the narrative
    reasoning: string; // Why their perspective is crucial
}
export interface ExpertProfileSuggestions {
    forAngle: ExpertSuggestion;
    againstAngle: ExpertSuggestion;
}

// Publication Outlet Suggestions (was PhysicalIntimacySuggestions)
export interface PublicationSuggestion {
    name: string; // e.g., "Opinion Piece", "Long-form Feature"
    description: string;
    icon: string;
    reasoning: string;
}
export interface PublicationOutletSuggestions {
    primaryOutlet: PublicationSuggestion;
    secondaryOutlet: PublicationSuggestion;
}

// Detailed Publication Strategy (was DetailedIntimacySuggestions)
export interface PublicationTactic {
    name: string;
    description: string;
    focus: string; // e.g., "Reader Engagement", "Establishing Authority"
}
export interface PublicationStrategy {
    introduction: string;
    tactics: PublicationTactic[];
    strategicBenefits: string[];
}
export interface DetailedPublicationStrategy {
    primaryStrategy: PublicationStrategy;
    secondaryStrategy: PublicationStrategy;
}


// --- Expert Finder Types (was MatchProfile) ---
export interface ExpertProfile {
  id: string;
  name: string;
  title: string; // e.g., "Chief Economist at FutureBank"
  institution: string;
  contact: string; // e.g., email or social media handle
  expertise: string;
  relevanceScore: number;
  notes?: string;
}

// --- Interview Simulator Types (was Dating Simulator) ---
export type Difficulty = 'easy' | 'hard';

export interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
  isCanceled?: boolean;
}

export interface InterviewAnalysisScores {
  clarity: number;
  probing: number;
  structure: number;
  confidence: number;
  [key: string]: number; // Allow other scores
}

export interface InterviewAnalysis {
  scores: InterviewAnalysisScores;
  strengths: string;
  areasForImprovement: string;
}

export interface PathSuggestion {
  pathId: string;
  reasoning: string;
}

export interface Goal {
  id:string;
  title: string;
  maxPractices: number;
}

export interface TrainingScenario {
  id: string;
  title: { en: string; fa: string };
  description: { en: string; fa:string };
  easy: {
    reward: { en: string; fa: string };
  };
  hard: {
    reward: { en: string; fa: string };
  };
}

export interface TrainingPath {
  id: string;
  title: { en: string; fa: string };
  description: { en: string; fa: string };
  scenarios: TrainingScenario[];
}

export interface ConversationCoachState {
  chatHistory: Message[];
  isStreaming: boolean;
  isLoadingAnalysis: boolean;
  currentAnalysis: InterviewAnalysis | null;
  error: string | null;
  selectedPartnerId: string; // now 'Expert Persona'
  activeGoal: Goal | null;
  practiceCount: number;
  pathSuggestions: PathSuggestion[];
  showPathSelectionScreen: boolean;
  activeTrainingPathId: string | null;
  activeScenarioId: string | null;
  activeDifficulty: Difficulty | null;
  completedScenarios: { [scenarioId: string]: Difficulty[] };
}

// --- Opposition AI Types ---

// AI Personality Themes for psychological approach
export type AIPersonalityTheme = 
  | 'strategic_warrior'    // Military precision, tactical analysis
  | 'feminine_power'       // Strong, nurturing, resistance-focused
  | 'emotional_intelligence' // Understanding, empathetic, strategic
  | 'compassion_bridge'    // Natalie Hudson method - mediation
  | 'light_triad';         // Altruistic, honest, empathetic

export interface AIPersonalityConfig {
  id: AIPersonalityTheme;
  name: { en: string; fa: string };
  description: { en: string; fa: string };
  icon: string;
  color: string;
  promptModifier: string;
}

export interface OppositionNewsItem {
  id: string;
  headline: string;
  source: string; // e.g., "NCRI", "IranIntl", "Reuters"
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  // New specific scoring metrics
  regimeImpact: number; // 0-100 (Impact on Regime)
  oppositionImpact: number; // 0-100 (Impact on Opposition)
  darkTriadScore: number; // 0-100 (How manipulative/chaotic is this event)
  relatedFactions: string[]; // e.g., ["Monarchists", "MEK"]
  timestamp: string;
}

export interface OppositionLayer {
  name: string; // Core, Mid, Outer
  description: string;
  factions: {
    name: string;
    alignment: number; // 0-100 (Unity Score)
    activity: 'High' | 'Medium' | 'Low';
    recentEvent?: string; // Specific scraped event title
  }[];
}

export interface ScrapedSource {
  title: string;
  uri: string;
}

export interface OppositionDashboardData {
  location?: string;
  unityScore: number;
  activeFactionsCount: number;
  layers: OppositionLayer[];
  newsFeed: OppositionNewsItem[];
  keyGroups: string[]; // e.g., "Rajavi Allies", "Poll-Driven Reformists"
  sources?: ScrapedSource[];
  tacticalMap?: { [key: string]: string }; // Map status e.g. { "Tehran": "Active" }
}

export interface SimMessage {
  id: string;
  sender: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  // Psychology Metrics
  darkTriadScore: number; // 0-100 (Narcissism, Machiavellianism, Psychopathy)
  lightTriadScore: number; // 0-100 (Empathy, Authenticity, Compassion)
  isDarkTriad: boolean; 
  analysis: string; // Expert psychological analysis of the text
  isCanceled?: boolean; // For "Cancel Culture" button state
}

export interface MediatorAnalysis {
  identifiedTrap: string; // e.g., "Power Struggle", "Victim Validation Trap"
  psychologicalInsight: string; // Deep text explaining the lack of compassion/narcissism trap
  suggestedBridge: string; // The "Natalie Hudson" style compassionate response
  jointAction: string; // A suggested action both parties could take
}

export interface IdeologyStats {
  economic: number; // 0 (State/Left) to 100 (Market/Right)
  social: number;   // 0 (Conservative) to 100 (Liberal/Progressive)
  method: number;   // 0 (Reform/Civil) to 100 (Revolution/Radical)
  structure: number; // 0 (Centralized) to 100 (Federal/Decentralized)
}

export interface SimResult {
  dialogue: SimMessage[];
  unityPotential: number; // 0-100
  overallDarkScore: number;
  overallLightScore: number;
  status: 'Toxic' | 'Constructive' | 'Neutral';
  conflictPoints: string[];
  commonGround: string[];
  psychologicalTrap: string;
  suggestedStrategy: string;
  mediatorConsole?: MediatorAnalysis;
  ideology?: {
    factionA: IdeologyStats;
    factionB: IdeologyStats;
  };
}

export interface OppositionMediaCampaign {
  instagramCaption: string;
  telegramPost: string;
  hashtags: string[];
  actionItems: string[];
}

// --- Game Strategy Types ---

export interface GameStats {
  unity: number;
  momentum: number;
  resources: number;
  regimeStability: number;
  turnCount: number;
  history: GameTurn[];
}

export interface GameTurn {
  id: string;
  type: 'simulation' | 'news_event';
  description: string;
  impact: {
    unity: number;
    momentum: number;
    regimeStability: number;
  };
  analysis: string; // Strategic advice
  timestamp: string;
}

// --- Scenario Map Types ---

export interface FutureScenario {
  id: string;
  title: string;
  type: 'Best Case' | 'Worst Case' | 'Status Quo' | 'Wild Card';
  probability: number; // 0-100
  description: string;
  triggers: string[]; // Events that trigger this
  outcome: string;
  relevantFactions?: string[]; // The factions most critical to this scenario (for simulation)
  strategicGoal?: string; // The suggested simulation goal (e.g. "Prevent this", "Accelerate this")
}

export interface ScenarioMapData {
  topic: string;
  scenarios: FutureScenario[];
  linkedNewsId?: string; // If generated from a news item
}

// --- Situation Analysis Types ---
export interface SituationNode {
  id: string;
  name: string;
  color: string;
  role: string;
}

export interface SituationEdge {
  from: string;
  to: string;
  type: 'conflict' | 'ally' | 'info';
}

export interface SituationAnalysisResult {
  sides: SituationNode[];
  relations: SituationEdge[];
}


// --- Unused component types for build ---
export interface ChangelogChange {
  type: 'new' | 'improvement' | 'fix';
  text: string;
}
export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    en: ChangelogChange[];
    fa: ChangelogChange[];
  };
}
// FIX: Added missing types for unused MenuModal component to resolve build errors.
export interface MenuItem {
  icon: string;
  name: string;
  description: string;
}
export interface GeneratedMenu {
  menuTitle: string;
  conceptDescription: string;
  drinkItems: MenuItem[];
  foodItems: MenuItem[];
  disclaimer: string;
}
export interface MarketingCopy {
  instagramPost: string;
  facebookPost: string;
  slogans: string[];
}
export interface CostAnalysisResult {
    items: {
        itemName: string;
        costOfIngredients: number;
        finalCostForCafe: number;
        sellingPriceToCustomer: number;
    }[];
    disclaimer: string;
}

// --- YouTube Video Finder Types ---
export interface YouTubeVideo {
  title:string;
  videoId: string;
  description: string;
}

export interface YouTubeSearchFilters {
  quality: 'any' | 'hd' | '4k';
  uploadDate: 'any' | 'month' | 'year';
  duration: 'any' | 'short' | 'long';
}
// Placeholder for RescueCampaign needed for the example provided
export interface RescueCampaign {
    instagramCaption: string;
    telegramPost: string;
    hashtags: string[];
    wishlistItems: string[];
}

// --- YouTube Media Analyzer Types ---
export interface MediaAnalysisMetrics {
  selfFocusIndex: number;        // 0-100 شاخص ایگو
  empathyResponsiveness: number; // 0-100 همدلی عاطفی
  defensivenessScale: number;    // 0-100 دفاعی‌گری
  transparencyIndex: number;     // 0-100 شفافیت
  cognitiveJusticeIndex: number; // 0-100 عدل شناختی
}

export interface MediaAnnotatedSegment {
  text: string;
  type: 'normal' | 'error' | 'insight';
  descriptionFa?: string;
  errorCode?: string;
}

export interface MediaFallacyCount {
  labelFa: string;
  label: string;
  count: number;
}

export interface MediaEmpathyError {
  code: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  descriptionFa: string;
  description: string;
}

export interface MediaAnalysisResult {
  videoTitle?: string;
  summaryFa: string;
  summary: string;
  metrics: MediaAnalysisMetrics;
  errors: MediaEmpathyError[];
  fallacyCounts: MediaFallacyCount[];
  annotatedSegments: MediaAnnotatedSegment[];
  labels: string[];
  overallScore: number; // 0-100 (100 = most empathetic)
}
