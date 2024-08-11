import { API_KEY } from "../config.js";
import fetch from "node-fetch"
import { getRank } from "./getRank.js";
import { pool } from "../dbConfig.js"
import { EmbedBuilder } from "discord.js";

export async function pollRankUpdates() {
	const channelId = '1270951455385456670'
    try {
        const result = await pool.query('SELECT username, tag, current_rank FROM trackers');

        for (const player of result.rows) {
            const newRank = await fetchPlayerRank(player.username, player.tag);

            if (newRank > player.current_rank) {
                const rankVisualInfo = await getRank(player.current_rank, newRank);
				const { mapName, agent, kills, deaths, headshotPercent } = await getLastMatch(player.username, player.tag)

                const rankUpEmbed = new EmbedBuilder()
					.setColor(0x00ff00)
					.setTitle(`|   △△△ ${player.username}#${player.tag} △△△   |`)
					.setDescription(`congratulations on ranking up to ${rankVisualInfo[2]}!`)
					.setThumbnail(rankVisualInfo[3])
					.setImage('https://i.imgur.com/wvhmPOd.png')
					.addFields(
						{ name: 'Map', value: mapName, inline: true },
						{ name: 'Agent', value: agent, inline: true },
						{ name: 'K/D', value: `K: ${String(kills)} D: ${String(deaths)}`, inline: true },
						{ name: 'Headshot %', value: `${String(headshotPercent)}`, inline: true },
					)
					.setTimestamp();

				const channel = await client.channels.fetch(channelId);
				if (channel) {
					await channel.send({ embeds: [rankUpEmbed] });
				}

                await pool.query('UPDATE trackers SET current_rank = $1 WHERE username = $2 AND tag = $3', [newRank, player.username, player.tag]);

            } else if (newRank < player.current_rank) {
                const rankVisualInfo = await getRank(player.current_rank, newRank);
                const { mapName, agent, kills, deaths, headshotPercent } = await getLastMatch(player.username, player.tag)

				const deRankEmbed = new EmbedBuilder()
					.setColor(0xff0000)
					.setTitle(`|   ▽▽▽ ${player.username}#${player.tag} ▽▽▽   |`)
					.setDescription(`Sorry these kids put you back to ${rankVisualInfo[0]}!`)
					.setThumbnail(rankVisualInfo[1])
					.addFields(
						{ name: 'Map', value: mapName, inline: true },
						{ name: 'Agent', value: agent, inline: true },
						{ name: 'K/D', value: `K: ${String(kills)} D: ${String(deaths)}`, inline: true },
						{ name: 'Headshot %', value: `${String(headshotPercent)}`, inline: true },
					)
					.setImage('https://i.imgur.com/wvhmPOd.png')
					.setTimestamp();

				const channel = await client.channels.fetch(channelId);
				if (channel) {
					await channel.send({ embeds: [deRankEmbed] });
				}

                await pool.query('UPDATE trackers SET current_rank = $1 WHERE username = $2 AND tag = $3', [newRank, player.username, player.tag]);
            }
        }
    } catch (error) {
        console.error('Error polling rank updates:', error);
    }
}

export const fetchPlayerRank = async (username, tag) => {
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/na/pc/${username}/${tag}`, {
        method: 'GET',
        headers: {
            'Authorization': `${API_KEY}`
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    const newRank = data.data.current.tier.id;

    return newRank;
}

async function getLastMatch(username, tag) {
	try {
		const response = await fetch(`https://api.henrikdev.xyz/valorant/v4/matches/na/pc/${username}/${tag}`, {
			method: 'GET',
			headers: {
				'Authorization': `${API_KEY}`
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
		const headshotPercent = calculateHeadshotPercentage(agentDetails.stats.headshots, agentDetails.stats.bodyshots, agentDetails.stats.legshots)

		return {
			mapName,
			agentDetails,
			agent,
			kills,
			deaths,
			headshotPercent
		};
	} catch (error) {
		console.error('Error fetching last match data:', error);
        throw error;
	}
}

function calculateHeadshotPercentage(headshots, bodyshots, legshots) {
    const totalShots = headshots + bodyshots + legshots;
    if (totalShots === 0) return 0;
    const headshotPercentage = (headshots / totalShots) * 100;
    return headshotPercentage.toFixed(2);
}

