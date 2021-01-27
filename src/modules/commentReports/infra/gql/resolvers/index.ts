import {
  closeCommentReport,
  createCommentReport,
  userCommentReports,
  openCommentReports,
  showCommentReport,
} from './CommentReportsResolver';

export const CommentReportQuerys = {
  userCommentReports,
  openCommentReports,
  showCommentReport,
};
export const CommentReportMutations = {
  closeCommentReport,
  createCommentReport,
};
