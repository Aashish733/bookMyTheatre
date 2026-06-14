"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const retryStrategy = () => 5000;
const useTls = config_1.config.redisUrl?.startsWith("rediss://") ||
    config_1.config.redisUrl?.includes("upstash.io");
const redis = config_1.config.redisUrl
    ? new ioredis_1.default(config_1.config.redisUrl, {
        retryStrategy,
        tls: useTls ? {} : undefined,
    })
    : new ioredis_1.default({
        host: config_1.config.redisHost,
        port: config_1.config.redisPort,
        retryStrategy,
    });
redis.on("error", (err) => {
    console.error("[Redis error:]", err);
});
redis.on("connect", () => {
    console.log("[Redis] Connected successfully.");
});
exports.default = redis;
