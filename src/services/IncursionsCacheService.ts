import fs from "fs";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";
import IncursionsCache from "../models/bot/IncursionsCache";

class IncursionsCacheService {
  private readonly incursionCacheFilePath: string = "incursions_cache.json";

  private incursionsCache: IncursionsCache;

  constructor() {
    this.incursionsCache = {
      lastIncursion: null,
      currentIncursions: [],
    };

    fs.readFile(this.incursionCacheFilePath, "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        try {
          this.incursionsCache = JSON.parse(data);
        } catch (ex) {
          console.error(ex);
        }
      }
    });
  }

  findLastIncursion(): IncursionsCacheEntry | null {
    return this.incursionsCache.lastIncursion;
  }

  saveCurrentIncursions(incursionsCacheEntry: IncursionsCacheEntry[]) {
    this.incursionsCache.currentIncursions = incursionsCacheEntry;

    fs.writeFile(
      this.incursionCacheFilePath,
      JSON.stringify(this.incursionsCache, null, 4),
      "utf8",
      (err) => {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          console.log(err);
        }
      }
    );
  }
}

export default IncursionsCacheService;
