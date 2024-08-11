import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';
import { getRank } from './getRank.js';
import { getRandomQuote } from './getRandomQuote.js';
import { userPlayerCard } from './userPlayerCard.js';
import { API_KEY } from '../config.js';

export async function getUserData(name, tag, interaction) {
    try {
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/na/pc/${name}/${tag}`, {
            method: 'GET',
            headers: {
                'Authorization': `${API_KEY}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        const { username, userTag, puuid, currentRank, current_rr, peakRank, peakSeason, lastGame, seasonGames } = {
            username: data.data.account.name,
            userTag: data.data.account.tag,
            puuid: data.data.account.puuid,
            currentRank: data.data.current.tier.id,
            current_rr: data.data.current.rr,
            peakRank: data.data.peak.tier.id,
            peakSeason: data.data.peak.season.short.toUpperCase(),
            lastGame: data.data.current.last_change,
            seasonGames: data.data.seasonal.at(-1)
        };

        const rankDescriptions = await getRank(currentRank, peakRank);
        const playerCard = await userPlayerCard(puuid);
        const currentRatingQuotes = [`You're a winner in my heart ${username}!`, 'Oof rough season mah guy.', 'Getting boosted huh?', `Pick it up you're drooling on yourself.`];
        const peakRatingQuotes = [`Op crutch??`, 'Boosted Monkey!', `You hit unc status you've PEAKED!`, 'Nothing but a memory now...'];

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

    } catch (error) {
        console.error(error);
        await interaction.editReply(`Error fetching user data: ${error.message}`);
    }
}