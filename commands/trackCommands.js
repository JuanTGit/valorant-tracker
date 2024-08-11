import { getUserData } from '../utils/getUserData.js'
import pool from '../dbConfig.js';
import { handleAddTracker, handleRemoveTracker } from './handleTrackingCommands.js';

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
            console.log(channelId, serverId)
            try {
                const query = `
                    INSERT INTO channel_settings (server_id, channel_id)
                    VALUES ($1, $2)
                    ON CONFLICT (server_id)
                    DO UPDATE SET channel_id = EXCLUDED.channel_id;
                `;
                await pool.query(query, [serverId, channelId]);

                await interaction.editReply(`Channel ID ${channelId} set for announcements.`);
            } catch (error) {
                console.error('Error setting channel ID:', error);
                await interaction.editReply('Error setting channel ID.');
            }

        } else if (commandName === 'remove_announcements') {
            const serverId = interaction.guildId;
            try {
                const query = `DELETE FROM channel_settings WHERE server_id = $1`
                await pool.query(query, [serverId])


                await interaction.editReply('Announcements removed successfully! You will no longer recieve updates in this server.')
            } catch (error) {
                console.error('Error removing announcements:', error)
                await interaction.editReply('Error removing announcements: Either no channel has been set or an internal error has occurred.')
            }
        } else {
            await interaction.editReply(`Unknown command ${commandName}`);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);

        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(`Error handling command: ${error.message}`);
        } else {
            await interaction.reply(`Error handling command: ${error.message}`);
        }
    }
}