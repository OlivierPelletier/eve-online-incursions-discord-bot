import IncursionsCacheEntry from "./IncursionsCacheEntry";

interface IncursionsCache {
  noIncursionMessageId: string | null;
  lastIncursion: IncursionsCacheEntry | null;
  currentIncursions: IncursionsCacheEntry[];
}

export default IncursionsCache;
