import React, { useState, useEffect } from 'react';
import { useLanguage, MediaAnalysisResult, MediaAnnotatedSegment } from '../types';
import * as geminiService from '../services/geminiService';

const LS_KEY = 'kavosh_gemini_api_key';

const SEVERITY_COLOR: Record<string, string> = {
  high: 'bg-red-900/50 border-red-700 text-red-300',
  medium: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
  low: 'bg-blue-900/50 border-blue-700 text-blue-300',
};

const SEG_STYLES: Record<string, { bg: string; border: string; text: string; icon: string; labelFa: string; labelEn: string }> = {
  error:   { bg: 'bg-red-950/70',     border: 'border-red-700',     text: 'text-red-200',     icon: '⚠️', labelFa: 'خطای همدلی', labelEn: 'Empathy Error' },
  insight: { bg: 'bg-emerald-950/70', border: 'border-emerald-700', text: 'text-emerald-200', icon: '💡', labelFa: 'لحظه بینش', labelEn: 'Insight'       },
  normal:  { bg: 'bg-slate-900/40',   border: 'border-slate-800',   text: 'text-slate-400',   icon: '▸',  labelFa: 'عادی',       labelEn: 'Normal'        },
};

const METRIC_CONFIG = [
  { key: 'selfFocusIndex'         as const, labelFa: 'شاخص ایگو',    color: '#ef4444' },
  { key: 'empathyResponsiveness'  as const, labelFa: 'همدلی عاطفی', color: '#10b981' },
  { key: 'defensivenessScale'     as const, labelFa: 'دفاعی‌گری',    color: '#f59e0b' },
  { key: 'transparencyIndex'      as const, labelFa: 'شفافیت',       color: '#3b82f6' },
  { key: 'cognitiveJusticeIndex'  as const, labelFa: 'عدل شناختی',  color: '#a855f7' },
];

const QUOTA_INFO = [
  { label: 'درخواست در دقیقه', value: '15 RPM',   icon: '⚡', color: '#10b981' },
  { label: 'درخواست در روز',   value: '1,500 RPD', icon: '📅', color: '#3b82f6' },
  { label: 'توکن در دقیقه',    value: '1M TPM',    icon: '🔢', color: '#a855f7' },
  { label: 'هزینه',             value: 'رایگان',    icon: '🎁', color: '#f59e0b' },
];

function extractVideoId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function exportSRT(segments: MediaAnnotatedSegment[]): void {
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},000`;
  };
  const lines = segments.map((seg, i) => {
    const pre = seg.type === 'error' ? '[⚠] ' : seg.type === 'insight' ? '[💡] ' : '';
    return `${i+1}\n${fmt(i*5)} --> ${fmt((i+1)*5)}\n${pre}${seg.text}\n`;
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  a.download = 'kavosh_subtitles.srt';
  a.click();
}

/* ── Score Ring ── */
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 48, circ = 2 * Math.PI * r;
  const color = score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'سالم' : score >= 60 ? 'متوسط' : score >= 40 ? 'نگران‌کننده' : 'بحرانی';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="116" height="116" viewBox="0 0 116 116">
        <circle cx="58" cy="58" r={r} fill="none" stroke="#1e293b" strokeWidth="10"/>
        <circle cx="58" cy="58" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 58 58)" style={{transition:'stroke-dasharray 1s ease'}}/>
        <text x="58" y="53" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{score}</text>
        <text x="58" y="70" textAnchor="middle" fill="#94a3b8" fontSize="11">{label}</text>
      </svg>
      <p className="text-slate-500 text-xs">امتیاز همدلی</p>
    </div>
  );
};

/* ── API Key Panel ── */
const ApiKeyPanel: React.FC<{ onSave:(k:string)=>void; isFa:boolean; showQuota:boolean; onToggleQuota:()=>void }> =
  ({ onSave, isFa, showQuota, onToggleQuota }) => {
  const [val, setVal] = useState('');
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-2xl border border-amber-800/50 bg-amber-950/25 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">🔑</span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-bold text-amber-300 text-sm">
              {isFa ? 'کلید Gemini API لازم است' : 'Gemini API Key Required'}
            </p>
            <button onClick={onToggleQuota}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline">
              {showQuota ? (isFa ? 'مخفی' : 'Hide quota') : (isFa ? 'سهمیه رایگان ←' : 'Free quota →')}
            </button>
          </div>
          <p className="text-amber-500/70 text-xs mt-1 leading-relaxed">
            {isFa
              ? 'کلید در مرورگر شما ذخیره می‌شود — نه روی سرور. رایگان و بدون نیاز به کارت اعتباری.'
              : 'Key is stored in your browser only — never sent to our servers. Free, no credit card needed.'}
          </p>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 underline block mt-1">
            {isFa ? '← دریافت کلید رایگان از Google AI Studio' : '← Get free key from Google AI Studio'}
          </a>
        </div>
      </div>

      {showQuota && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          {QUOTA_INFO.map(q => (
            <div key={q.label} className="text-center space-y-1">
              <div className="text-lg">{q.icon}</div>
              <p className="font-bold text-sm" style={{ color: q.color }}>{q.value}</p>
              <p className="text-xs text-slate-500">{q.label}</p>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-4 text-xs text-slate-600 text-center border-t border-slate-800 pt-2 mt-1">
            {isFa
              ? 'سهمیه رایگان Gemini 2.5 Flash — بیش از کافی برای تحلیل روزانه رسانه'
              : 'Gemini 2.5 Flash free tier — more than enough for daily media analysis'}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input type={show ? 'text' : 'password'} value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && val.trim() && onSave(val.trim())}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm font-mono pr-10"
            dir="ltr" />
          <button onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        <button onClick={() => val.trim() && onSave(val.trim())}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-colors">
          {isFa ? 'ذخیره' : 'Save'}
        </button>
      </div>
    </div>
  );
};

/* ── Colored Transcript ── */
const ColoredTranscript: React.FC<{ segments: MediaAnnotatedSegment[]; isFa: boolean }> = ({ segments, isFa }) => {
  const [active, setActive] = useState<number|null>(null);
  if (!segments.length) return (
    <p className="text-slate-600 text-sm text-center py-12">
      {isFa ? 'متن تحلیل‌شده‌ای موجود نیست.' : 'No annotated transcript available.'}
    </p>
  );
  const errorCount   = segments.filter(s => s.type === 'error').length;
  const insightCount = segments.filter(s => s.type === 'insight').length;

  return (
    <div className="space-y-3">
      {/* Legend + Export */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-800 text-xs">
        {Object.entries(SEG_STYLES).map(([type, cfg]) => (
          <span key={type} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
            {cfg.icon} {isFa ? cfg.labelFa : cfg.labelEn}
            {type === 'error'   && <span className="opacity-50">({errorCount})</span>}
            {type === 'insight' && <span className="opacity-50">({insightCount})</span>}
          </span>
        ))}
        <button onClick={() => exportSRT(segments)}
          className="mr-auto flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-700 bg-blue-950/50 text-blue-300 hover:bg-blue-900/60 transition-colors">
          ⬇️ {isFa ? 'دانلود SRT' : 'Download SRT'}
        </button>
      </div>

      {/* Segments */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto">
        {segments.map((seg, i) => {
          const cfg = SEG_STYLES[seg.type] || SEG_STYLES.normal;
          const isOpen = active === i && seg.type !== 'normal';
          return (
            <div key={i} onClick={() => seg.type !== 'normal' && setActive(isOpen ? null : i)}
              className={`rounded-xl border p-3.5 transition-all ${cfg.bg} ${cfg.border} ${cfg.text} ${seg.type !== 'normal' ? 'cursor-pointer hover:opacity-90' : ''}`}>
              <div className="flex items-start gap-2.5">
                <span className="text-sm mt-0.5 flex-shrink-0">{cfg.icon}</span>
                <p className="leading-relaxed text-sm flex-1">{seg.text}</p>
                {seg.errorCode && <span className="text-[10px] font-mono opacity-40 flex-shrink-0 mt-0.5">{seg.errorCode}</span>}
              </div>
              {isOpen && seg.descriptionFa && (
                <p className="mt-2.5 pt-2.5 border-t border-white/10 text-xs opacity-80 leading-relaxed">
                  {seg.descriptionFa}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════
   Main Component
═══════════════════════════════════ */
const YoutubeAnalyzer: React.FC = () => {
  const { language } = useLanguage();
  const isFa = language === 'fa';

  const [apiKey, setApiKey]       = useState<string>(() => { try { return localStorage.getItem(LS_KEY) || ''; } catch { return ''; } });
  const [showQuota, setShowQuota] = useState(false);
  const [mode, setMode]           = useState<'youtube'|'text'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [manualText, setManualText] = useState('');
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState<string|null>(null);
  const [result, setResult]         = useState<MediaAnalysisResult|null>(null);
  const [activeTab, setActiveTab]   = useState<'transcript'|'metrics'|'errors'>('transcript');

  const envKeySet = !!(process.env.API_KEY);
  const effectiveKey = envKeySet ? '[از سرور]' : apiKey;
  const videoId = mode === 'youtube' ? extractVideoId(youtubeUrl) : null;

  const saveApiKey = (k: string) => {
    try { localStorage.setItem(LS_KEY, k); } catch {}
    setApiKey(k);
    geminiService.resetAiInstance();
    setError(null);
  };

  const clearApiKey = () => {
    try { localStorage.removeItem(LS_KEY); } catch {}
    setApiKey('');
    geminiService.resetAiInstance();
  };

  const handleAnalyze = async () => {
    if (!envKeySet && !apiKey) { setError(isFa ? 'ابتدا کلید Gemini API را وارد کنید.' : 'Please enter your Gemini API key first.'); return; }
    if (mode === 'youtube' && !youtubeUrl.trim()) { setError(isFa ? 'لینک یوتیوب وارد کنید.' : 'Enter a YouTube URL.'); return; }
    if (mode === 'text'    && !manualText.trim()) { setError(isFa ? 'متنی وارد کنید.' : 'Enter some text.'); return; }

    setIsLoading(true); setError(null); setResult(null);

    try {
      const data = await geminiService.analyzeYoutubeMedia(
        mode === 'youtube' ? youtubeUrl.trim() : '',
        mode === 'text'    ? manualText.trim() : '',
        language
      );
      setResult(data);
      setActiveTab('transcript');
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg === 'NO_API_KEY') {
        setError(isFa ? 'کلید API یافت نشد.' : 'No API key found. Please enter one above.');
      } else if (msg.includes('API_KEY_INVALID') || msg.includes('not valid') || msg.includes('INVALID_ARGUMENT')) {
        setError(isFa ? '❌ کلید API معتبر نیست. یک کلید صحیح از Google AI Studio بگیرید.' : '❌ Invalid API key. Get a valid one from Google AI Studio.');
        clearApiKey();
      } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        setError(isFa ? '⏳ سهمیه این کلید تمام شده. ۱ دقیقه صبر کنید یا کلید دیگری استفاده کنید.' : '⏳ Quota exceeded. Wait 1 min or use a different API key. (Free: 15 req/min)');
      } else if (msg.includes('SAFETY')) {
        setError(isFa ? 'محتوا توسط فیلتر ایمنی Google مسدود شد.' : 'Content blocked by Google safety filter.');
      } else {
        setError(msg || (isFa ? 'خطا در تحلیل.' : 'Analysis failed.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen"
      style={{ backgroundColor:'#020617', fontFamily:"'Vazirmatn','Inter',sans-serif", direction: isFa ? 'rtl' : 'ltr', color:'#f1f5f9' }}>

      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-xl">🧬</div>
            <div>
              <h1 className="text-xl font-bold text-white">{isFa ? 'آنالیزگر رسانه‌ای کاوش' : 'Kavosh Media Empathy Analyzer'}</h1>
              <p className="text-slate-500 text-xs mt-0.5">
                {isFa ? 'تحلیل ساختار عاطفی و الگوهای روان‌شناختی در رسانه — با Gemini AI' : 'Detect empathy patterns & cognitive biases in media — powered by Gemini AI'}
              </p>
            </div>
          </div>

          {/* Key status badge */}
          <div className="flex items-center gap-2 text-xs">
            {envKeySet ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isFa ? 'کلید از سرور' : 'Key from server'}
              </span>
            ) : apiKey ? (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/40 border border-blue-700/40 text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="font-mono">{apiKey.slice(0,10)}…</span>
                <button onClick={clearApiKey} className="text-red-400/70 hover:text-red-400 mr-1 text-xs">×</button>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {isFa ? 'کلید تنظیم نشده' : 'No key set'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">

        {/* API Key Panel — only if no env key and no stored key */}
        {!envKeySet && !apiKey && (
          <ApiKeyPanel onSave={saveApiKey} isFa={isFa} showQuota={showQuota} onToggleQuota={() => setShowQuota(!showQuota)} />
        )}

        {/* Quota info button when key is present */}
        {(envKeySet || apiKey) && (
          <div>
            <button onClick={() => setShowQuota(!showQuota)}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5">
              📊 {isFa ? (showQuota ? 'مخفی کردن اطلاعات سهمیه' : 'مشاهده سهمیه Gemini رایگان') : (showQuota ? 'Hide quota info' : 'View free Gemini quota')}
            </button>
            {showQuota && (
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
                {QUOTA_INFO.map(q => (
                  <div key={q.label} className="space-y-0.5">
                    <div>{q.icon}</div>
                    <p className="font-bold text-sm" style={{ color: q.color }}>{q.value}</p>
                    <p className="text-xs text-slate-500">{q.label}</p>
                  </div>
                ))}
                <div className="col-span-2 sm:col-span-4 text-xs text-slate-600 border-t border-slate-800 pt-2 mt-1">
                  {isFa ? 'سهمیه Gemini 2.5 Flash (رایگان) — بیش از کافی برای تحلیل روزانه رسانه' : 'Gemini 2.5 Flash free tier — more than enough for daily media analysis'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          {/* Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-700 w-fit text-sm">
            {[
              { id:'youtube' as const, icon:'🎬', fa:'لینک یوتیوب', en:'YouTube URL' },
              { id:'text'    as const, icon:'📝', fa:'متن مستقیم',  en:'Paste Text'  },
            ].map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`px-5 py-2.5 font-medium transition-colors flex items-center gap-2 ${mode===m.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {m.icon} {isFa ? m.fa : m.en}
              </button>
            ))}
          </div>

          {mode === 'youtube' ? (
            <div className="space-y-2">
              <input type="url" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-mono"
                dir="ltr" />
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-xs text-slate-600">{isFa ? 'مثال:' : 'Try:'}</span>
                {[{ label:'Iran International', url:'https://www.youtube.com/watch?v=q-kNSIs7lTU' },
                  { label:'BBC فارسی',          url:'https://www.youtube.com/watch?v=C3-yBJeS6Ok' }
                ].map(s => (
                  <button key={s.url} onClick={() => setYoutubeUrl(s.url)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <textarea value={manualText} onChange={e => setManualText(e.target.value)} rows={7}
              placeholder={isFa ? 'متن رسانه، گفتگو یا سخنرانی را اینجا وارد کنید...' : 'Paste media text, dialogue or speech here...'}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm leading-relaxed resize-none" />
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <div>
                <p>{error}</p>
                {(error.includes('معتبر') || error.includes('Invalid') || error.includes('API key')) && (
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-xs underline mt-1 block">
                    ← Google AI Studio (رایگان / Free)
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button onClick={handleAnalyze}
            disabled={isLoading || (!envKeySet && !apiKey)}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{ background: isLoading ? '#1e293b' : 'linear-gradient(135deg,#10b981,#3b82f6)', color:'white' }}>
            {isLoading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isFa ? 'در حال کالبدشکافی عاطفی رسانه...' : 'Running empathy audit...'}</>
            ) : isFa ? '🔬 شروع تحلیل کالبدشکافی' : '🔬 Start Deep Audit'}
          </button>
        </div>

        {/* ── Results ── */}
        {result && (
          <div className="space-y-5">
            {/* Video + Score row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: video embed or text indicator */}
              {videoId ? (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black">
                  <div className="relative w-full" style={{ paddingTop:'56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title="Analyzed video" />
                  </div>
                  {result.videoTitle && (
                    <p className="px-4 py-3 text-sm text-white font-medium border-t border-slate-800 leading-snug">
                      {result.videoTitle}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center p-10">
                  <div className="text-center space-y-2 opacity-40">
                    <div className="text-5xl">📄</div>
                    <p className="text-slate-500 text-sm">{isFa ? 'متن تحلیل شد' : 'Text analyzed'}</p>
                  </div>
                </div>
              )}

              {/* Right: Score + mini metrics */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <ScoreRing score={result.overallScore ?? 50} />
                  <div className="flex-1 space-y-2">
                    <p className="text-slate-300 text-sm leading-relaxed">{result.summaryFa}</p>
                    {result.labels?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {result.labels.map((lbl, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">{lbl}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2.5 pt-3 border-t border-slate-800">
                  {METRIC_CONFIG.map(m => (
                    <div key={m.key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{m.labelFa}</span>
                        <span className="font-mono" style={{ color: m.color }}>{result.metrics?.[m.key] ?? 50}٪</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width:`${result.metrics?.[m.key] ?? 50}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-slate-700 w-fit text-sm">
              {[
                { id:'transcript' as const, icon:'🎨', fa:'زیرنویس رنگ‌آمیزی‌شده', en:'Colored Transcript' },
                { id:'metrics'    as const, icon:'📊', fa:'آمار مغالطات',            en:'Fallacy Stats'      },
                { id:'errors'     as const, icon:'⚠️', fa:'خطاهای شناسایی‌شده',    en:'Detected Errors'    },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`px-5 py-2.5 font-medium transition-colors flex items-center gap-2 ${activeTab===t.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {t.icon} {isFa ? t.fa : t.en}
                </button>
              ))}
            </div>

            {/* Transcript Tab */}
            {activeTab === 'transcript' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <ColoredTranscript segments={result.annotatedSegments ?? []} isFa={isFa} />
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                <h3 className="text-slate-400 text-xs uppercase tracking-widest">
                  {isFa ? 'آمار مغالطات شناسایی‌شده' : 'Detected Fallacy Statistics'}
                </h3>
                {result.fallacyCounts?.length > 0 ? (
                  <div className="space-y-3">
                    {result.fallacyCounts.map((fc, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{fc.labelFa || fc.label}</span>
                          <span className="font-mono text-slate-500">{fc.count}×</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700"
                            style={{ width:`${Math.min(100, fc.count * 20)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-600">
                    <span className="text-3xl block mb-2">✅</span>
                    {isFa ? 'مغالطه‌ای شناسایی نشد.' : 'No fallacies detected.'}
                  </div>
                )}
                {result.summary && (
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Summary (EN)</p>
                    <p className="text-slate-400 text-sm leading-relaxed" dir="ltr">{result.summary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-400 text-xs uppercase tracking-widest">
                    {isFa ? 'خطاهای روان‌شناختی شناسایی‌شده' : 'Detected Psychological Errors'}
                  </h3>
                  <span className="text-xs text-slate-600">{result.errors?.length ?? 0} {isFa ? 'مورد' : 'found'}</span>
                </div>
                {result.errors?.length > 0 ? result.errors.map((e, i) => (
                  <div key={i} className={`p-4 rounded-xl border text-sm ${SEVERITY_COLOR[e.severity] || SEVERITY_COLOR.low}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs opacity-60">{e.code}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/30">{e.category}</span>
                    </div>
                    <p className="leading-relaxed">{e.descriptionFa}</p>
                    <p className="mt-1 text-xs opacity-50" dir="ltr">{e.description}</p>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-600">
                    <span className="text-4xl block mb-2">✅</span>
                    {isFa ? 'خطای روان‌شناختی جدی شناسایی نشد.' : 'No significant errors detected.'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-slate-800/50">
            <div className="text-5xl mb-3 opacity-20">🧬</div>
            <p className="text-slate-600 text-base">{isFa ? 'در انتظار ورودی برای تحلیل رسانه...' : 'Awaiting input for empathy audit...'}</p>
            <p className="text-slate-700 text-xs mt-1">{isFa ? 'لینک یوتیوب یا متن رسانه را وارد کنید' : 'Enter a YouTube URL or paste media text'}</p>
          </div>
        )}

        <footer className="pt-4 border-t border-slate-900 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-800">
            Kavosh AI · Media Empathy Analyzer · DIAGNOSTICA {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default YoutubeAnalyzer;
