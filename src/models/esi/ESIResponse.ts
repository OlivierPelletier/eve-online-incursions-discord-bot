import ESIHeaders from "./ESIHeaders";

interface ESIResponse<T> {
  data: T;
  headers: ESIHeaders;
}

export default ESIResponse;
