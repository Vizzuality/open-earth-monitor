import { useState, useEffect } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import { useLayerParsedSource } from '@/hooks/layers';
import { useURLayerParams } from '@/hooks/url-params';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import CompareDropdown from './compare';
import OpacitySetting from './opacity';
import RemoveLayer from './remove';
import LayerVisibility from './visibility';
const LEGEND_BUTTON_STYLES =
  'bg-brand-500 flex-1 text-center text-xs uppercase rounded font-medium grow px-2 h-[34px] py-1 tracking-wide text-white hover:bg-secondary-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed';

export const Legend = () => {
  const { layerId, date } = useURLayerParams();
  const { data } = useLayerParsedSource({ layer_id: layerId }, { enabled: !!layerId });
  const { title, range } = data ?? {};
  const [baseLayerDate, setBaseLayerDate] = useState(date);
  const [compareDate, setCompareDate] = useState('20000101_20000131');
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'layer-settings' | 'compare-layers'>('layer-settings');

  const handleTabChange = (value: 'layer-settings' | 'compare-layers') => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (activeTab === 'compare-layers') {
      const encodedLayers = encodeURIComponent(
        JSON.stringify({
          id: layerId,
          opacity: 1,
          date: baseLayerDate,
        })
      );

      const encodedCompareLayers = encodeURIComponent(
        JSON.stringify({
          id: layerId,
          opacity: 1,
          date: compareDate,
        })
      );

      const url = `${pathname}/?layers=[${encodedLayers}]&compareLayers=[${encodedCompareLayers}]`;
      router.replace(url);
    }
  }, [baseLayerDate, compareDate, layerId, pathname, router, activeTab]);
  return (
    <div
      className="absolute bottom-3 right-3 z-10 space-y-1 font-inter text-xs text-secondary-500"
      data-testid="map-legend"
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        defaultValue="layer-settings"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger
            data-testid="map-legend-toggle-button"
            value="layer-settings"
            className={cn(LEGEND_BUTTON_STYLES)}
          >
            Layer
          </TabsTrigger>
          <TabsTrigger
            value="compare-layers"
            className={cn(LEGEND_BUTTON_STYLES)}
            disabled={!range || range.length === 0}
            data-testid="map-legend-compare-button"
          >
            Compare
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layer-settings">
          <div
            className="relative flex min-h-[34px] items-center justify-between space-x-4 rounded-sm border border-gray-600 bg-brand-500 px-4 py-3 text-secondary-500"
            data-testid="map-legend-item"
          >
            <div data-testid="map-legend-item-title" className="text-xs font-bold">
              {title}
            </div>
            <div
              className="flex space-x-2 divide-x divide-secondary-900"
              data-testid="map-legend-item-toolbar"
            >
              <div className="flex space-x-2">
                <OpacitySetting />
                <LayerVisibility />
              </div>
              <RemoveLayer className="pl-2" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="compare-layers">
          <div
            className={cn(
              'relative flex min-h-[34px] flex-col items-center justify-between space-x-4 space-y-6 rounded-sm border border-gray-600 bg-brand-500 px-4 py-3 text-secondary-500'
            )}
            data-testid="map-legend-item"
          >
            <div data-testid="map-legend-item-title" className="text-xs font-bold">
              {title}
            </div>

            <div className="flex w-full flex-col space-y-6">
              <CompareDropdown
                selectedDate={baseLayerDate as string}
                setDate={setBaseLayerDate}
                dates={range}
              />
              <CompareDropdown selectedDate={compareDate} setDate={setCompareDate} dates={range} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Legend;
