import User from '@modules/users/infra/typeorm/schemas/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import CommentReport from '@modules/commentReports/infra/typeorm/schemas/CommentReport';
import FakeCommentReportsRepository from '@modules/commentReports/repositories/fakes/FakeCommentReportsRepository';
import CloseCommentReportService from '@modules/commentReports/services/CloseCommentReportService';

let fakeCommentReportsRepository: FakeCommentReportsRepository;
let fakeUsersRepository: FakeUsersRepository;
let closeCommentReport: CloseCommentReportService;
let report: CommentReport;
let user: User;

describe('Close Comment Report', () => {
  beforeEach(async () => {
    fakeCommentReportsRepository = new FakeCommentReportsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    closeCommentReport = new CloseCommentReportService(
      fakeUsersRepository,
      fakeCommentReportsRepository,
    );
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456',
    });
    user.permission = 2;
    report = await fakeCommentReportsRepository.create({
      body: 'Só por reportar',
      title: 'Teste',
      comment_id: new ObjectId(),
      user_id: new ObjectId(),
    });
  });
  it('should be able to close a report', async () => {
    user.permission = 1;
    const closedReport = await closeCommentReport.execute({
      action: 'nothing',
      feedback: 'só fechei',
      user_id: user.id.toHexString(),
      id: report.id.toHexString(),
    });
    expect(closedReport.moderator_id).toEqual(user.id);
    expect(closedReport.closed).toEqual(true);
  });
  it('should not be able to close a report without permission', async () => {
    await expect(
      closeCommentReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: user.id.toHexString(),
        id: report.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to close a non-existing report', async () => {
    user.permission = 1;
    await expect(
      closeCommentReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: user.id.toHexString(),
        id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to close a report with a non-existing user', async () => {
    await expect(
      closeCommentReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: 'non-existing',
        id: report.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
