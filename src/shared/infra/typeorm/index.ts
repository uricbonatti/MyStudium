import { createConnections } from 'typeorm';
import ormConfig from '@config/orm';

createConnections(ormConfig);
