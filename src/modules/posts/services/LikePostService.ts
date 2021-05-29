import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import IPostsRepository from '../repositories/IPostsRepository';

interface ILikePost {
  post_id: string;
  user_id: string;
}

@injectable()
class LikePostService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute({ user_id, post_id }: ILikePost): Promise<number> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', '400');
    }
    const post = await this.postsRepository.findByID(post_id);
    if (!post) {
      throw new ApolloError('Post not found.', '400');
    }
    const likes = await this.postsRepository.like({
      post_id: post.id,
      user_id: user.id,
    });

    return likes;
  }
}
export default LikePostService;
