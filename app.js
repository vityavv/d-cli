const readline = require("readline");
const Discord = require("discord.js");
let app = {
	rl: readline.createInterface({
		input: process.stdin,
		output: process.stdout
	}),
	user: new Discord.Client()
};
try {
	app.config = require(`${process.env.HOME}/.d-cli-config.json`);
	app.user.login(app.config.token).then(() => {
		app.rl.write(`Logged in as ${app.user.user.username}`);
	}).catch(() => {errorAndExit("invalid token")});
} catch (e) {
	app.rl.question("You haven't logged in with d-cli yet! Please enter your token: ", token => {
		app.user.login(token).then(() => {
			app.rl.write(`\nLogged in as ${app.user.user.username}`);
		}).catch(() => {errorAndExit("invalid token")});
		const fs = require("fs");
		fs.writeFile(`${process.env.HOME}/.d-cli-config.json`, JSON.stringify({token: token}), err => {
			if (err) throw errorAndExit(err.message);
			app.rl.write("Created config file for you!");
			app.config = require(`${process.env.HOME}/.d-cli-config.json`);
		});
	});
}

function errorAndExit(message) {
	app.rl.write(`Looks like someone did something wrong! The error message received was ${message}. Quitting...\n`);
	process.exit();
}
