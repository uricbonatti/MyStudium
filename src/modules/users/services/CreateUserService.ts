import { injectable, inject } from 'tsyringe'
import { ApolloError } from 'apollo-server'
import IUsersRepository from '../repositories/IUsersRepository'
import User from '../infra/typeorm/schemas/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import ICreateUserDTO from '../dtos/ICreateUserDTO'

@injectable()
class CreateUserService {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute ({
    email,
    name,
    password,
    description,
    github,
    linkedin
  }: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new ApolloError('Email address already used.', '400')
    }
    const hashedPassword = await this.hashProvider.generateHash(password)
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      description,
      github,
      linkedin
    })
    return user
  }
}

export default CreateUserService
