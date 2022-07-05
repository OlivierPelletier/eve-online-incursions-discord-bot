import axios from "axios";
import ESICharacter from "../models/esi/ESICharacter";
import ESIUniverseIdsResponse from "../models/esi/ESIUniverseIdsResponse";
import ESIIncursion from "../models/esi/ESIIncursion";
import ESISystem from "../models/esi/ESISystem";
import ESIConstellation from "../models/esi/ESIConstellation";
import ESIStation from "../models/esi/ESIStation";
import ESIRegion from "../models/esi/ESIRegion";

class ESIService {
  esiUniverseIdsUrl: string = "https://esi.evetech.net/latest/universe/ids";

  esiIncursionsUrl: string = "https://esi.evetech.net/latest/incursions";

  esiUniverseSystemsUrl: string =
    "https://esi.evetech.net/latest/universe/systems";

  esiUniverseConstellationsUrl: string =
    "https://esi.evetech.net/latest/universe/constellations";

  esiUniverseRegionsUrl: string =
    "https://esi.evetech.net/latest/universe/regions";

  esiUniverseStationsUrl: string =
    "https://esi.evetech.net/latest/universe/stations";

  async findCharacterId(name: string): Promise<ESICharacter | null> {
    try {
      const response = await axios.post(this.esiUniverseIdsUrl, Array.of(name));
      const esiUniversIdsResponse: ESIUniverseIdsResponse = response.data;
      let esiCharacter: ESICharacter | null = null;

      if (
        esiUniversIdsResponse.characters !== undefined &&
        esiUniversIdsResponse.characters.length > 0
      ) {
        esiCharacter = esiUniversIdsResponse.characters.pop() as ESICharacter;
      }

      return esiCharacter;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getIncursionsInfo(): Promise<ESIIncursion[] | null> {
    try {
      const response = await axios.get(this.esiIncursionsUrl);
      return response.data;
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
}

export default ESIService;
