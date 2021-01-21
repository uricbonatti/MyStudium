import ICreatePostReportDTO from '@modules/postReports/dtos/ICreatePostReportDTO';
import IPostReportsRepository from '@modules/postReports/repositories/IPostReportsRepository';
import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import { MongoRepository, getMongoRepository } from 'typeorm';
import PostReport from '../schemas/PostReport';

class PostReportsRepository implements IPostReportsRepository {
  private odmRepository: MongoRepository<PostReport>;

  constructor() {
    this.odmRepository = getMongoRepository(PostReport);
  }

  public async create({
    body,
    post_id,
    title,
    user_id,
  }: ICreatePostReportDTO): Promise<PostReport> {
    try {
      const report = this.odmRepository.create({
        body,
        post_id,
        title,
        user_id,
        closed: false,
      });
      await this.odmRepository.save(report);
      return report;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async close(report: PostReport): Promise<PostReport> {
    try {
      // eslint-disable-next-line no-param-reassign
      report.closed = true;
      return this.odmRepository.save(report);
    } catch {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findById(id: string): Promise<PostReport | undefined> {
    try {
      const report = await this.odmRepository.findOne(id);
      return report;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByUserId(id: string): Promise<PostReport[]> {
    try {
      const user_id = new ObjectId(id);
      const reports = await this.odmRepository.find({
        where: {
          user_id,
        },
      });
      return reports;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findOpenReports(): Promise<PostReport[]> {
    try {
      const reports = await this.odmRepository.find({
        where: {
          closed: false,
        },
      });
      return reports;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}
export default PostReportsRepository;
