import React from 'react';

interface BarcodeGraphicProps {
  value: string;
  height?: number;
  className?: string;
}

/**
 * Generates a deterministic crisp SVG Code-128 style vertical bar pattern
 * from an ISBN or call number string.
 */
export const BarcodeGraphic: React.FC<BarcodeGraphicProps> = ({
  value,
  height = 38,
  className = '',
}) => {
  const clean = value.replace(/[^0-9A-Za-z]/g, '') || '9786020388214';
  const bars: Array<{ x: number; width: number }> = [];

  // Start guard pattern
  bars.push({ x: 0, width: 2 });
  bars.push({ x: 3, width: 1 });
  bars.push({ x: 6, width: 2 });

  let cursor = 10;
  for (let i = 0; i < Math.max(clean.length, 13); i++) {
    const code = clean.charCodeAt(i % clean.length);
    const w1 = (code % 3) + 1;
    const gap1 = ((code >> 1) % 2) + 1;
    const w2 = ((code >> 2) % 2) + 1;
    const gap2 = ((code >> 3) % 2) + 1;

    bars.push({ x: cursor, width: w1 });
    cursor += w1 + gap1;
    bars.push({ x: cursor, width: w2 });
    cursor += w2 + gap2;
  }

  // Stop guard pattern
  bars.push({ x: cursor, width: 2 });
  bars.push({ x: cursor + 4, width: 1 });
  bars.push({ x: cursor + 6, width: 2 });
  const totalWidth = cursor + 9;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className={`w-full max-w-[210px] ${className}`}
      role="img"
      aria-label={`Barcode ${value}`}
    >
      {bars.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y={0}
          width={bar.width}
          height={height}
          fill="#2C1E16"
        />
      ))}
    </svg>
  );
};
