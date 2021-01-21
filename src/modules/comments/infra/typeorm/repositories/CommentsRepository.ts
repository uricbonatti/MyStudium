import { MongoRepository, getMongoRepository, MoreThan } from 'typeorm';
import { ObjectId as MongoObjectID, ObjectId } from 'mongodb';

import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICommentLikeDTO from '@modules/comments/dtos/ICommentLikeDTO';
import Comment from '../schemas/Comment';
import { ApolloError } from 'apollo-server';

class CommentsRepository implements ICommentsRepository {
  private odmRepository: MongoRepository<Comment>;

  constructor() {
    this.odmRepository = getMongoRepository(Comment);
  }

  public async countCommentsLikedByUser(
    liker_id: MongoObjectID,
    limitDate: Date,
  ): Promise<number> {
    try {
      const commentLikes = await this.odmRepository.count({
        where: {
          users_liked: [liker_id],
          created_at: MoreThan(limitDate),
        },
      });
      return commentLikes;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async create({
    author,
    body,
    post_id,
  }: ICreateCommentDTO): Promise<Comment> {
    try {
      const { avatar_url, id, name } = author;
      const comment = this.odmRepository.create({
        author: { id, name, avatar_url },
        body,
        post_id: new MongoObjectID(post_id),
        users_liked: [],
      });
      await this.odmRepository.save(comment);
      return comment;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(comment_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(comment_id);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async save(comment: Comment): Promise<Comment> {
    try {
      return this.odmRepository.save(comment);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByID(comment_id: string): Promise<Comment | undefined> {
    try {
      const comment = await this.odmRepository.findOne(comment_id);
      return comment;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByAuthorId(author_id: ObjectId): Promise<Comment[]> {
    try {
      const comments = await this.odmRepository.find({
        where: {
          'author.id': author_id,
        },
      });
      return comments;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByPostId(post_id: ObjectId): Promise<Comment[]> {
    try {
      const comments = await this.odmRepository.find({
        post_id,
      });
      return comments;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async isLiked({
    comment_id,
    user_id,
  }: ICommentLikeDTO): Promise<boolean> {
    try {
      const findComment = await this.odmRepository.findOne(
        comment_id.toHexString(),
      );
      if (findComment && findComment.users_liked.indexOf(user_id) >= 0) {
        return true;
      }
      return false;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async like({ comment_id, user_id }: ICommentLikeDTO): Promise<number> {
    try {
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
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async likesNumber(comment_id: ObjectId): Promise<number> {
    try {
      const findComment = await this.odmRepository.findOne(
        comment_id.toHexString(),
      );
      if (!findComment) {
        return 0;
      }
      return findComment.getLikes();
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}
export default CommentsRepository;
