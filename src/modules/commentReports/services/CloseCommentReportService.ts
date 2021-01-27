import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICommentReportsRepository from '@modules/commentReports/repositories/ICommentReportsRepository';
import { ApolloError } from 'apollo-server';
import CommentReport from '../infra/typeorm/schemas/CommentReport';

interface IRequest {
  id: string;
  user_id: string;
  feedback: string;
  action: 'deleted' | 'nothing';
}

@injectable()
class CloseCommentReportService {
  constructor(
    @inject('UsersReppository')
    private usersRepository: IUsersRepository,
    @inject('CommentReportsRepository')
    private reportsRepository: ICommentReportsRepository,
  ) {}

  public async execute({
    id,
    action,
    feedback,
    user_id,
  }: IRequest): Promise<CommentReport> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }
    if (user.permission === 2) {
      throw new ApolloError('User without permission', '401');
    }
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new ApolloError('Report not found', '400');
    }
    report.feedback = feedback;
    report.action = action;
    report.moderator_id = user.id;
    return this.reportsRepository.close(report);
  }
}
export default CloseCommentReportService;
