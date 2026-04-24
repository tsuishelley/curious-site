'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}

export default function SlideUpText({ text, className, as: Tag = 'h2' }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement>}>
      <span className="hero-line-wrap">
        <span
          className={`hero-line${visible ? ' hero-line--visible' : ''}`}
          style={{ animationDelay: visible ? '0.15s' : '0s' }}
        >{text}</span>
      </span>
    </Tag>
  );
}
