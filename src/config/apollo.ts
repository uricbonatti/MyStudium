import { ApolloError, Config } from 'apollo-server';

export default {
  formatError: err => {
    if (err.message) {
      if (err.extensions && err.extensions.code) {
        if (err.extensions.code === 'INTERNAL_SERVER_ERROR') {
          return new ApolloError(err.message, '400');
        }
        return new ApolloError(err.message, err.extensions.code);
      }
    }
    return new ApolloError('Internal Server Error', 'INTERNAL_SERVER_ERROR');
  },
  context: ({ req }) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return { token: '' };
    }
    const [, token] = authHeader.split(' ');
    return { token };
  },
} as Config;
