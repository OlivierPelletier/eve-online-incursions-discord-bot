import { TextChannel } from "discord.js";
import ESIService from "../services/ESIService";
import IncursionInfo from "../models/bot/IncursionInfo";
import IncursionLayoutService from "../services/IncursionLayoutService";
import RegionIconService from "../services/RegionIconService";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";
import IncursionsCacheService from "../services/IncursionsCacheService";
import IncursionInfoService from "../services/IncursionInfoService";

class BotController {
  channel: TextChannel;

  esiService: ESIService;

  incursionLayoutService: IncursionLayoutService;

  regionIconService: RegionIconService;

  incursionsCacheService: IncursionsCacheService;

  incursionsInfoService: IncursionInfoService;

  constructor(_channel: TextChannel) {
    this.channel = _channel;
    this.esiService = new ESIService();
    this.incursionLayoutService = new IncursionLayoutService();
    this.regionIconService = new RegionIconService();
    this.incursionsCacheService = new IncursionsCacheService();
    this.incursionsInfoService = new IncursionInfoService(
      this.esiService,
      this.regionIconService,
      this.incursionLayoutService
    );
  }

  async incursions(): Promise<IncursionsCacheEntry[] | null> {
    const lastIncursionCache: IncursionsCacheEntry | null =
      this.incursionsCacheService.findLastIncursion();
    let lastIncursionInfo: IncursionInfo | null = null;

    if (lastIncursionCache != null) {
      lastIncursionInfo = lastIncursionCache.incursionInfo;
    }

    const incursionInfos: IncursionInfo[] | null =
      await this.incursionsInfoService.findAllIncursionsInfo(lastIncursionInfo);

    // this.incursionsCacheService.saveCurrentIncursions(currentIncursionsCache);

    const incursionCacheEntries: IncursionsCacheEntry[] = [];

    incursionInfos?.forEach((incursionInfo) => {
      incursionCacheEntries.push({
        timestamp: new Date().getDate(),
        messageId: "",
        incursionInfo,
      });
    });

    return incursionCacheEntries;
  }
}

export default BotController;
