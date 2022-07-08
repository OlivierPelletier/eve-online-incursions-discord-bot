import axios from "axios";
import ESIIdResponse from "../models/esi/ESIIdResponse";
import ESIIncursion from "../models/esi/ESIIncursion";
import ESISystem from "../models/esi/ESISystem";
import ESIConstellation from "../models/esi/ESIConstellation";
import ESIStation from "../models/esi/ESIStation";
import ESIRegion from "../models/esi/ESIRegion";
import ESIUniverseIdsResponse from "../models/esi/ESIUniverseIdsResponse";
import ESIHeaders from "../models/esi/ESIHeaders";
import ESIResponse from "../models/esi/ESIResponse";

class ESIService {
  private readonly esiUniverseIdsUrl: string =
    "https://esi.evetech.net/latest/universe/ids";

  private readonly esiIncursionsUrl: string =
    "https://esi.evetech.net/latest/incursions";

  private readonly esiUniverseSystemsUrl: string =
    "https://esi.evetech.net/latest/universe/systems";

  private readonly esiUniverseConstellationsUrl: string =
    "https://esi.evetech.net/latest/universe/constellations";

  private readonly esiUniverseRegionsUrl: string =
    "https://esi.evetech.net/latest/universe/regions";

  private readonly esiUniverseStationsUrl: string =
    "https://esi.evetech.net/latest/universe/stations";

  private readonly esiRouteUrl: string = "https://esi.evetech.net/latest/route";

  async findCharacterId(name: string): Promise<ESIIdResponse | null> {
    try {
      const response = await axios.post(this.esiUniverseIdsUrl, Array.of(name));
      const esiUniversIdsResponse: ESIUniverseIdsResponse = response.data;
      let esiCharacterId: ESIIdResponse | null = null;

      if (
        esiUniversIdsResponse.characters !== undefined &&
        esiUniversIdsResponse.characters.length > 0
      ) {
        esiCharacterId =
          esiUniversIdsResponse.characters.pop() as ESIIdResponse;
      }

      return esiCharacterId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findSystemId(name: string): Promise<ESIIdResponse | null> {
    try {
      const response = await axios.post(this.esiUniverseIdsUrl, Array.of(name));
      const esiUniversIdsResponse: ESIUniverseIdsResponse = response.data;
      let esiCharacterId: ESIIdResponse | null = null;

      if (
        esiUniversIdsResponse.characters !== undefined &&
        esiUniversIdsResponse.characters.length > 0
      ) {
        esiCharacterId = esiUniversIdsResponse.systems.pop() as ESIIdResponse;
      }

      return esiCharacterId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getIncursionsInfo(): Promise<ESIResponse<ESIIncursion[]> | null> {
    try {
      const response = await axios.get(this.esiIncursionsUrl);
      const esiIncursions: ESIIncursion[] = response.data;
      const esiHeaders: ESIHeaders = {
        etag: response.headers.etag,
        expires: response.headers.expires,
        lastModified: response.headers["last-modified"],
        xEsiErrorLimitRemain: response.headers["x-esi-error-limit-remain"],
        xEsiErrorLimitReset: response.headers["x-esi-error-limit-reset"],
        xEsiRequestId: response.headers["x-esi-request-id"],
      };
      return {
        data: esiIncursions,
        headers: esiHeaders,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getSystemInfo(systemId: number): Promise<ESISystem | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseSystemsUrl}/${systemId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getConstellationInfo(
    constellationId: number
  ): Promise<ESIConstellation | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseConstellationsUrl}/${constellationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRegionInfo(regionId: number): Promise<ESIRegion | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseRegionsUrl}/${regionId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getStationInfo(stationId: number): Promise<ESIStation | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseStationsUrl}/${stationId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRouteInfo(
    originSystemId: number,
    destinationSystemId: number
  ): Promise<number[] | null> {
    try {
      const response = await axios.get(
        `${this.esiRouteUrl}/${originSystemId}/${destinationSystemId}?flag=secure`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default ESIService;
