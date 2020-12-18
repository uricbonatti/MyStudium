import { ObjectId } from 'mongodb';

import ICreateTagDTO from '@modules/tags/dtos/ICreateTagDTO';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import { MongoRepository, getMongoRepository } from 'typeorm';
import Tag from '../schemas/Tag';

class TagsRepository implements ITagsRepository {
  private odmRepository: MongoRepository<Tag>;

  constructor() {
    this.odmRepository = getMongoRepository(Tag);
  }

  public async create({ name, category }: ICreateTagDTO): Promise<Tag> {
    const tag = this.odmRepository.create({
      name,
      category,
    });

    await this.odmRepository.save(tag);
    return tag;
  }

  public async findById(tag_id: string): Promise<Tag | undefined> {
    const tag = await this.odmRepository.findOne(tag_id);
    return tag;
  }

  public async findByCategory(category_id: string): Promise<Tag[]> {
    const tags = await this.odmRepository.find({
      where: {
        'category.id': ObjectId.createFromHexString(category_id),
      },
    });
    return tags;
  }

  public async findByName(name: string): Promise<Tag | undefined> {
    const tag = await this.odmRepository.findOne({ name });
    return tag;
  }

  public async findAll(): Promise<Tag[]> {
    const tags = await this.odmRepository.find();
    return tags;
  }

  public async delete(tag_id: string): Promise<void> {
    await this.odmRepository.delete(tag_id);
  }
}
export default TagsRepository;
