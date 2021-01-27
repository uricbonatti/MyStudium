import { inject, injectable } from 'tsyringe';
import { ApolloError } from 'apollo-server';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICommentReportsRepository from '../repositories/ICommentReportsRepository';
import CommentReport from '../infra/typeorm/schemas/CommentReport';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class ShowCommentReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CommentReportsRepository')
    private reportsRepository: ICommentReportsRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<CommentReport> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new ApolloError('Comment Report not found', '400');
    }
    if (user.permission === 2 && !report.user_id.equals(user.id)) {
      throw new ApolloError('User dont have permission', '401');
    }
    return report;
  }
}
export default ShowCommentReportService;
