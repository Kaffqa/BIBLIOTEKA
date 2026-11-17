import React from 'react';
import { Book, CoverTheme } from '../types/library';
import { extractAuthorCode } from '../utils/catalogLogic';

const THEME_STYLES: Record<
  CoverTheme,
  {
    bg: string;
    border: string;
    accentText: string;
    badgeBorder: string;
  }
> = {
  navy: {
    bg: '#16242F',
    border: '#2B3E4E',
    accentText: '#D5E1EA',
    badgeBorder: 'rgba(213, 225, 234, 0.35)',
  },
  terracotta: {
    bg: '#68281F',
    border: '#85392E',
    accentText: '#F2D9D0',
    badgeBorder: 'rgba(242, 217, 208, 0.35)',
  },
  forest: {
    bg: '#1D3326',
    border: '#2F4D3B',
    accentText: '#D4E4D9',
    badgeBorder: 'rgba(212, 228, 217, 0.35)',
  },
  espresso: {
    bg: '#3D2F24',
    border: '#564335',
    accentText: '#E8DDD1',
    badgeBorder: 'rgba(232, 221, 209, 0.35)',
  },
};

function resolveThemeStyle(rawTheme?: string) {
  if (!rawTheme) return THEME_STYLES.navy;
  if (rawTheme in THEME_STYLES) {
    return THEME_STYLES[rawTheme as CoverTheme];
  }
  const lower = String(rawTheme).toLowerCase();
  if (
    lower.includes('terra') ||
    lower.includes('burgundy') ||
    lower.includes('maroon') ||
    lower.includes('red') ||
    lower.includes('crimson')
  ) {
    return THEME_STYLES.terracotta;
  }
  if (
    lower.includes('forest') ||
    lower.includes('green') ||
    lower.includes('olive') ||
    lower.includes('sage')
  ) {
    return THEME_STYLES.forest;
  }
  if (
    lower.includes('espresso') ||
    lower.includes('brown') ||
    lower.includes('umber') ||
    lower.includes('leather') ||
    lower.includes('wood')
  ) {
    return THEME_STYLES.espresso;
  }
  return THEME_STYLES.navy;
}

interface BookCoverArtProps {
  book: Partial<
    Pick<
      Book,
      | 'title'
      | 'authors'
      | 'publisher'
      | 'year'
      | 'ddcCode'
      | 'coverTheme'
      | 'customCoverUrl'
    >
  >;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const BookCoverArt: React.FC<BookCoverArtProps> = ({
  book,
  size = 'md',
}) => {
  const safeBook = book || {};
  const theme = resolveThemeStyle(safeBook.coverTheme);
  const safeAuthors = Array.isArray(safeBook.authors) ? safeBook.authors : [];
  const authorInitial = extractAuthorCode(safeAuthors)[0] || 'B';
  const primaryAuthor = safeAuthors[0]?.name || 'Anonim';
  const ddcMain = String(safeBook.ddcCode || '000').slice(0, 3);
  const safeTitle = safeBook.title || 'Naskah Tanpa Judul';
  const safePublisher = String(safeBook.publisher || 'Pustaka Arsip').slice(
    0,
    18
  );
  const safeYear = safeBook.year || 2024;

  if (safeBook.customCoverUrl) {
    const dimClasses =
      size === 'xs'
        ? 'w-11 h-16'
        : size === 'sm'
        ? 'w-20 h-28'
        : size === 'lg'
        ? 'w-44 h-64'
        : 'w-full aspect-[2/3]';
    return (
      <div
        className={`relative overflow-hidden rounded-sm border border-[#2C1E16]/30 shadow-sm ${dimClasses}`}
      >
        <img
          src={safeBook.customCoverUrl}
          alt={`Sampul ${safeTitle}`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (size === 'xs') {
    return (
      <div
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
        className="relative flex h-16 w-12 shrink-0 flex-col justify-between rounded-[3px] border p-1.5 text-[#FAF7F2] shadow-xs select-none"
      >
        <div className="border-b border-white/15 pb-0.5 font-mono-code text-[6px] tracking-wider uppercase opacity-75">
          {ddcMain}
        </div>
        <div className="line-clamp-2 font-serif-editorial text-[7.5px] leading-tight font-medium">
          {safeTitle}
        </div>
        <div className="font-mono-code text-[5.5px] opacity-70 truncate">
          {safeYear}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: theme.bg, borderColor: theme.border }}
      className="relative flex aspect-[2/3] w-full flex-col justify-between rounded-[4px] border p-4 text-[#FAF7F2] shadow-md select-none"
    >
      {/* Spine fold highlight on left */}
      <div className="pointer-events-none absolute inset-y-0 left-2 w-[1px] bg-white/15" />

      {/* Top metadata badge & title */}
      <div className="pl-2">
        <span
          style={{ borderColor: theme.badgeBorder, color: theme.accentText }}
          className="inline-block rounded-[2px] border px-1.5 py-0.5 font-mono-code text-[8px] tracking-widest uppercase"
        >
          KLASIFIKASI {ddcMain}
        </span>
        <h4 className="mt-2.5 line-clamp-3 font-serif-editorial text-sm sm:text-base leading-snug font-semibold text-[#FAF7F2]">
          {safeTitle}
        </h4>
      </div>

      {/* Bottom monogram & author credit */}
      <div className="flex flex-col items-center pl-2 text-center">
        <div
          style={{ borderColor: theme.badgeBorder, color: theme.accentText }}
          className="mb-2 flex h-7 w-7 items-center justify-center rounded-full border font-serif-editorial text-xs italic"
        >
          {authorInitial}
        </div>
        <div className="line-clamp-1 font-serif-editorial text-[11px] italic text-[#FAF7F2]/90">
          {primaryAuthor}
        </div>
        <div className="mt-0.5 font-mono-code text-[8px] tracking-wider uppercase text-[#FAF7F2]/65">
          {safePublisher} • {safeYear}
        </div>
      </div>
    </div>
  );
};
