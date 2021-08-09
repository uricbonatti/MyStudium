import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { inject, injectable } from 'tsyringe';
import CommentReport from '../infra/typeorm/schemas/CommentReport';
import ICommentReportsRepository from '../repositories/ICommentReportsRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListOpenCommentReportsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CommentReportsRepository')
    private reportsRepository: ICommentReportsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<CommentReport[]> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }
    if (user.permission === 2) {
      throw new ApolloError('User without permission', '401');
    }
    return this.reportsRepository.findOpenReports();
  }
}
export default ListOpenCommentReportsService;
