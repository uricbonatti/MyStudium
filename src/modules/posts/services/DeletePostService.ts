import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';
import { ObjectId as MongoObjectID } from 'mongodb';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '../repositories/IPostsRepository';
import Post from '../infra/typeorm/schemas/Post';

interface IDelete {
  user_id: string;
  post_id: string;
}

@injectable()
class DeletePostService {
  constructor(
    @inject('PostRepository')
    private postRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, post_id }: IDelete): Promise<Post> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User cannot be found', '400');
    }
    const post = await this.postRepository.findByID(post_id);
    if (!post) {
      throw new ApolloError('Post cannot be found', '400');
    }
    if (!post.author.id.equals(new MongoObjectID(user_id))) {
      throw new ApolloError(
        'User is not the Author, then User cannot delete this post',
        '400',
      );
    }
    await this.postRepository.delete(post_id);
    return post;
  }
}
export default DeletePostService;
