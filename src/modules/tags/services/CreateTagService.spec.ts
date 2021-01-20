import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import User from '@modules/users/infra/typeorm/schemas/User'
import FakeCategoriesRepository from '@modules/categories/repositories/fakes/FakeCategoriesRepository'
import Category from '@modules/categories/infra/typeorm/schemas/Category'
import FakeTagsRepository from '../repositories/fakes/FakeTagsRepository'
import CreateTagService from './CreateTagService'

let fakeUsersRepository: FakeUsersRepository
let fakeCategoriesRepository: FakeCategoriesRepository
let fakeTagsRepository: FakeTagsRepository
let createTagService: CreateTagService
let user: User
let category: Category

describe('Create Tag', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCategoriesRepository = new FakeCategoriesRepository()
    fakeTagsRepository = new FakeTagsRepository()
    createTagService = new CreateTagService(
      fakeUsersRepository,
      fakeTagsRepository,
      fakeCategoriesRepository
    )
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456'
    })
    category = await fakeCategoriesRepository.create({
      name: 'Teste'
    })
  })
  it('should be able to create a new Tag', async () => {
    const tag = await createTagService.execute({
      name: 'Teste Tag',
      user_id: user.id.toHexString(),
      category_id: category.id.toHexString()
    })
    expect(tag).toHaveProperty('id')
  })
  it('should not be able to create a new Tag with same name', async () => {
    await createTagService.execute({
      name: 'Teste Tag',
      user_id: user.id.toHexString(),
      category_id: category.id.toHexString()
    })
    await expect(
      createTagService.execute({
        name: 'Teste Tag',
        user_id: user.id.toHexString(),
        category_id: category.id.toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be able to create a new Tag with non-valid user', async () => {
    await expect(
      createTagService.execute({
        name: 'Teste Tag',
        user_id: new ObjectId().toHexString(),
        category_id: category.id.toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be able to create a new Tag with non-valid category', async () => {
    await expect(
      createTagService.execute({
        name: 'Teste Tag',
        user_id: user.id.toHexString(),
        category_id: new ObjectId().toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
