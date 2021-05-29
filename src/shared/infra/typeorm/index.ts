import { createConnections } from 'typeorm';
import ormConfig from '@config/orm';

console.log('Preparing Database connection');
createConnections(ormConfig)
  .then(() => console.log('Database connection open...'))
  .catch(() => 'Error on database connection');
