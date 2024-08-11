Sure! Here it is in a copiable format:

---

# Valorant Tracker Bot

Welcome to the Valorant Tracker Bot project! This bot is designed to provide Valorant players with their in-game statistics directly within Discord. Built with Node.js and JavaScript, the bot leverages the power of Heroku for deployment.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- Fetch and display player statistics from the Valorant API.
- Integrates seamlessly with Discord to provide real-time data.
- Simple commands to retrieve various stats.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JuanTGit/valorant-tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd valorant-tracker
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory and add the following variables:

    ```env
    DISCORD_TOKEN=your_discord_bot_token
    VALORANT_API_KEY=your_valorant_api_key
	CLIENT_ID=your_discord_application_id
    ```

2. Replace `your_discord_bot_token`, `your_valorant_api_key`, `your_discord_application_id` with your Token, API Key, and Application ID.

### Usage

1. Start the bot:

    ```bash
    node index.js
    ```

2. Invite the bot to your Discord server using the OAuth2 URL generated from the Discord Developer Portal.

3. Use the bot commands in your server to fetch Valorant stats. For example:

    ```text
    /track username tag
    ```

### Deployment

To deploy the bot to Heroku, follow these steps:

1. Login to Heroku:

    ```bash
    heroku login
    ```

2. Create a new Heroku app:

    ```bash
    heroku create your-app-name
    ```

3. Push the code to Heroku:

    ```bash
    git push heroku main
    ```

4. Set the environment variables on Heroku:

    ```bash
    heroku config:set DISCORD_TOKEN=your_discord_bot_token
    heroku config:set VALORANT_API_KEY=your_valorant_api_key
    heroku config:set CLIENT_ID=your_discord_application_id
    ```

5. Start the bot:

    ```bash
    heroku ps:scale web=1
    ```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/YourNewFeature`)
3. Commit your Changes (`git commit -m 'Add some YourNewFeature'`)
4. Push to the Branch (`git push origin feature/YourNewFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
