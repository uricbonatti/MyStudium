import { inject, injectable } from 'tsyringe';
import { ApolloError } from 'apollo-server';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostReportsRepository from '../repositories/IPostReportsRepository';
import PostReport from '../infra/typeorm/schemas/PostReport';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class ShowPostReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PostReportsRepository')
    private reportsRepository: IPostReportsRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<PostReport> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new ApolloError('Post Report not found', '400');
    }
    if (user.permission === 2 && !report.user_id.equals(user.id)) {
      throw new ApolloError('User dont have permission', '401');
    }
    return report;
  }
}
export default ShowPostReportService;
