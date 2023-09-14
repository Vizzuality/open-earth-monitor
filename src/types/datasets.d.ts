export type UseParamsOptions = Readonly<{
  layer_id: string;
}>;

export type LayerTypes = Readonly<{
  gs_base_wms: string;
  gs_name: string;
  gs_dimension: string;
  range: string;
  author: string | null;
  coverage: string;
  description: string;
  download_url: string;
  filename: string;
  geo_story: string;
  layer_id: string;
  license: string;
  location_query_url: string;
  metadata_url: string;
  monitor: string;
  polygon_query_url: string;
  range_labels: string;
  regex: string;
  srv_path: string;
  theme: string;
  title: string;
  unit: string;
  use_case: string;
}>;

export type GeoStoryTypes = Readonly<{
  author: string;
  date_created: string;
  description: string;
  id: string;
  layers: LayerTypes[];
  title: string;
  use_case_link: string;
}>;

export type MonitorTypes = Readonly<{
  author: string;
  coverage: string;
  date_created: string;
  description: string;
  geostories: GeoStoryTypes[];
  id: string;
  title: string;
}>;