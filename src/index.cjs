console.log(`

	   ______  _____ __
	  / ____ \\/ ___// /_____ ______
	 / / __ \`/\\__ \\/ __/ __ \`/ ___/
	/ / /_/ /___/ / /_/ /_/ / /
	\\ \\__,_//____/\\__/\\__,_/_/
	 \\____/


  Starlight Base App
  Open Source project driven by
  @Star Labs.

  Server:  https://join.starlight-foss.org/
  Lead:    bvnsxhii
           bvnsxhii@starlight-foss.org

`)

const nodeVer = parseInt(process.versions.node.split(".")[0], 10);
const maxTrace = process.env.NODE_ENV === "development" ? Infinity : 8;

if (nodeVer < 22) {
    console.error(`[FATAL] Node.js ${nodeVer} is unsupported! Please install Node.js 22 or above.`);
    process.exit(1);
}
console.log(`[INFO] Running on Node.js ${process.versions.node}.`)

const log = require("./utils/logging.cjs");
const config = require("./utils/config.cjs");
const functions = require("./function.cjs")

async function handleError(err) {
	if (err && err.message && err.message.startsWith("Unhandled MESSAGE_CREATE type")) return;

	if (err) {
		if (typeof err === "string") {
			console.error(`[FATAL] Error: ${err}`);
		} else if (err.message === "Disallowed intents specified") {
			console.error(
				"[FATAL] Error: Disallowed intents specified\n|\n" +
				"| To run the bot, enable 'Server Members Intent' in the Discord Developer Portal:\n|\n" +
				"| 1. Go to https://discord.com/developers/applications\n" +
				"| 2. Click on your bot\n" +
				"| 3. Click 'Bot' in the sidebar\n" +
				"+ 4. Turn on 'Server Members Intent'"
			);
		} else {
			let stackLines = (err.stack || "").split("\n");
			if (stackLines.length > (maxTrace + 2)) {
				stackLines = stackLines.slice(0, maxTrace);
				stackLines.push(`    ...stack trace truncated to ${maxTrace} lines.`);
			}
			const finalStack = stackLines.join("\n");
			const errorPrefix = err.code ? `[FATAL] Error ${err.code}: ` : "[FATAL] Error: ";
			console.error(errorPrefix + finalStack);
		}
	}

	await log("Bot Error", err !== undefined ? `\`\`\`\n${err}\n\`\`\`\n## Bot Restart Needed.` : "Unknown error occurred.\n## Bot Restart Needed.");

	console.log("[FATAL] Cannot continue. Reboot required.");
	process.exit(1)
}

(async () => {
	process.on("uncaughtException", handleError);
	process.on("unhandledRejection", handleError);

	const msg = `Starting the bot v${config.appVersion} (Build: ${config.appBuild}); Node.js ${process.versions.node} (${process.platform} ${process.arch})`
	console.log(`[INFO] ${msg}`);
	await log("Bot Process", msg);

	await functions();
})();
