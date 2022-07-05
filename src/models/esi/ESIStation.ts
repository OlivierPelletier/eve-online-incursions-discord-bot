import ESIPosition from "./ESIPosition";

interface ESIStation {
  max_dockable_ship_volume: number;
  name: string;
  office_rental_cost: number;
  owner: number;
  position: ESIPosition;
  race_id: number;
  reprocessing_efficiency: number;
  reprocessing_stations_take: number;
  services: string[];
  station_id: number;
  system_id: number;
  type_id: number;
}

export default ESIStation;
