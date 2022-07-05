interface IncursionInfo {
  constellationName: string;
  headquarterSystem: string;
  assaultSystems: string[];
  vanguardSystems: string[];
  stagingSystem: string;
  influence: number;
  state: string;
  numberOfJumpsFromLastIncursion: string;
  regionIconUrl: string;
}

export default IncursionInfo;
