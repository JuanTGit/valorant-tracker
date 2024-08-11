import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
	{
		name: 'track',
		description: 'Track Valorant user data',
		options: [
			{
				name: 'username',
				type: 3,
				description: 'The username of the Valorant player',
				required: true,
			},
			{
				name: 'tag',
				type: 3,
				description: 'The tag of the Valorant player',
				required: true,
			},
		],
	},
	{
		name: 'add_tracker',
		description: 'Add a player to the tracking list for regular rank updates.',
		options: [
			{
				name: 'username',
				type: 3,
				description: 'The username of the Valorant player',
				required: true,
			},
			{
				name: 'tag',
				type: 3,
				description: 'The tag of the Valorant player',
				required: true,
			},
		],
	},
	{
		name: 'remove_tracker',
		description: 'Remove a player from the tracking list and stop rank updates.',
		options: [
			{
				name: 'username',
				type: 3,
				description: 'The username of the Valorant player',
				required: true,
			},
			{
				name: 'tag',
				type: 3,
				description: 'The tag of the Valorant player',
				required: true,
			},
		],
	},
	{
		name: 'add_announcements',
		description: 'This will add or update channel announements of tracked users',
	},
	{
		name: 'remove_announcements',
		description: 'Remove server announcements. alternatively use /add_announcements anywhere to update channel.'
	}
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
