require('dotenv').config();

import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import apolloConfig from '@config/apollo';
import corsConfig from '@config/cors';
import Schema from './schema';
import resolvers from './resolvers';
import '@shared/infra/typeorm';
import '@shared/container';

const server = new ApolloServer({
  typeDefs: Schema,
  cors: corsConfig,
  resolvers,
  context: apolloConfig.context,
  formatError: apolloConfig.formatError,
});

server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
