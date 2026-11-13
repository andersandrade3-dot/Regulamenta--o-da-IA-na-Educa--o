import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, BookOpen, Download, ExternalLink, Search, X } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import {
  MEC_DOCUMENT_INFO,
  REFERENCE_LIBRARY,
  type ReferenceCategory,
} from '../../data/mecReferences';

const CATEGORY_FILTERS: { id: 'all' | ReferenceCategory; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'base_mec', label: 'Documento Base' },
  { id: 'legislacao_br', label: 'LGPD, ECA Digital e Leis' },
  { id: 'normativos_mec', label: 'MEC e Pesquisas BR' },
  { id: 'unesco_internacional', label: 'UNESCO e Internacionais' },
];

export const ReferenceDrawer: React.FC = () => {
  const { isReferenceDrawerOpen, setReferenceDrawerOpen } = useMission();
  const [category, setCategory] = useState<'all' | ReferenceCategory>('all');
  const [query, setQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReferenceDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReferenceDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReferenceDrawerOpen, setReferenceDrawerOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCE_LIBRARY.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.citation.toLowerCase().includes(q) ||
        item.pagesInMecPdf.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  if (!isReferenceDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0B1228]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-library-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setReferenceDrawerOpen(false);
        }
      }}
    >
      <div className="flex h-dvh max-h-dvh w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl">
        {/* Cabeçalho compacto fixo */}
        <div className="shrink-0 flex items-center justify-between gap-3 bg-[#183EFF] px-5 py-3.5 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFD000] text-[#183EFF]">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="ref-library-title" className="font-editorial text-base sm:text-lg font-extrabold truncate">
                Biblioteca de Referências
              </h2>
              <p className="text-xs text-white/85 truncate">
                Publicação oficial do MEC (2026), legislação brasileira e referenciais da UNESCO
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReferenceDrawerOpen(false)}
            aria-label="Fechar Biblioteca de Referências"
            className="shrink-0 rounded-lg bg-white/15 p-2 text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corpo único rolável — garante leitura integral em qualquer altura de tela */}
        <div
          ref={scrollContainerRef}
          data-testid="reference-drawer-scroll"
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[#FAFBFD]"
        >
          {/* Identificação do documento-base */}
          <div className="border-b border-[#E2E8F0] bg-[#F5F8FF] px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <span className="inline-block rounded-full bg-[#183EFF] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Fonte Primária da Atividade
                </span>
                <h3 className="font-editorial text-sm font-bold text-[#22252B]">
                  {MEC_DOCUMENT_INFO.title}
                </h3>
                <p className="text-xs text-[#475569]">{MEC_DOCUMENT_INFO.institution}</p>
                <p className="text-[11px] text-[#525866]">
                  {MEC_DOCUMENT_INFO.cooperation} • {MEC_DOCUMENT_INFO.year}
                </p>
              </div>

              <a
                href="/ia-basica.pdf"
                download="ia-basica.pdf"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#FFD000] px-3.5 py-2 text-xs font-extrabold text-[#183EFF] hover:bg-[#F5C400] transition-colors"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                Baixar PDF (ia-basica.pdf)
              </a>
            </div>

            {/* Mapa dos capítulos */}
            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {MEC_DOCUMENT_INFO.chapters.map((ch) => (
                <div
                  key={ch.number}
                  className="rounded-lg border border-[#D7E0FF] bg-white px-2.5 py-1.5 text-[11px]"
                >
                  <span className="font-bold text-[#183EFF]">
                    {ch.number} ({ch.pages}):
                  </span>{' '}
                  <span className="text-[#3C3C3C]">{ch.highlights}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Busca e filtros */}
          <div className="border-b border-[#E2E8F0] px-5 py-3.5 space-y-2.5 bg-white">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por LGPD, ECA Digital, UNESCO, página..."
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] py-2 pl-9 pr-3 text-sm text-[#22252B] focus:border-[#183EFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183EFF]/20"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategory(f.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      category === f.id
                        ? 'bg-[#183EFF] text-white'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-semibold text-[#525866]">
                Exibindo {filtered.length} de {REFERENCE_LIBRARY.length} referências
              </span>
            </div>
          </div>

          {/* Lista de referências */}
          <div className="px-5 py-4 pb-10 space-y-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-[#D7DCE6] bg-white p-4 shadow-2xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-bold text-[#183EFF]">
                    {item.categoryLabel}
                  </span>
                  <span className="font-badge rounded-full bg-[#FFF8D6] px-2.5 py-0.5 text-[11px] font-bold text-[#7A5900]">
                    No PDF do MEC: {item.pagesInMecPdf}
                  </span>
                </div>
                <h4 className="font-editorial text-sm font-bold text-[#22252B]">{item.title}</h4>
                <p className="font-body text-xs leading-relaxed text-[#3C3C3C]">{item.summary}</p>
                <p className="rounded-lg bg-[#F8FAFC] p-2.5 text-[11px] text-[#475569] border border-[#E2E8F0]">
                  {item.citation}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#183EFF] hover:underline"
                  >
                    <span>Consultar fonte oficial citada no documento</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}

            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-[#525866]">
                Nenhuma referência encontrada para "{query}".
              </p>
            )}

            {filtered.length > 0 && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D7E0FF] bg-white px-3.5 py-1.5 text-xs font-bold text-[#183EFF] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Voltar ao topo da Biblioteca</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>