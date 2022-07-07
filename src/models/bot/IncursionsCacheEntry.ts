import IncursionInfo from "./IncursionInfo";

interface IncursionsCacheEntry {
  timestamp: number;
  messageId: string;
  incursionInfo: IncursionInfo;
}

export default IncursionsCacheEntry;
