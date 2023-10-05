import type { GeoStory } from './geostories';

export type Monitor = {
  author: string;
  coverage: string;
  date_created: string;
  description: string;
  geostories: GeoStory[];
  id: string;
  title: string;
};

export type MonitorParsed = Monitor & { color: string; colorOpacity: string };
