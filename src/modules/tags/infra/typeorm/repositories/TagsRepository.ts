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
    return this.odmRepository.findOne(tag_id);
  }

  public async findByCategory(category_id: string): Promise<Tag[]> {
    return this.odmRepository.find({
      where: {
        'category.id': ObjectId.createFromHexString(category_id),
      },
    });
  }

  public async findByName(name: string): Promise<Tag | undefined> {
    return this.odmRepository.findOne({ name });
  }

  public async findAll(): Promise<Tag[]> {
    return this.odmRepository.find();
  }

  public async delete(tag_id: string): Promise<void> {
    await this.odmRepository.delete(tag_id);
  }
}
export default TagsRepository;
