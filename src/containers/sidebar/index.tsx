'use client';
import { FC, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useMonitor, useMonitors } from '@/hooks/monitors';

import Loading from '@/components/loading';
import MonitorDisplay from '@/components/monitors-datasets-display';
import MonitorsDirectory from '@/components/monitors-directory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Sidebar: FC = () => {
  const [isMonitorsDirectoryOpen, setMonitorsDirectoryVisibility] = useState(false);
  const { data: monitors } = useMonitors();
  const defaultMonitor = monitors?.[0];
  const params = useSearchParams();
  const paramsMonitor = params.get('monitor_id');
  const monitor_id = useMemo<string>(
    () => paramsMonitor || defaultMonitor?.id,
    [paramsMonitor, defaultMonitor]
  );
  const { data, isLoading, isFetched, isError } = useMonitor({
    monitor_id: monitor_id,
  });
  const { title, description } = data;
  return (
    <aside className="absolute bottom-16 left-5 top-5 z-50 w-[30vw] min-w-[526px] overflow-y-auto bg-brand-600 p-7.5">
      {!isMonitorsDirectoryOpen && (
        <div className="space-y-2 bg-secondary-200 p-7.5 text-brand-600">
          <Button variant="dark" onClick={() => setMonitorsDirectoryVisibility(true)}>
            Monitors Directory
          </Button>
          <span className="inter text-xs">MONITOR</span>
          <h2 className="text-5xl">{title}</h2>
          <p>{description}</p>
        </div>
      )}
      {isMonitorsDirectoryOpen && <MonitorsDirectory />}
      {!isMonitorsDirectoryOpen && (
        <Tabs defaultValue="datasets">
          <TabsList>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="geostories">Geostories</TabsTrigger>
          </TabsList>
          <TabsContent value="datasets">
            {' '}
            {isLoading && <Loading visible={isLoading} />}
            {isFetched && !isError && <MonitorDisplay monitor={data} />}
          </TabsContent>
          <TabsContent value="geostories"> </TabsContent>
        </Tabs>
      )}
    </aside>
  );
};

export default Sidebar;
