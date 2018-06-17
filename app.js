const readline = require("readline");
const Discord = require("discord.js");
let app = {
	rl: readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: ">>> "
	}),
	user: new Discord.Client(),
	channel: "",
	guild: ""
};
try {
	app.config = require(`${process.env.HOME}/.d-cli-config.json`);
	app.user.login(app.config.token).then(() => {
		app.rl.write(`| Logged in as ${app.user.user.username}`);
		app.guild = app.user.guilds.first().id;
		app.channel = app.user.guilds.first().channels.first().id;
		let currnick = app.user.guilds.get(app.guild).me.nickname || null;
		app.rl._prompt = `> ${currnick || app.user.user.username}: `;
		app.rl.write(`\n| Dropping you off in #${app.user.guilds.get(app.guild).channels.get(app.channel).name}, in ${app.user.guilds.get(app.guild)}\n`);
		app.rl.prompt();
	}).catch(() => {errorAndExit("invalid token")});
} catch (e) {
	app.rl.question("| You haven't logged in with d-cli yet! Please enter your token: ", token => {
		app.user.login(token).then(() => {
			app.rl.write(`\n| Logged in as ${app.user.user.username}`);
			app.guild = app.user.guilds.first().id;
			app.channel = app.user.guilds.first().channels.first().id;
			let currnick = app.user.guilds.get(app.guild).me.nickname || null;
			app.rl._prompt = `> ${currnick || app.user.user.username}: `;
			app.rl.write(`\n| Dropping you off in #${app.user.guilds.get(app.guild).channels.get(app.channel).name}, in ${app.user.guilds.get(app.guild)}\n`);
			app.rl.prompt();
		}).catch(() => {errorAndExit("invalid token")});
		const fs = require("fs");
		fs.writeFile(`${process.env.HOME}/.d-cli-config.json`, JSON.stringify({token: token}), err => {
			if (err) throw errorAndExit(err.message);
			app.rl.write("| Created config file for you!");
			app.config = require(`${process.env.HOME}/.d-cli-config.json`);
		});
	});
}
app.user.on("message", message => {
	if (message.channel.id !== app.channel || message.guild.id !== app.guild) return;
	if (message.author.id === app.user.user.id) return;
	readline.cursorTo(process.stdin, 0);
	readline.
	app.rl.write(`| ${message.member.nickname || message.author.username}: `);
	app.rl.write(message.content.split("\n").join("\n| >>> "));
	app.rl.write("\n");
	app.rl.prompt();
});
app.rl.on("line", line => {
	if (line.startsWith("|")) return;
	if (line.startsWith("/")) {
		handleCommand(line);
		return;
	}
	if (line === "") {
		readline.cursorTo(process.stdin, 0);
		app.rl.write(`| WARNING: You can't send an empty message!\n`);
		app.rl.prompt();
		return;
	}
	app.user.guilds.get(app.guild).channels.get(app.channel).send(line);
	app.rl.prompt();
});

function handleCommand(line) {
	let command = line.split(" ")[0].substring(1);
	let args = line.split(" ");
	args.shift();
	switch(command) {
		case "channels":
			let channelnames = app.user.guilds.get(app.guild).channels;
			channelnames = channelnames.filter(channel => ["dm", "text", "group"].includes(channel.type)).map(channel => channel.name);
			app.rl.write(`| All channels in ${app.user.guilds.get(app.guild).name}: ${channelnames.join(", ")}\n`);
			app.rl.prompt();
			break;
		case "channel":
			if (!args[0]) {
				app.rl.write("| You didn't include a channel name!\n");
				app.rl.prompt();
				return;
			}
			let channels = app.user.guilds.get(app.guild).channels.filterArray(channel => channel.name.includes(args[0]) && ["dm", "text", "group"].includes(channel.type));
			if (channels.length === 0) {
				app.rl.write(`| No channels found with that name\n`);
			} else if (channels.length > 1) {
				if (args[1]) {
					if (channels[Number(args[1] - 1)].id) {
						app.channel = channels[Number(args[1] - 1)].id;
						app.rl.write(`| Switched to channel ${app.user.guilds.get(app.guild).channels.get(app.channel).name} in ${app.user.guilds.get(app.guild).name}\n`);
app.user.guilds.get(app.guild).channels.get(app.channel).fetchMessages({limit: 10}).then(messages => {
messages.forEach(message => {
app.rl.write(`| ${message.member.nickname || message.author.username}: `);
app.rl.write(message.content.split("\n").join("\n| >>> "));
app.rl.write("\n");
});
});
					} else {
						app.rl.write(`| No channel found`);
					}
				} else {
					app.rl.write(`| Found multiple channels: ${channels.map((channel, index) => `${index + 1}: ${channel.name}`).join(", ")}. Reply with /channel <search> <number> or try a more specific search.\n`);
				}
			} else {
				app.channel = channels[0].id;
				app.rl.write(`| Switched to channel ${app.user.guilds.get(app.guild).channels.get(app.channel).name} in ${app.user.guilds.get(app.guild).name}\n`);
app.user.guilds.get(app.guild).channels.get(app.channel).fetchMessages({limit: 10}).then(messages => {
messages.forEach(message => {
app.rl.write(`| ${message.member.nickname || message.author.username}: `);
app.rl.write(message.content.split("\n").join("\n| >>> "));
app.rl.write("\n");
});
});
			}
			app.rl.prompt();
			break;
		case "servers":
		case "guilds":
			let guildnames = app.user.guilds.map(guild => guild.name);
			app.rl.write(`| All of the guilds that you are in: ${guildnames.join(", ")}\n`);
			app.rl.prompt();
			break;
		case "guild":
		case "server":
			if (!args[0]) {
				app.rl.write("| You didn't include a guild name!\n");
				app.rl.prompt();
				return;
			}
			let guilds = app.user.guilds.filterArray(guild => guild.name.includes(args[0]));
			if (guilds.length === 0) {
				app.rl.write(`| No guilds found with that name\n`);
			} else if (guilds.length > 1) {
				if (args[1]) {
					if (guilds[Number(args[1] - 1)].id) {
						app.guild = guilds[Number(args[1] - 1)].id;
						app.rl.write(`| Switched to guild ${app.user.guilds.get(app.guild).name}\n`);
					} else {
						app.rl.write(`| No guild found`);
					}
				} else {
					app.rl.write(`| Found multiple guilds: ${channels.map((guild, index) => `${index + 1}: ${guild.name}`).join(", ")}. Reply with /guild <search> <number> or try a more specific search.\n`);
				}
			} else {
				app.guild = guilds[0].id;
				app.rl.write(`| Switched to guild ${app.user.guilds.get(app.guild).name}\n`);
			}
			app.rl.prompt();
			break;
	}
}
function errorAndExit(message) {
	app.rl.write(`\n| Looks like someone did something wrong! The error message received was ${message}. Quitting...\n`);
	process.exit();
}
