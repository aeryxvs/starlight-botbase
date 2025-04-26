const config = require("./config.cjs");

async function webhookLog(title, message) {
	if (! config.appLoggingWebhook) return;

	console.log("[INFO] Sending embed...");

	const embeddedMsg = {
		content: "",
		embeds: [{
			title: title,
			description: message,
			image: { url: "https://raw.i.at-star.org/starv3/minibanner.jpeg" },
			color: 0xfefefe,
			timestamp: new Date().toISOString(),
		}]
	};

	try {
		const response = await fetch(config.appLoggingWebhook, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(embeddedMsg),
		});

		if (! response.ok) {
			new Error(`${response.status} ${response.statusText}`);
		}

		console.log("[INFO] Embed sent successfully!");
	} catch (error) {
		console.warn(`[WARN] Error sending embed to webhook: ${error.message}`);
	}
}

module.exports = webhookLog;
