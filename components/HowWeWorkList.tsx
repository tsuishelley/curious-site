'use client';

import { useEffect, useRef, useState } from 'react';

interface Item {
  title: string;
  body: string;
}

function HowWeWorkRow({ title, body, delay }: Item & { delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`how-we-work-row how-we-work-row--anim${visible ? ' how-we-work-row--visible' : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function HowWeWorkList({ items }: { items: Item[] }) {
  return (
    <div className="how-we-work-list">
      {items.map((item, i) => (
        <HowWeWorkRow key={item.title} {...item} delay={0.5 + i * 0.08} />
      ))}
    </div>
  );
}
