import { EmbedBuilder } from "discord.js";
import pool from "./dbConfig.js"



export async function viewTrackingList(server_id, interaction){

	try {
		const query = await pool.query('SELECT server_id, agent FROM trackers WHERE server_id = $1', [server_id])
		const users = []
		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.addFields(
				{ name: 'Tracked Users', value: users.join(', '), inline: true }
			)

		for (let i=0; i < query.rows.length; i++){
			users.push(query.rows[i].agent)
		}

		console.log(users)
		await interaction.editReply({ embeds: [embed]})

	} catch (error) {
        console.error('Error fetching data:', error);
	}
}