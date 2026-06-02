import React from 'react';
import { useLanguage, Page } from '../types';

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6 text-green-400 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

interface SubscriptionPageProps {
    setPage: (page: Page) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ setPage }) => {
    const { t } = useLanguage();
    const serviceTiers = ['tier1', 'tier2', 'tier3'];

    const getTierStyles = (tier: string) => {
        if (tier === 'tier2') {
            return 'border-teal-500/80 md:scale-105 bg-gray-800 z-10';
        }
        return 'border-white/10 bg-gray-800/50';
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    {t('servicesPage.title')}
                </h1>
                <p className="mt-4 text-lg text-gray-300">{t('servicesPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {serviceTiers.map(tierKey => (
                    <div key={tierKey} className={`rounded-xl shadow-lg p-8 flex flex-col transition-transform duration-300 ${getTierStyles(tierKey)}`}>
                        <h3 className="text-2xl font-bold text-center text-white">{t(`servicesPage.${tierKey}.title`)}</h3>
                        
                        <div className="mt-4 text-center">
                            <span className="text-4xl font-extrabold text-white">{t(`servicesPage.${tierKey}.price`)}</span>
                            {t(`servicesPage.${tierKey}.unit`) && <span className="text-base font-medium text-gray-400"> {t(`servicesPage.${tierKey}.unit`)}</span>}
                        </div>

                        <p className="mt-6 text-center text-gray-400 text-sm flex-grow min-h-[6rem]">{t(`servicesPage.${tierKey}.description`)}</p>

                        <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
                            {t(`servicesPage.${tierKey}.features`).map((feature: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <CheckIcon />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <button
                                onClick={() => {
                                    if (tierKey === 'tier1') setPage('topic_deep_dive');
                                    // In a real app, other buttons would link to a booking or contact page.
                                }}
                                className={`w-full py-3 px-6 text-sm font-semibold rounded-lg shadow-md transition-colors ${tierKey === 'tier2' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                            >
                                {t(`servicesPage.${tierKey}.cta`)}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPage;