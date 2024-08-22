# Valorant Tracker Discord Bot

A Discord bot that tracks and displays Valorant player stats using Riot Games' API.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Database](#database)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [Contact](#contact)

## About the Project

The **Valorant Tracker** Discord bot allows users to track and retrieve statistics for Valorant players. It leverages the Riot Games API to fetch player details, such as rank, match history, and performance, and posts them in Discord channels. The bot supports multi-server usage, ensuring player data is specific to each server.

## Features

- Track and display Valorant player stats.
- Add and remove players from tracking lists.
- Fetch real-time rank updates for tracked players.
- Server-specific tracking for Discord guilds.
- Database support using PostgreSQL.

## Getting Started

To get a local copy of this project up and running, follow these steps.

### Prerequisites

- **Node.js** (v20.12.2 or later)
- **PostgreSQL** for database management
- A Discord bot token from the [Discord Developer Portal](https://discord.com/developers/applications)
- Riot Games API key from the [Riot Developer Portal](https://developer.riotgames.com/)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JuanTGit/valorant-tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd valorant-tracker
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    Create a `.env` file in the root directory and configure the following:

    ```env
    DISCORD_TOKEN=your_discord_bot_token
    RIOT_API_KEY=your_riot_api_key
    DATABASE_URL=your_postgresql_database_url
    ```

5. Run database migrations:

    Ensure your PostgreSQL database is set up, and migrate any necessary schema.

6. Start the bot:

    ```bash
    node index.js
    ```

## Usage

Invite the bot to your server and use the following commands to interact with it. The bot will fetch player statistics and display them within Discord.

## Commands

- `/track <player_name> <tag>` - Display the current and peak rank of a player.
- `/add_announcements` - Adds or updates channel announcements for tracked players.
- `/add_tracker <player_name> <tag>` - Add a player to the tracking list for Valorant stats.
- `/untrack <player_name> <tag>` - Remove a player from tracking.
- `/view_list` - Fetch and display a list of all tracked users in current server.
  
More commands can be added as needed by modifying the `commands/` directory.

## Database

This project uses PostgreSQL to store player data, ensuring persistence across bot restarts. The database is configured via the `pg` Node.js package.

Ensure your `DATABASE_URL` is correctly set in the `.env` file.

## Deployment

This bot is deployed using **Heroku** with a worker dyno. You can deploy the bot by following these steps:

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
2. Log in to Heroku:

    ```bash
    heroku login
    ```

3. Create a new Heroku app:

    ```bash
    heroku create your-app-name
    ```

4. Set environment variables in Heroku:

    ```bash
    heroku config:set DISCORD_TOKEN=your_discord_bot_token RIOT_API_KEY=your_riot_api_key DATABASE_URL=your_postgresql_database_url
    ```

5. Deploy to Heroku:

    ```bash
    git push heroku main
    ```

## Built With

- **Node.js** - Backend environment
- **Discord.js** - Discord API library
- **Express.js** - Server framework
- **PostgreSQL** - Database
- **Riot API** - Valorant stats fetching

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

JuanTGit - [GitHub](https://github.com/JuanTGit)

