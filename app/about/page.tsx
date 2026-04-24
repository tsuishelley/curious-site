import type { Metadata } from 'next';
import PixelHover from '@/components/PixelHover';
import PageHero from '@/components/PageHero';
import { asset } from '@/lib/basePath';

export const metadata: Metadata = { title: 'About' };

const TEAM = [
  { name: 'Andrew Dumont', role: 'Founder and CEO',           photo: '/images/andrew.avif' },
  { name: 'Kathy Xu',      role: 'Finance Lead',              photo: '/images/kathy.jpeg' },
  { name: 'Phil Trench',   role: 'Investment Lead',           photo: '/images/phil.avif' },
  { name: 'Justin Diraddio', role: 'Investment Analyst',      photo: '/images/justin.avif' },
  { name: 'Shelley Tsui',  role: 'Product and Design Lead',   photo: '/images/shelley.avif' },
  { name: 'Kirstey Smith', role: 'Operations Lead',           photo: '/images/kirstey.avif' },
  { name: 'Nicholas Thoni',   role: 'CEO of Convox',    photo: '/images/nick.avif' },
  { name: 'Samantha Forster', role: 'CEO of Buildfire', photo: '/images/sam.avif' },
  { name: 'Jessica Gertig',   role: 'CEO of Polymer',   photo: '/images/jess.avif' },
  { name: 'Srey Sankar',      role: 'CEO of Avenue',    photo: '/images/srey.avif' },
  { name: 'Jennifer Cullem',  role: 'CEO of Uservoice', photo: '/images/jen.avif' },
  { name: 'Eva Shang',        role: 'Finance Analyst',        photo: '/images/eva.avif' },
];

const HOW_WE_WORK = [
  {
    title: 'Decades, not Days',
    body: "We're long-term minded. That is apparent in everything we do — the companies we choose to operate, the way we treat people, the decisions we make, the way we show up. Our word is our bond and legacy is our guide.",
  },
  {
    title: 'Relentlessly Curious',
    body: "This is a place for the intellectually curious. The people that aren't satisfied with good enough. We love the work we do, we think creatively, and question the status quo. The way it's been done isn't necessarily the way it needs to be done.",
  },
  {
    title: 'Simply Transparent',
    body: "We operate with radical honesty and don't overcomplicate. We believe in turning on the lights to expose the facts and distilling down complicated things to simple actions. Bureaucracy kills and movement is our version of perfection.",
  },
  {
    title: 'Fully Autonomous',
    body: "We are built with people that are great at what they do and focus on the work. Curious is a place that allows them to fully realize that potential. We believe in our individual expertise and operate with earned trust as a core belief.",
  },
  {
    title: 'Once Curious, Always Curious',
    body: "Our people make us, both at head office and at our portfolio companies. We know that. Every person that joins us is always part of the Curious family, while they're here, and more importantly, long after.",
  },
  {
    title: 'Adversity Seekers',
    body: "We seek out adversity and lean into challenging situations. We care more about the quality of a person than their pedigree. We're underdogs. We love the journey more than the destination and constantly seek new mountains to climb.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        lines={[
          { text: "We're builders who believe the" },
          { text: "best companies are built over" },
          { text: "decades, not quarters." },
        ]}
        description="Our team of operators bring over two decades of lived experience in customer acquisition, growth, product design, and financial management to help Curious businesses grow more sustainably."
        primaryCta={{ label: 'Join Our Team', href: "https://careers.curious.vc/" }}
      />

      <section className="about-section">
<div className="team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="team-member" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              <PixelHover src={asset(member.photo)} alt={member.name} />
              <div className="team-card-body">
                <p className="team-name">{member.name}</p>
                <p className="team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="how-we-work-section">
        <h2 className="how-we-work-title">How we work</h2>
        <div className="how-we-work-list">
          {HOW_WE_WORK.map((v) => (
            <div key={v.title} className="how-we-work-row">
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
