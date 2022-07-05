import ESIPosition from "./ESIPosition";

interface ESIConstellation {
  constellation_id: number;
  name: string;
  position: ESIPosition;
  region_id: number;
  systems: number[];
}

export default ESIConstellation;
