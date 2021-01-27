import {
  closePostReport,
  createPostReport,
  openPostReports,
  showPostReport,
  userPostReports,
} from './PostReportsResolver';

export const PostReportQuerys = {
  openPostReports,
  showPostReport,
  userPostReports,
};

export const PostReportMutations = {
  closePostReport,
  createPostReport,
};
