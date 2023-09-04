'use client';

import { useEffect, useState, useCallback, FC } from 'react';

import ReactMapGL, { ViewState, ViewStateChangeEvent, useMap } from 'react-map-gl';

import cx from 'clsx';
import MapLibreGL from 'maplibre-gl';
// import { useDebounce } from 'usehooks-ts';

import { DEFAULT_VIEW_STATE } from './constants';
import type { CustomMapProps } from './types';

export const CustomMap: FC<CustomMapProps> = ({
  // * if no id is passed, react-map-gl will store the map reference in a 'default' key:
  // * https://github.com/visgl/react-map-gl/blob/ecb27c8d02db7dd09d8104e8c2011bda6aed4b6f/src/components/use-map.tsx#L18
  id = 'default',
  children,
  className,
  viewState,
  constrainedAxis,
  initialViewState,
  bounds,
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

  /**
   * STATE
   */
  const [localViewState, setLocalViewState] = useState<Partial<ViewState>>(
    !initialViewState && {
      ...DEFAULT_VIEW_STATE,
      ...viewState,
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

  const handleMapMove = useCallback(
    ({ viewState: _viewState }: ViewStateChangeEvent) => {
      const newViewState = {
        ..._viewState,
        latitude: constrainedAxis === 'y' ? localViewState.latitude : _viewState.latitude,
        longitude: constrainedAxis === 'x' ? localViewState.longitude : _viewState.longitude,
      };
      setLocalViewState(newViewState);
      // debouncedViewStateChange(newViewState);
    },
    [constrainedAxis, localViewState.latitude, localViewState.longitude]
  );

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
