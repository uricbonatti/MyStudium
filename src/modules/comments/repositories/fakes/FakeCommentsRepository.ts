import { ObjectId } from 'mongodb';

import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import ICommentLikeDTO from '@modules/comments/dtos/ICommentLikeDTO';
import { isAfter } from 'date-fns';
import ICommentsRepository from '../ICommentsRepository';
import CommentLikes from '@modules/comments/infra/typeorm/schemas/CommentLikes';

class FakeCommentsRepository implements ICommentsRepository {
  private comments: Comment[] = [];
  private commentLikes: CommentLikes[] = [];

  public async create(data: ICreateCommentDTO): Promise<Comment> {
    const comment = new Comment();
    const commentLike = new CommentLikes();

    Object.assign(
      comment,
      {
        users_liked: [],
        id: new ObjectId(),
        created_at: new Date(),
      },
      data,
    );
    this.comments.push(comment);

    Object.assign(commentLike, {
      id: new ObjectId(),
      comment_id: comment.id,
      users_liked: [],
      created_at: commentLike.created_at,
    });
    this.commentLikes.push(commentLike);
    return comment;
  }
  public async getLikes(
    comment_id: ObjectId,
  ): Promise<CommentLikes | undefined> {
    return this.commentLikes.find(commentLike =>
      commentLike.comment_id.equals(comment_id),
    );
  }
  public async delete(comment_id: string): Promise<void> {
    const findIndex = this.comments.findIndex(
      comment => comment.id.toHexString() === comment_id,
    );
    if (findIndex >= 0) {
      if (this.comments.length === 1) {
        this.comments = [];
      } else {
        this.comments = [...this.comments.slice(findIndex, 1)];
      }
    }
  }

  public async save(comment: Comment): Promise<Comment> {
    const findIndex = this.comments.findIndex(
      findComment => findComment.id === comment.id,
    );
    this.comments[findIndex] = comment;
    return comment;
  }

  public async findByID(comment_id: string): Promise<Comment | undefined> {
    return this.comments.find(
      comment => comment.id.toHexString() === comment_id,
    );
  }

  public async findByAuthorId(author_id: ObjectId): Promise<Comment[]> {
    return this.comments.filter(comment => author_id.equals(comment.author.id));
  }

  public async findByPostId(post_id: ObjectId): Promise<Comment[]> {
    return this.comments.filter(comment => comment.post_id.equals(post_id));
  }

  public async isLiked({
    user_id,
    comment_id,
  }: ICommentLikeDTO): Promise<boolean> {
    const findIndex = this.comments.findIndex(comment =>
      comment_id.equals(comment.id),
    );
    const user = this.comments[findIndex].users_liked.find(user_like =>
      user_like.equals(user_id),
    );
    return !!user;
  }

  public async like({ user_id, comment_id }: ICommentLikeDTO): Promise<number> {
    const findIndex = this.comments.findIndex(comment =>
      comment_id.equals(comment.id),
    );
    if (findIndex < 0) {
      return 0;
    }
    const likesStored = [...this.comments[findIndex].users_liked];
    const userLikeIndex = likesStored.findIndex(user_like =>
      user_id.equals(user_like),
    );

    if (userLikeIndex >= 0) {
      if (likesStored.length === 1) {
        this.comments[findIndex].users_liked = [];
      } else {
        this.comments[findIndex].users_liked = [
          ...this.comments[findIndex].users_liked.slice(userLikeIndex, 1),
        ];
      }
    } else {
      this.comments[findIndex].users_liked.push(user_id);
    }
    return this.comments[findIndex].users_liked.length;
  }

  public async likesNumber(comment_id: ObjectId): Promise<number> {
    const findIndex = this.comments.findIndex(comment =>
      comment_id.equals(comment.id),
    );
    return this.comments[findIndex].getLikes();
  }

  public async countCommentsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    const commentIsLiked = this.comments.map(
      comment =>
        comment.users_liked.includes(liker_id) &&
        isAfter(comment.created_at, limitDate),
    );
    return commentIsLiked.filter(liked => liked).length;
  }
}

export default FakeCommentsRepository;
