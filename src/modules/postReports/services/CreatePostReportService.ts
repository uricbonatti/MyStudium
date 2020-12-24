import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostReportsRepository from '@modules/postReports/repositories/IPostReportsRepository';
import { ApolloError } from 'apollo-server';
import PostReport from '../infra/typeorm/schemas/PostReport';

interface IRequest {
  user_id: string;
  body: string;
  title: string;
  post_id: string;
}

@injectable()
class CreatePostReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('PostReportsRepository')
    private postReportRepository: IPostReportsRepository,
  ) {}

  public async execute({
    user_id,
    body,
    post_id,
    title,
  }: IRequest): Promise<PostReport> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', '400');
    }
    const post = await this.postsRepository.findByID(post_id);
    if (!post) {
      throw new ApolloError('Post not found.', '400');
    }
    const report = await this.postReportRepository.create({
      body,
      post_id: post.id,
      title,
      user_id: user.id,
    });
    return report;
  }
}

export default CreatePostReportService;
