import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();
import '@shared/infra/typeorm';
import '@shared/container';
import { ApolloServer } from 'apollo-server';
import apolloConfig from '@config/apollo';
import corsConfig from '@config/cors';
import Schema from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({
  typeDefs: Schema,
  cors: corsConfig,
  resolvers,
  introspection: true,
  playground: {
    title: 'Studium Backend',
  },
  context: apolloConfig.context,
  formatError: apolloConfig.formatError,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server running on ${url}`);
});
