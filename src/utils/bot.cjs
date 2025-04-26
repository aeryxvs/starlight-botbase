const Eris = require("eris");
const config = require("./config.cjs")

const intents = [
	"guildMembers",
	"directMessages",
	"guildMessages",
	"messageContent",
	"guilds",
	"guildVoiceStates",
	"guildMessageTyping",
	"directMessageTyping",
	"guildBans",
];

const bot = new Eris.Client(config.appToken, {
	restMode: true,
	intents: Array.from(new Set(intents)),
	allowedMentions: {
		everyone: false,
		roles: false,
		users: false,
	},
});

const SAFE_TO_IGNORE_ERROR_CODES = [
	1001,
	1006,
	"ECONNRESET",
];

bot.on("error", err => {
	if (SAFE_TO_IGNORE_ERROR_CODES.includes(err?.code)) {
		return;
	}
	throw err;
});

/**
 * @type {Eris.Client}
 */
module.exports = bot;
