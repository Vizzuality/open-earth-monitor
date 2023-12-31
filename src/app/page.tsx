import type { NextPage, Metadata } from 'next';

import LandingDatasets from '@/components/datasets-grid';
import Footer from '@/components/footer';
import Hero from '@/components/hero';
import Prefooter from '@/components/prefooter';

export const metadata: Metadata = {
  title: 'Hub - Open Earth Monitor Cyberinfrastructure',
  description: '...',
};

const Hub: NextPage = () => (
  <>
    <Hero />
    <LandingDatasets />
    <Prefooter />
    <Footer />
  </>
);

export default Hub;
