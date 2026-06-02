import React, { useState, useEffect } from 'react';
import { GeneratedMenu, MenuItem, MarketingCopy, useLanguage, CostAnalysisResult } from '../types';
import * as geminiService from '../services/geminiService';


interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: GeneratedMenu | null;
  onSave: (menu: GeneratedMenu) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, menu, onSave }) => {
  const { language, t } = useLanguage();
  
  const [marketingCopy, setMarketingCopy] = useState<MarketingCopy | null>(null);
  const [isGeneratingMarketing, setIsGeneratingMarketing] = useState(false);
  const [marketingError, setMarketingError] = useState<string | null>(null);

  const [costAnalysis, setCostAnalysis] = useState<CostAnalysisResult | null>(null);
  const [isGeneratingCosts, setIsGeneratingCosts] = useState(false);
  const [costError, setCostError] = useState<string | null>(null);

  useEffect(() => {
    // Reset marketing state when a new menu is viewed
    if (menu) {
      setMarketingCopy(null);
      setIsGeneratingMarketing(false);
      setMarketingError(null);
      setCostAnalysis(null);
      setIsGeneratingCosts(false);
      setCostError(null);
    }
  }, [menu]);

  if (!isOpen || !menu) return null;

  const handleSave = () => {
    onSave(menu);
    onClose();
  };
  
  const handleGenerateMarketing = async () => {
    if (!menu) return;
    setIsGeneratingMarketing(true);
    setMarketingError(null);
    setMarketingCopy(null);
    try {
      const result = await geminiService.generateMarketingCopy(menu, language);
      setMarketingCopy(result);
    } catch (err) {
      console.error("Marketing copy generation failed:", err);
      setMarketingError("Failed to generate marketing ideas. Please try again.");
    } finally {
      setIsGeneratingMarketing(false);
    }
  };
  
  const handleGenerateCosts = async () => {
    if (!menu) return;
    setIsGeneratingCosts(true);
    setCostError(null);
    setCostAnalysis(null);
    try {
      const result = await geminiService.generateCostAnalysis(menu, language);
      setCostAnalysis(result);
    } catch (err) {
      console.error("Cost analysis generation failed:", err);
      setCostError("Failed to calculate costs. Please try again.");
    } finally {
      setIsGeneratingCosts(false);
    }
  };

  const renderMenuItem = (item: MenuItem, index: number) => (
    <div key={index} className="py-4">
      <div className="flex items-center">
        <span className="text-3xl mr-4 rtl:ml-4 rtl:mr-0">{item.icon}</span>
        <h5 className="font-bold text-lg text-white">{item.name}</h5>
      </div>
      <p className="pl-12 rtl:pr-12 text-sm text-gray-400 mt-1">{item.description}</p>
    </div>
  );
  
  const MarketingSection = () => (
    <div className="pt-8 mt-8 border-t-2 border-dashed border-brown-800">
      <h4 className="text-lg font-semibold text-gray-400 mb-4">Staff Notes: {t('menuGenerator.marketingIdeasTitle')}</h4>
      
      {isGeneratingMarketing && (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-brown-400"></div>
          <span className="ml-3 text-sm text-gray-400">{t('menuGenerator.generatingMarketing')}</span>
        </div>
      )}

      {marketingError && <p className="text-sm text-red-400 p-3 bg-red-900/30 rounded-md">{marketingError}</p>}
      
      {!marketingCopy && !isGeneratingMarketing && !marketingError && (
        <button
          onClick={handleGenerateMarketing}
          className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 transition-colors"
        >
          {t('menuGenerator.generateMarketingButton')}
        </button>
      )}

      {marketingCopy && (
        <div className="space-y-6 text-sm animate-fade-in">
          <div>
            <h5 className="font-semibold text-gray-200 mb-2">{t('menuGenerator.instagramPost')}</h5>
            <p className="p-3 bg-gray-900/50 rounded-md text-gray-300 whitespace-pre-wrap">{marketingCopy.instagramPost}</p>
          </div>
           <div>
            <h5 className="font-semibold text-gray-200 mb-2">{t('menuGenerator.facebookPost')}</h5>
            <p className="p-3 bg-gray-900/50 rounded-md text-gray-300 whitespace-pre-wrap">{marketingCopy.facebookPost}</p>
          </div>
           <div>
            <h5 className="font-semibold text-gray-200 mb-2">{t('menuGenerator.slogans')}</h5>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                {marketingCopy.slogans.map((slogan, i) => <li key={i}>{slogan}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const CostAnalysisSection = () => (
    <div className="pt-8 mt-8 border-t-2 border-dashed border-brown-800">
      <h4 className="text-lg font-semibold text-gray-400 mb-4">{t('menuGenerator.costAnalysisTitle')}</h4>
      
      {isGeneratingCosts && (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-brown-400"></div>
          <span className="ml-3 text-sm text-gray-400">{t('menuGenerator.generatingCosts')}</span>
        </div>
      )}

      {costError && <p className="text-sm text-red-400 p-3 bg-red-900/30 rounded-md">{costError}</p>}
      
      {!costAnalysis && !isGeneratingCosts && !costError && (
        <button
          onClick={handleGenerateCosts}
          className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 transition-colors"
        >
          {t('menuGenerator.calculateCostsButton')}
        </button>
      )}

      {costAnalysis && (
        <div className="space-y-4 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="border-b border-brown-700/50 text-xs text-gray-400 uppercase">
                <tr>
                  <th scope="col" className="py-3 px-4">{t('menuGenerator.tableHeaders.item')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('menuGenerator.tableHeaders.ingredientsCost')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('menuGenerator.tableHeaders.cafeCost')}</th>
                  <th scope="col" className="py-3 px-4 text-right">{t('menuGenerator.tableHeaders.customerPrice')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown-800/50">
                {costAnalysis.items.map((item, index) => (
                  <tr key={index} className="hover:bg-brown-900/20">
                    <td className="py-3 px-4 font-medium text-white">{item.itemName}</td>
                    <td className="py-3 px-4 text-gray-300 text-right">{item.costOfIngredients.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300 text-right">{item.finalCostForCafe.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-brown-300 text-right">{item.sellingPriceToCustomer.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 text-center pt-2">{costAnalysis.disclaimer} {t('menuGenerator.currencyDisclaimer')}</p>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in p-4" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-[#1c1611] rounded-lg shadow-2xl w-full max-w-2xl mx-auto border-4 border-brown-900/80 max-h-[90vh] flex flex-col"
        style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: `20px 20px`
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 overflow-y-auto">
            {/* Menu Header */}
            <header className="text-center border-b-2 border-dashed border-brown-600 pb-6 mb-6">
                <h3 className="text-4xl font-bold text-brown-300 tracking-wider">{menu.menuTitle}</h3>
                <p className="text-gray-400 mt-4 max-w-prose mx-auto">{menu.conceptDescription}</p>
            </header>
            
            {/* Menu Body */}
            <main className="space-y-8">
                 <div>
                    <h4 className="text-2xl font-semibold text-brown-400 mb-4 tracking-widest uppercase text-center">{t('menuGenerator.drinks')}</h4>
                    <div className="divide-y divide-brown-700/50">{menu.drinkItems.map(renderMenuItem)}</div>
                </div>
                 <div>
                    <h4 className="text-2xl font-semibold text-brown-400 my-8 tracking-widest uppercase text-center">{t('menuGenerator.food')}</h4>
                    <div className="divide-y divide-brown-700/50">{menu.foodItems.map(renderMenuItem)}</div>
                </div>
            </main>

            <MarketingSection />
            
            <CostAnalysisSection />
            
             <div className="pt-8 mt-8 border-t border-brown-800/50">
                <h5 className="text-sm font-semibold text-gray-500 mb-2 text-center">{t('menuGenerator.disclaimerTitle')}</h5>
                <p className="text-xs text-gray-600 text-center">{menu.disclaimer}</p>
            </div>
        </div>

        <footer className="p-4 bg-black/30 border-t-2 border-brown-900 flex-shrink-0 flex justify-end items-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              {t('quotaErrorModal.close')}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-brown-600 rounded-md hover:bg-brown-700 transition-colors"
            >
              {t('menuGenerator.saveConcept')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default MenuModal;