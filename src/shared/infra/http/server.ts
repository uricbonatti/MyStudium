import dotenv from 'dotenv';
import 'reflect-metadata';
import path from 'path';
import { ApolloServer } from 'apollo-server';
import apolloConfig from '@config/apollo';
import corsConfig from '@config/cors';
import Schema from './schema';
import resolvers from './resolvers';
import '@shared/infra/typeorm';
import '@shared/container';

dotenv.config();

const server = new ApolloServer({
  typeDefs: Schema,
  cors: corsConfig,
  resolvers,
  introspection: true,
  playground: {
    title: 'Studium Backend',
    faviconUrl: path.resolve(__dirname, '..', '..', '..', '..', 'favicon.ico'),
  },
  context: apolloConfig.context,
  formatError: apolloConfig.formatError,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server running on ${url}`);
});
