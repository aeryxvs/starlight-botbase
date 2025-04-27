const bot = require("./utils/bot.cjs")
const config = require("./utils/config.cjs")
const { Constants } = require("eris");

const commands = [
	{
		name: "ping", description: "Ping, pong...!",
		type: Constants.ApplicationCommandTypes.CHAT_INPUT,
		function: async (interaction) => {
			// Your code here.
			await interaction.createMessage("Pong!");
		}
	},
	{
		name: "say", description: "Make the bot say something.",
		type: Constants.ApplicationCommandTypes.CHAT_INPUT,
		options: [
			{
				name: "message",
				description: "Message message...",
				type: Constants.ApplicationCommandOptionTypes.STRING,
				required: true,
			}
		],
		function: async (interaction) => {
			// Your code here.
			const text = interaction.data.options.find((opt) => opt.name === "message");
			await interaction.createMessage(text.value);
		}
	},
];

function status () {
	if (config.botStatusType === "none") return;

	const data = {
		"playing": Constants.ActivityTypes.GAME,
		"watching": Constants.ActivityTypes.WATCHING,
		"listening": Constants.ActivityTypes.LISTENING,
		"competing": Constants.ActivityTypes.COMPETING,
	}

	const apply = () => {
		bot.editStatus(config.botShowAs, { name: config.botStatus, type: data[config.botStatusType] });
	}

	apply()
	setInterval(apply, 60 * 60 * 1000)
}

async function register () {
	const appId = bot.user.id;
	try {
		const existingCommands = await bot.requestHandler.request(
			"GET",
			`/applications/${appId}/commands`,
			true
		);

		const commandsToUpsert = commands.filter((localCmd) => {
			const matchingCommand = existingCommands.find((globalCmd) => globalCmd.name === localCmd.name && globalCmd.type === localCmd.type);
			return ! matchingCommand || JSON.stringify(localCmd) !== JSON.stringify(matchingCommand);
		});

		const commandsToDelete = existingCommands.filter(
			(globalCmd) =>
				! commands.some((localCmd) => localCmd.name === globalCmd.name && globalCmd.type === localCmd.type)
		);

		if (commandsToUpsert.length > 0) {
			console.log("[INFO] Adding/Updating commands:", commandsToUpsert.map((cmd) => cmd.name));
			await bot.requestHandler.request("PUT", `/applications/${appId}/commands`, true, commands);
		} else {
			console.log("[INFO] No new commands to add or update.");
		}

		for (const cmd of commandsToDelete) {
			console.log(`[WARN] Deleting command: ${cmd.name}`);
			await bot.requestHandler.request("DELETE", `/applications/${appId}/commands/${cmd.id}`, true);
		}
		console.log("[INFO] Global slash and user context commands synced successfully!");

	} catch (err) {
		console.error("[FATAL] Error syncing slash commands:", err);
	}
}

async function main () {
	console.log("[INFO] Connecting to Discord...");

	bot.once("ready", async () => {
		console.log("[INFO] Connected! Waiting for servers to become available...");
		console.log("[INFO] Initializing...");

		await register();
		status();

		console.log("\n[INFO] Ready!");
	});

	bot.on("interactionCreate", async (interaction) => {
		if (interaction.type !== Constants.InteractionTypes.APPLICATION_COMMAND) return;

		if (! interaction.guildID) {
			await interaction.createMessage("**Uh-oh!** Don't run me in DMs. :(");
			return;
		}

		const { name } = interaction.data;
		console.log(`[INFO] Received command: ${name}`);

		try {
			for (const c of commands) {
				if (c.name === name) {
					await c.function(interaction);
					break;
				}
			}
		} catch (error) {
			await interaction.createMessage(`An error occurred while executing command:\n\`\`\`\n${error}\n\`\`\``);
			console.log(error);
		}
	})

	process.on("SIGINT", async () => {
		console.warn("[WARN] Killing the bot!")
		await bot.disconnect({reconnect: false});
		process.exit(0);
	})
	await bot.connect();
}

module.exports = main;
