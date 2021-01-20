import 'reflect-metadata'
import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import authConfig from '@config/auth'
import { ApolloError } from 'apollo-server'
import User from '../infra/typeorm/schemas/User'
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IAuthDTO from '../dtos/IAuthDTO'

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute ({ email, password }: IAuthDTO): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new ApolloError('Incorrect email/password combination.', '401')
    }
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    )
    if (!passwordMatched) {
      throw new ApolloError('Incorrect email/password combination.', '401')
    }
    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: user.id.toString(),
      expiresIn
    })
    return { user, token }
  }
}
export default AuthenticateUserService
