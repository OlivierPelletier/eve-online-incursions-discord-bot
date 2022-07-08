# EVE Online incursions Discord bot

An EVE Online Discord bot for incursions enthousiast.

## Sponsors

- Kevin "Twiggys" T.

New features for this bot are mainly motivated by ISK/PLEX donation. If you want to sponsor a new feature for this bot, DM me on discord @Opet#1246.

## Bot features

### Slash commands

- /incursions (shows current incursion information )

### Other

- The bot will scan regularly the ESI for incursions update and will post the update inside a dedicated Discord channel.

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

#### docker-compose up

```
docker compose -p eve-online-incursion-bot up
```

Add "-d" to run in detached mode.

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
docker build . -t opetdev/eve-online-incursion-discord-bot:1.0.0
```

#### Multi-arch build

```
docker buildx build . -t opetdev/eve-online-incursion-discord-bot:1.0.0 --push --platform=linux/arm64,linux/amd64
```

## CCP Copyright Notice

EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. CCP hf. has granted permission to pyfa to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, pyfa. CCP is in no way responsible for the content on or functioning of this program, nor can it be liable for any damage arising from the use of this program.
