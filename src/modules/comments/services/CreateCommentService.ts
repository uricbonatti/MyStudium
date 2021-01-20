import { injectable, inject } from 'tsyringe'
import { ApolloError } from 'apollo-server'
import { ObjectId } from 'mongodb'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import IPostsRepository from '@modules/posts/repositories/IPostsRepository'

import ICommentsRepository from '../repositories/ICommentsRepository'
import Comment from '../infra/typeorm/schemas/Comment'

export interface ICreateCommentDTO {
  author_id: string;
  body: string;
  post_id: string;
}

@injectable()
class CreateCommentService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository
  ) {}

  public async execute ({
    author_id,
    body,
    post_id
  }: ICreateCommentDTO): Promise<Comment> {
    const user = await this.usersRepository.findById(author_id)
    if (!user) {
      throw new ApolloError('Author/User not found.', '400')
    }
    const post = await this.postsRepository.findByID(post_id)
    if (!post) {
      throw new ApolloError('Post not found.', '400')
    }

    const comment = await this.commentsRepository.create({
      author: user,
      body,
      post_id: post.id
    })
    await this.commentsRepository.save(comment)

    return comment
  }
}
export default CreateCommentService
