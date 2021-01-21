import { createConnections } from 'typeorm';
import ormConfig from '@config/orm';

createConnections(ormConfig).then(config => {
  console.log(config[0].options.entities);
  console.log(config[0].options.database);
});
