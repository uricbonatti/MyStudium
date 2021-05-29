import { ObjectId } from 'mongodb';
import ICommentLikeDTO from '../dtos/ICommentLikeDTO';
import ICreateCommentDTO from '../dtos/ICreateCommentDTO';
import Comment from '../infra/typeorm/schemas/Comment';
import CommentLikes from '../infra/typeorm/schemas/CommentLikes';

export default interface ICommentsRepository {
  create(data: ICreateCommentDTO): Promise<Comment>;
  delete(comment_id: string): Promise<void>;
  save(comment: Comment): Promise<Comment>;

  like(data: ICommentLikeDTO): Promise<number>;
  countCommentsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number>;

  findByID(comment_id: string): Promise<Comment | undefined>;
  findByPostId(post_id: ObjectId): Promise<Comment[]>;
  findByAuthorId(author_id: ObjectId): Promise<Comment[]>;
  getLikes(comment_id: ObjectId): Promise<CommentLikes | undefined>;
}
