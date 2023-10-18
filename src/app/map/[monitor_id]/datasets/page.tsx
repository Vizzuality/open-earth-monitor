import { notFound } from 'next/navigation';

import type { Metadata, NextPage } from 'next';

import { useMonitorLayers } from '@/hooks/monitors';

import DatasetCard from '@/components/datasets/card';
import Loading from '@/components/loading';

export const metadata: Metadata = {
  title: 'Hub - Open Earth Monitor Cyberinfrastructure',
  description: '...',
};

const DatasetsPage: NextPage<{ params: { monitor_id: string } }> = ({ params: { monitor_id } }) => {
  const { data, isLoading, isFetched, isError } = useMonitorLayers({ monitor_id });

  if (!isError) return notFound();

  return (
    <div>
      {isLoading && <Loading />}
      {isFetched && !isError && (
        <ul className="space-y-6 text-secondary-500" data-testid="datasets-list">
          {data.map((dataset, index) => (
            <li key={dataset.layer_id}>
              <DatasetCard {...dataset} id={dataset.layer_id} active={index === 0} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DatasetsPage;
