'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
export type FontSize = 'normal' | 'large' | 'xl';

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  pauseAnimations: boolean;
  dyslexiaMode: boolean;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  togglePauseAnimations: () => void;
  toggleDyslexiaMode: () => void;
  resetAll: () => void;
}

// ── Defaults ─────────────────────────────────────────────────────────────────
const defaults: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  pauseAnimations: false,
  dyslexiaMode: false,
};

const STORAGE_KEY = 'vv-a11y';

// ── Context ───────────────────────────────────────────────────────────────────
const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

// ── Apply settings to <html> data attributes ─────────────────────────────────
function applyToDOM(s: AccessibilitySettings) {
  const el = document.documentElement;
  el.dataset.fontSize = s.fontSize;
  el.dataset.highContrast = String(s.highContrast);
  el.dataset.pauseAnimations = String(s.pauseAnimations);
  el.dataset.dyslexia = String(s.dyslexiaMode);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaults);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
        const merged: AccessibilitySettings = { ...defaults, ...parsed };
        setSettings(merged);
        applyToDOM(merged);
      }
    } catch {
      // ignore parse errors — use defaults
    }
  }, []);

  // Persist + apply to DOM whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore storage errors
    }
    applyToDOM(settings);
  }, [settings]);

  const setFontSize = (size: FontSize) =>
    setSettings((prev) => ({ ...prev, fontSize: size }));

  const toggleHighContrast = () =>
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));

  const togglePauseAnimations = () =>
    setSettings((prev) => ({ ...prev, pauseAnimations: !prev.pauseAnimations }));

  const toggleDyslexiaMode = () =>
    setSettings((prev) => ({ ...prev, dyslexiaMode: !prev.dyslexiaMode }));

  const resetAll = () => {
    setSettings(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setFontSize,
        toggleHighContrast,
        togglePauseAnimations,
        toggleDyslexiaMode,
        resetAll,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
