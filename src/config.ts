export default {
  DB_PATH: process.env.DB_PATH ?? "urls.db",
  PORT: Number(process.env.PORT ?? "3000"),
  CODE_LENGTH: Number(process.env.CODE_LENGTH ?? "6"),
};
