import { MongoRepository, getMongoRepository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../schemas/UserToken';
import { ObjectId } from 'mongodb';

class UserTokensRepository implements IUserTokensRepository {
  private odmRepository: MongoRepository<UserToken>;

  constructor() {
    this.odmRepository = getMongoRepository(UserToken);
  }

  public async generate(user_id: ObjectId): Promise<UserToken> {
    const userToken = this.odmRepository.create({
      user_id,
    });
    await this.odmRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.odmRepository.findOne({ where: { token } });
    return userToken;
  }
}
export default UserTokensRepository;
