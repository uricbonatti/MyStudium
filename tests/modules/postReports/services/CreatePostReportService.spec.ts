import Category from '@modules/categories/infra/typeorm/schemas/Category';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ApolloError } from 'apollo-server';
import FakePostReportsRepository from '@modules/postReports/repositories/fakes/FakePostReportsRepository';
import CreatePostReportService from '@modules/postReports/services/CreatePostReportService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let fakePostReportsRepository: FakePostReportsRepository;
let createPostReport: CreatePostReportService;
let user: User;
let post: Post;

describe('Create Post Report', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakePostReportsRepository = new FakePostReportsRepository();
    createPostReport = new CreatePostReportService(
      fakeUsersRepository,
      fakePostsRepository,
      fakePostReportsRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'user@test.tes',
      name: 'John Duo',
      password: '123456',
    });
    const postAuthor = await fakeUsersRepository.create({
      email: 'author@test.tes',
      name: 'John Duo',
      password: '123456',
    });
    post = await fakePostsRepository.create({
      body: 'Loren Ypsolon',
      title: 'Teste Post',
      category: new Category(),
      resume: 'resumo',
      tags: [new Tag()],
      author: postAuthor,
      image_url: 'img',
    });
  });
  it('should be able to create a post report', async () => {
    const report = await createPostReport.execute({
      body: 'Just to Report',
      post_id: post.id.toHexString(),
      title: 'Report',
      user_id: user.id.toHexString(),
    });
    expect(report).toHaveProperty('id');
    expect(report.closed).toBe(false);
  });
  it('should not be able to create a report with a non-existing user', async () => {
    await expect(
      createPostReport.execute({
        body: 'Just to Report',
        post_id: post.id.toHexString(),
        title: 'Report',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a report for a non-existing post', async () => {
    await expect(
      createPostReport.execute({
        body: 'Just to Report',
        post_id: 'non-existing-post',
        title: 'Report',
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
