import IncursionInfo from "./IncursionInfo";

interface IncursionsCacheEntry {
  createdAt: number;
  updatedAt: number;
  messageId: string;
  incursionInfo: IncursionInfo;
}

export default IncursionsCacheEntry;
