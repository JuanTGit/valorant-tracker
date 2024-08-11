import fetch from 'node-fetch';
import { API_KEY } from '../config.js';

export async function userPlayerCard(puuid) {
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v2/by-puuid/account/${puuid}`, {
        method: 'GET',
        headers: {
            'Authorization': `${API_KEY}`
        },
    });

    const data = await response.json();

    const playerCardResponse = await fetch(`https://valorant-api.com/v1/playercards/${data.data.card}`);
    const playerData = await playerCardResponse.json();

    return playerData.data.wideArt;
}
