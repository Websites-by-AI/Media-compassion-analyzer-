
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, AnalysisInputs, DeepDiveResult, Point, DataVisualizationSuggestions, DataVizSuggestion, ExpertProfileSuggestions, ExpertSuggestion, PublicationOutletSuggestions, PublicationSuggestion, DetailedPublicationStrategy, PublicationStrategy, TrendsResult, YouTubeVideo, YouTubeSearchFilters } from '../types';
import * as geminiService from '../services/geminiService';

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

// --- Sub-Components defined at top level ---

const PointCard: React.FC<{ item: Point, color: string }> = ({ item, color }) => (
  <div className={`bg-gray-900/50 p-4 rounded-lg border border-white/10 flex items-start space-x-4 rtl:space-x-reverse h-full transition-transform hover:scale-105 hover:border-white/20`}>
    <span className="text-3xl mt-1">{item.icon}</span>
    <div>
      <h4 className={`font-semibold ${color}`}>{item.name}</h4>
      <p className="text-sm text-gray-400">{item.description}</p>
    </div>
  </div>
);

const DataVizCard: React.FC<{ suggestion: DataVizSuggestion, title: string }> = ({ suggestion, title }) => {
    const { t } = useLanguage();
    return (
        <div className="bg-gray-900/70 p-5 rounded-xl border border-white/10 flex flex-col h-full animate-fade-in">
            <div className="text-center mb-4">
                <span className="text-5xl">{suggestion.icon}</span>
                <h4 className="text-lg font-bold text-white mt-2">{suggestion.name}</h4>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">{title}</p>
            </div>
            <p className="text-sm text-gray-400 flex-grow">{suggestion.description}</p>
            <div className="mt-4 pt-4 border-t border-white/15">
                <h5 className="text-sm font-semibold text-gray-200 mb-2">{t('topicDeepDive.reasoning')}</h5>
                <p className="text-xs text-gray-400">{suggestion.reasoning}</p>
            </div>
        </div>
    );
};

const ExpertDossier: React.FC<{ suggestion: ExpertSuggestion, title: string }> = ({ suggestion, title }) => {
    const { t } = useLanguage();
    return (
      <div className="bg-gray-900/70 p-5 rounded-xl border border-purple-500/30 flex flex-col h-full animate-fade-in">
        <div className="text-center mb-4 pb-4 border-b border-purple-500/20">
            <span className="text-5xl">{suggestion.icon}</span>
            <h4 className="text-lg font-bold text-white mt-2">{suggestion.archetype}</h4>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">{title}</p>
        </div>
        <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{t('topicDeepDive.expertise')}</p>
              <p className="text-sm text-purple-300 font-medium">{suggestion.expertise}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{t('topicDeepDive.theDynamic')}</p>
              <p className="text-sm text-gray-300">{suggestion.theDynamic}</p>
            </div>
             <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{t('topicDeepDive.reasoning')}</p>
              <p className="text-sm text-gray-300">{suggestion.reasoning}</p>
            </div>
        </div>
      </div>
    );
};

const PublicationCard: React.FC<{ suggestion: PublicationSuggestion, title: string }> = ({ suggestion, title }) => {
    const { t } = useLanguage();
    return (
      <div className="bg-gray-900/70 p-5 rounded-xl border border-cyan-500/30 flex flex-col h-full animate-fade-in">
        <div className="text-center mb-4">
          <span className="text-5xl">{suggestion.icon}</span>
          <h4 className="text-lg font-bold text-white mt-2">{suggestion.name}</h4>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">{title}</p>
        </div>
        <p className="text-sm text-gray-400 flex-grow">{suggestion.description}</p>
        <div className="mt-4 pt-4 border-t border-white/15">
          <h5 className="text-sm font-semibold text-gray-200 mb-2">{t('topicDeepDive.reasoning')}</h5>
          <p className="text-xs text-gray-400">{suggestion.reasoning}</p>
        </div>
      </div>
    );
};

const StrategyDetailsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    details: DetailedPublicationStrategy | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: () => void;
    baseSuggestions: PublicationOutletSuggestions | null;
  }> = ({ isOpen, onClose, details, isLoading, error, onGenerate, baseSuggestions }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    const renderDetailsColumn = (title: string, data?: PublicationStrategy) => (
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-cyan-300">{title}</h4>
        {data ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h5 className="font-semibold text-gray-200 mb-2">{t('topicDeepDive.introduction')}</h5>
              <p className="text-sm text-gray-400">{data.introduction}</p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-200 mb-2">{t('topicDeepDive.techniques')}</h5>
              <div className="space-y-3">
                {data.tactics.map((tech, i) => (
                  <div key={i} className="bg-gray-900/50 p-3 rounded-md">
                    <p className="font-semibold text-white">{tech.name} <span className="text-xs font-normal text-gray-500">- {t('topicDeepDive.focus')}: {tech.focus}</span></p>
                    <p className="text-xs text-gray-400 mt-1">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
             <div>
              <h5 className="font-semibold text-gray-200 mb-2">{t('topicDeepDive.psychologicalBenefits')}</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                {data.strategicBenefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-cyan-500/30" onClick={e => e.stopPropagation()}>
          <header className="p-4 border-b border-cyan-500/20 flex justify-between items-center flex-shrink-0">
            <h3 className="text-lg font-semibold text-white">{t('topicDeepDive.intimacyDetailsModalTitle')}</h3>
            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          </header>
          <div className="p-6 overflow-y-auto">
            {!details && (
              <div className="text-center py-8">
                {isLoading ? (
                  <>
                    <div className="w-8 h-8 mx-auto border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
                    <p className="mt-3 text-gray-400">{t('topicDeepDive.generatingIntimacyDetails')}</p>
                  </>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  <button onClick={onGenerate} className="px-6 py-2.5 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition-colors">
                    {t('topicDeepDive.generatePublicationOutlet')}
                  </button>
                )}
              </div>
            )}
            {details && baseSuggestions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderDetailsColumn(baseSuggestions.primaryOutlet.name, details.primaryStrategy)}
                {renderDetailsColumn(baseSuggestions.secondaryOutlet.name, details.secondaryStrategy)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

interface ResultDisplayProps {
    result: DeepDiveResult;
    visualizations: DataVisualizationSuggestions | null;
    isGeneratingViz: boolean;
    vizError: string | null;
    handleGenerateVisualizations: () => void;
    expertSuggestions: ExpertProfileSuggestions | null;
    isGeneratingExperts: boolean;
    expertsError: string | null;
    handleGenerateExpertSuggestions: () => void;
    publicationSuggestions: PublicationOutletSuggestions | null;
    isGeneratingOutlets: boolean;
    outletsError: string | null;
    handleGeneratePublicationSuggestions: () => void;
    setIsStrategyModalOpen: (open: boolean) => void;
    thematicImage: string | null;
    isGeneratingImage: boolean;
    imageError: string | null;
    handleGenerateImage: () => void;
    trendsResult: TrendsResult | null;
    isFindingTrends: boolean;
    trendsError: string | null;
    handleFindTrends: () => void;
    youtubeVideos: YouTubeVideo[] | null;
    isFindingVideos: boolean;
    videosError: string | null;
    handleFindVideos: () => void;
    youtubeFilters: YouTubeSearchFilters;
    setYoutubeFilters: React.Dispatch<React.SetStateAction<YouTubeSearchFilters>>;
    onSave: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    result,
    visualizations,
    isGeneratingViz,
    vizError,
    handleGenerateVisualizations,
    expertSuggestions,
    isGeneratingExperts,
    expertsError,
    handleGenerateExpertSuggestions,
    publicationSuggestions,
    isGeneratingOutlets,
    outletsError,
    handleGeneratePublicationSuggestions,
    setIsStrategyModalOpen,
    thematicImage,
    isGeneratingImage,
    imageError,
    handleGenerateImage,
    trendsResult,
    isFindingTrends,
    trendsError,
    handleFindTrends,
    youtubeVideos,
    isFindingVideos,
    videosError,
    handleFindVideos,
    youtubeFilters,
    setYoutubeFilters,
    onSave
}) => {
    const { t } = useLanguage();

    return (
      <div className="animate-fade-in p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-white mt-2">{result.title}</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">{result.summary}</p>
        </div>
        
        {/* Content Grid */}
        <div className="space-y-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-white/20 pb-2">{t('topicDeepDive.keyAnglesTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.keyAngles.map((item, i) => <PointCard key={i} item={item} color="text-teal-300" />)}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-white/20 pb-2">{t('topicDeepDive.talkingPointsTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.talkingPoints.map((item, i) => <PointCard key={i} item={item} color="text-blue-300" />)}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b-2 border-white/20 pb-2">{t('topicDeepDive.counterArgumentsTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.counterArguments.map((item, i) => <PointCard key={i} item={item} color="text-yellow-300" />)}
              </div>
            </div>
        </div>
        
        {/* Data Visualization Section */}
        <div className="mt-10 pt-6 border-t border-dashed border-white/20">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">{t('topicDeepDive.dataVizTitle')}</h3>
                <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.dataVizSubtitle')}</p>
            </div>
            
            {!visualizations && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleGenerateVisualizations}
                        disabled={isGeneratingViz}
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
                    >
                         {isGeneratingViz ? t('topicDeepDive.generatingDataViz') : t('topicDeepDive.generateDataViz')}
                    </button>
                    {vizError && <p className="text-red-400 text-sm mt-3">{vizError}</p>}
                </div>
            )}
            
            {isGeneratingViz && (
                 <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-teal-400"></div>
                 </div>
            )}

            {visualizations && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DataVizCard suggestion={visualizations.primary} title={t('topicDeepDive.primaryViz')} />
                    <DataVizCard suggestion={visualizations.secondary} title={t('topicDeepDive.secondaryViz')} />
                </div>
            )}
        </div>
        
        {/* Expert Profiles Section */}
        <div className="mt-10 pt-6 border-t border-dashed border-white/20">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{t('topicDeepDive.expertProfilesTitle')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.expertProfilesSubtitle')}</p>
          </div>

          {!expertSuggestions && (
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerateExpertSuggestions}
                disabled={isGeneratingExperts}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
              >
                {isGeneratingExperts ? t('topicDeepDive.generatingExpertProfiles') : t('topicDeepDive.generateExpertProfiles')}
              </button>
              {expertsError && <p className="text-red-400 text-sm mt-3">{expertsError}</p>}
            </div>
          )}

          {isGeneratingExperts && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-purple-400"></div>
            </div>
          )}

          {expertSuggestions && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ExpertDossier suggestion={expertSuggestions.forAngle} title={t('topicDeepDive.forAngleTitle')} />
              <ExpertDossier suggestion={expertSuggestions.againstAngle} title={t('topicDeepDive.againstAngleTitle')} />
            </div>
          )}
        </div>
        
        {/* Publication Outlet Section */}
        <div className="mt-10 pt-6 border-t border-dashed border-white/20">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{t('topicDeepDive.publicationOutletTitle')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.publicationOutletSubtitle')}</p>
          </div>

          {!publicationSuggestions && (
            <div className="mt-6 text-center">
              <button
                onClick={handleGeneratePublicationSuggestions}
                disabled={isGeneratingOutlets}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
              >
                {isGeneratingOutlets ? t('topicDeepDive.generatingPublicationOutlet') : t('topicDeepDive.generatePublicationOutlet')}
              </button>
              {outletsError && <p className="text-red-400 text-sm mt-3">{outletsError}</p>}
            </div>
          )}

          {isGeneratingOutlets && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
            </div>
          )}

          {publicationSuggestions && (
            <>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <PublicationCard suggestion={publicationSuggestions.primaryOutlet} title={t('topicDeepDive.primaryOutletTitle')} />
                <PublicationCard suggestion={publicationSuggestions.secondaryOutlet} title={t('topicDeepDive.secondaryOutletTitle')} />
              </div>
              <div className="mt-6 text-center">
                  <button
                      onClick={() => setIsStrategyModalOpen(true)}
                      className="text-sm font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-800/50 hover:bg-cyan-800/80 px-5 py-2 rounded-lg transition-colors"
                  >
                      {t('topicDeepDive.viewIntimacyDetails')}
                  </button>
              </div>
            </>
          )}
        </div>
        
        {/* Thematic Visualization Section */}
        <div className="mt-10 pt-6 border-t border-dashed border-white/20">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white">{t('topicDeepDive.thematicImageTitle')}</h3>
            <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.thematicImageSubtitle')}</p>
          </div>

          {!thematicImage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-wait transition-colors"
              >
                {isGeneratingImage ? t('topicDeepDive.generatingThematicImage') : t('topicDeepDive.generateThematicImage')}
              </button>
              {imageError && <p className="text-red-400 text-sm mt-3">{imageError}</p>}
            </div>
          )}

          {isGeneratingImage && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
            </div>
          )}

          {thematicImage && (
            <div className="mt-6 animate-fade-in">
              <div className="aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl border-2 border-amber-400/50 p-1 bg-black">
                  <img src={thematicImage} alt="AI generated thematic visualization" className="w-full h-full object-cover rounded-md" />
              </div>
              <div className="text-center mt-4">
                  <a
                      href={thematicImage}
                      download={`${result?.title.replace(/\s/g, '_') || 'thematic'}_visualization.jpeg`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      {t('topicDeepDive.downloadImage')}
                  </a>
              </div>
            </div>
          )}
        </div>

        {/* Current Trends Section */}
        <div className="mt-10 pt-6 border-t border-dashed border-white/20">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">{t('topicDeepDive.findTrendsTitle')}</h3>
                <p className="text-sm text-gray-400 mt-1">{t('topicDeepDive.findTrendsSubtitle')}</p>
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={handleFindTrends}
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
                <label htmlFor="video-quality" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.quality')}</label>
                <select id="video-quality" name="quality" value={youtubeFilters.quality} onChange={(e) => setYoutubeFilters(f => ({...f, quality: e.target.value as YouTubeSearchFilters['quality']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyQuality')}</option>
                  <option value="hd">{t('topicDeepDive.videoFilters.hd')}</option>
                  <option value="4k">{t('topicDeepDive.videoFilters.fourK')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="video-date" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.uploadDate')}</label>
                <select id="video-date" name="uploadDate" value={youtubeFilters.uploadDate} onChange={(e) => setYoutubeFilters(f => ({...f, uploadDate: e.target.value as YouTubeSearchFilters['uploadDate']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyTime')}</option>
                  <option value="month">{t('topicDeepDive.videoFilters.lastMonth')}</option>
                  <option value="year">{t('topicDeepDive.videoFilters.thisYear')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="video-duration" className="block text-xs font-medium text-gray-400">{t('topicDeepDive.videoFilters.duration')}</label>
                <select id="video-duration" name="duration" value={youtubeFilters.duration} onChange={(e) => setYoutubeFilters(f => ({...f, duration: e.target.value as YouTubeSearchFilters['duration']}))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-white">
                  <option value="any">{t('topicDeepDive.videoFilters.anyDuration')}</option>
                  <option value="short">{t('topicDeepDive.videoFilters.short')}</option>
                  <option value="long">{t('topicDeepDive.videoFilters.long')}</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-center">
                <button
                    onClick={handleFindVideos}
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


        {/* Disclaimer & Save */}
        <div className="mt-10 pt-6 border-t border-white/10 space-y-4">
            <p className="text-xs text-gray-500 text-center">{result.disclaimer}</p>
            <button
              onClick={onSave}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
            >
              {t('topicDeepDive.saveAnalysis')}
            </button>
        </div>
      </div>
    );
};

interface TopicDeepDivePageProps {
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
  inputs: AnalysisInputs;
  setInputs: (value: React.SetStateAction<AnalysisInputs>) => void;
  isQuotaExhausted: boolean;
  analysisResult: DeepDiveResult | null;
  onSave: () => void;
}

const TopicDeepDivePage: React.FC<TopicDeepDivePageProps> = ({
  onAnalyze,
  isLoading,
  error,
  inputs,
  setInputs,
  isQuotaExhausted,
  analysisResult,
  onSave
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // State for Data Visualization
  const [visualizations, setVisualizations] = useState<DataVisualizationSuggestions | null>(null);
  const [isGeneratingViz, setIsGeneratingViz] = useState(false);
  const [vizError, setVizError] = useState<string | null>(null);

  // State for Expert Profiles
  const [expertSuggestions, setExpertSuggestions] = useState<ExpertProfileSuggestions | null>(null);
  const [isGeneratingExperts, setIsGeneratingExperts] = useState(false);
  const [expertsError, setExpertsError] = useState<string | null>(null);
  
  // State for Publication Outlets
  const [publicationSuggestions, setPublicationSuggestions] = useState<PublicationOutletSuggestions | null>(null);
  const [isGeneratingOutlets, setIsGeneratingOutlets] = useState(false);
  const [outletsError, setOutletsError] = useState<string | null>(null);
  
  // State for Publication Strategy
  const [detailedStrategy, setDetailedStrategy] = useState<DetailedPublicationStrategy | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState<string | null>(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

  // State for Thematic Image
  const [thematicImage, setThematicImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // State for Trends
  const [trendsResult, setTrendsResult] = useState<TrendsResult | null>(null);
  const [isFindingTrends, setIsFindingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  
  // State for YouTube Videos
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[] | null>(null);
  const [isFindingVideos, setIsFindingVideos] = useState(false);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [youtubeFilters, setYoutubeFilters] = useState<YouTubeSearchFilters>({
    quality: 'any',
    uploadDate: 'any',
    duration: 'any',
  });


  useEffect(() => {
    const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionImpl) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognitionImpl();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'fa' ? 'fa-IR' : 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInputs(prev => ({ ...prev, description: prev.description ? `${prev.description} ${finalTranscript.trim()}` : finalTranscript.trim() }));
      }
    };
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    }
    
    recognitionRef.current = recognition;
  }, [language, setInputs]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.description.trim()) {
      alert(t('topicDeepDive.validationError'));
      return;
    }
    // Reset all sub-states
    setVisualizations(null);
    setVizError(null);
    setExpertSuggestions(null);
    setExpertsError(null);
    setPublicationSuggestions(null);
    setOutletsError(null);
    setDetailedStrategy(null);
    setStrategyError(null);
    setThematicImage(null);
    setImageError(null);
    setTrendsResult(null);
    setTrendsError(null);
    setYoutubeVideos(null);
    setVideosError(null);
    onAnalyze();
  };

  const handleGenerateVisualizations = async () => {
    if (!analysisResult) return;
    setIsGeneratingViz(true);
    setVizError(null);
    try {
        const result = await geminiService.generateDataVizSuggestions(analysisResult, language);
        setVisualizations(result);
    } catch(err) {
        console.error("Failed to generate visualizations", err);
        setVizError("Sorry, couldn't generate suggestions. Please try again.");
    } finally {
        setIsGeneratingViz(false);
    }
  };
  
  const handleGenerateExpertSuggestions = async () => {
    if (!analysisResult) return;
    setIsGeneratingExperts(true);
    setExpertsError(null);
    try {
        const result = await geminiService.generateExpertSuggestions(analysisResult, language);
        setExpertSuggestions(result);
    } catch(err) {
        console.error("Failed to generate expert suggestions", err);
        setExpertsError("Sorry, couldn't generate profiles. Please try again.");
    } finally {
        setIsGeneratingExperts(false);
    }
  };
  
  const handleGeneratePublicationSuggestions = async () => {
    if (!analysisResult) return;
    setIsGeneratingOutlets(true);
    setOutletsError(null);
    try {
        const result = await geminiService.generatePublicationSuggestions(analysisResult, language);
        setPublicationSuggestions(result);
    } catch(err) {
        console.error("Failed to generate publication suggestions", err);
        setOutletsError("Sorry, couldn't generate outlet ideas. Please try again.");
    } finally {
        setIsGeneratingOutlets(false);
    }
  };

  const handleGenerateStrategyDetails = async () => {
    if (!analysisResult || !publicationSuggestions) return;
    setIsGeneratingStrategy(true);
    setStrategyError(null);
    setDetailedStrategy(null);
    try {
        const result = await geminiService.getPublicationStrategyDetails(analysisResult, publicationSuggestions, language);
        setDetailedStrategy(result);
    } catch(err) {
        console.error("Failed to generate strategy details", err);
        setStrategyError("Sorry, couldn't generate the details. Please try again.");
    } finally {
        setIsGeneratingStrategy(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!analysisResult) return;
    setIsGeneratingImage(true);
    setImageError(null);
    try {
        const imagePrompt = await geminiService.generateThematicImagePrompt(analysisResult, language);
        const imageBase64 = await geminiService.generateThematicImage(imagePrompt);
        setThematicImage(`data:image/jpeg;base64,${imageBase64}`);
    } catch(err) {
        console.error("Failed to generate thematic image", err);
        setImageError("Sorry, couldn't generate the image. The model might be busy. Please try again.");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleFindTrends = async () => {
    if (!analysisResult) return;
    setIsFindingTrends(true);
    setTrendsError(null);
    try {
        const result = await geminiService.findCurrentTrends(analysisResult.summary, language);
        setTrendsResult(result);
    } catch(err) {
        console.error("Failed to find trends", err);
        setTrendsError("Sorry, couldn't find current trends. Please try again.");
    } finally {
        setIsFindingTrends(false);
    }
  };
  
  const handleFindVideos = async () => {
    if (!analysisResult) return;
    setIsFindingVideos(true);
    setVideosError(null);
    setYoutubeVideos(null);
    try {
        const result = await geminiService.findYouTubeVideos(analysisResult, language, youtubeFilters);
        setYoutubeVideos(result);
    } catch(err) {
        console.error("Failed to find YouTube videos", err);
        setVideosError(err instanceof Error ? err.message : "Sorry, couldn't find related videos. Please try again.");
    } finally {
        setIsFindingVideos(false);
    }
  };

  return (
    <>
      <section id="topic-deep-dive" className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="xl:col-span-1 xl:sticky top-28">
            <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-white">{t('topicDeepDive.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">{t('topicDeepDive.descriptionLabel')}</label>
                    <button
                        type="button"
                        onClick={toggleListening}
                        title={isListening ? t('topicDeepDive.voiceInputStop') : t('topicDeepDive.voiceInputStart')}
                        className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                        disabled={!recognitionRef.current}
                    >
                        {isListening ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path d="M5.5 13a.5.5 0 01.5.5v1.5a4.5 4.5 0 009 0v-1.5a.5.5 0 011 0v1.5a5.5 5.5 0 01-11 0v-1.5a.5.5 0 01.5-.5z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm5 10.5a.5.5 0 01.5.5v.5a3.5 3.5 0 01-7 0v-.5a.5.5 0 01.5-.5h6zM5 8a1 1 0 011-1h1V6a1 1 0 112 0v1h1a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                  </div>
                  <textarea
                    id="description"
                    rows={10}
                    value={inputs.description}
                    onChange={(e) => setInputs({ description: e.target.value })}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
                    placeholder={t('topicDeepDive.descriptionPlaceholder')}
                  />
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">{t('topicDeepDive.sampleTitle')}</p>
                    <div className="flex flex-wrap gap-2">
                      {t('topicDeepDive.sampleTexts').map((sample: {label: string; value: string}, index: number) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setInputs({ description: sample.value })}
                          className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700/60 rounded-full hover:bg-gray-600/80 border border-gray-600 transition-colors"
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || isQuotaExhausted}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? t('topicDeepDive.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('topicDeepDive.buttonText')}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="xl:col-span-2">
            <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 min-h-[400px]">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('topicDeepDive.analysisTitle')}</h3>
                  {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
                          <p className="mt-4 text-gray-400">{t('topicDeepDive.generating')}</p>
                      </div>
                    ) : error ? (
                      <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>
                    ) : !analysisResult ? (
                      <div className="text-center py-10 text-gray-500">
                          <p>{t('topicDeepDive.placeholder')}</p>
                      </div>
                    ) : (
                      <ResultDisplay 
                        result={analysisResult} 
                        visualizations={visualizations}
                        isGeneratingViz={isGeneratingViz}
                        vizError={vizError}
                        handleGenerateVisualizations={handleGenerateVisualizations}
                        expertSuggestions={expertSuggestions}
                        isGeneratingExperts={isGeneratingExperts}
                        expertsError={expertsError}
                        handleGenerateExpertSuggestions={handleGenerateExpertSuggestions}
                        publicationSuggestions={publicationSuggestions}
                        isGeneratingOutlets={isGeneratingOutlets}
                        outletsError={outletsError}
                        handleGeneratePublicationSuggestions={handleGeneratePublicationSuggestions}
                        setIsStrategyModalOpen={setIsStrategyModalOpen}
                        thematicImage={thematicImage}
                        isGeneratingImage={isGeneratingImage}
                        imageError={imageError}
                        handleGenerateImage={handleGenerateImage}
                        trendsResult={trendsResult}
                        isFindingTrends={isFindingTrends}
                        trendsError={trendsError}
                        handleFindTrends={handleFindTrends}
                        youtubeVideos={youtubeVideos}
                        isFindingVideos={isFindingVideos}
                        videosError={videosError}
                        handleFindVideos={handleFindVideos}
                        youtubeFilters={youtubeFilters}
                        setYoutubeFilters={setYoutubeFilters}
                        onSave={onSave}
                      />
                    )}
                </div>
            </div>
          </div>
        </div>
      </section>
      <StrategyDetailsModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        details={detailedStrategy}
        isLoading={isGeneratingStrategy}
        error={strategyError}
        onGenerate={handleGenerateStrategyDetails}
        baseSuggestions={publicationSuggestions}
      />
    </>
  );
};

export default TopicDeepDivePage;
