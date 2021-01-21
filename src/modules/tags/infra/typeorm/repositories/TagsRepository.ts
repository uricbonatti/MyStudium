import { ObjectId } from 'mongodb';

import ICreateTagDTO from '@modules/tags/dtos/ICreateTagDTO';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';
import { MongoRepository, getMongoRepository } from 'typeorm';
import Tag from '../schemas/Tag';
import { ApolloError } from 'apollo-server';

class TagsRepository implements ITagsRepository {
  private odmRepository: MongoRepository<Tag>;

  constructor() {
    this.odmRepository = getMongoRepository(Tag);
  }

  public async create({ name, category }: ICreateTagDTO): Promise<Tag> {
    try {
      const tag = this.odmRepository.create({
        name,
        category,
      });

      await this.odmRepository.save(tag);
      return tag;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findById(tag_id: string): Promise<Tag | undefined> {
    try {
      const tag = await this.odmRepository.findOne(tag_id);
      return tag;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByCategory(category_id: string): Promise<Tag[]> {
    try {
      const tags = await this.odmRepository.find({
        where: {
          'category.id': ObjectId.createFromHexString(category_id),
        },
      });
      return tags;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByName(name: string): Promise<Tag | undefined> {
    try {
      const tag = await this.odmRepository.findOne({ name });
      return tag;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findAll(): Promise<Tag[]> {
    try {
      const tags = await this.odmRepository.find();
      return tags;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(tag_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(tag_id);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}
export default TagsRepository;
