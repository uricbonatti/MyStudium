import path from 'path';
import { ConnectionOptions } from 'typeorm';

const localConfig = {
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    process.env.LOCAL_SYSTEM === 'win'
      ? `${
          process.env.NODE_ENV === 'development' ? 'src' : 'dist'
        }/modules/**/infra/typeorm/schemas/*.${
          process.env.NODE_ENV === 'development' ? 'ts' : 'js'
        }`
      : path.resolve(
          process.env.NODE_ENV === 'development' ? 'src' : 'dist',
          'modules',
          '**',
          'infra',
          'typeorm',
          'schemas',
          process.env.NODE_ENV === 'development' ? '*.ts' : '*.js',
        ),
  ],
  host: 'localhost',
  port: 27017,
  synchronize: true,
  database: 'Studium',
} as ConnectionOptions;

const webConfig = {
  type: 'mongodb',
  useUnifiedTopology: true,
  entities: [
    process.env.LOCAL_SYSTEM === 'win'
      ? `${
          process.env.NODE_ENV === 'development' ? 'src' : 'dist'
        }/modules/**/infra/typeorm/schemas/*.${
          process.env.NODE_ENV === 'development' ? 'ts' : 'js'
        }`
      : path.resolve(
          process.env.NODE_ENV === 'development' ? 'src' : 'dist',
          'modules',
          '**',
          'infra',
          'typeorm',
          'schemas',
          process.env.NODE_ENV === 'development' ? '*.ts' : '*.js',
        ),
  ],
  url: process.env.DB_URL,
  synchronize: true,
  w: 'majority',
  logging: false,
  useNewUrlParser: true,
} as ConnectionOptions;

export default [process.env.LOCAL === 'web' ? webConfig : localConfig];
