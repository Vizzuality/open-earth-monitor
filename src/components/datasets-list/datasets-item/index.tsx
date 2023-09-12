'use client';
import { FC, useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/classnames';

import type { LayerSettingTypes } from '@//types/layers';

import { useLayerSource } from '@/hooks/map';

import ItemHeader from '@/components/datasets-list/datasets-item-header';
import { Button } from '@/components/ui/button';

export const DatasetsItem: FC<{ layer_id: string }> = ({ layer_id }) => {
  const { data } = useLayerSource({ layer_id });
  const { title, description, download_url } = data;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const layersId = params.get('layers');
  const layersIdParsed = useMemo<null | LayerSettingTypes[]>(() => {
    if (layersId === null) return null;
    else return JSON.parse(layersId) as LayerSettingTypes[];
  }, [layersId]);
  const layerId = useMemo<LayerSettingTypes['id']>(() => layersIdParsed?.[0]?.id, [layersIdParsed]);

  const isActive = layerId === layer_id;

  // Create the layers object
  const layersObject = { id: layer_id, opacity: 1 };

  // Encode the layers object as a JSON string
  const encodedLayers = decodeURIComponent(JSON.stringify(layersObject));

  // Construct the URL
  const url = `${pathname}/?layers=[${encodedLayers}]`;

  const handleClick = useCallback(() => {
    isActive ? router.replace(`${pathname}`) : router.replace(url);
  }, [pathname, router, isActive, url]);

  return (
    <li key={layer_id} className="space-y-6 border-b border-b-brand-200 p-7.5 ">
      <ItemHeader
        title={title}
        layer_id={layer_id}
        downloadUrlBase={download_url}
        // filename={filename}
        // range={range}
      />
      <p className="inter">{description}</p>

      <Button
        id={layer_id}
        type="button"
        className={cn({ 'w-full': true, '': isActive })}
        onClick={handleClick}
        variant={isActive ? 'default_active' : 'default'}
        size="sm"
      >
        {isActive ? 'Hide' : 'Show'} layer on the map
      </Button>
    </li>
  );
};

export default DatasetsItem;
