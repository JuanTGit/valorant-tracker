import { fetchPlayerRank } from '../utils/rankTracker.js';
import pool from '../dbConfig.js';
import { EmbedBuilder } from 'discord.js';

export async function handleAddTracker(username, tag, interaction) {
    try {
        const serverId = interaction.guildId;
        const key = `${username.toLowerCase()}#${tag.toLowerCase()}`;
		const rank = await fetchPlayerRank(username, tag);

        const checkQuery = `
            SELECT 1 FROM trackers WHERE server_id = $1 AND agent = $2 LIMIT 1;
            `;
        
        const checkResults = await pool.query(checkQuery, [serverId, key]);

        if (checkResults > 0) {
            await interaction.editReply(`${key} is already being tracked.`)
        }
        
        const query = `
            INSERT INTO trackers (server_id, username, tag, current_rank, agent)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (server_id, username, tag)
            DO UPDATE SET current_rank = EXCLUDED.current_rank;
        `;
        await pool.query(query, [serverId, username.toLowerCase(), tag.toLowerCase(), rank, key]);

        const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`${key} added to tracking list.`)


        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error adding tracker:', error);
        await interaction.editReply(`Error adding tracker: ${error.message}`);

    }
}

export async function handleRemoveTracker(username, tag, interaction) {
    try {
        const serverId = interaction.guildId;
        const key = `${username.toLowerCase()}#${tag.toLowerCase()}`;

        const result = await pool.query(
            'DELETE FROM trackers WHERE server_id = $1 AND username = $2 AND tag = $3 RETURNING *',
            [serverId, username.toLowerCase(), tag.toLowerCase()]
        );

        const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle(`${key} removed from tracking list.`)


    await interaction.editReply({ embeds: [embed] });

        // Send a reply if not already replied
        if (result.rowCount > 0) {
            await interaction.editReply({ embeds: [embed]});
        } else {
            await interaction.editReply(`${key} is not found in the tracking list.`);
        }
    } catch (error) {
        console.error('Error removing tracker:', error);
        await interaction.editReply(`Error removing tracker: ${error.message}`);
    }
}
