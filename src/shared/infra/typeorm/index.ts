import { createConnections } from 'typeorm';
import ormConfig from '@config/orm';

createConnections(ormConfig)
  .then(() => console.log('Database connection open...'))
  .catch(() => 'Error on database connection');
