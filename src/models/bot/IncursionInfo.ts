interface IncursionInfo {
  constellationName: string;
  constellationId: number;
  headquarterSystem: string;
  headquarterSystemId: number | null;
  assaultSystems: string[];
  vanguardSystems: string[];
  stagingSystem: string;
  influence: number;
  state: string;
  numberOfJumpsFromLastIncursion: string;
  regionIconUrl: string;
  isIslandConstellation: string;
}

export default IncursionInfo;
