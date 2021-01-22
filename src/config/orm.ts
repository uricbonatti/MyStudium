import path from 'path';
import { ConnectionOptions } from 'typeorm';

export default [
  {
    type: 'mongodb',
    url:
      process.env.LOCAL === 'web'
        ? process.env.DB_WEB_URL
        : process.env.DB_LOCAL_URL,
    entities: [
      process.env.LOCAL_SYSTEM === 'win'
        ? `${
            process.env.ENTITIES_LANGUAGE === 'ts' ? 'src' : 'dist'
          }/modules/**/infra/typeorm/schemas/*.${process.env.ENTITIES_LANGUAGE}`
        : path.resolve(
            process.env.ENTITIES_LANGUAGE === 'ts' ? 'src' : 'dist',
            'modules',
            '**',
            'infra',
            'typeorm',
            'schemas',
            `*.${process.env.ENTITIES_LANGUAGE}`,
          ),
    ],
    useUnifiedTopology: true,
    synchronize: true,
    w: 'majority',
    logging: false,
    useNewUrlParser: true,
  },
] as ConnectionOptions[];
