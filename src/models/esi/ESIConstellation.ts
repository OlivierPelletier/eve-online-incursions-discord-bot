import ESIPosition from "./ESIPosition";

interface ESIConstellation {
  constellation_id: number;
  name: string;
  position: ESIPosition;
  region_id: 10000013;
  systems: number[];
}

export default ESIConstellation;
