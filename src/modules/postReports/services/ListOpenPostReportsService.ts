import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { inject, injectable } from 'tsyringe';
import PostReport from '../infra/typeorm/schemas/PostReport';
import IPostReportsRepository from '../repositories/IPostReportsRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListOpenPostReportsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PostReportsRepository')
    private reportsRepository: IPostReportsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<PostReport[]> {
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
export default ListOpenPostReportsService;
