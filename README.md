# EVE Online incursions Discord bot

An EVE Online Discord bot for incursions enthousiast.

## Sponsors

- Kevin "Twiggys" T.

New features for this bot are mainly motivated by ISK/PLEX donation. If you want to sponsor a new feature for this bot, DM me on discord @Opet#1246.

## Development setup

### Requirements

- node.js (v16.15.X)
- npm (8.13.X)
- yarn (1.22.X)

The project was developped on macOS 12.4 with the versions listed above. Might work with older/newer versions.

### Add the bot to a server

Replace CLIENT_ID by your own Discord application client id.

```
https://discord.com/api/oauth2/authorize?client_id=<CLIENT_ID>&permissions=534723951680&scope=bot%20applications.commands
```

### Configure the bot

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

## Bot features

### Slash commands

- /incursions (shows current incursion information )

## TODOs

- Automatically send new incursion information to the Discord channel
- Add missing information to the embed message (number of jump of last incursion, timestamp)
- Create a Docker image for the project
- Write installation instructions
