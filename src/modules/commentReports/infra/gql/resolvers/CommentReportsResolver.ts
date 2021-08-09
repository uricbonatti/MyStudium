import { IContext } from '@shared/utils/interfaces';
import verifyToken from '@shared/utils/tokenValidation';
import { container } from 'tsyringe';
import ListUserCommentReportsService from '@modules/commentReports/services/ListUserCommentReportsService';
import ListOpenCommentReportsService from '@modules/commentReports/services/ListOpenCommentReportsService';
import ShowCommentReportService from './../../../services/ShowCommentReportService';
import CreateCommentReportService from './../../../services/CreateCommentReportService';
import CloseCommentReportService from '@modules/commentReports/services/CloseCommentReportService';

interface ICreateReport {
  data: {
    comment_id: string;
    body: string;
    title: string;
  };
}
interface ICloseReport {
  data: {
    id: string;
    feedback: string;
    action: 'deleted' | 'nothing';
  };
}
interface IShowReport {
  id: string;
}
export async function userCommentReports(_: any, __: any, { token }: IContext) {
  const user_id = verifyToken(token);
  const listUserCommentReportsService = container.resolve(
    ListUserCommentReportsService,
  );
  return listUserCommentReportsService.execute({ user_id });
}
export async function openCommentReports(_: any, __: any, { token }: IContext) {
  const user_id = verifyToken(token);
  const listOpenCommentReportsService = container.resolve(
    ListOpenCommentReportsService,
  );
  return listOpenCommentReportsService.execute({
    user_id,
  });
}
export async function showCommentReport(
  _: any,
  { id }: IShowReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const showCommentReportService = container.resolve(ShowCommentReportService);
  return showCommentReportService.execute({ id, user_id });
}

export async function createCommentReport(
  _: any,
  { data }: ICreateReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const { comment_id, body, title } = data;
  const createReport = container.resolve(CreateCommentReportService);
  return createReport.execute({
    body,
    comment_id,
    title,
    user_id,
  });
}
export async function closeCommentReport(
  _: any,
  { data }: ICloseReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const { action, feedback, id } = data;
  const closeReport = container.resolve(CloseCommentReportService);
  return closeReport.execute({
    action,
    feedback,
    id,
    user_id,
  });
}
