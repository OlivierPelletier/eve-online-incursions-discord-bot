import { Client, Intents, TextChannel } from "discord.js";
import { token, channelId } from "./config/config.json";
import BotController from "./controllers/BotController";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let botController: BotController;

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
    await interaction.reply("Retrieving incursions informations...")
    const incursionsInfoAsString = JSON.stringify(await botController.incursions());
    console.log(incursionsInfoAsString);
    await interaction.editReply(incursionsInfoAsString);
  }
});

client.login(token);
