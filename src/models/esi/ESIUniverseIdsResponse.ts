import ESIIdResponse from "./ESIIdResponse";

interface ESIUniverseIdsResponse {
  characters: ESIIdResponse[];
  systems: ESIIdResponse[];
}

export default ESIUniverseIdsResponse;
