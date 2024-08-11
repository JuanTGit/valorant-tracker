import { fetchPlayerRank } from '../utils/rankTracker.js'
import { pool } from '../dbConfig.js'

export async function handleAddTracker(username, tag, interaction) {
    try {
		const serverId = interaction.guildId;
		const key = `${username}#${tag}`
		const rank = await fetchPlayerRank(username, tag);
		
        const query = `
            INSERT INTO trackers (server_id, username, tag, current_rank)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (server_id, username, tag)
            DO UPDATE SET current_rank = EXCLUDED.current_rank;
        `;
		await pool.query(query, [serverId, username, tag, rank]);

        await interaction.reply(`${key} added to tracking list.`);
    } catch (error) {
        console.error(error);
        await interaction.reply(`Error adding tracker: ${error.message}`);
    }
}



export async function handleRemoveTracker(username, tag, interaction) {
    try {
        const serverId = interaction.guildId;
        const key = `${username}#${tag}`;

        const result = await pool.query(
            'DELETE FROM trackers WHERE server_id = $1 AND username = $2 AND tag = $3 RETURNING *',
            [serverId, username, tag]
        );

        if (result.rowCount > 0) {
            await interaction.reply(`${key} removed from tracking list.`);
        } else {
            await interaction.reply(`${key} is not found in the tracking list.`);
        }
    } catch (error) {
        console.error(error);
        await interaction.reply(`Error ${error.message}`);
    }
}
