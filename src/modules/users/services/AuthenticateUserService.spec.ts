import { ApolloError } from 'apollo-server'

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import CreateUserService from './CreateUserService'

let fakeHashProvider: FakeHashProvider
let fakeUsersRepository: FakeUsersRepository
let createUserService: CreateUserService
let authenticateUserService: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeUsersRepository = new FakeUsersRepository()
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should be abre to authenticate', async () => {
    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })
    const response = await authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })
    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'jdoe2@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'jdoe@example.com',
      password: '123456'
    })

    await expect(
      authenticateUserService.execute({
        email: 'jdoe@example.com',
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
