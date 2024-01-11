import { EmbedFieldData, MessageEmbed } from "discord.js";
import ESIIncursionState from "../models/esi/ESIIncursionState";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";
import { noIncursionIconUrl } from "../config/icon_urls.json";
import { timeZone } from "../config/config.json";

class EmbedMessageMapper {
  private readonly greenColor: number = 0x00b129;

  private readonly yellowColor: number = 0xff8000;

  private readonly redColor: number = 0xb11500;

  private readonly purpleColor: number = 0x5d0085;

  noIncursionToEmbedMessage(
    lastIncursion: IncursionsCacheEntry | null
  ): MessageEmbed {
    let spawnWindowField: EmbedFieldData;
    const now = new Date();

    if (lastIncursion != null) {
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
      .addFields([spawnWindowField])
      .setFooter({
        text: `Message updated on ${EmbedMessageMapper.dateToEveTimeString(
          now
        )} ${EmbedMessageMapper.dateToMskTimeString(
            now
        )}`,
      });
  }

  incursionInfoToEmbedMessage(
    incursionsCacheEntry: IncursionsCacheEntry
  ): MessageEmbed {
    const now = new Date();
    let color: number = this.purpleColor;

    const { incursionInfo, createdAt } = incursionsCacheEntry;

    if (incursionInfo.state === ESIIncursionState.ESTABLISHED.toString()) {
      color = this.greenColor;
    } else if (
      incursionInfo.state === ESIIncursionState.MOBILIZING.toString()
    ) {
      color = this.yellowColor;
    } else if (
      incursionInfo.state === ESIIncursionState.WITHDRAWING.toString()
    ) {
      color = this.redColor;
    }

    const createAtDate = new Date(createdAt);
    let lastIncursionDistanceMessage = "N/A";

    if (incursionInfo.numberOfJumpsFromLastIncursion !== "N/A") {
      lastIncursionDistanceMessage = `${incursionInfo.numberOfJumpsFromLastIncursion} jumps from ${incursionInfo.lastIncursionSystemName}`;
    }

    return new MessageEmbed()
      .setAuthor({
        name: `${incursionInfo.constellationName}`,
        url: `https://eve-incursions.de/`,
        iconURL: noIncursionIconUrl,
      })
      .setTitle(
        `${incursionInfo.constellationName} is now in ${incursionInfo.state} state`
      )
      .setDescription(
        `Detected on ${EmbedMessageMapper.dateToEveTimeString(createAtDate)} ${EmbedMessageMapper.dateToMskTimeString(createAtDate)}`
      )
      .setThumbnail(`${incursionInfo.regionIconUrl}`)
      .setColor(color)
      .addFields([
        {
          name: "Incursion information:",
          value: `\>\>\> **From last:** ${lastIncursionDistanceMessage}\n**Influence:** ${Math.round(
            incursionInfo.influence * 100
          )}%\n**Island:** ${
            incursionInfo.isIslandConstellation
          }`,
          inline: true,
        },
        {
          name: `Constellation layout:`,
          value: `\>\>\> **HQ:** ${incursionInfo.headquarterSystem
          }\n**VG:** ${incursionInfo.vanguardSystems.join(", ")
          }\n**AS:** ${incursionInfo.assaultSystems.join(", ")
          }\n**ST:** ${incursionInfo.stagingSystem}`,
          inline: true,
        },
      ])
      .setFooter({
        text: `Message updated on ${EmbedMessageMapper.dateToEveTimeString(
          now
        )} ${EmbedMessageMapper.dateToMskTimeString(
            now
        )}`,
      });
  }

  private static dateToEveTimeString(date: Date): string {
    const locale: Intl.LocalesArgument = "en-US";
    const options: Intl.NumberFormatOptions = { minimumIntegerDigits: 2 };
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toLocaleString(locale, options);
    const day = date.getUTCDate().toLocaleString(locale, options);
    const hours = date.getUTCHours().toLocaleString(locale, options);
    const minutes = date.getUTCMinutes().toLocaleString(locale, options);

    return `${year}-${month}-${day} at ${hours}:${minutes} EVE Time`;
  }

  private static dateToMskTimeString(date: Date): string {
    date.setTime( date.getTime() + timeZone * 60 * 60 * 1000 );
    const locale: Intl.LocalesArgument = "en-US";
    const options: Intl.NumberFormatOptions = { minimumIntegerDigits: 2 };
    const hours = date.getUTCHours().toLocaleString(locale, options);
    const minutes = date.getUTCMinutes().toLocaleString(locale, options);
    return `(${hours}:${minutes} MSK)`;
  }

}

export default EmbedMessageMapper;
