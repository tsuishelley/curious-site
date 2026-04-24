import Link from 'next/link';
import PageHeroHeadline from '@/components/PageHeroHeadline';

interface Line {
  text: string;
  italic?: boolean;
}

interface PageHeroProps {
  lines: Line[];
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function PageHero({ lines, description, primaryCta, secondaryCta }: PageHeroProps) {
  return (
    <section className="hero">
      <div className="hero-left">
        <PageHeroHeadline lines={lines} />
      </div>
      <div className="hero-right page-hero-right">
        <p className="hero-description">{description}</p>
        {(primaryCta || secondaryCta) && (
          <div className="hero-ctas">
            {primaryCta && (
              <Link href={primaryCta.href} className="btn btn-dark btn-sm">{primaryCta.label}</Link>
            )}
            {secondaryCta && (
              <Link href={secondaryCta.href} className="btn btn-outline-dark btn-sm">{secondaryCta.label}</Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
