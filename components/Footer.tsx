import React from 'react';
import { useLanguage } from '../types';

const SiteFooter: React.FC = () => {
    const { t } = useLanguage();

    return (
        <footer id="footer" className="bg-black/20 backdrop-blur-sm text-gray-400 border-t border-white/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                           <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00.547-1.806z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.572 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L-1.95 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00.547-1.806z" />
                           </svg>
                            <span className="font-bold text-xl text-white">کاوش AI</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm">{t('footer.description')}</p>
                    </div>
                    <div className="text-center md:text-right">
                         <p className="text-xs">{t('footer.copyright')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;