import { ObjectID } from 'mongodb';
import { v4 } from 'uuid';

import IUserTokensRpository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/schemas/UserToken';

class FakeUserTokensRepository implements IUserTokensRpository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: ObjectID): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: new ObjectID(),
      token: v4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );
    return userToken;
  }
}

export default FakeUserTokensRepository;
