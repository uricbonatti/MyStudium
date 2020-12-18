import { MongoRepository, getMongoRepository, MoreThan } from 'typeorm';
import { ObjectId as MongoObjectID, ObjectId } from 'mongodb';

import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICommentLikeDTO from '@modules/comments/dtos/ICommentLikeDTO';
import Comment from '../schemas/Comment';

class CommentsRepository implements ICommentsRepository {
  private odmRepository: MongoRepository<Comment>;

  constructor() {
    this.odmRepository = getMongoRepository(Comment);
  }

  public async countCommentsLikedByUser(
    liker_id: MongoObjectID,
    limitDate: Date,
  ): Promise<number> {
    const commentLikes = await this.odmRepository.count({
      where: {
        users_liked: [liker_id],
        created_at: MoreThan(limitDate),
      },
    });
    return commentLikes;
  }

  public async create({
    author,
    body,
    post_id,
  }: ICreateCommentDTO): Promise<Comment> {
    const { avatar_url, id, name } = author;
    const comment = this.odmRepository.create({
      author: { id, name, avatar_url },
      body,
      post_id: new MongoObjectID(post_id),
      users_liked: [],
    });
    await this.odmRepository.save(comment);
    return comment;
  }

  public async delete(comment_id: string): Promise<void> {
    await this.odmRepository.delete(comment_id);
  }

  public async save(comment: Comment): Promise<Comment> {
    return this.odmRepository.save(comment);
  }

  public async findByID(comment_id: string): Promise<Comment | undefined> {
    const comment = await this.odmRepository.findOne(comment_id);
    return comment;
  }

  public async findByAuthorId(author_id: ObjectId): Promise<Comment[]> {
    const comments = await this.odmRepository.find({
      where: {
        'author.id': author_id,
      },
    });
    return comments;
  }

  public async findByPostId(post_id: ObjectId): Promise<Comment[]> {
    const comments = await this.odmRepository.find({
      post_id,
    });
    return comments;
  }

  public async isLiked({
    comment_id,
    user_id,
  }: ICommentLikeDTO): Promise<boolean> {
    const findComment = await this.odmRepository.findOne(
      comment_id.toHexString(),
    );
    if (findComment && findComment.users_liked.indexOf(user_id) >= 0) {
      return true;
    }
    return false;
  }

  public async like({ comment_id, user_id }: ICommentLikeDTO): Promise<number> {
    const findComment = await this.odmRepository.findOne(
      comment_id.toHexString(),
    );
    if (findComment) {
      const index = findComment.users_liked.indexOf(user_id);
      if (index >= 0) {
        if (findComment.users_liked.length > 1) {
          findComment.users_liked = [
            ...findComment.users_liked.slice(index, 1),
          ];
        } else {
          findComment.users_liked = [];
        }
      } else {
        findComment.users_liked.push(user_id);
      }
      await this.odmRepository.save(findComment);
      return findComment.getLikes();
    }
    return 0;
  }

  public async likesNumber(comment_id: ObjectId): Promise<number> {
    const findComment = await this.odmRepository.findOne(
      comment_id.toHexString(),
    );
    if (!findComment) {
      return 0;
    }
    return findComment.getLikes();
  }
}
export default CommentsRepository;
