import { FC } from 'react';

import { MonitorTypes } from '@/types/datasets';

import DatasetsList from '@/components/datasets-list';

const MonitorDisplay: FC<{ monitor: MonitorTypes }> = ({ monitor }) => {
  const { geostories } = monitor;

  return (
    <div>
      {geostories.map(({ id, layers }) => (
        <DatasetsList key={id} data={layers} />
      ))}
    </div>
  );
};

export default MonitorDisplay;
