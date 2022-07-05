import { TextChannel } from "discord.js";
import ESIService from "../services/ESIService";
import ESIIncursion from "../models/esi/ESIIncursion";
import IncursionInfo from "../models/bot/IncursionInfo";
import ESISystem from "../models/esi/ESISystem";
import ESIConstellation from "../models/esi/ESIConstellation";

class BotController {
  esiService: ESIService;

  channel: TextChannel;

  constructor(_channel: TextChannel) {
    this.esiService = new ESIService();
    this.channel = _channel;
  }

  async incursions(): Promise<IncursionInfo[] | null> {
    const incursionInfos : IncursionInfo[] = [];

    const esiIncursionInfos: ESIIncursion[] = await this.esiService.getIncursionsInfo() as ESIIncursion[];

    if (esiIncursionInfos != null) {
      // eslint-disable-next-line no-restricted-syntax
      for (const esiIncursion of esiIncursionInfos) {
        incursionInfos.push({
          // eslint-disable-next-line no-await-in-loop
          constellationName: (await this.esiService.getConstellationInfo(esiIncursion.constellation_id) as ESIConstellation).name,
          faction_id: esiIncursion.faction_id,
          has_boss: esiIncursion.has_boss,
          infested_solar_systems: [],
          influence: esiIncursion.influence,
          // eslint-disable-next-line no-await-in-loop
          staging_solar_system_name: (await this.esiService.getSystemInfo(esiIncursion.staging_solar_system_id) as ESISystem).name,
          state: esiIncursion.state,
          type: esiIncursion.type
        })
      }
    }

    return incursionInfos;
  }
}

export default BotController;
