import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import CommentReport from '@modules/commentReports/infra/typeorm/schemas/CommentReport';
import FakeCommentReportsRepository from '@modules/commentReports/repositories/fakes/FakeCommentReportsRepository';
import ListOpenCommentReportsService from '@modules/commentReports/services/ListOpenCommentReportsService';

let fakeCommentReportsRepository: FakeCommentReportsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listOpenCommentReports: ListOpenCommentReportsService;
let report: CommentReport;
let user: User;

describe('List Open Comment Reports', () => {
  beforeEach(async () => {
    fakeCommentReportsRepository = new FakeCommentReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listOpenCommentReports = new ListOpenCommentReportsService(
      fakeUsersRepository,
      fakeCommentReportsRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    report = await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id,
    });
    const report2 = await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 2',
      title: 'Teste 2',
      user_id: user.id,
    });
    report2.closed = true;
  });
  it('should be able to list open comment reports', async () => {
    user.permission = 1;
    const reports = await listOpenCommentReports.execute({
      user_id: user.id.toHexString(),
    });
    expect(reports).toEqual([report]);
  });
  it('should not be able to list open comment reports without permission', async () => {
    user.permission = 2;
    await expect(
      listOpenCommentReports.execute({
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to list open comment reports with non-existing user', async () => {
    user.permission = 2;
    await expect(
      listOpenCommentReports.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
