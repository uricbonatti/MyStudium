import { ObjectId } from 'mongodb';

export default interface IPostLikeDTO {
  post_id: ObjectId;
  user_id: ObjectId;
}
