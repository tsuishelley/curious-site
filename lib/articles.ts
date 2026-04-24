export interface Article {
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  slug: string;
  readTime?: string;
  author?: string;
  body?: string;
}

export const ARTICLES: Article[] = [
  {
    title: 'Shaping Insight: Uservoice Brand Evolution',
    subtitle: 'How a 15-year-old feedback platform found a new visual identity without losing what made it trusted.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution',
    readTime: '5 min read',
    author: 'Andrew Dumont',
    body: `UserVoice has been the backbone of product feedback for thousands of software teams since 2008. When we acquired the company in late 2025, we inherited something rare: a product people genuinely relied on. The challenge wasn't fixing what was broken — it was modernizing what worked without erasing the trust that had accumulated over 15 years.

The first thing we noticed was a gap between how the product felt and how good the underlying software actually was. The interface carried the aesthetic weight of a different era. Menus that required too many clicks. Typography that felt like a holdover from a different decade. A color palette that had never been deliberately chosen — it had just happened.

We started by talking to customers. Not about design — about what they trusted. What they feared losing. The answers were consistent: reliability, transparency, and a sense that the software had been built by people who understood enterprise feedback loops at a deep level.

That gave us our brief. The new identity needed to feel considered without feeling cold. Modern without feeling like a rebrand for its own sake. We landed on a system built around clarity — clean type, generous whitespace, and a palette anchored in a warm slate that felt professional without the sterility of pure grays.

The result is a product that looks like it belongs in 2026, while feeling like it was built by the same team customers have trusted since the beginning. That continuity matters more than most people realize.`,
  },
  {
    title: "The Free Trial Trap: Why More Product Exposure Isn't Always Better",
    subtitle: 'Extending trial periods and expanding feature access sounds like good growth strategy. The data tells a different story.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'free-trial-trap',
    readTime: '7 min read',
    author: 'Phil Trench',
    body: `There's a well-worn playbook in B2B SaaS: when conversion rates dip, extend the trial. Give users more time, more features, more runway to fall in love with the product. It's intuitive. It's also frequently wrong.

Across the portfolio companies we operate, we've run enough conversion experiments to see a consistent pattern emerge. Beyond a certain threshold — usually around 14 days — longer trials don't improve conversion rates. They delay them, which sounds similar but isn't. Delayed conversions carry lower lifetime value, higher early churn, and weaker product attachment scores.

The mechanism is counterintuitive but makes sense once you see it. A trial with a clear end date creates urgency. Urgency drives engagement. Engagement drives the specific moments — usually two or three key actions in the first week — that predict long-term retention. Extend the trial, and you push those moments further out. Some users never reach them.

Feature gating compounds the problem in the opposite direction. When you give trial users access to everything, they often explore the wrong things first. Power features that require configuration. Integrations that don't work without a full team. They hit friction before they hit value, and they churn before the product has a chance to prove itself.

The better approach: a shorter trial, a narrower feature set chosen specifically to deliver the core value proposition quickly, and a deliberate onboarding sequence that gets users to their first meaningful outcome within 48 hours. It requires more up-front work. It consistently outperforms the open-access approach.`,
  },
  {
    title: 'Shaping Insight: Uservoice Brand Evolution',
    subtitle: 'How a 15-year-old feedback platform found a new visual identity without losing what made it trusted.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution-2',
    readTime: '5 min read',
    author: 'Andrew Dumont',
  },
  {
    title: 'Shaping Insight: Uservoice Brand Evolution',
    subtitle: 'How a 15-year-old feedback platform found a new visual identity.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution-3',
    readTime: '5 min read',
    author: 'Andrew Dumont',
  },
  {
    title: "The Free Trial Trap: Why More Product Exposure Isn't Always Better",
    subtitle: 'Extending trial periods and expanding feature access sounds like good growth strategy.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'free-trial-trap-2',
    readTime: '7 min read',
    author: 'Phil Trench',
  },
  {
    title: 'Shaping Insight: Uservoice Brand Evolution',
    subtitle: 'How a 15-year-old feedback platform found a new visual identity.',
    category: 'Perspective',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution-4',
    readTime: '5 min read',
    author: 'Andrew Dumont',
  },
  {
    title: 'Curious Acquires Uservoice',
    subtitle: "We're excited to welcome UserVoice and its team to the Curious portfolio.",
    category: 'Announcements',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution-5',
    readTime: '3 min read',
    author: 'Andrew Dumont',
  },
  {
    title: "The Free Trial Trap: Why More Product Exposure Isn't Always Better",
    subtitle: 'Extending trial periods sounds like good growth strategy. The data says otherwise.',
    category: 'Announcements',
    date: 'March 19, 2026',
    slug: 'free-trial-trap-3',
    readTime: '7 min read',
    author: 'Phil Trench',
  },
  {
    title: 'Shaping Insight: Uservoice Brand Evolution',
    subtitle: 'How a 15-year-old feedback platform found a new visual identity.',
    category: 'Portfolio Updates',
    date: 'March 19, 2026',
    slug: 'uservoice-brand-evolution-6',
    readTime: '5 min read',
    author: 'Andrew Dumont',
  },
  {
    title: 'Curious Acquires Buildfire',
    subtitle: "We're proud to welcome Buildfire and its team to the Curious family.",
    category: 'Announcements',
    date: 'February 28, 2026',
    slug: 'curious-acquires-buildfire',
    readTime: '3 min read',
    author: 'Andrew Dumont',
  },
  {
    title: 'Why We Bet on Boring Software',
    subtitle: 'The most durable businesses in our portfolio share one trait: they solve problems nobody talks about.',
    category: 'Perspective',
    date: 'February 14, 2026',
    slug: 'why-we-bet-on-boring-software',
    readTime: '6 min read',
    author: 'Phil Trench',
  },
  {
    title: 'Avenue Q1 2026 Update',
    subtitle: 'Revenue up 18% quarter-over-quarter. A look at what drove growth and what we are building next.',
    category: 'Portfolio Updates',
    date: 'February 5, 2026',
    slug: 'avenue-q1-2026-update',
    readTime: '4 min read',
    author: 'Srey Sankar',
  },
  {
    title: "The Operator's Edge",
    subtitle: "Why former founders make better investors — and why that still isn't enough.",
    category: 'Perspective',
    date: 'January 22, 2026',
    slug: 'the-operators-edge',
    readTime: '8 min read',
    author: 'Andrew Dumont',
  },
  {
    title: 'Convox 2026 Roadmap',
    subtitle: 'A preview of what the Convox team is shipping this year and the thinking behind it.',
    category: 'Portfolio Updates',
    date: 'January 10, 2026',
    slug: 'convox-2026-roadmap',
    readTime: '5 min read',
    author: 'Nicholas Thoni',
  },
  {
    title: 'Curious Year in Review: 2025',
    subtitle: 'Five acquisitions, three new team members, and one lesson we keep relearning.',
    category: 'Announcements',
    date: 'December 31, 2025',
    slug: 'year-in-review-2025',
    readTime: '6 min read',
    author: 'Andrew Dumont',
  },
];
