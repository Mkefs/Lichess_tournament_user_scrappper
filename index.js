const https = require("https");
const colors = require("colors");
const { argv } = require("process");
let lichess = "https://lichess.org";
async function get_page(name, tournament){
	return await new Promise((res, rej) => {
		let url = `${tournament}/player/${name.toLowerCase()}`;
		https.get(url, 
			(resp) => {
				let chunks = [];
				resp.on("data", (chunk) => chunks.push(chunk));
				resp.on("end", () => res(Buffer.concat(chunks)));
			}
		).on("error", err => rej(err));
	});
}

get_page(argv[2], argv[3])
	.then(buff => {
		let games = JSON.parse(buff);
		console.clear();
		console.log(
			`\n[${games.player.name}]`,
			`\tN.${games.player.rank}\n`,
			`\t[G: ${games.player.nb.game}]`, 
			`\t${colors.green(`[W: ${games.player.nb.win}]`)}`
		);
		console.log("-----------------------------------");
		for(let i = 0; i < games.pairings.length; i++){
			let game = games.pairings[i];
			let gameColor = "\t[P]", gameLink;
			gameColor = (game.color != "black")? 
				gameColor.bgBlack.white : gameColor.bgWhite.black;
			gameLink = ` ${game.win? game.op.name.green : game.op.name.red} [${lichess}/${game.id}]`;
			console.log(gameColor, gameLink);
		}
		console.log('\n');
	});