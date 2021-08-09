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
    return this.odmLikeRepository.count({
      where: {
        users_liked: [liker_id],
        created_at: MoreThan(limitDate),
      },
    });
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
    const users_liked = this.odmLikeRepository.create({
      users_liked: [],
      comment_id: comment.id,
    });
    await this.odmLikeRepository.save(users_liked);
    return comment;
  }

  public async delete(comment_id: string): Promise<void> {
    await this.odmRepository.delete(comment_id);
    await this.odmLikeRepository.findOneAndDelete({
      where: { post_id: new ObjectId(comment_id) },
    });
  }

  public async save(comment: Comment): Promise<Comment> {
    return this.odmRepository.save(comment);
  }

  public async findByID(comment_id: string): Promise<Comment | undefined> {
    return this.odmRepository.findOne(comment_id);
  }

  public async findByAuthorId(author_id: ObjectId): Promise<Comment[]> {
    return this.odmRepository.find({
      where: {
        'author.id': author_id,
      },
    });
  }

  public async findByPostId(post_id: ObjectId): Promise<Comment[]> {
    const comments = await this.odmRepository.find({
      post_id,
    });
    return Promise.all(
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
  }

  public async like({ comment_id, user_id }: ICommentLikeDTO): Promise<number> {
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
  }

  public async getLikes(comment_id: ObjectId): Promise<CommentLikes> {
    const commentLikes = await this.odmLikeRepository.findOne({
      where: { comment_id },
    });
    if (!commentLikes) {
      throw new ApolloError("Comment Likes can't be found");
    }
    return commentLikes;
  }
}
export default CommentsRepository;
