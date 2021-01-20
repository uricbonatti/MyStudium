import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/schemas/User';

interface IRequest {
  id: string;
}
@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ApolloError('User not found');
    }
    return user;
  }
}
export default ShowProfileService;
