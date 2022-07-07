import { regions } from "../config/icon_urls.json";

class RegionIconService {
  private readonly regionIconsDict: { [regionId: number]: string };

  constructor() {
    this.regionIconsDict = regions;
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
