import { ObjectId } from 'mongodb';
import User from '@modules/users/infra/typeorm/schemas/User';

export default interface ICreateCommentDTO {
  author: User;
  body: string;
  post_id: ObjectId;
}
