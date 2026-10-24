import React from 'react';
import { Leaf, Wifi, WifiOff, Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, UI_STRINGS } from '../data/translations';

interface HeaderProps {
  currentTab: 'diagnose' | 'scanner' | 'walk' | 'radar' | 'expert';
  setCurrentTab: (tab: 'diagnose' | 'scanner' | 'walk' | 'radar' | 'expert') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  isOfflineMode,
  setIsOfflineMode,
}) => {
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setCurrentTab('diagnose')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              {t.appTitle}
            </span>
            <span className="text-[10px] text-stone-400 font-medium block">
              Field Crop Doctor
            </span>
          </div>
        </div>

        {/* Zone 2: Single-line clean text navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => setCurrentTab('diagnose')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'diagnose' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.navDoctor}
          </button>
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'scanner' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.navPacket}
          </button>
          <button
            onClick={() => setCurrentTab('walk')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'walk' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.navWalk}
          </button>
          <button
            onClick={() => setCurrentTab('radar')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'radar' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.navRadar}
          </button>
          <button
            onClick={() => setCurrentTab('expert')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentTab === 'expert' ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold' : 'hover:text-white'
            }`}
          >
            {t.navExpert}
          </button>
        </nav>

        {/* Zone 3: Controls (Language + Offline Village Mode) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Offline Village Mode Toggle */}
          <button
            onClick={() => setIsOfflineMode(!isOfflineMode)}
            title={isOfflineMode ? 'Switch to Online Mode' : 'Switch to Offline Village Mode'}
            className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 border border-stone-700'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{t.villageOffline}</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{t.onlineSync}</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="h-9 pl-7 pr-3 bg-stone-800 text-stone-200 text-xs rounded-lg border border-stone-700 hover:border-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-800 text-white">
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
