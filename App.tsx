
import React, { useState, useEffect, useCallback } from 'react';
import SiteHeader from './components/Header';
import HomePage from './components/Hero';
import TopicDeepDivePage from './components/LegalDrafter';
import NewsBriefingPage from './components/NewsSummarizer';
import SavedReportsPage from './components/ReportGenerator';
import SampleReportsPage from './components/GrantAdopter';
import SubscriptionPage from './components/InvestmentPage';
import HuggingFaceGuidePage from './components/HuggingFaceGuidePage';
import DeploymentGuidePage from './components/DeploymentGuidePage';
import OppositionDashboard from './components/OppositionDashboard';
import YoutubeAnalyzer from './components/YoutubeAnalyzer';
import SiteFooter from './components/Footer';
import QuotaErrorModal from './components/QuotaErrorModal';
import AuthModal from './components/AuthModal';

import { 
  useLanguage, 
  Page, 
  AnalysisInputs, 
  DeepDiveResult, 
  SavedReport,
  BriefingResult,
  BriefingInputs,
  BriefingDetails,
  User,
} from './types';
import * as geminiService from './services/geminiService';

const initialInputs: AnalysisInputs = {
  description: '',
};

const initialBriefingDetails: BriefingDetails = {
  sourceURL: '',
  keyFigures: '',
  specificQuestions: '',
  audience: '',
  tone: '',
};

const initialBriefingInputs: BriefingInputs = {
  description: '',
  details: initialBriefingDetails,
};

const REPORTS_STORAGE_KEY = 'kavosh-ai-reports';

const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [page, setPage] = useState<Page>('home');
  
  // State for Topic Deep Dive
  const [deepDiveInputs, setDeepDiveInputs] = useState<AnalysisInputs>(initialInputs);
  const [deepDiveResult, setDeepDiveResult] = useState<DeepDiveResult | null>(null);
  const [isAnalyzingTopic, setIsAnalyzingTopic] = useState(false);
  const [topicError, setTopicError] = useState<string | null>(null);

  // State for News Briefing
  const [briefingInputs, setBriefingInputs] = useState<BriefingInputs>(initialBriefingInputs);
  const [briefingResult, setBriefingResult] = useState<BriefingResult | null>(null);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  
  // State for Saved Reports
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Global State
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');


  const loadSavedReports = useCallback(() => {
    try {
        const reportsJson = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (reportsJson) {
            const reports: SavedReport[] = JSON.parse(reportsJson);
            setSavedReports(reports.sort((a, b) => b.timestamp - a.timestamp));
        }
    } catch (error) {
        console.error("Failed to load saved reports from localStorage", error);
    }
  }, []);

  useEffect(() => {
    loadSavedReports();
  }, [loadSavedReports]);
  
  const handleApiError = (error: unknown): string => {
    console.error("API Error:", error);
    if (error instanceof Error) {
        if (error.message.includes('429')) {
            setIsQuotaExhausted(true);
            return "API Quota Exceeded. Please try again later.";
        }
        // Return the specific error message from the API
        return error.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  // --- Auth Logic ---
  const handleLoginClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Simulating login with ${provider}`);
    // In a real app, you'd handle the OAuth flow here
    setCurrentUser({ name: 'News Editor' });
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  // --- Topic Deep Dive Logic ---
  const handleAnalyzeTopic = useCallback(async () => {
    setIsAnalyzingTopic(true);
    setTopicError(null);
    setDeepDiveResult(null);
    try {
      const result = await geminiService.analyzeTopic(deepDiveInputs, language);
      setDeepDiveResult(result);
    } catch (err) {
      setTopicError(handleApiError(err));
    } finally {
      setIsAnalyzingTopic(false);
    }
  }, [deepDiveInputs, language]);

  // --- News Briefing Logic ---
  const handleGenerateBriefing = useCallback(async () => {
    setIsGeneratingBriefing(true);
    setBriefingError(null);
    setBriefingResult(null);
    try {
      const result = await geminiService.generateBriefing(briefingInputs.description, briefingInputs.details, language);
      setBriefingResult(result);
    } catch (err) {
      setBriefingError(handleApiError(err));
    } finally {
      setIsGeneratingBriefing(false);
    }
  }, [briefingInputs, language]);


  // --- Saved Reports Logic ---
  const handleSaveDeepDive = () => {
    if (!deepDiveResult) return;
    const name = deepDiveResult.title || "Untitled Topic Deep Dive";
    
    const existing = savedReports.find(a => a.name === name);
    if (existing) {
      if (!window.confirm("A report with this name already exists. Overwrite it?")) {
        return;
      }
    }

    const newSavedReport: SavedReport = {
      id: existing?.id || self.crypto.randomUUID(),
      name: name,
      type: 'deep_dive',
      timestamp: Date.now(),
      state: {
        type: 'deep_dive',
        inputs: deepDiveInputs,
        result: deepDiveResult,
      },
    };
    
    const updatedReports = (existing
        ? savedReports.map(a => a.id === existing.id ? newSavedReport : a)
        : [...savedReports, newSavedReport]
    ).sort((a, b) => b.timestamp - a.timestamp);

    try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
        setSavedReports(updatedReports);
        alert(`Report "${name}" saved!`);
    } catch (error) {
        console.error("Could not save report to localStorage:", error);
        alert("Failed to save report. Storage might be full.");
    }
  };

  const handleSaveBriefing = () => {
    if (!briefingResult) return;
    const name = prompt(t('Give your briefing a name:'), t('savedReportsPage.untitledBriefing'));
    if (!name) return;

    const existing = savedReports.find(a => a.name === name);
    if (existing) {
        if (!window.confirm("A report with this name already exists. Overwrite it?")) {
            return;
        }
    }

    const newSavedReport: SavedReport = {
        id: existing?.id || self.crypto.randomUUID(),
        name: name,
        type: 'briefing',
        timestamp: Date.now(),
        state: {
            type: 'briefing',
            inputs: briefingInputs,
            result: briefingResult,
        },
    };
    
    const updatedReports = (existing
        ? savedReports.map(a => a.id === existing.id ? newSavedReport : a)
        : [...savedReports, newSavedReport]
    ).sort((a, b) => b.timestamp - a.timestamp);

    try {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
        setSavedReports(updatedReports);
        alert(`Report "${name}" saved!`);
    } catch (error) {
        console.error("Could not save report to localStorage:", error);
        alert("Failed to save report. Storage might be full.");
    }
  };

  const handleRestoreReport = (reportId: string) => {
    const reportToRestore = savedReports.find(a => a.id === reportId);
    if (!reportToRestore) return;

    // Reset all analysis states first
    setDeepDiveInputs(initialInputs);
    setDeepDiveResult(null);
    setBriefingInputs(initialBriefingInputs);
    setBriefingResult(null);

    if (reportToRestore.state.type === 'deep_dive') {
      setDeepDiveInputs(reportToRestore.state.inputs);
      setDeepDiveResult(reportToRestore.state.result);
      setPage('topic_deep_dive');
    } else if (reportToRestore.state.type === 'briefing') {
      setBriefingInputs(reportToRestore.state.inputs);
      setBriefingResult(reportToRestore.state.result);
      setPage('news_briefing');
    }
  };


  const handleDeleteReport = (reportId: string) => {
    if (window.confirm(t('savedReportsPage.deleteConfirm'))) {
        const updatedReports = savedReports.filter(a => a.id !== reportId);
        try {
            localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(updatedReports));
            setSavedReports(updatedReports);
        } catch (error) {
            console.error("Could not delete report from localStorage:", error);
            alert("Failed to delete report.");
        }
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'topic_deep_dive':
        return <TopicDeepDivePage
                  onAnalyze={handleAnalyzeTopic}
                  isLoading={isAnalyzingTopic}
                  error={topicError}
                  inputs={deepDiveInputs}
                  setInputs={setDeepDiveInputs}
                  isQuotaExhausted={isQuotaExhausted}
                  analysisResult={deepDiveResult}
                  onSave={handleSaveDeepDive}
                />;
      case 'news_briefing':
        return <NewsBriefingPage 
                  handleApiError={handleApiError} 
                  isQuotaExhausted={isQuotaExhausted}
                  inputs={briefingInputs}
                  // FIX: Pass the correct state setter 'setBriefingInputs' instead of the undefined 'setInputs'.
                  setInputs={setBriefingInputs}
                  result={briefingResult}
                  isLoading={isGeneratingBriefing}
                  error={briefingError}
                  onAnalyze={handleGenerateBriefing}
                  onSave={handleSaveBriefing}
                />;
      case 'saved_reports':
        return <SavedReportsPage
                  savedReports={savedReports}
                  onRestore={handleRestoreReport}
                  onDelete={handleDeleteReport}
                  setPage={setPage}
                />;
      case 'case_studies':
        return <SampleReportsPage />;
      case 'subscriptions':
        return <SubscriptionPage setPage={setPage} />;
      case 'hugging_face_guide':
        return <HuggingFaceGuidePage />;
      case 'deployment_guide':
        return <DeploymentGuidePage />;
      case 'opposition_ai':
        return <OppositionDashboard />;
      case 'youtube_analyzer':
        return <YoutubeAnalyzer />;
      case 'home':
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <SiteHeader 
        currentPage={page} 
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        user={currentUser}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={handleLogout}
      />
      <main>
        {renderPage()}
      </main>
      <SiteFooter />
      <QuotaErrorModal 
        isOpen={isQuotaExhausted} 
        onClose={() => setIsQuotaExhausted(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authModalMode}
        onSocialLogin={handleSocialLogin}
      />
    </div>
  );
};

export default App;
