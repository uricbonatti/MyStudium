import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import User from '@modules/users/infra/typeorm/schemas/User';
import { ApolloError } from 'apollo-server';
import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import CreateCategoryService from './CreateCategoryService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategoryService: CreateCategoryService;
let user: User;

describe('Create Category', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    createCategoryService = new CreateCategoryService(
      fakeUsersRepository,
      fakeCategoriesRepository,
    );
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
  });
  it('should be able to create a new category', async () => {
    const category = await createCategoryService.execute({
      name: 'Teste',
      user_id: user.id.toHexString(),
    });
    expect(category).toHaveProperty('id');
  });
  it('should not be able to create categories with same name', async () => {
    await createCategoryService.execute({
      name: 'Teste',
      user_id: user.id.toHexString(),
    });
    await expect(
      createCategoryService.execute({
        name: 'Teste',
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create category with non-valid user', async () => {
    await expect(
      createCategoryService.execute({
        name: 'Teste',
        user_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
