import { getMongoRepository, MongoRepository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../schemas/User';
import { ApolloError } from 'apollo-server';

class UsersRepository implements IUsersRepository {
  private odmRepository: MongoRepository<User>;

  constructor() {
    this.odmRepository = getMongoRepository(User);
  }

  public async create({
    name,
    email,
    description,
    password,
    linkedin,
    github,
  }: ICreateUserDTO): Promise<User> {
    const user = this.odmRepository.create({
      name,
      email,
      password,
      description,
      linkedin,
      github,
      fullexp: 0,
      permission: 2,
    });
    await this.odmRepository.save(user);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.odmRepository.findOne(id);

    return findUser;
  }

  public async findByEmail(userMail: string): Promise<User | undefined> {
    const findUser = await this.odmRepository.findOne({
      email: `${userMail}`,
    });
    return findUser;
  }

  public async save(user: User): Promise<User> {
    return this.odmRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    await this.odmRepository.delete(id);
  }
}

export default UsersRepository;
