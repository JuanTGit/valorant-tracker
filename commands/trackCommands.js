import { getUserData } from '../utils/getUserData.js'
import pool from '../dbConfig.js';
import { handleAddTracker, handleRemoveTracker } from './handleTrackingCommands.js';
import client from '../index.js';
import { viewTrackingList } from '../viewTrackingList.js';

export async function handleInteraction(interaction){
	if (!interaction.isCommand()) return;

    try {
        await interaction.deferReply();

        const { commandName, options } = interaction;

        if (commandName === 'track') {

            const username = options.getString('username').replace(' ', '_');
            const tag = options.getString('tag').replace('#', '');
            await getUserData(username, tag, interaction);

        } else if (commandName === 'add_tracker') {

            const username = options.getString('username').replace(' ', '_');
            const tag = options.getString('tag').replace('#', '');
            await handleAddTracker(username, tag, interaction)

        } else if (commandName === 'remove_tracker') {

            const username = options.getString('username').replace(' ', '_');
            const tag = options.getString('tag').replace('#', '');
            await handleRemoveTracker(username, tag, interaction)

        } else if (commandName === 'add_announcements') {
            const channelId = interaction.channelId;
            const serverId = interaction.guildId;
            const channel = await client.channels.fetch(channelId)
            try {
                const query = `
                    INSERT INTO channel_settings (server_id, channel_id)
                    VALUES ($1, $2)
                    ON CONFLICT (server_id)
                    DO UPDATE SET channel_id = EXCLUDED.channel_id;
                `;
                await pool.query(query, [serverId, channelId]);

                await interaction.editReply(`Channel ID ${channel.name} set for announcements.`);
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000);
            } catch (error) {
                console.error('Error setting channel ID:', error);
                await interaction.editReply('Error setting channel ID.');
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000);
            }

        } else if (commandName === 'remove_announcements') {
            const serverId = interaction.guildId;
            const server = await client.guilds.fetch(serverId)
            try {
                const query = `DELETE FROM channel_settings WHERE server_id = $1`
                await pool.query(query, [serverId])


                await interaction.editReply(`Announcements removed from ${server.name} successfully!`)
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000);
            } catch (error) {
                console.error('Error removing announcements:', error)
                await interaction.editReply('Error removing announcements: Either no channel has been set or an internal error has occurred.')
                setTimeout(() => {
                    interaction.deleteReply()
                }, 10000);
            }
        } else if (commandName === 'view_list') {
            const serverId = interaction.guildId;
            await viewTrackingList(serverId, interaction);
        } else {
            await interaction.editReply(`Unknown command ${commandName}`);
            setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(`Error handling command: ${error.message}`);
            setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
        } else {
            await interaction.reply(`Error handling command: ${error.message}`);
            setTimeout(() => {
				interaction.deleteReply()
			}, 10000);
        }
    }
}