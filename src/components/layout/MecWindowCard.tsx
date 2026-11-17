import React from 'react';
import { Search } from 'lucide-react';

interface MecWindowCardProps {
  title: string;
  variant?: 'dots' | 'controls' | 'search-pill' | 'callout';
  accent?: 'blue' | 'yellow';
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export const MecWindowCard: React.FC<MecWindowCardProps> = ({
  title,
  variant = 'dots',
  accent = 'blue',
  children,
  className = '',
  headerRight,
}) => {
  if (variant === 'search-pill') {
    return (
      <section
        className={`rounded-2xl border-[1.5px] border-[#183EFF] bg-[#183EFF] p-3 sm:p-5 shadow-sm ${className}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl sm:rounded-full bg-white px-4 py-2.5 shadow-sm">
          <h3 className="font-editorial text-sm sm:text-base font-bold text-[#22252B] leading-snug break-words">
            {title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            {headerRight}
            <Search className="h-4 w-4 text-[#183EFF]" aria-hidden="true" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 sm:p-6 text-[#22252B]">{children}</div>
      </section>
    );
  }

  if (variant === 'callout') {
    const borderClass = accent === 'yellow' ? 'border-[#E6B800] bg-[#FFFDF0]' : 'border-[#183EFF] bg-white';
    const headerBorder = accent === 'yellow' ? 'border-[#F3DF7C] text-[#1E2430]' : 'border-[#D7E0FF] text-[#183EFF]';
    return (
      <section className={`rounded-2xl border-[1.5px] ${borderClass} p-4 sm:p-5 shadow-xs ${className}`}>
        <div className={`mb-3 flex items-center justify-between gap-3 border-b pb-2.5 ${headerBorder}`}>
          <h3 className="font-editorial text-sm sm:text-base font-bold">{title}</h3>
          {headerRight}
        </div>
        <div>{children}</div>
      </section>
    );
  }

  return (
    <section
      className={`overflow-hidden rounded-2xl border-[1.5px] border-[#183EFF] bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 bg-[#183EFF] px-4 py-2.5 text-white">
        <div className="flex items-center gap-3 min-w-0">
          {variant === 'dots' && (
            <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00D000]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFD000]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF0000]" />
            </div>
          )}
          <h3 className="font-editorial text-sm sm:text-base font-bold leading-snug break-words">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {headerRight}
          {variant === 'controls' && (
            <span
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold opacity-80 select-none"
              aria-hidden="true"
            >
              <span>—</span>
              <span>□</span>
              <span>×</span>
            </span>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
};

