import { ObjectId } from 'mongodb';

export default interface IUsersLikedDTO {
  users_liked: ObjectId[];
}
