import Redis from "ioredis";
import config from "./config";

const _redis = new Redis({
  port: config.REDIS_PORT,
  host: config.REDIS_HOST,
  db: config.REDIS_DB,
});
