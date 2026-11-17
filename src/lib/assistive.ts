export type FontScale = 'normal' | 'large' | 'xlarge';

export interface AssistivePreferences {
  fontScale: FontScale;
  highContrast: boolean;
  relaxedReading: boolean;
  reduceMotion: boolean;
}

const PREFS_KEY = 'ia_edu_assistive_prefs_v1';

export const DEFAULT_ASSISTIVE_PREFS: AssistivePreferences = {
  fontScale: 'normal',
  highContrast: false,
  relaxedReading: false,
  reduceMotion: false,
};

export function loadAssistivePrefs(): AssistivePreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_ASSISTIVE_PREFS;
    const parsed = JSON.parse(raw) as Partial<AssistivePreferences>;
    return {
      fontScale:
        parsed.fontScale === 'large' || parsed.fontScale === 'xlarge'
          ? parsed.fontScale
          : 'normal',
      highContrast: Boolean(parsed.highContrast),
      relaxedReading: Boolean(parsed.relaxedReading),
      reduceMotion: Boolean(parsed.reduceMotion),
    };
  } catch {
    return DEFAULT_ASSISTIVE_PREFS;
  }
}

export function saveAssistivePrefs(prefs: AssistivePreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Falha silenciosa caso o armazenamento esteja restrito
  }
}

/**
 * Copia texto com fallback para navegadores móveis sem suporte a navigator.clipboard
 * (por exemplo, ao testar em rede local via HTTP no celular).
 */
export async function copyTextSafely(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Continua para o fallback
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}
