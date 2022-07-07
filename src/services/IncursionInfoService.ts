import ESISystem from "../models/esi/ESISystem";
import ESIConstellation from "../models/esi/ESIConstellation";
import ESIService from "./ESIService";
import { highSecOnly } from "../config/config.json";
import IncursionConstellationLayout from "../models/bot/IncursionConstellationLayout";
import IncursionInfo from "../models/bot/IncursionInfo";
import ESIIncursion from "../models/esi/ESIIncursion";
import RegionIconService from "./RegionIconService";
import IncursionLayoutService from "./IncursionLayoutService";

class IncursionInfoService {
  esiService: ESIService;

  regionIconService: RegionIconService;

  incursionLayoutService: IncursionLayoutService;

  esiSystemInfoByIdDict: { [systemId: number]: ESISystem };

  esiSystemInfoByNameDict: { [systemName: string]: ESISystem };

  esiConstellationInfoDict: { [constellationId: number]: ESIConstellation };

  constructor(
    _esiService: ESIService,
    _regionIconService: RegionIconService,
    _incursionLayoutService: IncursionLayoutService
  ) {
    this.esiService = _esiService;
    this.regionIconService = _regionIconService;
    this.incursionLayoutService = _incursionLayoutService;
    this.esiSystemInfoByIdDict = {};
    this.esiSystemInfoByNameDict = {};
    this.esiConstellationInfoDict = {};
  }

  async findAllIncursionsInfo(
    lastIncursionInfo: IncursionInfo | null
  ): Promise<IncursionInfo[] | null> {
    const esiIncursionInfos: ESIIncursion[] | null =
      await this.esiService.getIncursionsInfo();

    if (esiIncursionInfos == null) {
      return null;
    }

    await this.prepareIncursionsData(esiIncursionInfos);

    const incursionInfos: IncursionInfo[] = [];
    const promiseList: Promise<void>[] = [];
    let lastHqSystemId: number | null = null;

    if (lastIncursionInfo != null) {
      lastHqSystemId = lastIncursionInfo.headquarterSystemId;
    }

    esiIncursionInfos.forEach((esiIncursion) => {
      promiseList.push(
        this.findCompletedIncursionInfo(esiIncursion, lastHqSystemId).then(
          (incursionInfo) => {
            if (incursionInfo != null) {
              incursionInfos.push(incursionInfo);
            }
          }
        )
      );
    });

    await Promise.all(promiseList);

    return incursionInfos;
  }

  async prepareIncursionsData(esiIncursionInfos: ESIIncursion[]) {
    const promiseList: Promise<void>[] = [];

    esiIncursionInfos.forEach((esiIncursion) => {
      promiseList.push(
        this.esiService
          .getConstellationInfo(esiIncursion.constellation_id)
          .then((esiConstellation) => {
            if (esiConstellation != null) {
              this.esiConstellationInfoDict[esiConstellation.constellation_id] =
                esiConstellation;
            }
          })
      );

      promiseList.push(
        this.esiService
          .getSystemInfo(esiIncursion.staging_solar_system_id)
          .then((esiSystem) => {
            if (esiSystem != null) {
              this.esiSystemInfoByIdDict[esiSystem.system_id] = esiSystem;
              this.esiSystemInfoByNameDict[esiSystem.name] = esiSystem;
            }
          })
      );

      esiIncursion.infested_solar_systems.forEach((infestedSolarSystem) => {
        promiseList.push(
          this.esiService
            .getSystemInfo(infestedSolarSystem)
            .then((esiSystem) => {
              if (esiSystem != null) {
                this.esiSystemInfoByIdDict[esiSystem.system_id] = esiSystem;
                this.esiSystemInfoByNameDict[esiSystem.name] = esiSystem;
              }
            })
        );
      });
    });

    await Promise.all(promiseList);
  }

  private async findCompletedIncursionInfo(
    esiIncursion: ESIIncursion,
    lastIncursionHeadquarterSystemId: number | null
  ): Promise<IncursionInfo | null> {
    const constellationInfo: ESIConstellation | undefined =
      this.esiConstellationInfoDict[esiIncursion.constellation_id];
    const stagingSolarSystemInfo: ESISystem | undefined =
      this.esiSystemInfoByIdDict[esiIncursion.staging_solar_system_id];
    const infestedSolarSystems: string[] = [];

    esiIncursion.infested_solar_systems.forEach((infestedSolarSystemId) => {
      const infestedSolarSystemInfo: ESISystem | undefined =
        this.esiSystemInfoByIdDict[infestedSolarSystemId];

      if (infestedSolarSystemInfo !== undefined) {
        infestedSolarSystems.push(infestedSolarSystemInfo.name);
      }
    });

    if (
      constellationInfo === undefined ||
      stagingSolarSystemInfo === undefined ||
      infestedSolarSystems.length !== esiIncursion.infested_solar_systems.length
    ) {
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
      const incursionConstellationLayout: IncursionConstellationLayout | null =
        this.incursionLayoutService.findIncursionLayout(constellationInfo.name);

      if (regionIconUrl == null) {
        regionIconUrl = "";
      }

      let stagingSystem = "N/A";
      let headquarterSystem = "N/A";
      let headquarterSystemId: number | null = null;
      let vanguardSystems = ["N/A"];
      let assaultSystems = ["N/A"];
      let isIslandConstellation = "N/A";
      let numberOfJumpsFromLastIncursion = "N/A";

      if (incursionConstellationLayout != null) {
        stagingSystem = incursionConstellationLayout.staging_system;
        headquarterSystem = incursionConstellationLayout.headquarter_system;
        headquarterSystemId =
          this.esiSystemInfoByNameDict[
            incursionConstellationLayout.headquarter_system
          ].system_id;
        vanguardSystems = incursionConstellationLayout.vanguard_systems;
        assaultSystems = incursionConstellationLayout.assault_systems;
        isIslandConstellation =
          incursionConstellationLayout.is_island_constellation ? "Yes" : "No";

        if (lastIncursionHeadquarterSystemId != null) {
          const route = await this.esiService.getRouteInfo(
            lastIncursionHeadquarterSystemId,
            headquarterSystemId
          );

          if (route != null) {
            numberOfJumpsFromLastIncursion = (route.length - 1).toString();
          }
        }
      }

      return {
        regionIconUrl,
        constellationName: constellationInfo.name,
        constellationId: esiIncursion.constellation_id,
        headquarterSystem,
        headquarterSystemId,
        stagingSystem,
        vanguardSystems,
        assaultSystems,
        numberOfJumpsFromLastIncursion,
        influence: 1 - esiIncursion.influence,
        state: esiIncursion.state,
        isIslandConstellation,
      };
    }

    return null;
  }
}

export default IncursionInfoService;
