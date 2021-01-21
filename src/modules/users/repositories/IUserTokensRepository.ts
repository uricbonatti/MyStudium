import UserToken from '../infra/typeorm/schemas/UserToken';
import { ObjectId } from 'mongodb';

export default interface IUserTokensRepository {
  generate(user_id: ObjectId): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
