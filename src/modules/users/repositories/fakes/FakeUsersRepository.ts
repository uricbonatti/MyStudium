import { ObjectId } from 'mongodb';

import User from '@modules/users/infra/typeorm/schemas/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      id: new ObjectId(),
      ...userData,
    });
    this.users.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id.toHexString() === id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[findIndex] = user;
    return user;
  }

  public async delete(id: string): Promise<void> {
    const findIndex = this.users.findIndex(
      findUser => findUser.id === ObjectId.createFromHexString(id),
    );
    this.users = [...this.users.slice(findIndex, 1)];
  }
}

export default FakeUsersRepository;
