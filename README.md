# [EVE Online incursions Discord bot](https://github.com/OlivierPelletier/eve-online-incursions-discord-bot)

An EVE Online Discord bot for incursions enthousiast.

![Discord message](https://user-images.githubusercontent.com/9085097/178177985-ae6be01e-47f7-4334-9574-063e2bb378b2.png)

## Sponsors

- Kevin "Twiggys" T.

### Note about sponsors

New features for this bot are mainly motivated by ISK and PLEX donations. If you want to sponsor a new feature, DM me on discord (Opet#1246).

## Bot features

### Slash commands

- _/incursions_ (shows current incursion information)

### Background processes

- Scans regularly the ESI (~5 minutes) for current incursions informations and posts updates inside a dedicated Discord channel.
- Caches locally informations about current and past incursions to display some enhanced data.

## Installation

### Requirements

- Docker (20.10.X)
- docker-compose (1.29.X)

Tested with Docker Desktop 4.9.1. Older version might work.

### (Option 1) docker-compose

- Copy the content content of the folder **example/** somewhere on your machine.
- Open **config.json** and complete the missing information. Read [Add the bot to a server](#Add-the-bot-to-a-server) section.
- Read **docker-compose.yml** and edit some part if needed.
- Run the docker-compose command inside the folder of the **docker-compose.yml** file.

```
docker compose -p eve-online-incursion-bot up
```

_Add "-d" to run in detached mode._

### (Option 2) docker run

- Copy the content of the folder **example/** somewhere on your machine.
- Open **config.json** and complete the missing information. Read [Add the bot to a server](#Add-the-bot-to-a-server) section.
- Run docker run command

```
docker run -it -v /FULLPATHTO/config.json:/app/src/config/config.json -v /FULLPATHTO/incursions_cache.json:/app/incursions_cache.json opetdev/eve-online-incursion-discord-bot:1.0.3
```

_Replace "-it" for "-d" to run in detached mode._

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
  "highSecOnly": true
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

## Docker

### Build Docker image

#### Standard build

```
docker build . -t opetdev/eve-online-incursion-discord-bot:1.0.3
```

#### Multi-arch build

```
docker buildx build . -t opetdev/eve-online-incursion-discord-bot:1.0.3 --push --platform=linux/arm64,linux/amd64,linux/arm/v7,linux/arm/v6
```

## CCP Copyright Notice

EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to EVE Online incursions Discord bot to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, EVE Online incursions Discord bot. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
