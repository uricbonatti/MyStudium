import { container } from 'tsyringe';

import { IContext } from '@shared/utils/interfaces';
import verifyToken from '@shared/utils/tokenValidation';

import CreatePostReportService from '@modules/postReports/services/CreatePostReportService';
import ClosePostReportService from '@modules/postReports/services/ClosePostReportService';
import ListUserPostReportsService from '@modules/postReports/services/ListUserPostReportsService';
import ListOpenPostReportsService from '@modules/postReports/services/ListOpenPostReportsService';
import ShowPostReportService from '@modules/postReports/services/ShowPostReportService';

interface ICreateReport {
  data: {
    post_id: string;
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

export async function createPostReport(
  _: any,
  { data }: ICreateReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const { post_id, body, title } = data;
  const createPostReportService = container.resolve(CreatePostReportService);
  return createPostReportService.execute({
    body,
    post_id,
    title,
    user_id,
  });
}

export async function closePostReport(
  _: any,
  { data }: ICloseReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const { id, feedback, action } = data;
  const closePostReportService = container.resolve(ClosePostReportService);
  return closePostReportService.execute({
    action,
    feedback,
    id,
    user_id,
  });
}
export async function userPostReports(_: any, __: any, { token }: IContext) {
  const user_id = verifyToken(token);
  const listUserPostReports = container.resolve(ListUserPostReportsService);
  return listUserPostReports.execute({ user_id });
}
export async function openPostReports(_: any, __: any, { token }: IContext) {
  const user_id = verifyToken(token);
  const listOpenPostReports = container.resolve(ListOpenPostReportsService);
  return listOpenPostReports.execute({ user_id });
}
export async function showPostReport(
  _: any,
  { id }: IShowReport,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const showPostReportService = container.resolve(ShowPostReportService);
  return showPostReportService.execute({ user_id, id });
}
