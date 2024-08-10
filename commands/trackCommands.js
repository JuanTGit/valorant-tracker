import { getUserData } from '../utils/getUserData.js'

export async function handleInteraction(interaction){
	if (!interaction.isCommand()) return;

    console.log(`Received interaction: ${interaction.commandName}`);

    try {
        await interaction.deferReply();

        const { commandName, options } = interaction;

        if (commandName === 'track') {
            const username = options.getString('username').replace(' ', '_');
            const tag = options.getString('tag').replace('#', '');
            await getUserData(username, tag, interaction);
        } else {
            await interaction.editReply(`Unknown command ${commandName}`);
        }
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(`Error handling command: ${error.message}`);
        } else {
            await interaction.reply(`Error handling command: ${error.message}`);
        }
    }
}