import fetch from 'node-fetch';

export async function getRank(current, peak) {
    const response = await fetch(`https://valorant-api.com/v1/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04`);
    const data = await response.json();

    const peakRankName = data.data.tiers[peak].tierName;
    const peakRankImg = data.data.tiers[peak].smallIcon;

    const currentRankName = data.data.tiers[current].tierName;
    const currentRankImg = data.data.tiers[current].smallIcon;

    return [peakRankName, peakRankImg, currentRankName, currentRankImg];
}
