import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICommentReportsRepository from '@modules/commentReports/repositories/ICommentReportsRepository';
import { ApolloError } from 'apollo-server';
import CommentReport from '../infra/typeorm/schemas/CommentReport';

interface IRequest {
  user_id: string;
  body: string;
  title: string;
  comment_id: string;
}

@injectable()
class CreateCommentReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('CommentReportsRepository')
    private commentReportRepository: ICommentReportsRepository,
  ) {}

  public async execute({
    user_id,
    body,
    comment_id,
    title,
  }: IRequest): Promise<CommentReport> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', '400');
    }
    const comment = await this.commentsRepository.findByID(comment_id);
    if (!comment) {
      throw new ApolloError('Comment not found.', '400');
    }
    const report = await this.commentReportRepository.create({
      body,
      comment_id: comment.id,
      title,
      user_id: user.id,
    });
    return report;
  }
}

export default CreateCommentReportService;
