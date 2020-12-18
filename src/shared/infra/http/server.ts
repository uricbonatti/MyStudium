import 'reflect-metadata';
import { ApolloServer, ApolloError } from 'apollo-server';
import corsConfig from '@config/cors';
import Schema from './gql/schema';
import resolvers from './gql/resolvers';
import '@shared/infra/typeorm';
import '@shared/container';

const server = new ApolloServer({
  typeDefs: Schema,
  cors: corsConfig,
  resolvers,
  formatError: err => {
    if (err.message) {
      return new ApolloError(
        err.message,
        err.extensions.code === 'INTERNAL_SERVER_ERROR'
          ? '400'
          : err.extensions?.code,
      );
    }
    return new ApolloError('Internal Server Error', '500');
  },
  context: ({ req }) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { token: '' };
    }
    const [, token] = authHeader.split(' ');
    return { token };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
