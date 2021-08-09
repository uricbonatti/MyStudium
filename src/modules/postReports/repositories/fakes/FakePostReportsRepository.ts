import { ObjectId } from 'mongodb';

import ICreatePostReportDTO from '@modules/postReports/dtos/ICreatePostReportDTO';
import PostReport from '@modules/postReports/infra/typeorm/schemas/PostReport';
import IPostReportsRepository from '../IPostReportsRepository';

class FakePostReportsRepository implements IPostReportsRepository {
  private reports: PostReport[] = [];

  public async create(data: ICreatePostReportDTO): Promise<PostReport> {
    const report = new PostReport();
    Object.assign(report, { id: new ObjectId(), closed: false }, data);
    this.reports.push(report);
    return report;
  }

  public async close(report: PostReport): Promise<PostReport> {
    const findIndex = this.reports.findIndex(findReport =>
      findReport.id.equals(report.id),
    );
    // eslint-disable-next-line no-param-reassign
    report.closed = true;
    this.reports[findIndex] = report;
    return report;
  }

  public async findById(id: string): Promise<PostReport | undefined> {
    return this.reports.find(report => report.id.toHexString() === id);
  }

  public async findByUserId(id: string): Promise<PostReport[]> {
    return this.reports.filter(report => report.user_id.toHexString() === id);
  }

  public async findOpenReports(): Promise<PostReport[]> {
    return this.reports.filter(report => !report.closed);
  }
}
export default FakePostReportsRepository;
