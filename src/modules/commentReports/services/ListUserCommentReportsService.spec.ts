import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import CommentReport from '../infra/typeorm/schemas/CommentReport';
import FakeCommentReportsRepository from '../repositories/fakes/FakeCommentReportsRepository';
import ListUserCommentReportsService from './ListUserCommentReportsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentReportsRepository: FakeCommentReportsRepository;
let listUserCommentReports: ListUserCommentReportsService;
let user: User;
let report1: CommentReport;
let report2: CommentReport;

describe('List User Comment Reports', () => {
  beforeEach(async () => {
    fakeCommentReportsRepository = new FakeCommentReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listUserCommentReports = new ListUserCommentReportsService(
      fakeUsersRepository,
      fakeCommentReportsRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    report1 = await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id,
    });

    report2 = await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 2',
      title: 'Teste 2',
      user_id: user.id,
    });
    await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 3',
      title: 'Teste 3',
      user_id: new ObjectId(),
    });
  });
  it('should be able to list user post reports', async () => {
    const reports = await listUserCommentReports.execute({
      user_id: user.id.toHexString(),
    });
    expect(reports).toEqual([report1, report2]);
  });
  it('should not be able to list post reports to a non-existing user', async () => {
    await expect(
      listUserCommentReports.execute({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
