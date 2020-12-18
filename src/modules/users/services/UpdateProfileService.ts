import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/schemas/User';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    id,
    email,
    name,
    description,
    old_password,
    password,
    github,
    linkedin,
    avatar_url,
  }: IUpdateUserDTO): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new ApolloError('User not found.', '400');
    }
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (
      userWithUpdatedEmail &&
      String(user.id) !== String(userWithUpdatedEmail.id)
    ) {
      throw new ApolloError('Email already in use.', '400');
    }
    if (password && !old_password) {
      throw new ApolloError(
        'You need to inform old password to set a new password',
        '400',
      );
    }
    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new ApolloError('Old Password not match', '400');
      }
      user.password = await this.hashProvider.generateHash(password);
    }
    user.name = name;
    user.email = email;
    if (description) user.description = description;
    if (avatar_url) user.avatar_url = avatar_url;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;

    return this.usersRepository.save(user);
  }
}
export default UpdateProfileService;
