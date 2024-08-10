import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
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
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/na/pc/${name}/${tag}`, {
            method: 'GET',
            headers: {
                'Authorization': `${process.env.API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();

        const {username, userTag, puuid, currentRank, current_rr, peakRank, peakSeason, lastGame, seasonGames} = {
            username: data.data.account.name,
            userTag: data.data.account.tag,
            puuid: data.data.account.puuid,
            currentRank: data.data.current.tier.id,
            current_rr: data.data.current.rr,
            peakRank: data.data.peak.tier.id,
            peakSeason: data.data.peak.season.short.toUpperCase(),
            lastGame: data.data.current.last_change,
            seasonGames: data.data.seasonal.at(-1)
        }

        const rankDescriptions = await getRank(currentRank, peakRank)
        const playerCard = await userPlayerCard(puuid)
        const currentRatingQuotes = [`You're a winner in my heart ${username}!`, 'Oof rough season mah nigga.', 'Getting boosted huh?', `Pick it up you're drooling on yourself.`]
        const peakRatingQuotes = [`Op crutch??`, 'Boosted Monkey!', `You hit unc status you've PEAKED!`, 'Nothing but a memory now...']

        const currentEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle(`|   Current Rating for ${username}#${userTag}   |`)
            .setDescription(currentRank === peakRank ? `Keep Climbing!` : getRandomQuote(currentRatingQuotes))
            .setThumbnail(rankDescriptions[3])
            .addFields(
                { name: 'Status', value: rankDescriptions[2], inline: true },
                { name: 'RR', value: String(current_rr), inline: true },
                { name: 'Last Game', value: `${String(lastGame)} RR`, inline: true },
                { name: 'Games Played', value: `${String(seasonGames.games)}`, inline: true },
                { name: 'Wins', value: `${String(seasonGames.wins)}`, inline: true },
                { name: 'Losses', value: `${String(seasonGames.games - seasonGames.wins)}`, inline: true }
            )
            .setImage(playerCard);
        
        const peakEmbed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle(`|      Peak Rating for ${username}#${userTag}      |`)
            .setDescription(currentRank === peakRank ? `YOU'RE PEAKING OUT OF YOUR MIND RN!!` : getRandomQuote(peakRatingQuotes))
            .setThumbnail(rankDescriptions[1])
            .addFields(
                { name: 'Peak', value: rankDescriptions[0], inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'Season', value: peakSeason.replace(/(.{2})(.)/, '$1 $2'), inline: true }
            )
            .setImage('https://i.imgur.com/wvhmPOd.png')
            .setTimestamp();

        await interaction.editReply({ embeds: [currentEmbed, peakEmbed] });

    }   catch (error) {

        console.error(error);
        await interaction.editReply(`Error fetching user data: ${error.message}`);
        
    }

}

async function getRank(current, peak) {
    const image = await fetch(`https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04`)
	let data = await image.json()

    let peakRankName = data.data.tiers[peak].tierName;
	let peakRankImg = data.data.tiers[peak].smallIcon;

    let currentRankName = data.data.tiers[current].tierName;
	let currentRankImg = data.data.tiers[current].smallIcon;

    return [peakRankName, peakRankImg, currentRankName, currentRankImg]
}

function getRandomQuote(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex]
}

const userPlayerCard = async (puuid) => {
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v2/by-puuid/account/${puuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `${process.env.API_KEY}`
        },
    });

    let data = await response.json()
    console.log(data.data.card)

    const playerCard = await fetch(`https://valorant-api.com/v1/playercards/${data.data.card}`)
    let playerData = await playerCard.json()

    return playerData.data.wideArt

}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.DISCORD_TOKEN);