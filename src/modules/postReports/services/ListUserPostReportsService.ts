import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import IPostReportsRepository from '../repositories/IPostReportsRepository';
import PostReport from '../infra/typeorm/schemas/PostReport';

interface IRequest {
  user_id: string;
}

@injectable()
class ListUserPostReportsService {
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
    const reports = await this.reportsRepository.findByUserId(user_id);
    return reports;
  }
}
export default ListUserPostReportsService;
