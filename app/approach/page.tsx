import type { Metadata } from 'next';
import ApproachScroll from '@/components/ApproachScroll';

export const metadata: Metadata = { title: 'Approach' };

export default function ApproachPage() {
  return <ApproachScroll />;
}
