import 'reflect-metadata';
import UserSummaryActivityService from '@modules/users/services/UserSummaryActivityService';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import FakeCommentsRepository from '@modules/comments/repositories/fakes/FakeCommentsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';

let userSummaryActivity: UserSummaryActivityService;
let fakePostsRepository: FakePostsRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let user: User;
let post: Post;
describe('User Summary Activity', () => {
  beforeEach(async () => {
    fakeCommentsRepository = new FakeCommentsRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    userSummaryActivity = new UserSummaryActivityService(
      fakeUsersRepository,
      fakePostsRepository,
      fakeCommentsRepository,
    );
    user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    post = await fakePostsRepository.create({
      author: user,
      body: 'anything',
      category: new Category(),
      image_url: 'teste.use',
      resume: 'resumo',
      tags: [new Tag()],
      title: 'Post Teste',
      slug: 'slug-teste',
    });
  });
  it('should be able to generante a user summary activity', async () => {
    const summary = await userSummaryActivity.execute({
      user_id: user.id.toHexString(),
    });
    expect(summary.all.commentsCreated).toBe(0);
    expect(summary.all.postsCreated).toBe(1);
    expect(summary.all.postsLiked).toBe(0);
    expect(summary.all.commentsLiked).toBe(0);
    expect(summary.lastMonth.commentsCreated).toBe(0);
    expect(summary.lastMonth.postsCreated).toBe(1);
    expect(summary.lastMonth.postsLiked).toBe(0);
    expect(summary.lastMonth.commentsLiked).toBe(0);
    expect(summary.lastWeek.commentsCreated).toBe(0);
    expect(summary.lastWeek.postsCreated).toBe(1);
    expect(summary.lastWeek.postsLiked).toBe(0);
    expect(summary.lastWeek.commentsLiked).toBe(0);
    expect(summary.lastWeekPosts).toEqual([post]);
    expect(summary.weekExp).toBe(500);
  });
  it('should not be able to generate a user summary activity for non-vali user', async () => {
    await expect(
      userSummaryActivity.execute({ user_id: 'non-valid' }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to generate a user summary activity for non-existing user', async () => {
    await expect(
      userSummaryActivity.execute({ user_id: new ObjectId().toHexString() }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
