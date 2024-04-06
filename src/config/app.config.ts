export const appConfig = {
  appDomain: process.env.APP_DOMAIN ?? '',
  mongoUri: process.env.MONGO_URI ?? '',
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH ?? '',
  jwtSecretAccess: process.env.JWT_SECRET_ACCESS ?? '',
  host: process.env.MT_HOST ?? '',
  port: process.env.MT_PORT ?? '',
  user: process.env.MT_USER ?? '',
  password: process.env.MT_PASSWORD ?? '',
};
