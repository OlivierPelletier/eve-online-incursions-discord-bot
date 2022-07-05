import { TextChannel } from "discord.js";
import ESIService from "../services/ESIService";
import ESIIncursion from "../models/esi/ESIIncursion";
import IncursionInfo from "../models/bot/IncursionInfo";
import ESISystem from "../models/esi/ESISystem";
import ESIConstellation from "../models/esi/ESIConstellation";
import { highSecOnly } from "../config/config.json";
import IncursionLayoutService from "../services/IncursionLayoutService";
import IncursionConstellationLayout from "../models/bot/IncursionConstellationLayout";
import RegionIconService from "../services/RegionIconService";

class BotController {
  channel: TextChannel;

  esiService: ESIService;

  incursionLayoutService: IncursionLayoutService;

  regionIconService: RegionIconService;

  constructor(_channel: TextChannel) {
    this.channel = _channel;
    this.esiService = new ESIService();
    this.incursionLayoutService = new IncursionLayoutService();
    this.regionIconService = new RegionIconService();
  }

  async incursions(): Promise<IncursionInfo[] | null> {
    const esiIncursionInfos: ESIIncursion[] | null =
      await this.esiService.getIncursionsInfo();

    if (esiIncursionInfos == null) {
      return null;
    }

    const incursionInfos: IncursionInfo[] = [];
    const esiSystemInfoDict: { [systemId: number]: ESISystem } = {};
    const esiConstellationInfoDict: {
      [constellationId: number]: ESIConstellation;
    } = {};
    const promiseList: Promise<void>[] = [];

    esiIncursionInfos.forEach((esiIncursion) => {
      promiseList.push(
        this.esiService
          .getConstellationInfo(esiIncursion.constellation_id)
          .then((esiConstellation) => {
            if (esiConstellation != null) {
              esiConstellationInfoDict[esiConstellation.constellation_id] =
                esiConstellation;
            }
          })
      );

      promiseList.push(
        this.esiService
          .getSystemInfo(esiIncursion.staging_solar_system_id)
          .then((esiSystem) => {
            if (esiSystem != null) {
              esiSystemInfoDict[esiSystem.system_id] = esiSystem;
            }
          })
      );

      esiIncursion.infested_solar_systems.forEach((infestedSolarSystem) => {
        promiseList.push(
          this.esiService
            .getSystemInfo(infestedSolarSystem)
            .then((esiSystem) => {
              if (esiSystem != null) {
                esiSystemInfoDict[esiSystem.system_id] = esiSystem;
              }
            })
        );
      });
    });

    await Promise.all(promiseList);

    let missingSystemInfo: boolean = false;

    esiIncursionInfos.forEach((esiIncursion) => {
      const constellationInfo: ESIConstellation | undefined =
        esiConstellationInfoDict[esiIncursion.constellation_id];
      const stagingSolarSystemInfo: ESISystem | undefined =
        esiSystemInfoDict[esiIncursion.staging_solar_system_id];
      const infestedSolarSystems: string[] = [];

      esiIncursion.infested_solar_systems.forEach((infestedSolarSystemId) => {
        const infestedSolarSystemInfo: ESISystem | undefined =
          esiSystemInfoDict[infestedSolarSystemId];

        if (infestedSolarSystemInfo !== undefined) {
          infestedSolarSystems.push(infestedSolarSystemInfo.name);
        }
      });

      if (
        constellationInfo === undefined ||
        stagingSolarSystemInfo === undefined ||
        infestedSolarSystems.length !==
          esiIncursion.infested_solar_systems.length
      ) {
        missingSystemInfo = true;
        console.error(
          `Missing information for incursion: ${JSON.stringify(esiIncursion)}`
        );
      } else if (
        !highSecOnly ||
        (highSecOnly && stagingSolarSystemInfo.security_status >= 0.5)
      ) {
        let regionIconUrl = this.regionIconService.findRegionIconUrl(
          constellationInfo.region_id
        );
        const incursionInfo: IncursionConstellationLayout | null =
          this.incursionLayoutService.findIncursionLayout(
            constellationInfo.name
          );

        if (regionIconUrl == null) {
          regionIconUrl = "";
        }

        let stagingSystem = "N/A";
        let headquarterSystem = "N/A";
        let vanguardSystems = ["N/A"];
        let assaultSystems = ["N/A"];

        if (incursionInfo != null) {
          stagingSystem = incursionInfo.staging_system;
          headquarterSystem = incursionInfo.headquarter_system;
          vanguardSystems = incursionInfo.vanguard_systems;
          assaultSystems = incursionInfo.assault_systems;
        }

        incursionInfos.push({
          regionIconUrl,
          constellationName: constellationInfo.name,
          headquarterSystem,
          stagingSystem,
          vanguardSystems,
          assaultSystems,
          numberOfJumpsFromLastIncursion: "5",
          influence: 1 - esiIncursion.influence,
          state: esiIncursion.state,
        });
      }
    });

    if (missingSystemInfo) {
      return null;
    }

    return incursionInfos;
  }
}

export default BotController;
