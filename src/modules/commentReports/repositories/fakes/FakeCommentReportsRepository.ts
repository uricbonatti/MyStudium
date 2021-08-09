import { ObjectId } from 'mongodb';

import CommentReport from '@modules/commentReports/infra/typeorm/schemas/CommentReport';
import ICommentReportsRepository from '../ICommentReportsRepository';
import ICreateCommentReportDTO from '@modules/commentReports/dtos/ICreateCommentReportDTO';

class FakeCommentReportsRepository implements ICommentReportsRepository {
  private reports: CommentReport[] = [];

  public async create(data: ICreateCommentReportDTO): Promise<CommentReport> {
    const report = new CommentReport();
    Object.assign(report, { id: new ObjectId(), closed: false }, data);
    this.reports.push(report);
    return report;
  }

  public async close(report: CommentReport): Promise<CommentReport> {
    const findIndex = this.reports.findIndex(findReport =>
      findReport.id.equals(report.id),
    );
    // eslint-disable-next-line no-param-reassign
    report.closed = true;
    this.reports[findIndex] = report;
    return report;
  }

  public async findById(id: string): Promise<CommentReport | undefined> {
    return this.reports.find(report => report.id.toHexString() === id);
  }

  public async findByUserId(id: string): Promise<CommentReport[]> {
    return this.reports.filter(report => report.user_id.toHexString() === id);
  }

  public async findOpenReports(): Promise<CommentReport[]> {
    return this.reports.filter(report => !report.closed);
  }
}
export default FakeCommentReportsRepository;
