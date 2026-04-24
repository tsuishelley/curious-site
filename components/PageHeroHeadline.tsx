'use client';

import { useEffect, useState } from 'react';

interface Line {
  text: string;
  italic?: boolean;
}

interface Props {
  lines: Line[];
}

export default function PageHeroHeadline({ lines }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <h1 className="hero-headline">
      {lines.map((line, i) => (
        <span key={i} className="hero-line-wrap">
          <span
            className={`hero-line${visible ? ' hero-line--visible' : ''}${line.italic ? ' italic-serif' : ''}`}
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            {line.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
