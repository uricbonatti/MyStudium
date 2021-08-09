import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import PostReport from '@modules/postReports/infra/typeorm/schemas/PostReport';
import FakePostReportsRepository from '@modules/postReports/repositories/fakes/FakePostReportsRepository';
import ShowPostReportService from '@modules/postReports/services/ShowPostReportService';

let fakeUsersRepository: FakeUsersRepository;
let fakePostReportsRepository: FakePostReportsRepository;
let showPostReport: ShowPostReportService;
let adm: User;
let user: User;
let report: PostReport;

describe('Show Post Report', () => {
  beforeEach(async () => {
    fakePostReportsRepository = new FakePostReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showPostReport = new ShowPostReportService(
      fakeUsersRepository,
      fakePostReportsRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    user.permission = 2;
    adm = await fakeUsersRepository.create({
      email: 'adm@tes.tes',
      name: 'John Duo Duo',
      password: '123456',
    });
    adm.permission = 0;
    report = await fakePostReportsRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id,
    });
  });
  it('should be able to show the report to user who created', async () => {
    await expect(
      showPostReport.execute({
        id: report.id.toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).resolves.toBeInstanceOf(PostReport);
  });
  it('should be able to show the report to user with high permission', async () => {
    await expect(
      showPostReport.execute({
        id: report.id.toHexString(),
        user_id: adm.id.toHexString(),
      }),
    ).resolves.toBeInstanceOf(PostReport);
  });
  it('should not be able to show the report to user without permission', async () => {
    const lowerUser = await fakeUsersRepository.create({
      email: 'lu@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    lowerUser.permission = 2;
    await expect(
      showPostReport.execute({
        id: report.id.toHexString(),
        user_id: lowerUser.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to show the report to non-existing user', async () => {
    await expect(
      showPostReport.execute({
        id: report.id.toHexString(),
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to show a non-existing report ', async () => {
    await expect(
      showPostReport.execute({
        id: 'non-existing-report',
        user_id: adm.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
