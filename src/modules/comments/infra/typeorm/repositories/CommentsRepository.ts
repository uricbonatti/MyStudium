import { MongoRepository, getMongoRepository, MoreThan } from 'typeorm';
import { ObjectId as MongoObjectID, ObjectId } from 'mongodb';

import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICommentLikeDTO from '@modules/comments/dtos/ICommentLikeDTO';
import Comment from '../schemas/Comment';
import { ApolloError } from 'apollo-server';
import CommentLikes from '../schemas/CommentLikes';

class CommentsRepository implements ICommentsRepository {
  private odmRepository: MongoRepository<Comment>;
  private odmLikeRepository: MongoRepository<CommentLikes>;

  constructor() {
    this.odmRepository = getMongoRepository(Comment);
    this.odmLikeRepository = getMongoRepository(CommentLikes);
  }

  public async countCommentsLikedByUser(
    liker_id: MongoObjectID,
    limitDate: Date,
  ): Promise<number> {
    try {
      const commentLikes = await this.odmLikeRepository.count({
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
      const users_liked = this.odmLikeRepository.create({
        users_liked: [],
        comment_id: comment.id,
      });
      await this.odmLikeRepository.save(users_liked);
      return comment;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(comment_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(comment_id);
      await this.odmLikeRepository.findOneAndDelete({
        where: { post_id: new ObjectId(comment_id) },
      });
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
      const commentsWithLikes = await Promise.all(
        comments.map(async comment => {
          const likes = await this.odmLikeRepository.findOne({
            where: { comment_id: comment.id },
          });
          comment.users_liked = [];
          if (!!likes) {
            comment.users_liked = likes.users_liked;
          }
          return comment;
        }),
      );
      return commentsWithLikes;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async like({ comment_id, user_id }: ICommentLikeDTO): Promise<number> {
    try {
      const findComment = await this.odmLikeRepository.findOne({ comment_id });
      if (findComment) {
        const { users_liked } = findComment;
        let usersLikedString = users_liked.map(liked => liked.toHexString());
        const index = usersLikedString.indexOf(user_id.toHexString());
        if (index >= 0) {
          if (usersLikedString.length === 1) {
            usersLikedString = [];
          } else {
            usersLikedString = [...usersLikedString.slice(index, 1)];
          }
        } else {
          usersLikedString.push(user_id.toHexString());
        }
        findComment.users_liked = [
          ...usersLikedString.map(user => new ObjectId(user)),
        ];
        await this.odmLikeRepository.save(findComment);
        return findComment.users_liked.length;
      }
      return 0;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async getLikes(comment_id: ObjectId): Promise<CommentLikes> {
    try {
      const commentLikes = await this.odmLikeRepository.findOne({
        where: { comment_id },
      });
      if (!commentLikes) {
        throw new ApolloError('Database Timeout');
      }
      return commentLikes;
    } catch (err) {
      throw err;
    }
  }
}
export default CommentsRepository;
