import { ObjectId } from 'mongodb';

import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import ICommentLikeDTO from '@modules/comments/dtos/ICommentLikeDTO';
import { isAfter } from 'date-fns';
import ICommentsRepository from '../ICommentsRepository';

class FakeCommentsRepository implements ICommentsRepository {
  private comments: Comment[] = [];

  public async create(data: ICreateCommentDTO): Promise<Comment> {
    const comment = new Comment();
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
    return comment;
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
    const findComment = await this.comments.find(
      comment => comment.id.toHexString() === comment_id,
    );
    return findComment;
  }

  public async findByAuthorId(author_id: ObjectId): Promise<Comment[]> {
    const findComments = this.comments.filter(comment =>
      author_id.equals(comment.author.id),
    );
    return findComments;
  }

  public async findByPostId(post_id: ObjectId): Promise<Comment[]> {
    const findComments = this.comments.filter(comment =>
      comment.post_id.equals(post_id),
    );
    return findComments;
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
    const commentIsLiked = await this.comments.map(
      comment =>
        comment.users_liked.includes(liker_id) &&
        isAfter(comment.created_at, limitDate),
    );
    return commentIsLiked.filter(liked => liked).length;
  }
}

export default FakeCommentsRepository;
