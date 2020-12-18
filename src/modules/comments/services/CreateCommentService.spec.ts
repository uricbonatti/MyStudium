import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import FakeCategoriesRepository from '@modules/categories/repositories/fakes/FakeCategoriesRepository';
import FakeTagsRepository from '@modules/tags/repositories/fakes/FakeTagsRepository';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import CreateCommentService from './CreateCommentService';
import FakeCommentsRepository from '../repositories/fakes/FakeCommentsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeTagsRepository: FakeTagsRepository;
let fakePostsRepository: FakePostsRepository;
let createCommentService: CreateCommentService;
let fakeCommentsRepository: FakeCommentsRepository;
let user: User;
let category: Category;
let tag: Tag;
let post: Post;

describe('Create Comment', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeTagsRepository = new FakeTagsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakePostsRepository = new FakePostsRepository();
    createCommentService = new CreateCommentService(
      fakeUsersRepository,
      fakePostsRepository,
      fakeCommentsRepository,
    );
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
    post = await fakePostsRepository.create({
      author: user,
      category,
      tags: [tag],
      title: 'Post Teste',
      body: 'Lorem Ipsolon',
      image_url: 'teste.com/teste.png',
    });
  });
  it('should be able to create a new Comment', async () => {
    const comment = await createCommentService.execute({
      author_id: user.id.toHexString(),
      body: 'Loren Ypsolon',
      post_id: post.id.toHexString(),
    });
    expect(comment).toHaveProperty('id');
  });

  it('should not be able to create a Comment with non-valid author/user', async () => {
    await expect(
      createCommentService.execute({
        author_id: new ObjectId().toHexString(),
        body: 'Loren Ypsolon',
        post_id: post.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a Comment with non-existing post', async () => {
    await expect(
      createCommentService.execute({
        author_id: user.id.toHexString(),
        body: 'Loren Ypsolon',
        post_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
