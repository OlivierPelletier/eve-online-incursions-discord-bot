import { MessageEmbed } from "discord.js";
import ESIIncursionState from "../models/esi/ESIIncursionState";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";

class EmbedMessageMapper {
  yellowColor: number = 0x00b129;

  greenColor: number = 0xff8000;

  redColor: number = 0xb11500;

  incursionInfoToEmbedMessage(
    incursionsCacheEntry: IncursionsCacheEntry
  ): MessageEmbed {
    let color: number = 0x5d0085;

    const { incursionInfo, timestamp } = incursionsCacheEntry;

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

    const date = new Date();
    date.setUTCMinutes(timestamp);

    return new MessageEmbed()
      .setAuthor({
        name: `${incursionInfo.constellationName}`,
        url: `https://eve-incursions.de/`,
        iconURL: `${incursionInfo.regionIconUrl}`,
      })
      .setTitle(
        `**${incursionInfo.constellationName} is now in ${incursionInfo.state} state**`
      )
      .setDescription(`Detected on ${date.toISOString()}`)
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
