import IncursionConstellationLayout from "../models/bot/IncursionConstellationLayout";
import incursionsLayout from "../config/incursion_layouts.json";

class IncursionLayoutService {
  private readonly incursionLayoutsDict: {
    [constellationName: string]: IncursionConstellationLayout;
  };

  constructor() {
    this.incursionLayoutsDict = incursionsLayout;
  }

  findIncursionLayout(
    constellationName: string
  ): IncursionConstellationLayout | null {
    const incursionLayout: IncursionConstellationLayout | undefined =
      this.incursionLayoutsDict[constellationName];

    if (incursionLayout === undefined) {
      return null;
    }

    return incursionLayout;
  }
}

export default IncursionLayoutService;
