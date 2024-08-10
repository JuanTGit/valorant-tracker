import { API_KEY } from "../config.js";
import fetch from "node-fetch"


const playerInfo = {
	'greatvaluejuan#na2': {
		username: 'greatvaluejuan',
		tag: 'na2',
		currentRank: 12,
	},
	'32#na2': {
		username: 'greatvaluejuan',
		tag: 'na2',
		currentRank: 14,
	}
}

export async function rankTracker(username, tag) {

	const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/na/pc/${username}/${tag}`, {
		method: 'GET',
		headers: {
			'Authorization': `${API_KEY}`
		},
	});

	const data = await response.json()
	const currentRank = data.data.current.tier.id

	for (const playerId in playerInfo) {
		const player = playerId
		console.log(player)
	}

}