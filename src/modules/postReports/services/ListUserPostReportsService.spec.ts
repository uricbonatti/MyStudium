import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import PostReport from '../infra/typeorm/schemas/PostReport';
import FakePostReportsRepository from '../repositories/fakes/FakePostReportsRepository';
import ListUserPostReportsService from './ListUserPostReportsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostReportRepository: FakePostReportsRepository;
let listUserPostReport: ListUserPostReportsService;
let user: User;
let report1: PostReport;
let report2: PostReport;

describe('List User Post Reports', () => {
  beforeEach(async () => {
    fakePostReportRepository = new FakePostReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listUserPostReport = new ListUserPostReportsService(
      fakeUsersRepository,
      fakePostReportRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    report1 = await fakePostReportRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id,
    });

    report2 = await fakePostReportRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 2',
      title: 'Teste 2',
      user_id: user.id,
    });
    await fakePostReportRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 3',
      title: 'Teste 3',
      user_id: new ObjectId(),
    });
  });
  it('should be able to list user post reports', async () => {
    const reports = await listUserPostReport.execute({
      user_id: user.id.toHexString(),
    });
    expect(reports).toEqual([report1, report2]);
  });
  it('should not be able to list post reports to a non-existing user', async () => {
    await expect(
      listUserPostReport.execute({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
