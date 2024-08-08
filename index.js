import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits } from 'discord.js';
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
});

client.on('interactionCreate', async interaction => {
    
    if (!interaction.isCommand()) return;

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
});


async function getUserData(name, tag, interaction) {
    try {
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v2/mmr/na/${name}/${tag}`, {
            method: 'GET',
            headers: {
                'Authorization': `${process.env.API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        const username = data.data.name;
        const rank = data.data.current_data.currenttierpatched.toUpperCase();
        const current_rr = data.data.current_data.ranking_in_tier;
        const image = data.data.current_data.images.small;
        const peakTier = data.data.highest_rank.tier;
        const peakSeason = data.data.highest_rank.season.toUpperCase();
        const userTag = data.data.tag

        const peakRank = await getRank(peakTier)
        const currentRatingQuotes = [`You're a winner in my heart ${username}!`, 'Oof rough season mah nigga.', 'Getting boosted huh?', `Pick it up you're drooling on yourself.`]
        const peakRatingQuotes = [`Op crutch??`, 'Boosted Monkey!', `You hit unc status you've PEAKED!`, 'Nothing but a memory now...']

        const embed1 = {
            color: 0xff0000,
            title: `|   Current Rating for ${username}#${userTag}   |`,
            description: (peakRank[1] === rank ? `YOU'RE PEAKING OUT OF YOUR MIND RN!!` : getRandomQuote(currentRatingQuotes)),
            image: {
                url: image
            },
            fields: [
                {
                    name: 'Status',
                    value: rank,
                    inline: true
                },
                {
                    name: 'RR',
                    value: current_rr,
                    inline: true
                },
            ],
        };

        const embed2 = {
            color: 0xffffff,
            title: `|      Peak Rating for ${username}#${userTag}      |`,
            description: getRandomQuote(peakRatingQuotes),
            image: {
                url: peakRank[0]
            },
            fields: [
                {
                    name: 'Peak',
                    value: peakRank[1],
                    inline: true
                },
                {
                    name: 'Season',
                    value: peakSeason.replace(/(.{2})(.)/, '$1 $2'),
                    inline: true
                },
            ],
            timestamp: new Date()
        };

        await interaction.editReply({ embeds: [embed1, embed2] });
    } catch (error) {
        console.error(error);
        await interaction.editReply(`Error fetching user data: ${error.message}`);
    }

}

async function getRank(tier) {
    const image = await fetch(`https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04`)
	let data = await image.json()

	let peakRank = data.data.tiers[tier].smallIcon;
    let tierName = data.data.tiers[tier].tierName;

    return [peakRank, tierName]
}

function getRandomQuote(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex]
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN);