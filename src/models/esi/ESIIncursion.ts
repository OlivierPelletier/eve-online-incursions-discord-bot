import ESIIncursionState from "./ESIIncursionState";

interface ESIIncursion {
  constellation_id: number;
  faction_id: number;
  has_boss: boolean;
  infested_solar_systems: number[];
  influence: number;
  staging_solar_system_id: number;
  state: ESIIncursionState;
  type: string;
}

export default ESIIncursion;
