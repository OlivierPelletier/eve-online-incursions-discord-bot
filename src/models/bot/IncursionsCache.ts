import IncursionsCacheEntry from "./IncursionsCacheEntry";

interface IncursionsCache {
  lastIncursion: IncursionsCacheEntry | null;
  currentIncursions: IncursionsCacheEntry[];
}

export default IncursionsCache;
