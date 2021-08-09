import path from 'path';
import { ConnectionOptions } from 'typeorm';

const folder = process.env.ENTITIES_LANGUAGE === 'ts' ? 'src' : 'dist';

const url =
  process.env.LOCAL === 'web'
    ? process.env.DB_WEB_URL
    : process.env.DB_LOCAL_URL;

const entitiesPath =
  process.env.LOCAL_SYSTEM === 'win'
    ? `${folder}/modules/**/infra/typeorm/schemas/*.${process.env.ENTITIES_LANGUAGE}`
    : path.resolve(
        folder,
        'modules',
        '**',
        'infra',
        'typeorm',
        'schemas',
        `*.${process.env.ENTITIES_LANGUAGE}`,
      );

export default [
  {
    type: 'mongodb',
    url,
    entities: [entitiesPath],
    useUnifiedTopology: true,
    synchronize: true,
    w: 'majority',
    logging: false,
    useNewUrlParser: true,
  },
] as ConnectionOptions[];
