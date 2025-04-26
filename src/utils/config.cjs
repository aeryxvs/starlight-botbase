const fs = require("fs");
const path = require("path");

/** @type {starlightBotConfig} */
let botConfig = {};

const searchFiles = [
	"botconfig.json", "config.json", "bot.json",
	"botconfig.json.txt", "config.json.txt", "bot.json.txt",
	"botconfig.json.json", "botconfig.json.json", "bot.json.json"

];

const cfTarget = searchFiles.find(file => {
	try {
		const revFile = path.resolve("./", file)
		fs.accessSync(revFile);
		return revFile
	} catch {
		return null;
	}
});

if (cfTarget) {
	console.log(`[INFO] Loading config file: ${cfTarget}`);
	try {
		const cfRaw = fs.readFileSync(cfTarget, "utf8");
		botConfig = require("json5").parse(cfRaw);
	} catch (e) {
		console.error(`[FATAL] Error reading config: ${e}`);
		process.exit(1);
	}
} else {
	console.error("[FATAL] Couldn\'t locate config file.");
	process.exit(1);
}

module.exports = botConfig;
