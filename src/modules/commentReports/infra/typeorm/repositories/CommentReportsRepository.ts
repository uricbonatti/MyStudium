import { ObjectId } from 'mongodb';
import { MongoRepository, getMongoRepository } from 'typeorm';

import CommentReport from '../schemas/CommentReport';
import ICreateCommentReportDTO from '@modules/commentReports/dtos/ICreateCommentReportDTO';
import ICommentReportsRepository from '@modules/commentReports/repositories/ICommentReportsRepository';

class CommentReportsRepository implements ICommentReportsRepository {
  private odmRepository: MongoRepository<CommentReport>;

  constructor() {
    this.odmRepository = getMongoRepository(CommentReport);
  }

  public async create({
    body,
    comment_id,
    title,
    user_id,
  }: ICreateCommentReportDTO): Promise<CommentReport> {
    const report = this.odmRepository.create({
      body,
      comment_id,
      title,
      user_id,
      closed: false,
    });
    await this.odmRepository.save(report);
    return report;
  }

  public async close(report: CommentReport): Promise<CommentReport> {
    // eslint-disable-next-line no-param-reassign
    report.closed = true;
    return this.odmRepository.save(report);
  }

  public async findById(id: string): Promise<CommentReport | undefined> {
    const report = await this.odmRepository.findOne(id);
    return report;
  }

  public async findByUserId(id: string): Promise<CommentReport[]> {
    const user_id = new ObjectId(id);
    const reports = await this.odmRepository.find({
      where: {
        user_id,
      },
    });
    return reports;
  }

  public async findOpenReports(): Promise<CommentReport[]> {
    const reports = await this.odmRepository.find({
      where: {
        closed: false,
      },
    });
    return reports;
  }
}
export default CommentReportsRepository;
