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
		app.rl._prompt = `> ${currnick ? currnick : app.user.user.username}: `;
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
			app.rl._prompt = `> ${currnick ? currnick : app.user.user.username}: `;
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
app.rl.on("line", line => {
	app.guild = "389448309519024138"; app.channel = "389448309959294988";
	if (line.startsWith("|")) return;
	if (line.startsWith("/")) return;
	if (line === "") {
		readline.cursorTo(process.stdin, 0);
		app.rl.write(`| WARNING: You can't send an empty message!\n`);
		app.rl.prompt();
		return;
	}
	app.user.guilds.get(app.guild).channels.get(app.channel).send(line);
	app.rl.prompt();
});
app.user.on("message", message => {
	if (message.channel.id !== app.channel || message.guild.id !== app.guild) return;
	if (message.author.id === app.user.user.id) return;
	readline.cursorTo(process.stdin, 0);
	app.rl.write(`| ${message.member.nickname ? message.member.nickname : message.author.username}: `);
	app.rl.write(message.content.split("\n").join("\n| >>> "));
	app.rl.write("\n");
	app.rl.prompt();
});

function errorAndExit(message) {
	app.rl.write(`| Looks like someone did something wrong! The error message received was ${message}. Quitting...\n`);
	process.exit();
}
