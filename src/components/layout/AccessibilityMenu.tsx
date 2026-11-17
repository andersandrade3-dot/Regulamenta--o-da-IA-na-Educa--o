import React, { useEffect, useState } from 'react';
import {
  Accessibility,
  Contrast,
  RotateCcw,
  Sparkles,
  Type,
  Volume2,
  X,
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import type { FontScale } from '../../lib/assistive';

const FONT_SCALE_OPTIONS: { id: FontScale; label: string; sample: string }[] = [
  { id: 'normal', label: 'Padrão', sample: 'A' },
  { id: 'large', label: 'Grande', sample: 'A+' },
  { id: 'xlarge', label: 'Extra', sample: 'A++' },
];

export const AccessibilityMenu: React.FC = () => {
  const {
    prefs,
    speechAvailable,
    setFontScale,
    toggleHighContrast,
    toggleRelaxedReading,
    toggleReduceMotion,
    resetPrefs,
  } = useAccessibility();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open]);

  const hasCustomPrefs =
    prefs.fontScale !== 'normal' ||
    prefs.highContrast ||
    prefs.relaxedReading ||
    prefs.reduceMotion;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="assistive-panel"
        className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
          hasCustomPrefs
            ? 'bg-[#FFD000] text-[#183EFF]'
            : 'bg-white/15 text-white hover:bg-white/25'
        }`}
      >
        <Accessibility className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Acessibilidade</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B1228]/50 backdrop-blur-xs sm:items-start sm:justify-end sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistive-panel-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            id="assistive-panel"
            className="w-full max-w-md rounded-t-3xl sm:rounded-2xl border-[1.5px] border-[#183EFF] bg-white shadow-2xl overflow-hidden animate-mec-enter max-h-[88dvh] flex flex-col"
          >
            <div className="shrink-0 flex items-center justify-between gap-3 bg-[#183EFF] px-5 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <Accessibility className="h-5 w-5 text-[#FFD000]" aria-hidden="true" />
                <div>
                  <h2 id="assistive-panel-title" className="font-editorial text-base font-extrabold">
                    Recursos Assistivos e Leitura
                  </h2>
                  <p className="text-[11px] text-white/85">
                    Ajuste conforto visual, toque e leitura no celular
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar painel de acessibilidade"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
              {/* Tamanho do texto */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#22252B]">
                  <Type className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />
                  <span>Tamanho da letra</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SCALE_OPTIONS.map((opt) => {
                    const active = prefs.fontScale === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFontScale(opt.id)}
                        aria-pressed={active}
                        className={`min-h-[44px] rounded-xl border-[1.5px] px-3 py-2 text-xs font-extrabold transition-colors cursor-pointer ${
                          active
                            ? 'border-[#183EFF] bg-[#183EFF] text-white'
                            : 'border-[#CBD5E1] bg-[#FAFBFD] text-[#22252B] hover:border-[#183EFF]'
                        }`}
                      >
                        <span className="block text-sm">{opt.sample}</span>
                        <span className="block text-[11px] font-semibold opacity-90">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alternadores assistivos */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  aria-pressed={prefs.highContrast}
                  className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left transition-colors cursor-pointer ${
                    prefs.highContrast
                      ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                      : 'border-[#CBD5E1] bg-white text-[#22252B] hover:border-[#183EFF]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Contrast className="h-4 w-4 shrink-0 mt-0.5 text-[#183EFF]" aria-hidden="true" />
                    <div>
                      <span className="block text-sm font-bold">Alto contraste</span>
                      <span className="block text-xs text-[#525866]">
                        Remove a grade de fundo e reforça bordas e textos.
                      </span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      prefs.highContrast ? 'bg-[#183EFF] text-white' : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {prefs.highContrast ? 'Ativo' : 'Desligado'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleRelaxedReading}
                  aria-pressed={prefs.relaxedReading}
                  className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left transition-colors cursor-pointer ${
                    prefs.relaxedReading
                      ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                      : 'border-[#CBD5E1] bg-white text-[#22252B] hover:border-[#183EFF]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Type className="h-4 w-4 shrink-0 mt-0.5 text-[#183EFF]" aria-hidden="true" />
                    <div>
                      <span className="block text-sm font-bold">Leitura confortável (dislexia / TDAH)</span>
                      <span className="block text-xs text-[#525866]">
                        Aumenta o espaçamento entre linhas e palavras.
                      </span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      prefs.relaxedReading
                        ? 'bg-[#183EFF] text-white'
                        : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {prefs.relaxedReading ? 'Ativo' : 'Desligado'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleReduceMotion}
                  aria-pressed={prefs.reduceMotion}
                  className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left transition-colors cursor-pointer ${
                    prefs.reduceMotion
                      ? 'border-[#183EFF] bg-[#EEF2FF] text-[#183EFF]'
                      : 'border-[#CBD5E1] bg-white text-[#22252B] hover:border-[#183EFF]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#183EFF]" aria-hidden="true" />
                    <div>
                      <span className="block text-sm font-bold">Reduzir animações</span>
                      <span className="block text-xs text-[#525866]">
                        Suaviza transições de tela e rolagens automáticas.
                      </span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                      prefs.reduceMotion ? 'bg-[#183EFF] text-white' : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {prefs.reduceMotion ? 'Ativo' : 'Desligado'}
                  </span>
                </button>
              </div>

              {speechAvailable && (
                <div className="rounded-xl border border-[#D7E0FF] bg-[#F5F8FF] p-3.5 text-xs text-[#1E2B58] flex items-start gap-2.5">
                  <Volume2 className="h-4 w-4 shrink-0 text-[#183EFF] mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">
                    <strong>Leitura em voz alta ativa:</strong> use o botão <strong>Ouvir</strong> nas
                    etapas, questões e discursivas para escutar os enunciados e feedbacks pelo áudio do
                    seu celular.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={resetPrefs}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#CBD5E1] px-3.5 py-2 text-xs font-bold text-[#475569] hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Restaurar padrão</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] rounded-xl bg-[#183EFF] px-5 py-2 text-xs font-extrabold text-white hover:bg-[#1230CC] cursor-pointer"
                >
                  Concluir ajustes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
