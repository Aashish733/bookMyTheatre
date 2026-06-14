import { config as conf } from 'dotenv';
conf();

const _config = {
    port: process.env.PORT,
    frontendUrl: process.env.FRONTEND_URL,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    hashingSecret: process.env.HASH_SECRET as string,
    emailUsername: process.env.NODEMAILER_EMAIL as string,
    emailPassword: process.env.NODEMAILER_PASSWORD as string,
    // emailUsername: process.env.EMAIL_USERNAME as string,
    // emailPassword: process.env.EMAIL_PASSWORD as string,
    // Upstash / Render: REDIS_URL or UPSTASH_REDIS_URL (rediss://...)
    // Local Docker: REDIS_HOST + REDIS_PORT
    redisUrl: process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL,
    redisHost: process.env.REDIS_HOST as string,
    redisPort: parseInt(process.env.REDIS_PORT || "6379"),
    razorpayKey : process.env.RAZORPAY_API_KEY as string,
    razorpaySecret : process.env.RAZORPAY_SECRET_KEY as string,
    databaseReplicaSet:
        process.env.MONGO_REPLICA_STRING || process.env.MONGO_CONNECTION_STRING,
}

export const config = Object.freeze(_config);