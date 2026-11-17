import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_ASSISTIVE_PREFS,
  isSpeechSupported,
  loadAssistivePrefs,
  saveAssistivePrefs,
  type AssistivePreferences,
  type FontScale,
} from '../lib/assistive';

interface AccessibilityContextValue {
  prefs: AssistivePreferences;
  speakingId: string | null;
  speechAvailable: boolean;
  setFontScale: (scale: FontScale) => void;
  toggleHighContrast: () => void;
  toggleRelaxedReading: () => void;
  toggleReduceMotion: () => void;
  resetPrefs: () => void;
  toggleSpeak: (id: string, text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useState<AssistivePreferences>(() => loadAssistivePrefs());
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const speechAvailable = isSpeechSupported();

  useEffect(() => {
    saveAssistivePrefs(prefs);
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.fontScale = prefs.fontScale;
    root.dataset.highContrast = prefs.highContrast ? 'true' : 'false';
    root.dataset.relaxedReading = prefs.relaxedReading ? 'true' : 'false';
    root.dataset.reduceMotion = prefs.reduceMotion ? 'true' : 'false';
  }, [prefs]);

  const stopSpeaking = useCallback(() => {
    if (speechAvailable) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  }, [speechAvailable]);

  useEffect(() => {
    return () => {
      if (isSpeechSupported()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = useCallback(
    (id: string, text: string) => {
      if (!speechAvailable) return;
      if (speakingId === id) {
        stopSpeaking();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = prefs.relaxedReading ? 0.92 : 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [prefs.relaxedReading, speakingId, speechAvailable, stopSpeaking]
  );

  const setFontScale = useCallback((fontScale: FontScale) => {
    setPrefs((prev) => ({ ...prev, fontScale }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setPrefs((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const toggleRelaxedReading = useCallback(() => {
    setPrefs((prev) => ({ ...prev, relaxedReading: !prev.relaxedReading }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setPrefs((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefs(DEFAULT_ASSISTIVE_PREFS);
    stopSpeaking();
  }, [stopSpeaking]);

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        speakingId,
        speechAvailable,
        setFontScale,
        toggleHighContrast,
        toggleRelaxedReading,
        toggleReduceMotion,
        resetPrefs,
        toggleSpeak,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider.');
  }
  return ctx;
}
