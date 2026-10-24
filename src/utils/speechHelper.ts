import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../data/translations';
import { fetchJson } from './apiClient';

let currentAudio: HTMLAudioElement | null = null;

export async function speakText(
  text: string,
  language: SupportedLanguage = 'en',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  // Stop any currently playing audio
  stopSpeaking();

  if (onStart) onStart();

  try {
    // 1. Try server-side Gemini 3.8 Flash Lite TTS
    const data = await fetchJson<{ audioBase64?: string; format?: string; useBrowserTTS?: boolean }>(
      '/api/speak',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      },
      { useBrowserTTS: true }
    );

    if (data && data.audioBase64) {
      const audioSrc = `data:${data.format || 'audio/wav'};base64,${data.audioBase64}`;
      currentAudio = new Audio(audioSrc);
      currentAudio.onended = () => {
        if (onEnd) onEnd();
        currentAudio = null;
      };
      currentAudio.onerror = () => {
        playBrowserFallback(text, language, onEnd);
      };
      await currentAudio.play();
      return;
    }
  } catch (err) {
    console.warn('Server TTS failed, using browser speech synthesis:', err);
  }

  // 2. Browser fallback (works offline 100%)
  playBrowserFallback(text, language, onEnd);
}

function playBrowserFallback(text: string, language: SupportedLanguage, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === language);
  utterance.lang = langMeta ? langMeta.voiceLang : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clarity in field conditions
  utterance.pitch = 1.0;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Gentle audio chime for action confirmations (useful for low-literacy farmers)
export function playChime(type: 'success' | 'alert' | 'click' = 'click') {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'alert') {
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    }
  } catch (e) {
    // Ignore audio context autoplay restrictions
  }
}
