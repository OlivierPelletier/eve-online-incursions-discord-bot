import { EmbedFieldData, MessageEmbed } from "discord.js";
import ESIIncursionState from "../models/esi/ESIIncursionState";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";
import { noIncursionIconUrl } from "../config/icon_urls.json";

class EmbedMessageMapper {
  yellowColor: number = 0x00b129;

  greenColor: number = 0xff8000;

  redColor: number = 0xb11500;

  purpleColor: number = 0x5d0085;

  noIncursionToEmbedMessage(
    lastIncursion: IncursionsCacheEntry | null
  ): MessageEmbed {
    let spawnWindowField: EmbedFieldData;

    if (lastIncursion != null) {
      const now: Date = new Date();
      const nextWindowDate = lastIncursion.updatedAt + 12 * 60 * 60 * 1000;
      const milliUntilNextWindow = nextWindowDate - now.getTime();

      if (milliUntilNextWindow > 0) {
        spawnWindowField = {
          name: "Next spawn window starts in:",
          value: `${Math.round(milliUntilNextWindow / 1000 / 60 / 60)} hours`,
        };
      } else {
        spawnWindowField = {
          name: "Spawn window is active.",
          value: "\u200B",
        };
      }
    } else {
      spawnWindowField = {
        name: "Next spawn window is currently not available.",
        value: "\u200B",
      };
    }

    return new MessageEmbed()
      .setAuthor({
        name: `No incursion`,
        url: `https://eve-incursions.de/`,
        iconURL: noIncursionIconUrl,
      })
      .setTitle(`Sansha's Nation is currently fighting outside of high-sec`)
      .setDescription(`Actively looking for a new spawn.`)
      .setColor(this.purpleColor)
      .addFields([spawnWindowField]);
  }

  incursionInfoToEmbedMessage(
    incursionsCacheEntry: IncursionsCacheEntry
  ): MessageEmbed {
    let color: number = this.purpleColor;

    const { incursionInfo, createdAt } = incursionsCacheEntry;

    if (incursionInfo.state === ESIIncursionState.ESTABLISHED.toString()) {
      color = this.yellowColor;
    } else if (
      incursionInfo.state === ESIIncursionState.MOBILIZING.toString()
    ) {
      color = this.greenColor;
    } else if (
      incursionInfo.state === ESIIncursionState.WITHDRAWING.toString()
    ) {
      color = this.redColor;
    }

    const date = new Date(createdAt);

    return new MessageEmbed()
      .setAuthor({
        name: `${incursionInfo.constellationName}`,
        url: `https://eve-incursions.de/`,
        iconURL: `${incursionInfo.regionIconUrl}`,
      })
      .setTitle(
        `**${incursionInfo.constellationName} is now in ${incursionInfo.state} state**`
      )
      .setDescription(
        `Detected on ${date.getFullYear()}-${date
          .getMonth()
          .toLocaleString("en-US", { minimumIntegerDigits: 2 })}-${date
          .getDay()
          .toLocaleString("en-US", { minimumIntegerDigits: 2 })} at ${date
          .getUTCHours()
          .toLocaleString("en-US", { minimumIntegerDigits: 2 })}:${date
          .getUTCMinutes()
          .toLocaleString("en-US", { minimumIntegerDigits: 2 })} EVE Time`
      )
      .setColor(color)
      .addFields([
        {
          name: "Incursion information:",
          value: `**Distance from last incursion:** ${
            incursionInfo.numberOfJumpsFromLastIncursion
          } jumps from ${
            incursionInfo.lastIncursionSystemName
          }\n**Influence level:** ${Math.round(
            incursionInfo.influence * 100
          )}%\n**Island constellation:** ${
            incursionInfo.isIslandConstellation
          }`,
          inline: true,
        },
        {
          name: `Constellation layout:`,
          value: `**Headquarter:** ${
            incursionInfo.headquarterSystem
          }\n**Staging:** ${
            incursionInfo.stagingSystem
          }\n**Vanguards:** ${incursionInfo.vanguardSystems.join(
            ", "
          )}\n**Assaults:** ${incursionInfo.assaultSystems.join(", ")}`,
          inline: true,
        },
      ]);
  }
}

export default EmbedMessageMapper;
