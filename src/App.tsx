import React, { useState } from 'react';
import { Header } from './components/Header';
import { GuidedDiagnosis } from './components/GuidedDiagnosis';
import { PesticideScanner } from './components/PesticideScanner';
import { FieldWalkScan } from './components/FieldWalkScan';
import { OutbreakRadar } from './components/OutbreakRadar';
import { ExpertReviewDashboard } from './components/ExpertReviewDashboard';
import { SupportedLanguage, UI_STRINGS } from './data/translations';
import { Stethoscope, Camera, Video, Radio, UserCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'diagnose' | 'scanner' | 'walk' | 'radar' | 'expert'>('diagnose');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const t = UI_STRINGS[language] || UI_STRINGS.en;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans pb-20 md:pb-8">
      {/* 3-Zone Desktop / Mobile Top Bar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'diagnose' && (
          <GuidedDiagnosis
            language={language}
            isOfflineMode={isOfflineMode}
            onNavigateToExpert={() => setCurrentTab('expert')}
          />
        )}

        {currentTab === 'scanner' && (
          <PesticideScanner
            currentCrop="Tomato"
            language={language}
          />
        )}

        {currentTab === 'walk' && (
          <FieldWalkScan
            cropName="Tomato"
            language={language}
          />
        )}

        {currentTab === 'radar' && (
          <OutbreakRadar
            currentCrop="Tomato"
            language={language}
          />
        )}

        {currentTab === 'expert' && (
          <ExpertReviewDashboard
            language={language}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-300">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
          <button
            onClick={() => setCurrentTab('diagnose')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'diagnose' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Stethoscope className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] tracking-tight truncate max-w-[62px]">{t.navDoctor}</span>
          </button>

          <button
            onClick={() => setCurrentTab('scanner')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'scanner' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] tracking-tight truncate max-w-[62px]">{t.navPacket}</span>
          </button>

          <button
            onClick={() => setCurrentTab('walk')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'walk' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] tracking-tight truncate max-w-[62px]">{t.navWalk}</span>
          </button>

          <button
            onClick={() => setCurrentTab('radar')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'radar' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] tracking-tight truncate max-w-[62px]">{t.navRadar}</span>
          </button>

          <button
            onClick={() => setCurrentTab('expert')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              currentTab === 'expert' ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] tracking-tight truncate max-w-[62px]">{t.navExpert}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
