export default {
  REDIS_HOST: process.env.REDIS_HOST ?? "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT ?? "6379"),
  REDIS_DB: Number(process.env.REDIS_DB ?? "0"),
};
