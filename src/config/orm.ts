import path from 'path';
import { ConnectionOptions } from 'typeorm';

const localConfig = {
  name: 'default',
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    path.resolve(
      __dirname,
      process.env.NODE === 'development' ? 'src' : 'dist',
      'modules',
      '**',
      'infra',
      'typeorm',
      'schemas',
      '*.ts',
    ),
  ],
  host: 'localhost',
  port: 27017,
  database: 'studium',
} as ConnectionOptions;

const webConfig = {
  name: 'default',
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    path.resolve(
      __dirname,
      process.env.NODE === 'development' ? 'src' : 'dist',
      'modules',
      '**',
      'infra',
      'typeorm',
      'schemas',
      '*.ts',
    ),
  ],
  url: process.env.DB_URL,
  synchronize: true,
  w: 'majority',
  logging: false,
  useNewUrlParser: true,
} as ConnectionOptions;

export default [process.env.LOCAL === 'web' ? webConfig : localConfig];
