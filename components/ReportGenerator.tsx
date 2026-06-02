
import React, { useState, useMemo } from 'react';
import { SavedReport, useLanguage, Page } from '../types';

interface SavedReportsPageProps {
  savedReports: SavedReport[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  setPage: (page: Page) => void;
}

const SavedReportsPage: React.FC<SavedReportsPageProps> = ({ savedReports, onRestore, onDelete, setPage }) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return savedReports;
    }

    const lowercasedQuery = searchQuery.toLowerCase();

    return savedReports.filter(report => {
      // 1. Check report name
      if (report.name.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }

      // 2. Check report content
      if (report.state.type === 'deep_dive') {
        const result = report.state.result;
        if (!result) return false;
        
        const { title, summary, keyAngles, talkingPoints, counterArguments } = result;
        if (title.toLowerCase().includes(lowercasedQuery) || summary.toLowerCase().includes(lowercasedQuery)) {
          return true;
        }
        const checkPoints = (points: { name: string; description: string }[]) =>
          points.some(p =>
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.description.toLowerCase().includes(lowercasedQuery)
          );
        if (checkPoints(keyAngles) || checkPoints(talkingPoints) || checkPoints(counterArguments)) {
          return true;
        }
      } else if (report.state.type === 'briefing') {
        const result = report.state.result;
        if (!result) return false;

        const { headlineSuggestions, keyTakeaways, stakeholderAnalysis, marketImpactAnalysis } = result;
        if (headlineSuggestions.some(h => h.toLowerCase().includes(lowercasedQuery))) return true;
        if (keyTakeaways.some(t =>
          t.name.toLowerCase().includes(lowercasedQuery) ||
          t.description.toLowerCase().includes(lowercasedQuery) ||
          t.suggestedStep.toLowerCase().includes(lowercasedQuery)
        )) return true;
        if (stakeholderAnalysis?.toLowerCase().includes(lowercasedQuery)) return true;
        if (marketImpactAnalysis?.toLowerCase().includes(lowercasedQuery)) return true;
      }

      return false;
    });
  }, [savedReports, searchQuery]);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('savedReportsPage.title')}
        </h1>
        <p className="mt-4 text-lg text-gray-300">{t('savedReportsPage.subtitle')}</p>
      </div>

      <div className="mt-12 max-w-4xl mx-auto">
        {savedReports.length > 0 && (
           <div className="mb-8 max-w-lg mx-auto">
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                  </div>
                  <input
                      type="search"
                      name="search-reports"
                      id="search-reports"
                      className="block w-full bg-gray-700/60 border border-gray-600 rounded-md py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 rtl:pl-3 rtl:pr-10"
                      placeholder="Search reports..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search saved reports"
                  />
              </div>
          </div>
        )}

        {filteredReports.length > 0 ? (
          <div className="space-y-6">
            {filteredReports.map(report => (
              <div key={report.id} className="bg-gray-800/50 border border-white/10 rounded-lg shadow-md p-4 animate-fade-in">
                <div className="flex justify-between items-start flex-wrap gap-2">
                   <div className="flex-grow">
                     <p className="text-lg font-semibold text-white truncate pr-2">{report.name}</p>
                     <div className="mt-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        report.type === 'deep_dive' 
                          ? 'bg-blue-900/70 text-blue-300' 
                          : 'bg-green-900/70 text-green-300'
                      }`}>
                        {report.type === 'deep_dive' ? t('savedReportsPage.analysisTypeFlavor') : t('savedReportsPage.analysisTypeCompatibility')}
                      </span>
                     </div>
                   </div>
                   <div className="flex-shrink-0 flex items-center space-x-2 self-center">
                     <button onClick={() => onRestore(report.id)} title={t('savedReportsPage.restore')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                     </button>
                     <button onClick={() => onDelete(report.id)} title={t('savedReportsPage.delete')} className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                     </button>
                   </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <time dateTime={new Date(report.timestamp).toISOString()}>
                    {t('savedReportsPage.savedOn')} {new Date(report.timestamp).toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')}
                  </time>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={searchQuery ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z"} />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-white">{searchQuery ? 'No Results Found' : t('savedReportsPage.emptyTitle')}</h3>
            <p className="mt-1 text-sm text-gray-400">{searchQuery ? `Your search for "${searchQuery}" did not match any reports.` : t('savedReportsPage.emptyText')}</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => searchQuery ? setSearchQuery('') : setPage('topic_deep_dive')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500"
              >
                {searchQuery ? 'Clear Search' : t('savedReportsPage.goBackButton')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedReportsPage;
