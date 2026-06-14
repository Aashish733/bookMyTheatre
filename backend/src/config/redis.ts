import Redis from "ioredis";
import { config } from "./config";

const retryStrategy = () => 5000;

const redis = config.redisUrl
    ? new Redis(config.redisUrl, {
          retryStrategy,
          tls: config.redisUrl.startsWith("rediss://") ? {} : undefined,
      })
    : new Redis({
          host: config.redisHost,
          port: config.redisPort,
          retryStrategy,
      });

redis.on("error", (err) => {
    console.error("[Redis error:]", err);
});

redis.on("connect", () => {
    console.log("[Redis] Connected successfully.");
});

export default redis;
