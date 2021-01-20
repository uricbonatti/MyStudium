import { verify } from 'jsonwebtoken'
import authConfig from '@config/auth'
import { ApolloError } from 'apollo-server'

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function verifyToken (token: string): string {
  try {
    const decoded = verify(token, authConfig.jwt.secret)
    const { sub } = decoded as ITokenPayload
    return sub
  } catch (err) {
    throw new ApolloError('Invalid JWT token.', '401')
  }
}
