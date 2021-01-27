import { ObjectId } from 'mongodb';

export default interface ICreateCommentReportDTO {
  comment_id: ObjectId;
  user_id: ObjectId;
  title: string;
  body: string;
}
