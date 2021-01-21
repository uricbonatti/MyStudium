import 'reflect-metadata';
import { differenceInSeconds } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}
@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new ApolloError('User token does not exists');
    }
    const user = await this.usersRepository.findById(
      userToken.user_id.toHexString(),
    );

    if (!user) {
      throw new ApolloError('User does not exists', '400');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInSeconds(Date.now(), tokenCreatedAt) > 7200) {
      throw new ApolloError('Token expired');
    }
    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
