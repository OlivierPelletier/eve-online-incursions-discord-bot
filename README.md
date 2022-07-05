# EVE Online incursions Discord bot

An EVE Online Discord bot for incursion enthousiast.

## Setup

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
  "token": "APP_BOT_TOKEN"
}
```

### Deploy slash commands

```
yarn run deploy
```

### Run the bot

```
yarn run bot
```
