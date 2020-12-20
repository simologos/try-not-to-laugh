import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT;

export const dbHost = process.env.DB_HOST;
export const dbPort = process.env.DB_PORT;
export const dbPass = process.env.DB_PASSWORD;
export const dbUser = process.env.DB_USER;
export const dbName = process.env.DB_NAME;

export const authClientId = process.env.AUTH_CLIENT_ID;
export const authClientSecret = process.env.AUTH_CLIENT_SECRET;

export const cookieKey = 'try_not_to_laugh_auth';
export const sessionSecret = process.env.SESSION_SECRET;

export const maxPlayerPerGame = 4;
export const minPlayerPerGame = 2;
export const roundsPerGame = 2;

export const serverSubmitterId = 'tntlServer';
