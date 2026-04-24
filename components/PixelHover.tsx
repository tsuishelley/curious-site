'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const CORNER_SIZE = 0.4;
const FILL_RATIO = 0.6;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  cols?: number;
  rows?: number;
  color?: string;
  children?: React.ReactNode;
  className?: string;
  src?: string;
  alt?: string;
}

export function usePixelHover(cols: number, rows: number) {
  const [hovered, setHovered] = useState(false);
  const [visibleCells, setVisibleCells] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const visibleRef = useRef<Set<number>>(new Set());

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const startAnimation = () => {
    clearTimers();
    setHovered(true);

    const cornerCols = Math.ceil(cols * CORNER_SIZE);
    const cornerRows = Math.ceil(rows * CORNER_SIZE);
    const diagonal = Math.random() < 0.5 ? 'tlbr' : 'trbl';

    const cornerCells: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const inA = diagonal === 'tlbr'
          ? (r < cornerRows && c < cornerCols)
          : (r < cornerRows && c >= cols - cornerCols);
        const inB = diagonal === 'tlbr'
          ? (r >= rows - cornerRows && c >= cols - cornerCols)
          : (r >= rows - cornerRows && c < cornerCols);
        if (inA || inB) cornerCells.push(r * cols + c);
      }
    }

    const count = Math.floor(cornerCells.length * FILL_RATIO);
    const chosen = shuffle(cornerCells).slice(0, count);
    const newSet = new Set<number>();
    visibleRef.current = newSet;

    timerRef.current = chosen.map((cellIdx, i) =>
      setTimeout(() => {
        newSet.add(cellIdx);
        setVisibleCells(new Set(newSet));
      }, i * 14)
    );
  };

  const stopAnimation = () => {
    clearTimers();
    const current = shuffle([...visibleRef.current]);
    const leaving = new Set(visibleRef.current);
    visibleRef.current = new Set();

    timerRef.current = current.map((cellIdx, i) =>
      setTimeout(() => {
        leaving.delete(cellIdx);
        setVisibleCells(new Set(leaving));
        if (i === current.length - 1) {
          setHovered(false);
        }
      }, i * 14)
    );

    if (current.length === 0) {
      setHovered(false);
    }
  };

  useEffect(() => () => clearTimers(), []);

  return { hovered, visibleCells, startAnimation, stopAnimation };
}

export default function PixelHover({
  cols = 10,
  rows = 12,
  color = 'var(--red)',
  src,
  alt = '',
}: Props) {
  const { hovered, visibleCells, startAnimation, stopAnimation } = usePixelHover(cols, rows);
  const total = cols * rows;

  return (
    <div
      className="pixel-hover-wrap"
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="team-photo-img"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      ) : (
        <div className="team-photo" />
      )}

      {hovered && (
        <div
          className="pixel-grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="pixel-cell"
              style={{
                background: color,
                opacity: visibleCells.has(i) ? 1 : 0,
                transition: 'opacity 0.12s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
