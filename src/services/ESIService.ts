import axios, { AxiosResponseHeaders } from "axios";
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

  async findCharacterId(
    name: string
  ): Promise<ESIResponse<ESIIdResponse | null> | null> {
    try {
      const response = await axios.post(this.esiUniverseIdsUrl, Array.of(name));
      const esiUniversIdsResponse: ESIUniverseIdsResponse = response.data;
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );
      let esiCharacterId: ESIIdResponse | null = null;

      if (
        esiUniversIdsResponse.characters !== undefined &&
        esiUniversIdsResponse.characters.length > 0
      ) {
        esiCharacterId =
          esiUniversIdsResponse.characters.pop() as ESIIdResponse;
      }

      return { data: esiCharacterId, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findSystemId(
    name: string
  ): Promise<ESIResponse<ESIIdResponse | null> | null> {
    try {
      const response = await axios.post(this.esiUniverseIdsUrl, Array.of(name));
      const esiUniversIdsResponse: ESIUniverseIdsResponse = response.data;
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );
      let esiSystemId: ESIIdResponse | null = null;

      if (
        esiUniversIdsResponse.systems !== undefined &&
        esiUniversIdsResponse.systems.length > 0
      ) {
        esiSystemId = esiUniversIdsResponse.systems.pop() as ESIIdResponse;
      }

      return { data: esiSystemId, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getIncursionsInfo(): Promise<ESIResponse<ESIIncursion[]> | null> {
    try {
      const response = await axios.get(this.esiIncursionsUrl);
      const esiIncursions: ESIIncursion[] = response.data;
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return {
        data: esiIncursions,
        headers: esiHeaders,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getSystemInfo(
    systemId: number
  ): Promise<ESIResponse<ESISystem> | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseSystemsUrl}/${systemId}`
      );
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return { data: response.data, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getConstellationInfo(
    constellationId: number
  ): Promise<ESIResponse<ESIConstellation> | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseConstellationsUrl}/${constellationId}`
      );
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return { data: response.data, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRegionInfo(
    regionId: number
  ): Promise<ESIResponse<ESIRegion> | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseRegionsUrl}/${regionId}`
      );
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return { data: response.data, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getStationInfo(
    stationId: number
  ): Promise<ESIResponse<ESIStation> | null> {
    try {
      const response = await axios.get(
        `${this.esiUniverseStationsUrl}/${stationId}`
      );
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return { data: response.data, headers: esiHeaders };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRouteInfo(
    originSystemId: number,
    destinationSystemId: number
  ): Promise<ESIResponse<number[]> | null> {
    try {
      const response = await axios.get(
        `${this.esiRouteUrl}/${originSystemId}/${destinationSystemId}?flag=secure`
      );
      const esiHeaders: ESIHeaders = ESIService.axiosHeadersToESIHeaders(
        response.headers
      );

      return {
        data: response.data,
        headers: esiHeaders,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private static axiosHeadersToESIHeaders(
    headers: AxiosResponseHeaders
  ): ESIHeaders {
    return {
      etag: headers.etag,
      expires: headers.expires,
      lastModified: headers["last-modified"],
      xEsiErrorLimitRemain: headers["x-esi-error-limit-remain"],
      xEsiErrorLimitReset: headers["x-esi-error-limit-reset"],
      xEsiRequestId: headers["x-esi-request-id"],
    };
  }
}

export default ESIService;
