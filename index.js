import dotenv from 'dotenv';
import fetch from 'node-fetch';
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(port, () => {
    console.log(`Web server running on port ${port}`);
});

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
});

client.on('messageCreate', message => {

    if (message.author.bot) return;

    const prefix = '!';

    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === 'track') {
            const username = args[0];
            const tag = args[1]
            getUserData(username, tag, message);
        } else {
            message.channel.send(`Unknown command ${command}`)
        }
    }
})


async function getUserData(name, tag, message) {
    try {
        let response = await fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/na/${name}/${tag}`, {
            method: 'GET',
            headers: {
                'Authorization': `${process.env.API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        let data = await response.json();

        let username = data.data.name;
        let rank = data.data.current_data.currenttierpatched;
        let current_rr = data.data.current_data.ranking_in_tier;

        message.channel.send(`Nigga ${username}\n${rank}\nRR: ${current_rr}/100`);
    } catch (error) {
        console.error(error);
        message.channel.send(`Error fetching user data: ${error.message}`);
    }

}

client.login(process.env.DISCORD_TOKEN);