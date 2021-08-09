import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import CommentReport from '@modules/commentReports/infra/typeorm/schemas/CommentReport';
import FakeCommentReportsRepository from '@modules/commentReports/repositories/fakes/FakeCommentReportsRepository';
import ShowCommentReportService from '@modules/commentReports/services/ShowCommentReportService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentReportsRepository: FakeCommentReportsRepository;
let showCommentReport: ShowCommentReportService;
let adm: User;
let user: User;
let report: CommentReport;

describe('Show Comment Report', () => {
  beforeEach(async () => {
    fakeCommentReportsRepository = new FakeCommentReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    showCommentReport = new ShowCommentReportService(
      fakeUsersRepository,
      fakeCommentReportsRepository,
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
    report = await fakeCommentReportsRepository.create({
      comment_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id,
    });
  });
  it('should be able to show the report to user who created', async () => {
    await expect(
      showCommentReport.execute({
        id: report.id.toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).resolves.toBeInstanceOf(CommentReport);
  });
  it('should be able to show the report to user with high permission', async () => {
    await expect(
      showCommentReport.execute({
        id: report.id.toHexString(),
        user_id: adm.id.toHexString(),
      }),
    ).resolves.toBeInstanceOf(CommentReport);
  });
  it('should not be able to show the report to user without permission', async () => {
    const lowerUser = await fakeUsersRepository.create({
      email: 'lu@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    lowerUser.permission = 2;
    await expect(
      showCommentReport.execute({
        id: report.id.toHexString(),
        user_id: lowerUser.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to show the report to non-existing user', async () => {
    await expect(
      showCommentReport.execute({
        id: report.id.toHexString(),
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to show a non-existing report ', async () => {
    await expect(
      showCommentReport.execute({
        id: 'non-existing-report',
        user_id: adm.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
