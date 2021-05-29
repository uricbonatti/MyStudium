import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  id: string;
  targetUserId: string;
  permissionLevel: 'admin' | 'moderator' | 'user';
}

@injectable()
class ChangeUserPermissionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({
    id,
    targetUserId,
    permissionLevel,
  }: IRequest): Promise<boolean> {
    const admin = await this.usersRepository.findById(id);
    if (!admin) {
      throw new ApolloError('User Logged not found.', '401');
    }
    if (admin.permission !== 0) {
      throw new ApolloError('User dont have permission.', '403');
    }
    const user = await this.usersRepository.findById(targetUserId);
    if (!user) {
      throw new ApolloError('User Target not found.', '404');
    }
    if (user.email === process.env.ADMIN_EMAIL) {
      throw new ApolloError('User Target cant have permission changed.', '403');
    }
    switch (permissionLevel) {
      case 'admin':
        user.permission = 0;
        break;
      case 'moderator':
        user.permission = 1;
        break;
      case 'user':
        user.permission = 2;
        break;
      default:
        break;
    }
    const updatedUser = await this.usersRepository.save(user);
    if (updatedUser.getPermission() === permissionLevel) {
      return true;
    }
    return false;
  }
}
export default ChangeUserPermissionService;
