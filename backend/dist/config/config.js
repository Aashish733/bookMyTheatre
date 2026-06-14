"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function resolveRedisUrl() {
    const raw = process.env.REDIS_URL ||
        process.env.UPSTASH_REDIS_URL ||
        process.env.UPSTASH_REDIS_ENDPOINT;
    if (!raw)
        return undefined;
    // Accept plain URLs or pasted redis-cli commands (`redis-cli --tls -u redis://...`)
    const urlMatch = raw.match(/rediss?:\/\/[^\s"']+/);
    const url = (urlMatch ? urlMatch[0] : raw.trim());
    // Upstash requires TLS; dashboard URLs sometimes use redis://
    if (url.includes("upstash.io") && url.startsWith("redis://")) {
        return url.replace("redis://", "rediss://");
    }
    return url;
}
const _config = {
    port: process.env.PORT,
    frontendUrl: process.env.FRONTEND_URL,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    hashingSecret: process.env.HASH_SECRET,
    emailUsername: process.env.NODEMAILER_EMAIL,
    emailPassword: process.env.NODEMAILER_PASSWORD,
    // emailUsername: process.env.EMAIL_USERNAME as string,
    // emailPassword: process.env.EMAIL_PASSWORD as string,
    // Upstash / Render: REDIS_URL, UPSTASH_REDIS_URL, or UPSTASH_REDIS_ENDPOINT
    // Local Docker: REDIS_HOST + REDIS_PORT (only when no URL is set)
    redisUrl: resolveRedisUrl(),
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT || "6379"),
    razorpayKey: process.env.RAZORPAY_API_KEY,
    razorpaySecret: process.env.RAZORPAY_SECRET_KEY,
    databaseReplicaSet: process.env.MONGO_REPLICA_STRING || process.env.MONGO_CONNECTION_STRING,
};
exports.config = Object.freeze(_config);
