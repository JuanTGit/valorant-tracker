import { API_KEY } from "../config.js";
import fetch from "node-fetch"
import { getRank } from "./getRank.js";
import pool from "../dbConfig.js";
import { EmbedBuilder } from "discord.js";
import client from "../index.js";

async function getChannelId(serverId) {
	try{
		const query = await pool.query('SELECT channel_id from channel_settings WHERE server_id = $1', [serverId]);
		return query.rows.length > 0 ? query.rows[0].channel_id : null;
	} catch (error) {
		console.error('Error fetching channel ID', error);
		return null;
	}
}

export async function pollRankUpdates() {
	try {
		const result = await pool.query('SELECT username, tag, current_rank, server_id FROM trackers');
		const messageQueue = [];

		for (const player of result.rows) {
			try {
				const newRank = await fetchPlayerRank(player.username, player.tag);
				if (newRank === player.current_rank) continue;

				const isRankUp = newRank > player.current_rank;
				const rankVisualInfo = await getRank(player.current_rank, newRank);
				const { mapName, agent, kills, deaths, headshotPercent } = await getLastMatch(
				player.username.replace('_', ' '),
				player.tag
				);

				const embed = new EmbedBuilder()
				.setColor(isRankUp ? 0x5b96a8 : 0xe9616b)
				.setTitle(`|   ${isRankUp ? '△△△' : '▽▽▽'} ${player.username.replace('_', ' ')}#${player.tag} ${isRankUp ? '△△△' : '▽▽▽'}   |`)
				.setDescription(`${isRankUp ? 'Rank up' : 'Back to'} ${rankVisualInfo[0]}! ${isRankUp ? 'Light Work 🥱' : '😭'}`)
				.setThumbnail(rankVisualInfo[1])
				.addFields(
					{ name: 'Map', value: mapName || 'Unknown', inline: true },
					{ name: 'Agent', value: agent || 'Unknown', inline: true },
					{ name: 'K/D', value: `Kills: ${kills} \nDeaths: ${deaths}`, inline: true },
					{ name: 'Headshot %', value: `${headshotPercent}%`, inline: true }
				)
				.setImage('https://i.imgur.com/wvhmPOd.png')
				.setTimestamp();

				const channelId = await getChannelId(player.server_id);
				if (!channelId) {
				console.warn(`No channel ID for server ${player.server_id}`);
				continue;
				}

				messageQueue.push({
				channelId,
				embed,
				username: player.username,
				tag: player.tag,
				newRank,
				});
			} catch (err) {
				console.error(`❌ Error building message for ${player.username}#${player.tag}:`, err);
			}
		}

		// Send messages sequentially
		for (const msg of messageQueue) {
			try {
				const channel = await client.channels.fetch(msg.channelId);
				if (!channel) {
				console.warn(`Channel ${msg.channelId} not found.`);
				continue;
				}

				await channel.send({ embeds: [msg.embed] });
				console.log(`✅ Sent message for ${msg.username}#${msg.tag}`);

				// Update rank in DB after successful send
				await pool.query(
				'UPDATE trackers SET current_rank = $1 WHERE username = $2 AND tag = $3',
				[msg.newRank, msg.username, msg.tag]
				);

				// Wait 1 second before next message to avoid hitting rate limit
				await new Promise((res) => setTimeout(res, 1000));
			} catch (err) {
				console.error(`❌ Failed to send message for ${msg.username}#${msg.tag}`, err);
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

