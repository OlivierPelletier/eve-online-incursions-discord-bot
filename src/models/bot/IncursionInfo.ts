
interface IncursionInfo {
  constellationName: string;
  faction_id: number;
  has_boss: boolean;
  infested_solar_systems: string[];
  influence: number;
  staging_solar_system_name: string;
  state: string;
  type: string;
}

export default IncursionInfo;
