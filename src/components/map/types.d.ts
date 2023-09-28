import type { ViewState, MapProps, FitBoundsOptions, MapboxMap } from 'react-map-gl';

export type Bbox = [number, number, number, number];

export interface CustomMapProps extends MapProps {
  /** A function that returns the map instance */
  children?: (map: MapboxMap) => React.ReactNode;

  /** Custom css class for styling */
  className?: string;

  /** An object that defines the viewport
   * @see https://visgl.github.io/react-map-gl/docs/api-reference/map#initialviewstate
   */
  viewState?: Partial<ViewState>;

  /** An string that defines the rotation axis */
  constrainedAxis?: 'x' | 'y';

  /** An object that defines the bounds */
  bounds?: {
    bbox: Bbox;
    options?: FitBoundsOptions;
    viewportOptions?: Partial<ViewState>;
  };

  /** A function that exposes the viewport */
  onMapViewStateChange?: (viewstate: Partial<ViewState>) => void;
}

export type ExplicitViewState = Pick<ViewState, 'longitude' | 'latitude' | 'zoom'>;
