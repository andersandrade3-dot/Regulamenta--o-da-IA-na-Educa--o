import React from 'react';

export const ChapterPillBadge: React.FC<{
  label: string;
  number: string | number;
  inverted?: boolean;
}> = ({ label, number, inverted = false }) => (
  <div
    className={`inline-flex items-center rounded-full pl-3.5 pr-1 py-1 text-xs font-extrabold tracking-wide uppercase shadow-xs ${
      inverted
        ? 'bg-white text-[#183EFF]'
        : 'bg-[#183EFF] text-white'
    }`}
  >
    <span className="mr-2.5 font-editorial">{label}</span>
    <span className="font-badge inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD000] text-sm font-extrabold text-[#183EFF]">
      {number}
    </span>
  </div>
);

export const BauhausTriangles: React.FC<{ color?: 'yellow' | 'red'; className?: string }> = ({
  color = 'yellow',
  className = '',
}) => {
  const fill = color === 'yellow' ? '#FFD000' : '#FF0000';
  return (
    <svg
      width="54"
      height="16"
      viewBox="0 0 54 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon points="0,0 14,8 0,16" fill={fill} />
      <polygon points="19,0 33,8 19,16" fill={fill} />
      <polygon points="38,0 52,8 38,16" fill={fill} />
    </svg>
  );
};

export const BauhausBowls: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 4H52C52 17.2548 41.2548 28 28 28C14.7452 28 4 17.2548 4 4Z" fill="#FFD000" />
    <path d="M4 30H52C52 43.2548 41.2548 54 28 54C14.7452 54 4 43.2548 4 30Z" fill="#FF0000" />
  </svg>
);

export const NumberedYellowDot: React.FC<{
  number: number;
  size?: 'sm' | 'md';
}> = ({ number, size = 'md' }) => {
  const dims = size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm';
  return (
    <span
      className={`font-badge inline-flex shrink-0 items-center justify-center rounded-full bg-[#FFD000] font-extrabold text-[#183EFF] shadow-2xs ${dims}`}
    >
      {number}
    </span>
  );
};

