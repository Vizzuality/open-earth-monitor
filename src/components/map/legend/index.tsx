import { useCallback, useState, useEffect } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import { useLayerParsedSource } from '@/hooks/layers';
import { useSyncCompareLayersSettings, useSyncLayersSettings } from '@/hooks/sync-query';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import OpacitySetting from './opacity';
import RemoveLayer from './remove';
import LayerVisibility from './visibility';

const LEGEND_BUTTON_STYLES =
  'bg-brand-500 flex-1 text-center text-xs uppercase rounded font-medium grow px-2 h-[34px] py-1 tracking-wide text-white hover:bg-secondary-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed';

const findLabel = (value, range) => range?.find((d) => d.value === value)?.label;

export const Legend = () => {
  const [layers, setLayers] = useSyncLayersSettings();
  const [compareLayers, setCompareLayers] = useSyncCompareLayersSettings();

  const { data } = useLayerParsedSource(
    { layer_id: layers?.[0]?.id },
    { enabled: !!layers?.length }
  );
  const { title, range } = data ?? {};

  const layerId = layers?.[0]?.id;
  const opacity = layers?.[0]?.opacity;
  const date = layers?.[0]?.date;

  const defaultCompareDate = compareLayers?.[0]?.date;

  const [activeTab, setActiveTab] = useState<'layer-settings' | 'compare-layers'>('layer-settings');

  const handleTabChange = (value: 'layer-settings' | 'compare-layers') => {
    setActiveTab(value);
  };

  const [baseDate, setBaseDate] = useState<string>(date);
  const [compareDate, setCompareDate] = useState<string>(defaultCompareDate);

  useEffect(() => {
    if (activeTab === 'compare-layers') {
      setLayers([{ id: layerId, opacity, date: baseDate }]);
      setCompareLayers([{ id: layerId, opacity, date: compareDate }]);
    } else {
      setLayers([{ id: layerId, opacity, date: baseDate }]);
      setCompareLayers(null);
    }
  }, [baseDate, compareDate, layerId, activeTab, setLayers, setCompareLayers, opacity]);

  const baseDateLabel = findLabel(baseDate, range);
  const CompareDateLabel = findLabel(compareDate, range);

  return (
    <div
      className="absolute bottom-3 right-3 z-10 space-y-1 font-inter text-xs"
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
            data-testid="map-legend-compare-button"
            disabled={!range || range.length === 0}
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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex w-full justify-between">
                    <span>Selected year: {baseDateLabel}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-brand-500">
                  {range?.map((d) => (
                    <DropdownMenuItem key={d.value}>
                      <button type="button" onClick={() => setBaseDate(d.value)}>
                        {d.label}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex w-full justify-between">
                    <span>Selected year: {CompareDateLabel}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-brand-500">
                  {range?.map((d) => (
                    <DropdownMenuItem key={d.value}>
                      <button type="button" onClick={() => setCompareDate(d.value)}>
                        {d.label}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Legend;
