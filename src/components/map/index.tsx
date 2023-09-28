'use client';

import { useEffect, useState, useCallback, FC } from 'react';

import ReactMapGL, { ViewState, ViewStateChangeEvent, useMap } from 'react-map-gl';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import cx from 'clsx';
import MapLibreGL from 'maplibre-gl';

// import { useDebounce } from 'usehooks-ts';

import { DEFAULT_VIEWPORT } from './constants';
import type { CustomMapProps, ExplicitViewState } from './types';

const CustomMap: FC<CustomMapProps> = ({
  // * if no id is passed, react-map-gl will store the map reference in a 'default' key:
  // * https://github.com/visgl/react-map-gl/blob/ecb27c8d02db7dd09d8104e8c2011bda6aed4b6f/src/components/use-map.tsx#L18
  id = 'default',
  children,
  className,
  initialViewState,
  bounds,
  viewState,
  // onMapViewStateChange,
  dragPan,
  dragRotate,
  scrollZoom,
  doubleClickZoom,
  onLoad,
  ...mapboxProps
}: CustomMapProps) => {
  /**
   * REFS
   */
  const { [id]: mapRef } = useMap();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  /**
   * STATE
   */
  const [localViewState, setLocalViewState] = useState<Partial<ViewState> | ExplicitViewState>(
    !initialViewState
      ? {
          ...DEFAULT_VIEWPORT,
          ...viewState,
        }
      : {
          longitude: searchParams.get('longitude')
            ? Number(searchParams.get('longitude'))
            : DEFAULT_VIEWPORT.longitude,
          latitude: searchParams.get('latitude')
            ? Number(searchParams.get('latitude'))
            : DEFAULT_VIEWPORT.latitude,
          zoom: searchParams.get('zoom') ? Number(searchParams.get('zoom')) : DEFAULT_VIEWPORT.zoom,
        }
  );
  const [isFlying, setFlying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /**
   * CALLBACKS
   */
  // const debouncedViewStateChange = useDebounce((_viewState: ViewState) => {
  //   if (onMapViewStateChange) onMapViewStateChange(_viewState);
  // }, 250);

  const handleFitBounds = useCallback(() => {
    const { bbox, options } = bounds;

    // enabling fly mode avoids the map to be interrupted during the bounds transition
    setFlying(true);

    try {
      mapRef?.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        options
      );
    } catch (e) {
      setFlying(false);
      console.error(e);
    }
  }, [bounds, mapRef]);

  const handleMapMove = useCallback<(e: ViewStateChangeEvent) => void>(({ viewState }) => {
    setLocalViewState(viewState);
  }, []);

  const handleMapLoad = useCallback(
    (e: Parameters<CustomMapProps['onLoad']>[0]) => {
      setLoaded(true);

      if (onLoad) {
        onLoad(e);
      }
    },
    [onLoad]
  );

  useEffect(() => {
    if (mapRef && bounds) {
      handleFitBounds();
    }
  }, [mapRef, bounds, handleFitBounds]);

  useEffect(() => {
    setLocalViewState((prevViewState) => ({
      ...prevViewState,
      ...viewState,
    }));
  }, [viewState]);

  useEffect(() => {
    if (!bounds) return undefined;

    const { options } = bounds;
    const animationDuration = options?.duration || 0;
    let timeoutId: number = null;

    if (isFlying) {
      timeoutId = window.setTimeout(() => {
        setFlying(false);
      }, animationDuration);
    }

    return () => {
      if (timeoutId) {
        window.clearInterval(timeoutId);
      }
    };
  }, [bounds, isFlying]);

  /**
   * Update the URL when the user stops moving the map
   */
  const handleUpdateUrl = useCallback(() => {
    const nextParams = new URLSearchParams({
      longitude: viewState.longitude?.toString() ?? DEFAULT_VIEWPORT.longitude.toString(),
      latitude: viewState.latitude?.toString() ?? DEFAULT_VIEWPORT.latitude.toString(),
      zoom: viewState.zoom?.toString() ?? DEFAULT_VIEWPORT.zoom.toString(),
    });
    router.replace(`${pathname}?${nextParams.toString()}`);
  }, [pathname, router, viewState.latitude, viewState.longitude, viewState.zoom]);

  /**
   * Update the viewport state when the URL pathname changes
   */
  useEffect(() => {
    handleUpdateUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={cx({
        'relative z-0 h-full w-full': true,
        [className]: !!className,
      })}
    >
      <ReactMapGL
        id={id}
        mapLib={MapLibreGL}
        initialViewState={initialViewState}
        dragPan={!isFlying && dragPan}
        dragRotate={!isFlying && dragRotate}
        scrollZoom={!isFlying && scrollZoom}
        doubleClickZoom={!isFlying && doubleClickZoom}
        onMove={handleMapMove}
        onMoveEnd={handleUpdateUrl}
        onLoad={handleMapLoad}
        {...mapboxProps}
        {...localViewState}
      >
        {!!mapRef && loaded && children(mapRef.getMap())}
      </ReactMapGL>
    </div>
  );
};

export default CustomMap;
