require('dotenv').config()

async function getUserData(name, tag) {
	let response = await fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/na/${name}/${tag}`, {
		method: 'GET',
		headers: {
			'Authorization': `${process.env.API_KEY}`
		},
	});
	let data = await response.json();

	let username = data.data.name
	let rank = data.data.current_data.currenttierpatched
	let current_rr = data.data.current_data.ranking_in_tier
	console.log(username, rank, current_rr)
	
}

getUserData('greatvaluejuan', 'na2')
