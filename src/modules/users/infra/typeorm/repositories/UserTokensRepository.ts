import { MongoRepository, getMongoRepository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../schemas/UserToken';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';

class UserTokensRepository implements IUserTokensRepository {
  private odmRepository: MongoRepository<UserToken>;

  constructor() {
    this.odmRepository = getMongoRepository(UserToken);
  }

  public async generate(user_id: ObjectId): Promise<UserToken> {
    try {
      const userToken = this.odmRepository.create({
        user_id,
      });
      await this.odmRepository.save(userToken);

      return userToken;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    try {
      const userToken = await this.odmRepository.findOne({ where: { token } });
      return userToken;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}
export default UserTokensRepository;
