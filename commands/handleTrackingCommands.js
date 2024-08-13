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

        if (checkResults.rowCount > 0) {
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle(`${key} already being tracked.`)

            await interaction.editReply({ embeds: [embed]})
            setTimeout(() => {
                interaction.deleteReply()
            }, 10000)
        } else {
            const query = `
                INSERT INTO trackers (server_id, username, tag, current_rank, agent)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (server_id, username, tag)
                DO UPDATE SET current_rank = EXCLUDED.current_rank;
            `;
            await pool.query(query, [serverId, username.toLowerCase(), tag.toLowerCase(), rank, key]);
    
            const embed = new EmbedBuilder()
                .setColor(0x156926)
                .setTitle(`${key} added to tracking list.`)
    
    
            await interaction.editReply({ embeds: [embed] });

            setTimeout(() => {
                interaction.deleteReply()
            }, 10000)
        }
        

    } catch (error) {
        console.error('Error adding tracker:', error);
        await interaction.editReply(`Error adding tracker: ${error.message}`);
        setTimeout(() => {
            interaction.deleteReply()
        }, 10000)

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

        const embedDeleted = new EmbedBuilder()
        .setColor(0x0b1926)
        .setTitle(`${key} deleted from tracking list.`);

        const embedNotFound = new EmbedBuilder()
        .setColor(0x0b1926)
        .setTitle(`${key} not found in tracking list.`);


        if (result.rowCount > 0) {
            await interaction.editReply({ embeds: [embedDeleted]});
            setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
        } else {
            await interaction.editReply({ embeds: [embedNotFound]});
            setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
        }
    } catch (error) {
        console.error('Error removing tracker:', error);
        await interaction.editReply(`Error removing tracker: ${error.message}`);
        setTimeout(() => {
            interaction.deleteReply()
        }, 10000)
    }
}
