import React from 'react';
import { useLanguage, Page } from '../types';

interface HomePageProps {
    setPage: (page: Page) => void;
}

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/50 p-6 rounded-lg border border-white/10 text-left h-full flex flex-col items-start transition-all duration-300 hover:bg-gray-800/80 hover:border-teal-400/50 hover:-translate-y-2 group"
    >
      <div className="bg-gray-900/50 p-3 rounded-lg border border-white/10 group-hover:border-teal-400/50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mt-4">{title}</h3>
      <p className="text-sm text-gray-400 mt-2 flex-grow">{description}</p>
    </button>
  );
};


const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
  const { t } = useLanguage();

  const features = [
    {
      page: 'topic_deep_dive' as Page,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      ),
      title: t('hero.feature1Title'),
      description: t('hero.feature1Description'),
    },
    {
      page: 'news_briefing' as Page,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9M7 16h6m-6-4h6" /></svg>
      ),
      title: t('hero.feature2Title'),
      description: t('hero.feature2Description'),
    },
    {
      page: 'saved_reports' as Page,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
      ),
      title: t('hero.feature3Title'),
      description: t('hero.feature3Description'),
    },
    {
      page: 'case_studies' as Page,
      icon: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
      ),
      title: t('hero.feature4Title'),
      description: t('hero.feature4Description'),
    },
  ];

  return (
    <div className="animate-fade-in bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
          src="https://cdn.pixabay.com/video/2023/10/24/183331-876735393_large.mp4"
          poster="https://cdn.pixabay.com/vimeo/876735393/plexus-183331.jpg?width=1280&hash=85e8d2e8b2649646b1424b94f09d00469b8214f4"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="z-20 p-4 space-y-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button onClick={() => setPage('topic_deep_dive')} className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors text-lg shadow-lg">
                {t('hero.button1')}
              </button>
              <button onClick={() => setPage('news_briefing')} className="px-8 py-3 bg-gray-700/50 border border-gray-500 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors text-lg">
                {t('hero.button2')}
              </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('hero.featuresTitle')}
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard
                key={feature.page}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => setPage(feature.page)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;