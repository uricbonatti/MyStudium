import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import User from '@modules/users/infra/typeorm/schemas/User';
import { ApolloError } from 'apollo-server';
import FakeCategoriesRepository from '@modules/categories/repositories/fakes/FakeCategoriesRepository';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import FakeTagsRepository from '@modules/tags/repositories/fakes/FakeTagsRepository';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import CreatePostService from './CreatePostService';
import FakePostsRepository from '../repositories/fakes/FakePostsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeTagsRepository: FakeTagsRepository;
let fakePostsRepository: FakePostsRepository;
let createPostService: CreatePostService;
let user: User;
let category: Category;
let tag: Tag;

describe('Create Post', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeTagsRepository = new FakeTagsRepository();
    fakePostsRepository = new FakePostsRepository();

    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    category = await fakeCategoriesRepository.create({
      name: 'Teste',
    });
    tag = await fakeTagsRepository.create({
      category,
      name: 'Teste Tag',
    });
    await fakeTagsRepository.create({
      category,
      name: 'Teste Tag2',
    });
    createPostService = new CreatePostService(
      fakeUsersRepository,
      fakePostsRepository,
      fakeTagsRepository,
      fakeCategoriesRepository,
    );
  });
  it('should be able to create a new Post', async () => {
    const post = await createPostService.execute({
      author_id: user.id.toHexString(),
      resume: 'testing',
      title: 'Post Teste',
      body: 'Loren Ypsolon',
      image_url: 'teste.com/teste.png',
      category_id: category.id.toHexString(),
      tag_ids: [
        {
          tag_id: tag.id.toHexString(),
        },
      ],
    });
    expect(post).toHaveProperty('id');
  });

  it('should not be able to create a non-valid author/user', async () => {
    await expect(
      createPostService.execute({
        author_id: new ObjectId().toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: category.id.toHexString(),
        tag_ids: [
          {
            tag_id: tag.id.toHexString(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });

  it('should not be able to create a non-existing category', async () => {
    await expect(
      createPostService.execute({
        author_id: user.id.toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: new ObjectId().toHexString(),
        tag_ids: [
          {
            tag_id: tag.id.toHexString(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create two post with same slug by single user', async () => {
    await createPostService.execute({
      author_id: user.id.toHexString(),
      resume: 'testing',
      title: 'Post Teste',
      body: 'Loren Ypsolon',
      image_url: 'teste.com/teste.png',
      category_id: category.id.toHexString(),
      tag_ids: [
        {
          tag_id: tag.id.toHexString(),
        },
      ],
    });
    await expect(
      createPostService.execute({
        author_id: user.id.toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: category.id.toHexString(),
        tag_ids: [
          {
            tag_id: tag.id.toHexString(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a non-valid category', async () => {
    await expect(
      createPostService.execute({
        author_id: user.id.toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: 'non-valid',
        tag_ids: [
          {
            tag_id: tag.id.toHexString(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a non-valid tag', async () => {
    await expect(
      createPostService.execute({
        author_id: user.id.toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: category.id.toHexString(),
        tag_ids: [
          {
            tag_id: 'non-valid',
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a non-existing tag', async () => {
    await expect(
      createPostService.execute({
        author_id: user.id.toHexString(),
        resume: 'testing',
        title: 'Post Teste',
        body: 'Loren Ypsolon',
        image_url: 'teste.com/teste.png',
        category_id: category.id.toHexString(),
        tag_ids: [
          {
            tag_id: new ObjectId().toHexString(),
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
