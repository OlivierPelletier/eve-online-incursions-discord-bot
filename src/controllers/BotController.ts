import { CommandInteraction, Message, TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import ESIService from "../services/ESIService";
import IncursionInfo from "../models/bot/IncursionInfo";
import IncursionLayoutService from "../services/IncursionLayoutService";
import RegionIconService from "../services/RegionIconService";
import IncursionsCacheEntry from "../models/bot/IncursionsCacheEntry";
import IncursionsCacheService from "../services/IncursionsCacheService";
import IncursionInfoService from "../services/IncursionInfoService";
import EmbedMessageMapper from "../mappers/EmbedMessageMapper";

class BotController {
  private readonly channel: TextChannel;

  private readonly embedMessageMapper: EmbedMessageMapper;

  private readonly esiService: ESIService;

  private readonly incursionLayoutService: IncursionLayoutService;

  private readonly regionIconService: RegionIconService;

  private readonly incursionsCacheService: IncursionsCacheService;

  private readonly incursionsInfoService: IncursionInfoService;

  private incursionLoopId: NodeJS.Timeout | undefined;

  constructor(_channel: TextChannel) {
    this.channel = _channel;
    this.embedMessageMapper = new EmbedMessageMapper();
    this.esiService = new ESIService();
    this.incursionLayoutService = new IncursionLayoutService();
    this.regionIconService = new RegionIconService();
    this.incursionsCacheService = new IncursionsCacheService();
    this.incursionsInfoService = new IncursionInfoService(
      this.esiService,
      this.regionIconService,
      this.incursionLayoutService
    );
    this.startIncursionLoop(1000);
  }

  private startIncursionLoop(nextRefreshInMs: number) {
    this.incursionLoopId = setTimeout(
      async () => {
        let nextRefreshMs = 10000;
        try {
          await this.loopIncursions();
          const now = Date.now();
          const expiresAt = this.incursionsInfoService
            .getEsiIncursionCacheExpireDate()
            .getTime();
          nextRefreshMs = expiresAt - now;
          console.log(
            `Next incursions refresh in ${nextRefreshMs / 1000} seconds`
          );
        } catch (err) {
          console.error(
            "An error occured while executing the incursion info loop. Retrying in 10 seconds..."
          );
        }
        this.startIncursionLoop(nextRefreshMs);
      },
      nextRefreshInMs < 1000 ? 1000 : nextRefreshInMs
    );
  }

  private stopIncursionLoop() {
    clearTimeout(this.incursionLoopId);
  }

  async loopIncursions() {
    const incursionInfos: IncursionsCacheEntry[] | null =
      await this.incursions();

    if (incursionInfos != null) {
      incursionInfos.forEach((incursionInfo, index) => {
        const cachedIncursionInfo =
          this.incursionsCacheService.findCurrentIncursionByConstellationId(
            incursionInfo.incursionInfo.constellationId
          );

        if (cachedIncursionInfo != null) {
          incursionInfos[index].createdAt = cachedIncursionInfo.createdAt;
          incursionInfos[index].messageId = cachedIncursionInfo.messageId;
        }
      });
    }

    const promiseList: Promise<Message | void>[] = [];

    if (incursionInfos != null && incursionInfos.length > 0) {
      this.incursionsCacheService.clearNoIncursionMessageId();
      incursionInfos.forEach((incursionInfo, incursionInfoIndex) => {
        const embedMessage =
          this.embedMessageMapper.incursionInfoToEmbedMessage(incursionInfo);

        if (this.channel != null) {
          promiseList.push(
            this.channel.messages
              .fetch(incursionInfo.messageId)
              .then(async (message) => {
                await message.edit({ embeds: [embedMessage] });
              })
              .catch(async () => {
                await this.channel
                  .send({ embeds: [embedMessage] })
                  .then((message) => {
                    incursionInfos[incursionInfoIndex].messageId = message.id;
                  });
              })
          );
        }
      });
    } else {
      const embedMessage = this.embedMessageMapper.noIncursionToEmbedMessage(
        this.incursionsCacheService.findLastIncursion()
      );
      if (this.channel != null) {
        const noIncursionMessageId =
          this.incursionsCacheService.findNoIncursionMessageId();

        if (noIncursionMessageId != null) {
          promiseList.push(
            this.channel.messages
              .fetch(noIncursionMessageId)
              .then(async (message) => {
                await message.edit({ embeds: [embedMessage] });
              })
              .catch(async () => {
                await this.channel
                  .send({ embeds: [embedMessage] })
                  .then((message) => {
                    this.incursionsCacheService.saveNoIncursionMessageId(
                      message.id
                    );
                  });
              })
          );
        } else {
          promiseList.push(
            this.channel.send({ embeds: [embedMessage] }).then((message) => {
              this.incursionsCacheService.saveNoIncursionMessageId(message.id);
            })
          );
        }
      }
    }

    await Promise.all(promiseList);

    if (incursionInfos != null) {
      this.incursionsCacheService.checkAndRotateCurrentIncursions(
        incursionInfos
      );
    }
  }

  async commandIncursions(interaction: CommandInteraction) {
    const loadingEmbed = new EmbedBuilder().setDescription(
      "Retrieving incursions informations..."
    ).data;
    await interaction.reply({ embeds: [loadingEmbed] });
    const incursionInfos: IncursionsCacheEntry[] | null =
      await this.incursions();

    if (incursionInfos != null) {
      incursionInfos.forEach((incursionInfo, index) => {
        const cachedIncursionInfo =
          this.incursionsCacheService.findCurrentIncursionByConstellationId(
            incursionInfo.incursionInfo.constellationId
          );

        if (cachedIncursionInfo != null) {
          incursionInfos[index].createdAt = cachedIncursionInfo.createdAt;
          incursionInfos[index].messageId = cachedIncursionInfo.messageId;
        }
      });
    }

    const promiseList: Promise<Message>[] = [];

    if (incursionInfos != null && incursionInfos.length > 0) {
      incursionInfos.forEach((incursionInfo) => {
        const embedMessage =
          this.embedMessageMapper.incursionInfoToEmbedMessage(incursionInfo);

        if (interaction.channel != null) {
          promiseList.push(
            interaction.channel.send({ embeds: [embedMessage] })
          );
        }
      });
    } else {
      const embedMessage = this.embedMessageMapper.noIncursionToEmbedMessage(
        this.incursionsCacheService.findLastIncursion()
      );
      if (interaction.channel != null) {
        promiseList.push(interaction.channel.send({ embeds: [embedMessage] }));
      }
    }

    await Promise.all(promiseList);

    if (incursionInfos != null) {
      this.incursionsCacheService.checkAndRotateCurrentIncursions(
        incursionInfos
      );
    }

    await interaction.deleteReply();
  }

  private async incursions(): Promise<IncursionsCacheEntry[] | null> {
    const lastIncursionCache: IncursionsCacheEntry | null =
      this.incursionsCacheService.findLastIncursion();
    let lastIncursionInfo: IncursionInfo | null = null;

    if (lastIncursionCache != null) {
      lastIncursionInfo = lastIncursionCache.incursionInfo;
    }

    const incursionInfos: IncursionInfo[] | null =
      await this.incursionsInfoService.findAllIncursionsInfo(lastIncursionInfo);

    const incursionCacheEntries: IncursionsCacheEntry[] = [];

    if (incursionInfos != null) {
      incursionInfos.forEach((incursionInfo) => {
        incursionCacheEntries.push({
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messageId: "",
          incursionInfo,
        });
      });
    }

    return incursionCacheEntries;
  }
}

export default BotController;
