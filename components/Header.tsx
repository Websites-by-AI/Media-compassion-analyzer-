
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Page, User } from '../types';

interface SiteHeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isLoggedIn: boolean;
    user: User | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogout: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, isLoggedIn, user, onLoginClick, onSignupClick, onLogout }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePageChange = (page: Page) => {
      setPage(page);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);
  }
  
  const navLinks = [
    { key: 'home', text: t('header.home'), action: () => handlePageChange('home') },
    { key: 'topic_deep_dive', text: t('header.topic_deep_dive'), action: () => handlePageChange('topic_deep_dive') },
    { key: 'news_briefing', text: t('header.news_briefing'), action: () => handlePageChange('news_briefing') },
    { key: 'opposition_ai', text: t('header.opposition_ai'), action: () => handlePageChange('opposition_ai') },
    { key: 'youtube_analyzer', text: t('header.youtube_analyzer'), action: () => handlePageChange('youtube_analyzer') },
    { key: 'saved_reports', text: t('header.saved_reports'), action: () => handlePageChange('saved_reports') },
    { key: 'subscriptions', text: t('header.subscriptions'), action: () => handlePageChange('subscriptions') },
    { key: 'case_studies', text: t('header.case_studies'), action: () => handlePageChange('case_studies') },
    { key: 'hugging_face_guide', text: t('header.hugging_face_guide'), action: () => handlePageChange('hugging_face_guide') },
    { key: 'deployment_guide', text: t('header.deployment_guide'), action: () => handlePageChange('deployment_guide') },
  ];

  const authNavs = {
    desktop: isLoggedIn ? (
      <div className="relative" ref={userMenuRef}>
        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center text-gray-300 hover:text-white">
          <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center ring-2 ring-teal-500">
             <span className="text-sm font-bold text-teal-300">{user?.name?.charAt(0)}</span>
          </div>
        </button>
        {isUserMenuOpen && (
          <div className={`absolute mt-2 w-40 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 ${language === 'fa' ? 'left-0' : 'right-0'}`}>
            <div className="px-4 py-3 border-b border-gray-600">
              <p className="text-sm text-white truncate">{user?.name}</p>
            </div>
            <ul className="py-1">
              <li><button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">{t('auth.logout')}</button></li>
            </ul>
          </div>
        )}
      </div>
    ) : (
      <div className="hidden md:flex items-center space-x-4">
        <button onClick={onLoginClick} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">{t('auth.login')}</button>
        <button onClick={onSignupClick} className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-700 transition-colors">{t('auth.signup')}</button>
      </div>
    ),
    mobile: isLoggedIn ? (
        <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center ring-2 ring-teal-500">
                    <span className="font-bold text-teal-300">{user?.name?.charAt(0)}</span>
                </div>
                <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
                <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-400 hover:text-white hover:bg-gray-700">{t('auth.logout')}</button>
            </div>
        </div>
    ) : (
      <div className="py-4 border-t border-gray-700 px-5 space-y-3">
          <button onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }} className="w-full text-center bg-teal-600 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-teal-700 transition-colors">{t('auth.signup')}</button>
          <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full text-center text-gray-300 hover:text-white text-base font-medium">{t('auth.login')}</button>
      </div>
    )
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 flex items-center space-x-2 rtl:space-x-reverse">
               <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00.547-1.806z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.572 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L-1.95 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00.547-1.806z" />
               </svg>
              <span className="font-bold text-xl text-white">کاوش AI</span>
            </button>
            <nav className="hidden md:flex md:ml-10 md:space-x-4 lg:space-x-8">
              {navLinks.map(link => (
                  <button key={link.key} onClick={link.action} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === link.key ? 'text-teal-300' : ''}`}>
                    {link.text}
                  </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {authNavs.desktop}
            
            {/* Language Switcher */}
            <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold text-sm mx-1">{language === 'fa' ? 'FA' : 'EN'}</span>
                </button>
                {isLangMenuOpen && (
                    <div className={`absolute mt-2 w-28 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 ${language === 'fa' ? 'left-0' : 'right-0'}`}>
                        <ul className="py-1">
                            <li><button onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">فارسی</button></li>
                            <li><button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 font-inter">English</button></li>
                        </ul>
                    </div>
                )}
            </div>

             <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(prev => !prev)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                <button key={link.key} onClick={link.action} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                  {link.text}
                </button>
            ))}
          </div>
          {authNavs.mobile}
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
