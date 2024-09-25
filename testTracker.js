


export async function getUserData(name, tag) {

	const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/na/pc/${name}/${tag}`, {
		method: 'GET',
		headers: {
			'Authorization': `HDEV-f0d7835b-dc3c-4365-9015-afe1f9d1c542`
		},
	})
	const data = await response.json()
	console.log(data.data.current.tier.id)
}

// getUserData(`ric00`, `2264`)