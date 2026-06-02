import React, { useState, useEffect, useRef } from 'react';
// FIX: Changed CompatibilityInputs to BriefingInputs to match the application's types.
import { BriefingInputs, useLanguage } from '../types';

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

interface BriefingFormProps {
  onAnalyze: () => void;
  isLoading: boolean;
  inputs: BriefingInputs;
  setInputs: (value: React.SetStateAction<BriefingInputs>) => void;
  isQuotaExhausted: boolean;
}

// FIX: Renamed component and updated logic to be a Briefing Form instead of a Compatibility Form.
const BriefingForm: React.FC<BriefingFormProps> = ({ 
  onAnalyze, 
  isLoading, 
  inputs,
  setInputs,
  isQuotaExhausted
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === 'fa' ? 'fa-IR' : 'en-US';

    recognition.onresult = (event) => {
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
    recognition.onerror = (event) => {
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
      alert(t('newsBriefing.validationError'));
      return;
    }
    onAnalyze();
  };
  
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(d => ({ ...d, details: { ...d.details, [name]: value } }));
  };


  return (
    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-white/10">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('newsBriefing.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="description" className={`block text-sm font-medium text-gray-300`}>{t('newsBriefing.descriptionLabel')}</label>
            <button
                type="button"
                onClick={toggleListening}
                title={isListening ? t('topicDeepDive.voiceInputStop') : t('topicDeepDive.voiceInputStart')}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                disabled={!recognitionRef.current}
            >
                {isListening ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                        <path d="M5.5 13a.5.5 0 01.5.5v1.5a4.5 4.5 0 009 0v-1.5a.5.5 0 011 0v1.5a5.5 5.5 0 01-11 0v-1.5a.5.5 0 01.5-.5z" />
                     </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4zm5 10.5a.5.5 0 01.5.5v.5a3.5 3.5 0 01-7 0v-.5a.5.5 0 01.5-.5h6zM5 8a1 1 0 011-1h1V6a1 1 0 112 0v1h1a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
          </div>
          <textarea
            id="description"
            rows={8}
            value={inputs.description}
            onChange={(e) => setInputs(prev => ({...prev, description: e.target.value}))}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
            placeholder={t('newsBriefing.descriptionPlaceholder')}
          />
        </div>

        {/* Details Form */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">{t('newsBriefing.detailsTitle')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            
            <div className="sm:col-span-2">
              <label htmlFor="sourceURL" className="block text-sm font-medium text-gray-300">{t('newsBriefing.sourceURL')}</label>
              <input type="text" name="sourceURL" id="sourceURL" value={inputs.details.sourceURL} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="keyFigures" className="block text-sm font-medium text-gray-300">{t('newsBriefing.keyFigures')}</label>
              <input type="text" name="keyFigures" id="keyFigures" value={inputs.details.keyFigures} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="specificQuestions" className="block text-sm font-medium text-gray-300">{t('newsBriefing.specificQuestions')}</label>
              <input type="text" name="specificQuestions" id="specificQuestions" value={inputs.details.specificQuestions} onChange={handleDetailChange} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
            </div>
            
            <div>
                <label htmlFor="audience" className="block text-sm font-medium text-gray-300">{t('newsBriefing.audience')}</label>
                <input type="text" name="audience" id="audience" value={inputs.details.audience} onChange={handleDetailChange} placeholder={t('newsBriefing.audiencePlaceholder')} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
            </div>

            <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-300">{t('newsBriefing.tone')}</label>
                <input type="text" name="tone" id="tone" value={inputs.details.tone} onChange={handleDetailChange} placeholder={t('newsBriefing.tonePlaceholder')} className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white" />
            </div>

          </div>
        </div>


        <div>
          <button
            type="submit"
            disabled={isLoading || isQuotaExhausted}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isQuotaExhausted ? t('quotaErrorModal.title') : t('newsBriefing.buttonText')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BriefingForm;
