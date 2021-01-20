import { ConnectionOptions } from 'typeorm';

const baseConfig = {
  name: 'default',
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    process.env.NODE === 'development'
      ? './src/modules/**/infra/typeorm/schemas/*.ts'
      : './dist/modules/**/infra/typeorm/schemas/*.js',
  ],
} as ConnectionOptions;

const localConfig = {
  host: 'localhost',
  port: 27017,
  database: 'studium',
} as ConnectionOptions;

const webCongig = {
  url: process.env.DB_URL,
  synchronize: true,
  w: 'majority',
  logging: false,
  useNewUrlParser: true,
} as ConnectionOptions;

export default [
  {
    ...baseConfig,
    ...(process.env.ENVIRONMENT === 'web' ? webCongig : localConfig),
  },
] as ConnectionOptions[];
