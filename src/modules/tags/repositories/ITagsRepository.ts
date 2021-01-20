import ICreateTagDTO from '../dtos/ICreateTagDTO'
import Tag from '../infra/typeorm/schemas/Tag'

export default interface ITagsRepository {
  create(data: ICreateTagDTO): Promise<Tag>;
  findById(tag_id: string): Promise<Tag | undefined>;
  findByCategory(category_id: string): Promise<Tag[]>;
  findByName(name: string): Promise<Tag | undefined>;
  findAll(): Promise<Tag[]>;
  delete(tag_id: string): Promise<void>;
}
