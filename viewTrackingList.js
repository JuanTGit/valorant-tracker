import { EmbedBuilder } from "discord.js";
import pool from "./dbConfig.js"



export async function viewTrackingList(server_id, interaction){

	try {
		const query = await pool.query('SELECT server_id, agent FROM trackers WHERE server_id = $1', [server_id])
		const users = query.rows.map(row => row.agent).filter(agent => agent.trim() !== '');

		if (users.length === 0) {
			await interaction.editReply('No tracked users found.')
			setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
			return;
		}
		
		const embed = new EmbedBuilder()
			.setColor(0xf0f71e)
			.addFields(
				{ name: 'Tracked Users', value: users.join('\n'), inline: true }
			)

		await interaction.editReply({ embeds: [embed]})

		setTimeout(() => {
            interaction.deleteReply()
        }, 60000);

	} catch (error) {
		console.error('Error fetching data:', error);
		await interaction.editReply(`Error fetching data: ${error.message}`);
		setTimeout(() => {
            interaction.deleteReply()
        }, 10000);
	}
}
