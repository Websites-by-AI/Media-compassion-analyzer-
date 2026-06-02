

import React, { useState, useCallback, useMemo, useEffect } from 'react';
// FIX: Changed generateMatches to findExperts
import { findExperts } from '../services/geminiService';
// FIX: Replaced dating-related types with expert finder types
import { ExpertProfile, BriefingResult } from '../types';
import { useLanguage } from '../types';
import { PROMPTS } from '../constants';

// FIX: Rewrote parser for expert profiles from markdown table
const parseProviderData = (markdown: string): ExpertProfile[] => {
    const profiles: ExpertProfile[] = [];
    const tableRows = markdown.split('\n').map(row => row.trim()).filter(row => row.startsWith('|') && row.endsWith('|'));

    if (tableRows.length < 2) return profiles;

    const headersRaw = tableRows.find(row => !row.includes('---'));
    const dataRows = tableRows.filter(row => !row.includes('---'));

    if (!headersRaw || dataRows.length === 0) return profiles;

    const headers = headersRaw.split('|').map(h => h.trim().toLowerCase()).slice(1, -1);
    
    // Mapping from expected headers (in English or Persian) to our object keys
    const headerMap: { [key in keyof ExpertProfile]?: number } = {};
    const keyMap: { [key in keyof ExpertProfile]: string[] } = {
        id: [], // will be generated
        name: ['name', 'نام'],
        title: ['title', 'عنوان'],
        institution: ['institution', 'موسسه'],
        contact: ['contact', 'contact (email)', 'اطلاعات تماس'],
        expertise: ['expertise', 'حوزه تخصص'],
        relevanceScore: ['relevance', 'relevance (%)', 'ارتباط'],
        notes: [],
    };

    headers.forEach((header, index) => {
        for (const key in keyMap) {
            const aliases = keyMap[key as keyof typeof keyMap];
            if (aliases && aliases.some(alias => header.includes(alias))) {
                headerMap[key as keyof typeof keyMap] = index;
                break;
            }
        }
    });
    
    dataRows.forEach(row => {
        try {
            const columns = row.split('|').map(col => col.trim()).slice(1, -1);
            if (columns.length < headers.length) return;

            const name = headerMap.name !== undefined ? columns[headerMap.name] : '';
            if (!name) return;
            
            const relevanceRaw = headerMap.relevanceScore !== undefined ? columns[headerMap.relevanceScore] : '0';
            const relevanceScore = parseInt(relevanceRaw.replace('%', '').trim() || '0', 10);
            
            profiles.push({
                id: `${name.replace(/\s/g, '-')}-${Date.now()}`,
                name,
                title: headerMap.title !== undefined ? columns[headerMap.title] : 'N/A',
                institution: headerMap.institution !== undefined ? columns[headerMap.institution] : 'N/A',
                contact: headerMap.contact !== undefined ? columns[headerMap.contact] : 'N/A',
                expertise: headerMap.expertise !== undefined ? columns[headerMap.expertise] : 'N/A',
                relevanceScore: isNaN(relevanceScore) ? 0 : relevanceScore,
            });
        } catch (e) {
            console.error("Error parsing expert row:", row, e);
        }
    });

    return profiles;
};

interface ExpertFinderProps {
  savedProviders: ExpertProfile[];
  onSaveProvider: (provider: ExpertProfile) => void;
  onRemoveProvider: (provider: ExpertProfile) => void;
  onClearAllSaved: () => void;
  onNoteChange: (index: number, note: string) => void;
  keywords: string;
  setKeywords: (value: React.SetStateAction<string>) => void;
  handleApiError: (err: unknown) => string;
  isQuotaExhausted: boolean;
  allProviders: ExpertProfile[];
  onProvidersFound: (providers: ExpertProfile[]) => void;
  onClearAllDbProviders: () => void;
  triggerSearch: boolean;
  onSearchTriggered: () => void;
  briefingResult: BriefingResult | null;
}

type SortKey = 'relevanceScore' | 'institution' | 'name';

// FIX: Renamed component from MatchFinder to ExpertFinder
const ExpertFinder: React.FC<ExpertFinderProps> = ({ 
    savedProviders,
    onSaveProvider,
    onRemoveProvider,
    onClearAllSaved,
    onNoteChange,
    keywords,
    setKeywords,
    handleApiError,
    isQuotaExhausted,
    allProviders,
    onProvidersFound,
    onClearAllDbProviders,
    triggerSearch,
    onSearchTriggered,
    briefingResult,
}) => {
    const { language, t } = useLanguage();
    const [maxResults, setMaxResults] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [rawTextResult, setRawTextResult] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('relevanceScore');
    
    // Filter State
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [filterText, setFilterText] = useState<string>('');
    const [filterRelevance, setFilterRelevance] = useState<[number, number]>([0, 100]);


    const handleSearch = useCallback(async () => {
        if (!briefingResult) {
            setError(t('expertFinder.validationError'));
            return;
        }
        setError(null);
        setRawTextResult(null);
        setIsLoading(true);
        onProvidersFound([]);

        // FIX: Updated prompt logic to be for expert finding
        const summary = briefingResult.headlineSuggestions.join(' ') + " " + briefingResult.keyTakeaways.map(t => t.name).join(', ');
        const prompt = PROMPTS.expertFinder
            .replace('{briefing_summary}', summary)
            .replace('{expertise}', keywords)
            .replace('{maxResults}', maxResults.toString());

        try {
            // FIX: Changed function call from generateMatches to findExperts
            const resultText = await findExperts(prompt);
            const parsed = parseProviderData(resultText);
            
            if (parsed.length > 0) {
                onProvidersFound(parsed);
            } else {
                if (resultText) {
                    setRawTextResult(resultText);
                    setError(t('expertFinder.parseErrorTitle'));
                }
            }
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally { setIsLoading(false); }
    }, [briefingResult, maxResults, t, handleApiError, onProvidersFound, keywords]);
    
    useEffect(() => {
      if (triggerSearch) {
        handleSearch();
        onSearchTriggered(); // Reset the trigger in the parent component
      }
    }, [triggerSearch, handleSearch, onSearchTriggered]);

    const isProviderSaved = useCallback((provider: ExpertProfile): boolean => {
        return savedProviders.some(p => p.id === provider.id);
    }, [savedProviders]);
    
    const handleResetFilters = () => {
        setFilterText('');
        setFilterRelevance([0, 100]);
    };


    const filteredAndSortedProviders = useMemo(() => {
        const filtered = allProviders.filter(provider => {
            // Relevance score filter
            if ((provider.relevanceScore ?? 0) < filterRelevance[0] || (provider.relevanceScore ?? 0) > filterRelevance[1]) {
                return false;
            }

            // Text filter (name, institution, expertise)
            if (filterText) {
                const searchText = filterText.toLowerCase();
                const inName = provider.name.toLowerCase().includes(searchText);
                const inInstitution = provider.institution.toLowerCase().includes(searchText);
                const inExpertise = provider.expertise.toLowerCase().includes(searchText);
                if (!inName && !inInstitution && !inExpertise) {
                    return false;
                }
            }

            return true;
        });

        return [...filtered].sort((a, b) => {
            switch (sortKey) {
                case 'relevanceScore': return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
                case 'institution': return (a.institution ?? '').localeCompare(b.institution ?? '');
                case 'name': return (a.name ?? '').localeCompare(b.name ?? '');
                default: return 0;
            }
        });
    }, [allProviders, sortKey, filterText, filterRelevance]);

    return (
        <section id="expert-finder" className="py-12 sm:py-16 space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">{t('expertFinder.title')}</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('expertFinder.subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10 space-y-6">
                <div>
                    <label htmlFor="max-results" className="block text-sm font-medium text-gray-300">{t('expertFinder.maxResults')} ({maxResults})</label>
                    <input id="max-results" type="range" min="3" max="15" step="1" value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))}
                        className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500" />
                </div>
                <div>
                    <button onClick={handleSearch} disabled={isLoading || !briefingResult || isQuotaExhausted}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? t('expertFinder.finding') : isQuotaExhausted ? t('quotaErrorModal.title') : t('expertFinder.findButton')}
                    </button>
                    {!briefingResult && <p className="text-xs text-center mt-2 text-yellow-400">{t('expertFinder.validationError')}</p>}
                </div>
            </div>
            
            {savedProviders.length > 0 && (
                <div className="mt-12 space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">{t('expertFinder.savedTitle')}</h3>
                        <button onClick={onClearAllSaved} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('expertFinder.clearAll')}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedProviders.map((provider, index) => (
                            <div key={`${provider.id}-${index}`} className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-white/10 p-6 flex flex-col">
                                <h4 className="text-lg font-bold text-teal-300">{provider.name}</h4>
                                <p className="text-sm text-gray-400">{provider.title} at {provider.institution}</p>
                                
                                <div className="text-sm text-gray-300 space-y-2 mt-4 pt-4 border-t border-white/10">
                                    <p><strong>{t('expertFinder.expertise')}:</strong> {provider.expertise}</p>
                                    <p><strong>{t('expertFinder.contact')}:</strong> {provider.contact}</p>
                                    <p><strong>{t('expertFinder.relevance')}:</strong> <span className="font-bold text-teal-300">{provider.relevanceScore}%</span></p>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-white/10 flex-grow">
                                    <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-300 mb-2">{t('expertFinder.notesLabel')}</label>
                                    <textarea id={`notes-${index}`} rows={3}
                                        className="w-full h-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white transition-colors"
                                        placeholder={t('expertFinder.notesPlaceholder')} value={provider.notes || ''} onChange={(e) => onNoteChange(index, e.target.value)} />
                                </div>
                                <div className="mt-6">
                                     <button onClick={() => onRemoveProvider(provider)} className="w-full text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">{t('expertFinder.remove')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{t('expertFinder.crateTitle')}</h3>
                        <p className="text-sm text-gray-400">{t('expertFinder.crateSubtitle')}</p>
                    </div>
                    {allProviders.length > 0 &&
                        <button onClick={onClearAllDbProviders} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('expertFinder.clearCrate')}</button>
                    }
                </div>

                {isLoading && (
                    <div className="text-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-teal-400 mx-auto"></div></div>
                )}
                {error && !error.includes('(Quota Exceeded)') && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                
                {!isLoading && (
                    <div className="space-y-6">
                        {/* Filters Section */}
                        {allProviders.length > 0 && (
                             <div className="bg-gray-800/30 p-4 rounded-lg border border-white/10">
                                <button onClick={() => setShowFilters(!showFilters)} className="w-full flex justify-between items-center text-left font-semibold text-white">
                                    <span>{t('expertFinder.filters.title')}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {showFilters && (
                                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fade-in">
                                        {/* Text Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('expertFinder.filters.nameInstitutionExpertise')}</label>
                                            <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="Type to filter..." className="w-full bg-gray-900 border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        {/* Relevance Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">{t('expertFinder.filters.relevanceRange')}</label>
                                            <div className="flex items-center gap-2">
                                                <input type="number" min="0" max="100" value={filterRelevance[0]} onChange={e => setFilterRelevance(v => [Number(e.target.value), v[1]])} className="w-full bg-gray-900 border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:ring-teal-500 focus:border-teal-500" />
                                                <span className="text-gray-400">-</span>
                                                <input type="number" min="0" max="100" value={filterRelevance[1]} onChange={e => setFilterRelevance(v => [v[0], Number(e.target.value)])} className="w-full bg-gray-900 border-gray-600 rounded-md py-2 px-3 text-sm text-white focus:ring-teal-500 focus:border-teal-500" />
                                            </div>
                                        </div>
                                        {/* Reset Button */}
                                        <button onClick={handleResetFilters} className="w-full mt-2 py-2 text-sm text-center text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md">{t('expertFinder.filters.reset')}</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {filteredAndSortedProviders.length > 0 ? (
                            <>
                                <div className="flex justify-end">
                                    <label htmlFor="sort-key" className="text-sm text-gray-400 self-center mr-2">{t('expertFinder.rankBy')}:</label>
                                    <select id="sort-key" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                                        className="bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white">
                                        <option value="relevanceScore">{t('expertFinder.sort.relevance')}</option>
                                        <option value="institution">{t('expertFinder.sort.institution')}</option>
                                        <option value="name">{t('expertFinder.sort.name')}</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredAndSortedProviders.map((provider) => (
                                        <div key={provider.id} className="bg-gray-800/50 rounded-lg p-6 flex flex-col border border-white/10">
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-lg font-bold text-teal-300 truncate" title={provider.name}>{provider.name}</h4>
                                                    <span className="text-sm font-bold text-teal-300 bg-teal-900/50 px-3 py-1 rounded-full">{provider.relevanceScore}%</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-3">{provider.title} at {provider.institution}</p>
                                                <div className="space-y-2 text-sm">
                                                    <p><strong className="text-gray-300">{t('expertFinder.expertise')}:</strong> {provider.expertise}</p>
                                                    <p><strong className="text-gray-300">{t('expertFinder.contact')}:</strong> {provider.contact}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-end">
                                                <button onClick={() => onSaveProvider(provider)} disabled={isProviderSaved(provider)} className="text-center font-semibold py-2 px-4 rounded-md transition-colors bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">{isProviderSaved(provider) ? t('expertFinder.saved') : t('expertFinder.save')}</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            rawTextResult ? (
                                <div className="p-6 bg-gray-800/50 border border-white/10 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">{t('expertFinder.parseErrorTitle')}</h4>
                                    <p className="text-sm text-gray-400 mb-4">{t('expertFinder.parseErrorSubtitle')}</p>
                                    <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md text-sm text-gray-300">{rawTextResult}</pre>
                                </div>
                            ) : (
                                !error && <div className="text-center text-gray-500 py-10 bg-gray-800/30 rounded-lg"><p>{allProviders.length > 0 ? 'No matches for the current filters.' : t('expertFinder.crateEmpty')}</p></div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExpertFinder;
