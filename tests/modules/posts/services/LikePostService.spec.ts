import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import User from '@modules/users/infra/typeorm/schemas/User';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import LikePostService from '@modules/posts/services/LikePostService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let likePostService: LikePostService;
let user: User;
let post: Post;

describe('Like Post', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    likePostService = new LikePostService(
      fakeUsersRepository,
      fakePostsRepository,
    );
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    post = await fakePostsRepository.create({
      author: user,
      body: 'Loren Ypsolon',
      category: new Category(),
      image_url: 'teste.com/test.png',
      tags: [],
      title: 'Post Teste',
      resume: 'resumo',
    });
  });
  it('should be able to like a post', async () => {
    const likes = await likePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user.id.toHexString(),
    });
    expect(likes).toBe(1);
  });

  it('should be able to unlike a post after like', async () => {
    await likePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user.id.toHexString(),
    });
    const likes = await likePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user.id.toHexString(),
    });
    expect(likes).toBe(0);
  });
  it('should be able one or more users like a post', async () => {
    const user2 = await fakeUsersRepository.create({
      name: 'John Duo2',
      email: 'johnduo2@example.com',
      password: '123456',
    });
    await likePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user2.id.toHexString(),
    });
    const likes = await likePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user.id.toHexString(),
    });
    expect(likes).toBe(2);
  });
  it('should not be able to like a non-existing post', async () => {
    await expect(
      likePostService.execute({
        post_id: new ObjectId().toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to like a post by a non-existing user', async () => {
    await expect(
      likePostService.execute({
        post_id: post.id.toHexString(),
        user_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
