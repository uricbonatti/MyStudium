import { ApolloError } from 'apollo-server';

import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import FakeCommentsRepository from '@modules/comments/repositories/fakes/FakeCommentsRepository';

import FakeCommentReportsRepository from '../repositories/fakes/FakeCommentReportsRepository';
import CreateCommentReportService from './CreateCommentReportService';
import { ObjectID } from 'mongodb';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeCommentReportsRepository: FakeCommentReportsRepository;
let createCommentReport: CreateCommentReportService;
let user: User;
let comment: Comment;

describe('Create Comment Report', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeCommentReportsRepository = new FakeCommentReportsRepository();
    createCommentReport = new CreateCommentReportService(
      fakeUsersRepository,
      fakeCommentsRepository,
      fakeCommentReportsRepository,
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
    comment = await fakeCommentsRepository.create({
      body: 'Loren Ypsolon',
      author: postAuthor,
      post_id: new ObjectID(),
    });
  });
  it('should be able to create a comment report', async () => {
    const report = await createCommentReport.execute({
      body: 'Just to Report',
      comment_id: comment.id.toHexString(),
      title: 'Report',
      user_id: user.id.toHexString(),
    });
    expect(report).toHaveProperty('id');
    expect(report.closed).toBe(false);
  });
  it('should not be able to create a report with a non-existing user', async () => {
    await expect(
      createCommentReport.execute({
        body: 'Just to Report',
        comment_id: comment.id.toHexString(),
        title: 'Report',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to create a report for a non-existing comment', async () => {
    await expect(
      createCommentReport.execute({
        body: 'Just to Report',
        comment_id: 'non-existing-post',
        title: 'Report',
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
