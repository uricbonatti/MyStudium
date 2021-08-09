import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { inject, injectable } from 'tsyringe';

@injectable()
class GenerateAdminOnFirstRunService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute(): Promise<undefined> {
    const administrativeEmail = process.env.ADMIN_EMAIL;
    if (!administrativeEmail) {
      throw new ApolloError(
        'Administrative Email is not setted on enviroments.',
        '500',
      );
    }
    const admin = await this.usersRepository.findByEmail(administrativeEmail);
    if (!!admin) {
      return;
    }
    const password = process.env.DEFAULT_ADMIN_PASS || 'default';
    const hashedPassword = await this.hashProvider.generateHash(password);

    const newAdmin = await this.usersRepository.create({
      email: administrativeEmail,
      password: hashedPassword,
      name: 'Equipe Studium',
      description: 'Equipe Administrativa da plataforma Studium',
    });
    newAdmin.permission = 0;
    newAdmin.avatar_url =
      'https://www.clipartmax.com/png/middle/319-3191274_male-avatar-admin-profile.png';
    await this.usersRepository.save(newAdmin);
  }
}
export default GenerateAdminOnFirstRunService;
