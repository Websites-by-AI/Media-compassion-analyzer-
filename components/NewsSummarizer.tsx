
import React, { useState, useCallback } from 'react';
import { useLanguage, BriefingResult, BriefingInputs, Takeaway, ExpertProfile, ConversationCoachState, TrendsResult, YouTubeVideo, YouTubeSearchFilters } from '../types';
import * as geminiService from '../services/geminiService';
import BriefingForm from './GeneratorForm';
import BriefingDisplay from './ReportDisplay';
import ResearchRequestModal from './GrantFinder';
import ExpertFinder from './LawyerFinder';
import InterviewCoach from './DatingSimulator';

const initialCoachState: ConversationCoachState = {
  chatHistory: [],
  isStreaming: false,
  isLoadingAnalysis: false,
  currentAnalysis: null,
  error: null,
  selectedPartnerId: 'economist', // Changed default persona
  activeGoal: null,
  practiceCount: 0,
  pathSuggestions: [],
  showPathSelectionScreen: false,
  activeTrainingPathId: null,
  activeScenarioId: null,
  activeDifficulty: null,
  completedScenarios: {},
};


type View = 'briefing' | 'expert_finder' | 'simulator';

interface NewsBriefingPageProps {
    handleApiError: (error: unknown) => string;
    isQuotaExhausted: boolean;
    inputs: BriefingInputs;
    setInputs: (value: React.SetStateAction<BriefingInputs>) => void;
    result: BriefingResult | null;
    isLoading: boolean;
    error: string | null;
    onAnalyze: () => void;
    onSave: () => void;
}

const NewsBriefingPage: React.FC<NewsBriefingPageProps> = ({ 
  handleApiError, 
  isQuotaExhausted,
  inputs,
  setInputs,
  result,
  isLoading,
  error,
  onAnalyze,
  onSave
}) => {
  const { language } = useLanguage();
  const [view, setView] = useState<View>('briefing');
  const [analysisResult, setAnalysisResult] = useState<BriefingResult | null>(result);

  // Deeper analysis state
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [researchTopic, setResearchTopic] = useState('');

  // Summary State
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Expert Finder State
  const [savedExperts, setSavedExperts] = useState<ExpertProfile[]>([]);
  const [keywords, setKeywords] = useState('');
  const [allExperts, setAllExperts] = useState<ExpertProfile[]>([]);
  const [triggerSearch, setTriggerSearch] = useState(false);
  
  // Interview Simulator State
  const [coachState, setCoachState] = useState<ConversationCoachState>(initialCoachState);

  // Trends State
  const [trendsResult, setTrendsResult] = useState<TrendsResult | null>(null);
  const [isFindingTrends, setIsFindingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  // YouTube Video State
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[] | null>(null);
  const [isFindingVideos, setIsFindingVideos] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [youtubeFilters, setYoutubeFilters] = useState<YouTubeSearchFilters>({
    quality: 'any',
    uploadDate: 'any',
    duration: 'any',
  });

  // Sync internal analysis result state with prop
  React.useEffect(() => {
    setAnalysisResult(result);
  }, [result]);


  const updateTakeawayDetails = (takeawayName: string, updates: Partial<Takeaway>) => {
    setAnalysisResult(prev => {
        if (!prev) return null;
        return {
            ...prev,
            keyTakeaways: prev.keyTakeaways.map(c => c.name === takeawayName ? {...c, ...updates} : c)
        };
    });
  };

  const handleGetDeeperAnalysis = useCallback(async (takeawayName: string) => {
    updateTakeawayDetails(takeawayName, { isLoadingDetails: true, detailsError: null });
    try {
        const details = await geminiService.getDeeperAnalysis(takeawayName, language);
        updateTakeawayDetails(takeawayName, { details, isLoadingDetails: false });
    } catch (err) {
        const errorMsg = handleApiError(err);
        updateTakeawayDetails(takeawayName, { detailsError: errorMsg, isLoadingDetails: false });
    }
  }, [language, handleApiError]);

  const handleGetAcademicAnalysis = useCallback(async (takeawayName: string) => {
    updateTakeawayDetails(takeawayName, { isLoadingFurtherReading: true, furtherReadingError: null });
    try {
        const furtherReading = await geminiService.getAcademicAnalysis(takeawayName, language);
        updateTakeawayDetails(takeawayName, { furtherReading, isLoadingFurtherReading: false });
    } catch (err) {
        const errorMsg = handleApiError(err);
        updateTakeawayDetails(takeawayName, { furtherReadingError: errorMsg, isLoadingFurtherReading: false });
    }
  }, [language, handleApiError]);
  
  const handleGenerateSummary = useCallback(async () => {
    if (!analysisResult) return;
    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      const summary = await geminiService.generateExecutiveSummary(analysisResult, language);
      setExecutiveSummary(summary);
    } catch (err) {
      setSummaryError(handleApiError(err));
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [analysisResult, language, handleApiError]);

  const handleRequestResearch = (topic: string) => {
    setResearchTopic(topic);
    setIsResearchModalOpen(true);
  };

  const handleFindTrends = useCallback(async () => {
    if (!analysisResult) return;
    setIsFindingTrends(true);
    setTrendsError(null);
    try {
        const summaryForTrends = analysisResult.keyTakeaways.map(t => t.name).join('. ');
        const result = await geminiService.findCurrentTrends(summaryForTrends, language);
        setTrendsResult(result);
    } catch (err) {
        setTrendsError(handleApiError(err));
    } finally {
        setIsFindingTrends(false);
    }
  }, [analysisResult, language, handleApiError]);
  
  const handleFindVideos = useCallback(async () => {
    if (!analysisResult) return;
    setIsFindingVideos(true);
    setVideosError(null);
    setYoutubeVideos(null);
    try {
        const result = await geminiService.findYouTubeVideos(analysisResult, language, youtubeFilters);
        setYoutubeVideos(result);
    } catch(err) {
        setVideosError(handleApiError(err) as string);
    } finally {
        setIsFindingVideos(false);
    }
  }, [analysisResult, language, handleApiError, youtubeFilters]);
  
  // --- Expert Finder Logic ---
  const handleFindExperts = (expertise: string[]) => {
      setKeywords(expertise.join(', '));
      setTriggerSearch(true);
      setView('expert_finder');
  };

  const handleSaveExpert = (expert: ExpertProfile) => {
      setSavedExperts(prev => [...prev, expert]);
  };
  const handleRemoveExpert = (expertToRemove: ExpertProfile) => {
      setSavedExperts(prev => prev.filter(p => p.id !== expertToRemove.id));
  };
  const handleClearAllSaved = () => {
      if (window.confirm("Are you sure you want to clear all saved expert contacts?")) {
          setSavedExperts([]);
      }
  };
  const handleNoteChange = (index: number, note: string) => {
      setSavedExperts(prev => prev.map((p, i) => i === index ? { ...p, notes: note } : p));
  };
  const handleExpertsFound = (experts: ExpertProfile[]) => {
      setAllExperts(experts);
  };
  const handleClearAllDbExperts = () => {
      setAllExperts([]);
  };

  const renderCurrentView = () => {
    switch (view) {
        case 'expert_finder':
            return (
                <div>
                    <button onClick={() => setView('briefing')} className="mb-8 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        Back to Briefing
                    </button>
                    <ExpertFinder
                        savedProviders={savedExperts}
                        onSaveProvider={handleSaveExpert}
                        onRemoveProvider={handleRemoveExpert}
                        onClearAllSaved={handleClearAllSaved}
                        onNoteChange={handleNoteChange}
                        keywords={keywords}
                        setKeywords={setKeywords}
                        handleApiError={handleApiError}
                        isQuotaExhausted={isQuotaExhausted}
                        allProviders={allExperts}
                        onProvidersFound={handleExpertsFound}
                        onClearAllDbProviders={handleClearAllDbExperts}
                        triggerSearch={triggerSearch}
                        onSearchTriggered={() => setTriggerSearch(false)}
                        briefingResult={analysisResult}
                    />
                </div>
            );
        case 'simulator':
            return (
                 <div>
                    <button onClick={() => setView('briefing')} className="mb-8 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        Back to Briefing
                    </button>
                    <InterviewCoach
                        state={coachState}
                        setState={setCoachState}
                        // Dummy functions for now
                        onSendMessage={() => {}}
                        onEndSession={() => {}}
                        onStartPractice={() => {}}
                        onNextPractice={() => {}}
                        onReset={() => {}}
                        onFullReset={() => {}}
                        activePath={null}
                        activeScenario={null}
                        onStartTrainingPath={() => {}}
                        onStartScenario={() => {}}
                        onExitTraining={() => {}}
                    />
                </div>
            )
        case 'briefing':
        default:
            return (
                 <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 items-start">
                    <div className="xl:col-span-2 xl:sticky top-28">
                    <BriefingForm
                        onAnalyze={onAnalyze}
                        isLoading={isLoading}
                        inputs={inputs}
                        setInputs={setInputs}
                        isQuotaExhausted={isQuotaExhausted}
                    />
                    </div>
                    <div className="xl:col-span-3 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10">
                        <BriefingDisplay
                            analysis={analysisResult}
                            isLoading={isLoading}
                            error={error}
                            onGetDeeperAnalysis={handleGetDeeperAnalysis}
                            onGetAcademicAnalysis={handleGetAcademicAnalysis}
                            onGenerateSummary={handleGenerateSummary}
                            executiveSummary={executiveSummary}
                            isGeneratingSummary={isGeneratingSummary}
                            summaryError={summaryError}
                            onFindExperts={handleFindExperts}
                            onRequestResearch={handleRequestResearch}
                            onStartSimulation={() => setView('simulator')}
                            onSave={onSave}
                            onFindTrends={handleFindTrends}
                            trendsResult={trendsResult}
                            isFindingTrends={isFindingTrends}
                            trendsError={trendsError}
                            onFindVideos={handleFindVideos}
                            youtubeVideos={youtubeVideos}
                            isFindingVideos={isFindingVideos}
                            videosError={videosError}
                            youtubeFilters={youtubeFilters}
                            setYoutubeFilters={setYoutubeFilters}
                        />
                    </div>
                </div>
            );
    }
  }


  return (
    <section id="news-briefing" className="py-12 sm:py-16 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentView()}
      </div>
      <ResearchRequestModal 
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
        topic={researchTopic}
      />
    </section>
  );
};

export default NewsBriefingPage;
