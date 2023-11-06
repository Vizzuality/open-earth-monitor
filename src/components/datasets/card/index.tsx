import { FC, useCallback } from 'react';

import { FiInfo } from 'react-icons/fi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { LuLayers } from 'react-icons/lu';

import cn from '@/lib/classnames';

import type { LayerParsed } from '@/types/layers';

import TimeSeries from '@/components/timeseries';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useSyncLayersSettings } from '../../../hooks/sync-query';

type DatasetCardProps = LayerParsed & {
  id: string;
  active?: string;
  autoPlay?: boolean;
};

const DatasetCard: FC<DatasetCardProps> = ({
  id,
  title,
  download_url,
  description,
  author,
  gs_style: legendStyles,
  range,
  autoPlay = true,
}) => {
  const [layers, setLayers] = useSyncLayersSettings();
  const isActive = layers?.[0]?.id;

  /**
   * Handle click on the toggle button
   */
  const handleClick = useCallback(() => {
    return isActive !== id
      ? setLayers([
          {
            opacity: layers?.[0]?.opacity ?? 1,
            date: layers?.[0]?.date || range?.[0]?.value,
            id,
          },
        ])
      : setLayers(null);
  }, [isActive, id, setLayers, layers, range]);

  return (
    <div className="space-y-6 bg-brand-300 p-6" data-testid={`dataset-item-${id}`}>
      <div className="flex items-start justify-between space-x-4">
        <h2 data-testid="dataset-title" className="font-satoshi text-2xl font-bold">
          {title}
        </h2>
        <div className="mt-1.5 flex items-baseline space-x-2">
          <Popover>
            <PopoverTrigger data-testid="dataset-info-button">
              <FiInfo className="h-6 w-6" title="Show info" />
            </PopoverTrigger>
            <PopoverContent align="center" sideOffset={5} data-testid="dataset-info-content">
              <div className="flex flex-col">
                <ul>
                  <li>Data author: {author}</li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>
          {!!download_url && (
            <a
              href={download_url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="dataset-download-button"
              title="Go to download dataset site"
            >
              <HiOutlineExternalLink className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>

      <p data-testid="dataset-description">{description}</p>

      {isActive && legendStyles && legendStyles.length > 8 && (
        <div className="columns-2 gap-2 space-y-1">
          {legendStyles.map(({ color, label }) => (
            <div
              key={label}
              className="flex items-baseline space-x-2"
              data-testid="dataset-legend-item"
            >
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="text-left text-xs opacity-50">{label}</div>
            </div>
          ))}
        </div>
      )}

      {isActive && legendStyles && legendStyles.length <= 8 && (
        <div className="flex">
          {legendStyles.map(({ color, label }) => (
            <div key={label} className="grow space-y-2" data-testid="dataset-legend-item">
              <div
                className="h-2 w-full"
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="text-center text-xs opacity-50">{label}</div>
            </div>
          ))}
        </div>
      )}

      {range && (
        <TimeSeries range={range} layerId={id} autoPlay={autoPlay} isActive={id === isActive} />
      )}

      <button
        data-testid="dataset-layer-toggle-button"
        type="button"
        className={cn(
          'flex min-h-[38px] w-full items-center justify-center space-x-2 border-2 border-secondary-500 px-6 py-2 text-xs font-bold transition-colors hover:bg-secondary-500/20',
          {
            'bg-secondary-500 text-brand-500 hover:text-secondary-500': isActive === id,
          }
        )}
        onClick={() => void handleClick()}
      >
        <span>{isActive ? 'Hide' : 'Show'} layer on the map</span>
        <LuLayers className="h-3 w-3 text-inherit" title="layer" />
      </button>
    </div>
  );
};

export default DatasetCard;
