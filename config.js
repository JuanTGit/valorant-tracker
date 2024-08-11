import dotenv from 'dotenv';

dotenv.config();

export const API_KEY = process.env.API_KEY;
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const HEROKU_POSTGRESQL_AMBER_URL = process.env.HEROKU_POSTGRESQL_AMBER_URL;
export const CHANNEL_ID = process.env.CHANNEL_ID;