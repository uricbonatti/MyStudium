import { ObjectId } from 'mongodb'

export default interface ICreatePostReportDTO {
  post_id: ObjectId;
  user_id: ObjectId;
  title: string;
  body: string;
}
