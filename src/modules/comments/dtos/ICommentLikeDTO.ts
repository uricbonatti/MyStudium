import { ObjectId } from 'mongodb';

export default interface ICommentLikeDTO {
  comment_id: ObjectId;
  user_id: ObjectId;
}
