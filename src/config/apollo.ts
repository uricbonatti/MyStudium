import { ApolloError, Config } from 'apollo-server';

export default {
  formatError: err => {
    if (err.message) {
      return new ApolloError(
        err.message,
        err.extensions && err.extensions.code === 'INTERNAL_SERVER_ERROR'
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
} as Config;
