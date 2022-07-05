import { Client, Intents, Message, TextChannel } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { token, channelId } from "./config/config.json";
import BotController from "./controllers/BotController";
import IncursionInfo from "./models/bot/IncursionInfo";
import EmbedMessageMapper from "./mappers/EmbedMessageMapper";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let botController: BotController;
const embedMessageMapper: EmbedMessageMapper = new EmbedMessageMapper();

client.once("ready", () => {
  console.log("Ready!");

  client.channels.fetch(channelId).then((channel) => {
    botController = new BotController(channel as TextChannel);
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "incursions") {
    const loadingEmbed = new EmbedBuilder().setDescription(
      "Retrieving incursions informations..."
    ).data;
    await interaction.reply({ embeds: [loadingEmbed] });
    const incursionInfos: IncursionInfo[] | null =
      await botController.incursions();

    const promiseList: Promise<Message>[] = [];

    if (incursionInfos != null) {
      incursionInfos.forEach((incursionInfo) => {
        const embedMessage =
          embedMessageMapper.incursionInfoToEmbedMessage(incursionInfo);

        if (interaction.channel != null) {
          promiseList.push(
            interaction.channel.send({ embeds: [embedMessage] })
          );
        }
      });
    }

    await Promise.all(promiseList);
    await interaction.deleteReply();
  }
});

client.login(token);
