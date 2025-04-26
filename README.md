# BaseBot Kit for Discord
This is a development ready base for _your_ [Discord](https://discord.com/) bot!

There's 2 example commands in `src/functions.cjs`:
- **ping**: Pings the bot.
- **say**: Makes the bot say whatever you like.

## Start the Bot
First off. Go to https://discord.com/developers/applications, create an application _("bot")_, and grab it's token.

Then, go to `botconfig.json`, and place the token in `appToken`.

And that's the most basic setup! To start your bot run:
```cmd
npm ci
```
In the root directory of the project to clean-install all dependencies.

To actually start the bot, run:
```cmd
npm run start
```
And you're done!

Here's an example of a modified `botconfig.json` file:
```json5
{
  "$schema": "./src/components/botconfig.schema.json",

  "appToken": "APP_TOKEN_HERE",
  "appServer": 1223456789,
  "appLoggingWebhook": "https://discord.com/api/webhooks/...",
  "appVersion": "1.4.2",
  "appBuild": 142,

  "botStatus": "Charli XCX",
  "botStatusType": "listening", // Listening to...
  "botShowAs": "idle"
}
```
