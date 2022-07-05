import ESIPlanet from "./ESIPlanet";
import ESIPosition from "./ESIPosition";

interface ESISystem {
  constellation_id: number;
  name: string;
  planets: ESIPlanet[];
  position: ESIPosition;
  security_class: string;
  security_status: number;
  star_id: number;
  stargates: number[];
  stations: number[];
  system_id: number;
}

export default ESISystem;
