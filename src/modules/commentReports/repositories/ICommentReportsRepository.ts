import ICreateCommentReportDTO from '../dtos/ICreateCommentReportDTO';
import CommentReport from '../infra/typeorm/schemas/CommentReport';

export default interface ICommentReportsRepository {
  create(data: ICreateCommentReportDTO): Promise<CommentReport>;
  close(report: CommentReport): Promise<CommentReport>;
  findById(id: string): Promise<CommentReport | undefined>;
  findByUserId(id: string): Promise<CommentReport[]>;
  findOpenReports(): Promise<CommentReport[]>;
}
