# EVE Online incursions Discord bot

An EVE Online Discord bot for incursions enthousiast.

## Sponsors

- Kevin "Twiggys" T.

New features for this bot are mainly motivated by ISK/PLEX donation. If you want to sponsor a new feature for this bot, DM me on discord @Opet#1246.

## Installation

### Requirements

- Docker (20.10.X)
- docker-compose (1.29.X)

Tested with Docker Desktop 4.9.1. Older version might work.

### (Option 1) docker-compose

- Make a copy of the content of the folder **example** somewhere on your machine.
- Open **config.json** and complete the missing information. Read [Configure the bot](#Configure-the-bot) section.
- Read **docker-compose.yml** and edit some part if needed.
- Run the docker-compose command inside the folder of the **docker-compose.yml** file.

#### docker-compose up (detached mode)

```
docker-compose -p eve-online-incursion-bot up -d
```

Remove "-d" to run in attached mode.

## Development setup

### Requirements

- node.js (v16.15.X)
- npm (8.13.X)
- yarn (1.22.X)

The project was developped on macOS 12.4 with the versions listed above. Might work with older/newer versions.

### Add the bot to a server

Read official doc [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html) to create your own Discord application and bot.

Replace CLIENT_ID by your own Discord application client id.

```
https://discord.com/api/oauth2/authorize?client_id=<CLIENT_ID>&permissions=534723951680&scope=bot%20applications.commands
```

### Configure the bot

To find your server id (guildId) and channel id, you need to enable development mode on Discord and right-click on your channel/server and press "Copy ID".
Also, don't forget to generate a token for your bot and put it in the config file.

**src/config/config.json**

```json
{
  "clientId": "APP_CLIENT_ID",
  "guildId": "DISCORD_SERVER_ID",
  "channelId": "DISCORD_CHANNEL_ID",
  "token": "APP_BOT_TOKEN",
  "highSecOnly": true,
  "refreshRateInSecond": 300
}
```

### Install dependencies

```
yarn install
```

### Deploy slash commands

```
yarn run deploy
```

### Run the bot

```
yarn run bot
```

## Bot features

### Slash commands

- /incursions (shows current incursion information )

## TODOs

- Automatically send new incursion information to the Discord channel
- Add missing information to the embed message (number of jump of last incursion, timestamp)
- Create a Docker image for the project
- Write installation instructions
