import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import ICommentReportsRepository from '../repositories/ICommentReportsRepository';
import CommentReport from '../infra/typeorm/schemas/CommentReport';

interface IRequest {
  user_id: string;
}

@injectable()
class ListUserCommentReportsService {
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
    const reports = await this.reportsRepository.findByUserId(user_id);
    return reports;
  }
}
export default ListUserCommentReportsService;
