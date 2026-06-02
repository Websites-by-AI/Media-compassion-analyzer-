
import React, { useState, useCallback, useRef } from 'react';
// FIX: Changed CompatibilityResult to BriefingResult to match the application's data types.
import { BriefingResult, useLanguage, Takeaway, TrendsResult, YouTubeVideo, YouTubeSearchFilters } from '../types';
// FIX: Renamed component to avoid confusion. It is now specific to Executive Summaries.
import ExecutiveSummaryPreview from './DoctorSummarySheet';

interface BriefingDisplayProps {
  analysis: BriefingResult | null;
  isLoading: boolean;
  error: string | null;
  onGetDeeperAnalysis: (takeawayName: string) => void;
  onGetAcademicAnalysis: (takeawayName: string) => void;
  onGenerateSummary: () => void;
  executiveSummary: string;
  isGeneratingSummary: boolean;
  summaryError: string | null;
  onFindExperts: (keywords: string[]) => void;
  onRequestResearch: (takeawayName: string) => void;
  onStartSimulation: () => void;
  onSave: () => void;
  onFindTrends: () => void;
  trendsResult: TrendsResult | null;
  isFindingTrends: boolean;
  trendsError: string | null;
  onFindVideos: () => void;
  youtubeVideos: YouTubeVideo[] | null;
  isFindingVideos: boolean;
  videosError: string | null;
  youtubeFilters: YouTubeSearchFilters;
  setYoutubeFilters: React.Dispatch<React.SetStateAction<YouTubeSearchFilters>>;
}

const RelevanceIndicator: React.FC<{ relevance: 'High' | 'Medium' | 'Low' }> = ({ relevance }) => {
    const { t } = useLanguage();
    const styles = {
        High: { color: 'bg-green-400', width: 'w-full', text: 'text-green-300' },
        Medium: { color: 'bg-yellow-400', width: 'w-2/3', text: 'text-yellow-300' },
        Low: { color: 'bg-red-400', width: 'w-1/3', text: 'text-red-300' },
    };
    const { color, width, text } = styles[relevance];
    return (
      <div className="flex flex-col items-end">
        <div className="w-24 bg-gray-700 rounded-full h-2">
            <div className={`${color} ${width} h-2 rounded-full`}></div>
        </div>
        <p className={`text-xs font-medium mt-1 ${text}`}>{relevance} {t('newsBriefing.relevance')}</p>
      </div>
    );
};


// FIX: Renamed component from AnalysisDisplay to BriefingDisplay and updated its logic.
const BriefingDisplay: React.FC<BriefingDisplayProps> = ({ 
  analysis, 
  isLoading, 
  error, 
  onGetDeeperAnalysis,
  onGetAcademicAnalysis,
  onGenerateSummary,
  executiveSummary,
  isGeneratingSummary,
  summaryError,
  onFindExperts,
  onRequestResearch,
  onStartSimulation,
  onSave,
  onFindTrends,
  trendsResult,
  isFindingTrends,
  trendsError,
  onFindVideos,
  youtubeVideos,
  isFindingVideos,
  videosError,
  youtubeFilters,
  setYoutubeFilters,
}) => {
  const { language, t } = useLanguage();
  const [copySuccess, setCopySuccess] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const [expandedTakeaway, setExpandedTakeaway] = useState<string | null>(null);
  const [academicAnalysisTakeaway, setAcademicAnalysisTakeaway] = useState<string | null>(null);
  const [summaryStyle, setSummaryStyle] = useState<'memo' | 'pressRelease'>('memo');


  const handleTakeawayToggle = (takeawayName: string) => {
    const isCurrentlyExpanded = expandedTakeaway === takeawayName;
    const targetTakeaway = analysis?.keyTakeaways.find(c => c.name === takeawayName);

    setExpandedTakeaway(isCurrentlyExpanded ? null : takeawayName);
    setAcademicAnalysisTakeaway(null); // Close academic view when toggling details

    if (!isCurrentlyExpanded && targetTakeaway && !targetTakeaway.details && !targetTakeaway.isLoadingDetails) {
        onGetDeeperAnalysis(takeawayName);
    }
  };

  const handleAcademicAnalysisToggle = (takeawayName: string) => {
      const isCurrentlyExpanded = academicAnalysisTakeaway === takeawayName;
      const targetTakeaway = analysis?.keyTakeaways.find(c => c.name === takeawayName);

      setAcademicAnalysisTakeaway(isCurrentlyExpanded ? null : takeawayName);
      setExpandedTakeaway(null); // Close details view when toggling academic

      if (!isCurrentlyExpanded && targetTakeaway && !targetTakeaway.furtherReading && !targetTakeaway.isLoadingFurtherReading) {
          onGetAcademicAnalysis(takeawayName);
      }
  };

    const copySummaryToClipboard = useCallback(() => {
        if (summaryRef.current) {
            const textToCopy = summaryRef.current.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopySuccess(t('newsBriefing.copySuccess'));
                setTimeout(() => setCopySuccess(''), 2000);
            });
        }
    }, [t]);

  const allLowRelevance = analysis && analysis.keyTakeaways.length > 0 && analysis.keyTakeaways.every(c => c.relevance === 'Low');

  return (
    <div className="p-6 sm:p-8 min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">{t('newsBriefing.analysisTitle')}</h3>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
          <span className={`${language === 'fa' ? 'mr-4' : 'ml-4'} text-gray-400`}>{t('newsBriefing.generating')}</span>
        </div>
      )}

      {error && !error.includes('(Quota Exceeded)') && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}

      {!isLoading && !analysis && !error && (
        <div className="text-center py-10 text-gray-500">
          <p>{t('newsBriefing.placeholder1')}</p>
          <p className="text-sm">{t('newsBriefing.placeholder2')}</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-8 animate-fade-in">
          {/* Disclaimer */}
          <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 text-sm" role="alert">
            <p>{analysis.disclaimer}</p>
          </div>

          {/* Headline Suggestions */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('newsBriefing.specialistsTitle')}</h4>
            <div className="flex flex-wrap gap-3">
              {analysis.headlineSuggestions.map((headline, index) => (
                <div key={index} className="px-4 py-2 bg-gray-700/60 rounded-lg border border-white/10">
                    <span className="text-gray-200 text-sm font-medium">{headline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('newsBriefing.conditionsTitle')}</h4>
            {allLowRelevance && (
                <div className="mb-4 p-4 bg-gray-700/50 border border-gray-600 text-gray-300 text-sm rounded-lg" role="alert">
                    <p>{t('newsBriefing.lowConfidenceFallback')}</p>
                </div>
            )}
            <div className="space-y-4">
              {analysis.keyTakeaways.map((takeaway: Takeaway) => (
                <div key={takeaway.name} className="bg-gray-900/50 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <h5 className="font-semibold text-white">{takeaway.name}</h5>
                      <p className="text-sm text-gray-400 mt-1">{takeaway.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                        <RelevanceIndicator relevance={takeaway.relevance} />
                    </div>
                  </div>
                  <p className="text-sm mt-3 text-cyan-300 bg-cyan-900/30 p-3 rounded-md">{language === 'fa' ? 'راهنمایی' : 'Guidance'}: {takeaway.suggestedStep}</p>

                  <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap gap-2">
                     <button
                        onClick={() => handleTakeawayToggle(takeaway.name)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                      >
                       {expandedTakeaway === takeaway.name ? t('newsBriefing.hideDetails') : t('newsBriefing.viewDetails')}
                     </button>
                      <button
                        onClick={() => handleAcademicAnalysisToggle(takeaway.name)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                      >
                       {academicAnalysisTakeaway === takeaway.name ? t('newsBriefing.hideDetails') : t('newsBriefing.academicAnalysisButton')}
                     </button>
                     {takeaway.relevance === 'Low' && (
                        <button
                            onClick={() => onRequestResearch(takeaway.name)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-yellow-800/70 hover:bg-yellow-700 text-yellow-200 transition-colors"
                        >
                            {t('newsBriefing.requestResearchButton')}
                        </button>
                     )}
                  </div>
                  
                  {/* Deeper Analysis Details */}
                   {expandedTakeaway === takeaway.name && (
                    <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-white/10 animate-fade-in">
                       {takeaway.isLoadingDetails && <p className="text-sm text-gray-400">{t('newsBriefing.loadingDetails')}</p>}
                       {takeaway.detailsError && <p className="text-sm text-red-400">{takeaway.detailsError}</p>}
                       {takeaway.details && <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: takeaway.details }} />}
                    </div>
                   )}
                   {/* Academic Analysis Details */}
                   {academicAnalysisTakeaway === takeaway.name && (
                    <div className="mt-4 p-4 bg-gray-900/70 rounded-md border border-white/10 animate-fade-in">
                       {takeaway.isLoadingFurtherReading && <p className="text-sm text-gray-400">{t('newsBriefing.loadingAcademicAnalysis')}</p>}
                       {takeaway.furtherReadingError && <p className="text-sm text-red-400">{takeaway.furtherReadingError}</p>}
                       {takeaway.furtherReading && <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: takeaway.furtherReading }} />}
                    </div>
                   )}
                </div>
              ))}
            </div>
          </div>

           {/* Stakeholder & Market Impact Section */}
            {(analysis.stakeholderAnalysis || analysis.marketImpactAnalysis) && (
                <div className="pt-8 border-t border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">{t('newsBriefing.careerSectionTitle')}</h3>
                    
                    {analysis.stakeholderAnalysis && (
                        <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-200 mb-3">{t('newsBriefing.currentJobAnalysisTitle')}</h4>
                            <blockquote className="p-4 bg-gray-900/50 border-l-4 border-teal-400 text-gray-300">
                                {analysis.stakeholderAnalysis}
                            </blockquote>
                        </div>
                    )}
                    
                    {analysis.marketImpactAnalysis && (
                        <div>
                             <h4 className="text-lg font-semibold text-gray-200 mb-4">{t('newsBriefing.jobSuggestionsTitle')}</h4>
                             <blockquote className="p-4 bg-gray-900/50 border-l-4 border-teal-400 text-gray-300">
                                {analysis.marketImpactAnalysis}
                            </blockquote>
                        </div>
                    )}
                </div>
            )}


          {/* Follow up questions */}
          {analysis.followUpQuestions && analysis.followUpQuestions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.732-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                   </svg>
                   <span>{t('newsBriefing.followUpTitle')}</span>
                </h4>
                <div className="space-y-3">
                    {analysis.followUpQuestions.map((q, i) => (
                        <p key={i} className="p-3 bg-gray-900/50 rounded-md text-sm text-gray-300 border-l-2 border-purple-400">{q}</p>
                    ))}
                </div>
              </div>
          )}

          {/* Generate Summary */}
          <div>
            <button
              onClick={onGenerateSummary}
              disabled={isGeneratingSummary}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isGeneratingSummary ? t('newsBriefing.generatingSummary') : t('newsBriefing.prepareSummaryButton')}
            </button>
          </div>
          
          {/* Interview Practice & Expert Finder CTA */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="p-6 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
                <h4 className="text-lg font-semibold text-purple-200">{t('expertFinder.title')}</h4>
                <p className="mt-2 text-sm text-purple-300/80 max-w-lg mx-auto">{t('expertFinder.subtitle')}</p>
                <button 
                  onClick={() => onFindExperts(analysis?.keyTakeaways.map(t => t.name) || [])}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-lg"
                >
                   <span>{t('newsBriefing.findSpecialistsButton')}</span>
                </button>
            </div>
          </div>
           <div className="mt-4">
            <div className="p-6 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
                <h4 className="text-lg font-semibold text-purple-200">{t('interviewSimulator.readyToPractice')}</h4>
                <p className="mt-2 text-sm text-purple-300/80 max-w-lg mx-auto">{t('interviewSimulator.practiceDescription')}</p>
                <button 
                  onClick={onStartSimulation}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span>{t('interviewSimulator.startSimulationButton')}</span>
                </button>
            </div>
          </div>


          {/* Executive Summary Display */}
          {(executiveSummary || summaryError) && (
             <div className="mt-6 animate-fade-in">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-200">{t('executiveSummaryPreview.title')}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{t('executiveSummaryPreview.style')}:</span>
                        <button
                            onClick={() => setSummaryStyle('memo')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${summaryStyle === 'memo' ? 'bg-teal-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >{t('executiveSummaryPreview.memo')}</button>
                        <button
                            onClick={() => setSummaryStyle('pressRelease')}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${summaryStyle === 'pressRelease' ? 'bg-teal-200 text-teal-900' : 'bg-gray-700 text-gray-300'}`}
                        >{t('executiveSummaryPreview.pressRelease')}</button>
                        <button
                            onClick={copySummaryToClipboard}
                            className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors ml-2"
                        >
                            {copySuccess || t('executiveSummaryPreview.copySummary')}
                        </button>
                    </div>
                </div>
                {summaryError && <p className="text-sm text-red-400 p-3 bg-red-900/30 rounded-md">{summaryError}</p>}
                {executiveSummary && (
                    <div className="overflow-hidden">
                        <ExecutiveSummaryPreview ref={summaryRef} summaryHtml={executiveSummary} styleMode={summaryStyle === 'memo' ? 'dark' : 'light'} />
                    </div>
                )}
             </div>
          )}

          {/* Current Trends Section */}
          <div className="mt-10 pt-6 border-t border-dashed border-white/20">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">{t('topicDeepDive.findTrendsTitle')}</h3>
                <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.findTrendsSubtitle')}</p>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={onFindTrends}
                    disabled={isFindingTrends}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
                >
                    {isFindingTrends ? t('topicDeepDive.findingTrends') : t('topicDeepDive.findTrendsButton')}
                </button>
                {trendsError && <p className="text-red-400 text-sm mt-3">{trendsError}</p>}
            </div>

            {isFindingTrends && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-indigo-400"></div>
                </div>
            )}

            {trendsResult && (
                <div className="mt-6 animate-fade-in space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">{t('topicDeepDive.trendsSummaryTitle')}</h4>
                        <div className="prose prose-sm prose-invert max-w-none bg-gray-900/50 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: trendsResult.summary }} />
                    </div>
                    
                    {trendsResult.sources && trendsResult.sources.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-200 mb-2">{t('topicDeepDive.trendsSourcesTitle')}</h4>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                {trendsResult.sources.map((source, index) => source.web && (
                                    <li key={index}>
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* YouTube Video Section */}
          <div className="mt-10 pt-6 border-t border-dashed border-white/20">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">{t('topicDeepDive.findVideosTitle')}</h3>
                <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.findVideosSubtitle')}</p>
            </div>
            <div className="mt-6 max-w-2xl mx-auto p-4 bg-gray-900/50 rounded-lg border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="video-quality-briefing" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.quality')}</label>
                <select id="video-quality-briefing" name="quality" value={youtubeFilters.quality} onChange={(e) => setYoutubeFilters(f => ({...f, quality: e.target.value as YouTubeSearchFilters['quality']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyQuality')}</option>
                  <option value="hd">{t('topicDeepDive.videoFilters.hd')}</option>
                  <option value="4k">{t('topicDeepDive.videoFilters.fourK')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="video-date-briefing" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.uploadDate')}</label>
                <select id="video-date-briefing" name="uploadDate" value={youtubeFilters.uploadDate} onChange={(e) => setYoutubeFilters(f => ({...f, uploadDate: e.target.value as YouTubeSearchFilters['uploadDate']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyTime')}</option>
                  <option value="month">{t('topicDeepDive.videoFilters.lastMonth')}</option>
                  <option value="year">{t('topicDeepDive.videoFilters.thisYear')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="video-duration-briefing" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.duration')}</label>
                <select id="video-duration-briefing" name="duration" value={youtubeFilters.duration} onChange={(e) => setYoutubeFilters(f => ({...f, duration: e.target.value as YouTubeSearchFilters['duration']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyDuration')}</option>
                  <option value="short">{t('topicDeepDive.videoFilters.short')}</option>
                  <option value="long">{t('topicDeepDive.videoFilters.long')}</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={onFindVideos}
                    disabled={isFindingVideos}
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
                >
                    {isFindingVideos ? t('topicDeepDive.findingVideos') : t('topicDeepDive.findVideosButton')}
                </button>
                {videosError && <p className="text-red-400 text-sm mt-3">{videosError}</p>}
            </div>
            {isFindingVideos && (
                <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-red-400"></div>
                </div>
            )}
            {youtubeVideos && youtubeVideos.length > 0 && (
                <div className="mt-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                    {youtubeVideos.map((video) => (
                        <a
                            key={video.videoId}
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900/50 p-4 rounded-lg border border-white/10 flex flex-col items-start space-y-3 transition-all duration-300 hover:bg-gray-800/80 hover:border-red-400/50 hover:-translate-y-1 group"
                        >
                            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                <img 
                                    src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} 
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="h-12 w-12 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white group-hover:text-red-300 transition-colors">{video.title}</h4>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
            {youtubeVideos && youtubeVideos.length === 0 && !isFindingVideos && (
                <div className="mt-6 text-center text-gray-500">
                    <p>No relevant videos were found. Try a different topic.</p>
                </div>
            )}
        </div>


          {/* Save Analysis Button */}
          <div className="mt-8 pt-8 border-t border-white/10">
              <button
                  onClick={onSave}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
              >
                  {t('topicDeepDive.saveAnalysis')}
              </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default BriefingDisplay;
