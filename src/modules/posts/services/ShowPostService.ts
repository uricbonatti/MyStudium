import { inject, injectable } from 'tsyringe'
import { ApolloError } from 'apollo-server'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import Post from '../infra/typeorm/schemas/Post'
import IPostsRepository from '../repositories/IPostsRepository'

interface IRequest {
  post_id: string;
}

@injectable()
class ShowPostService {
  constructor (
    @inject('PostsRepository')
    private postsRepository: IPostsRepository
  ) {}

  public async execute ({ post_id }: IRequest): Promise<Post> {
    const post = await this.postsRepository.findByID(post_id)
    if (!post) {
      throw new ApolloError('Post not found.', '400')
    }
    return post
  }
}
export default ShowPostService
