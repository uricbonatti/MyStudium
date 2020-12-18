import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';

import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';

import { ObjectId } from 'mongodb';
import User from '../infra/typeorm/schemas/User';

interface IDeleteUser {
  user_id: string;
  email: string;
}
@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({ user_id, email }: IDeleteUser): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User cannot be found', '400');
    }
    if (user.email !== email) {
      throw new ApolloError('User email not matched', '400');
    }
    const comments = await this.commentsRepository.findByAuthorId(
      new ObjectId(user_id),
    );
    const posts = await this.postsRepository.findByAuthor(
      new ObjectId(user_id),
    );
    const comments_id = comments.map(comment => comment.id);
    const posts_id = posts.map(post => post.id);
    comments_id.forEach(comment_id => {
      this.commentsRepository.delete(comment_id.toHexString());
    });
    posts_id.forEach(post_id => {
      this.postsRepository.delete(post_id.toHexString());
    });
    await this.usersRepository.delete(user_id);
    return user;
  }
}
export default DeleteUserService;
