import regionIcons from "../config/region_icons.json";

class RegionIconService {
  regionIconsDict: { [regionId: number]: string };

  constructor() {
    this.regionIconsDict = regionIcons;
  }

  findRegionIconUrl(regionId: number): string | null {
    const regionIconUrl: string | undefined = this.regionIconsDict[regionId];

    if (regionIconUrl === undefined) {
      return null;
    }

    return regionIconUrl;
  }
}

export default RegionIconService;
