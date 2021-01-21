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
    try {
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
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findById(id: string): Promise<User | undefined> {
    try {
      const findUser = await this.odmRepository.findOne(id);
      return findUser;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    try {
      const findUser = await this.odmRepository.findOne({ where: { email } });
      return findUser;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async save(user: User): Promise<User> {
    try {
      return this.odmRepository.save(user);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.odmRepository.delete(id);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}

export default UsersRepository;
