
import React, { useState } from 'react';
import { useLanguage } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSocialLogin: (provider: 'Google' | 'Facebook' | 'Instagram' | 'demo_admin' | 'demo_user') => void;
}

const DEMO_ACCOUNTS = [
  {
    id: 'demo_admin' as const,
    role: 'مدیر / Admin',
    email: 'admin@kavosh.ai',
    password: 'kavosh1234',
    icon: '🛡️',
    color: 'border-amber-600/50 bg-amber-950/30 hover:bg-amber-900/40',
    badge: 'bg-amber-700/50 text-amber-300',
  },
  {
    id: 'demo_user' as const,
    role: 'خبرنگار / Reporter',
    email: 'reporter@kavosh.ai',
    password: 'kavosh1234',
    icon: '📰',
    color: 'border-blue-700/50 bg-blue-950/30 hover:bg-blue-900/40',
    badge: 'bg-blue-700/50 text-blue-300',
  },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSocialLogin }) => {
  const { t, language } = useLanguage();
  const isFa = language === 'fa';
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const title = mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const SocialButton: React.FC<{ provider: 'Google' | 'Facebook' | 'Instagram' }> = ({ provider }) => {
    const logos = {
      Google: (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.582-3.344-11.13-7.962l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.24 44 30.023 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
      ),
      Facebook: (
        <svg aria-hidden="true" className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      Instagram: (
        <svg aria-hidden="true" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    };
    const colors = {
      Google: 'bg-white text-gray-700 hover:bg-gray-200',
      Facebook: 'bg-blue-600 text-white hover:bg-blue-700',
      Instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:opacity-90',
    };
    return (
      <button onClick={() => onSocialLogin(provider)}
        className={`w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium transition-colors ${colors[provider]}`}>
        {logos[provider]}
        <span>{t('auth.continueWith', { provider })}</span>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="auth-modal-title"
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center pt-7 pb-5 px-6 border-b border-gray-800">
          <div className="text-3xl mb-2">🔍</div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-white">کاوش AI</h2>
          <p className="text-gray-400 text-sm mt-1">{title}</p>
        </div>

        <div className="p-5 space-y-5">
          {/* ── Demo Test Accounts ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
              <span className="flex-1 border-t border-gray-800" />
              <span>{isFa ? '🧪 حساب تست' : '🧪 Test Accounts'}</span>
              <span className="flex-1 border-t border-gray-800" />
            </div>

            {DEMO_ACCOUNTS.map(acc => (
              <div key={acc.id}
                className={`rounded-xl border p-3 transition-colors cursor-pointer ${acc.color}`}
                onClick={() => onSocialLogin(acc.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{acc.icon}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acc.badge}`}>{acc.role}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {isFa ? 'کلیک برای ورود ←' : 'Click to login →'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs" dir="ltr">
                  <div className="flex items-center gap-1 bg-gray-900/60 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-500 flex-shrink-0">✉</span>
                    <span className="font-mono text-gray-300 truncate">{acc.email}</span>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(acc.email, acc.id + '_email'); }}
                      className="mr-auto text-gray-600 hover:text-gray-300 flex-shrink-0"
                      title="Copy"
                    >
                      {copied === acc.id + '_email' ? '✓' : '⎘'}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-900/60 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-500 flex-shrink-0">🔒</span>
                    <span className="font-mono text-gray-300">{acc.password}</span>
                    <button
                      onClick={e => { e.stopPropagation(); copyToClipboard(acc.password, acc.id + '_pass'); }}
                      className="mr-auto text-gray-600 hover:text-gray-300 flex-shrink-0"
                      title="Copy"
                    >
                      {copied === acc.id + '_pass' ? '✓' : '⎘'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Social Login ── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
              <span className="flex-1 border-t border-gray-800" />
              <span>{isFa ? 'ورود با شبکه اجتماعی' : 'Social Login'}</span>
              <span className="flex-1 border-t border-gray-800" />
            </div>
            <SocialButton provider="Google" />
            <SocialButton provider="Facebook" />
            <SocialButton provider="Instagram" />
          </div>

          <p className="text-center text-xs text-gray-600">
            {isFa
              ? 'این یک محیط دمو است. اطلاعات واقعی وارد نکنید.'
              : 'This is a demo environment. Do not enter real credentials.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
