import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { handleInteraction } from './commands/trackCommands.js';
import { pollRankUpdates } from './utils/rankTracker.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    setInterval(async () => {
        try {
            await pollRankUpdates();
        } catch (error) {
            console.error('Error during polling:', error);
        }
    }, 10 * 60 * 1000);
    
});

client.on('interactionCreate', async (interaction) => {
    await handleInteraction(interaction);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN);
