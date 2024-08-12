
async function getLastMatch(username, tag) {
	try {
		const response = await fetch(`https://api.henrikdev.xyz/valorant/v4/matches/na/pc/${username}/${tag}`, {
			method: 'GET',
			headers: {
				'Authorization': `HDEV-f0d7835b-dc3c-4365-9015-afe1f9d1c542`
			},
		});
	

		if (!response.ok) {
			throw new Error(`Error fetching match data: ${response.statusText}`)
		}

		const data = await response.json()

		const mapName = data.data.at(0).metadata.map.name
		const agentDetails = data.data.at(0).players.find(player => player.name.toLowerCase() === username)
		const agent = agentDetails.agent.name
		const kills = agentDetails.stats.kills
		const deaths = agentDetails.stats.deaths
		// const headshotPercent = calculateHeadshotPercentage(agentDetails.stats.headshots, agentDetails.stats.bodyshots, agentDetails.stats.legshots)
		console.log(`${username}: `, data.data.at(0))

		return {
			mapName,
			agentDetails,
			agent,
			kills,
			deaths,
			// headshotPercent
		};
	} catch (error) {
		console.error('Error fetching last match data:', error);
        throw error;
	}
}

getLastMatch('jus_chillen', 'na1')
// getLastMatch('greatvaluejuan', 'na2')


