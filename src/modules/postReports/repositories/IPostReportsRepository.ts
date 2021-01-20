import ICreatePostReportDTO from '../dtos/ICreatePostReportDTO'
import PostReport from '../infra/typeorm/schemas/PostReport'

export default interface IPostReportsRepository {
  create(data: ICreatePostReportDTO): Promise<PostReport>;
  close(report: PostReport): Promise<PostReport>;
  findById(id: string): Promise<PostReport | undefined>;
  findByUserId(id: string): Promise<PostReport[]>;
  findOpenReports(): Promise<PostReport[]>;
}
