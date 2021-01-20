import ICreateTagDTO from '@modules/tags/dtos/ICreateTagDTO';
import Tag from '@modules/tags/infra/typeorm/schemas/Tag';
import { ObjectId } from 'mongodb';
import ITagsRepository from '../ITagsRepository';

class FakeTagsRepository implements ITagsRepository {
  private tags: Tag[] = [];

  public async create({ name, category }: ICreateTagDTO): Promise<Tag> {
    const tag = new Tag();
    Object.assign(tag, {
      id: new ObjectId(),
      name,
      category,
    });
    this.tags.push(tag);
    return tag;
  }

  public async findById(tag_id: string): Promise<Tag | undefined> {
    const findTag = this.tags.find(tag => tag.id.toHexString() === tag_id);
    return findTag;
  }

  public async findByCategory(category_id: string): Promise<Tag[]> {
    const findTags = this.tags.filter(
      tag => tag.category.id.toHexString() === category_id,
    );
    return findTags;
  }

  public async findByName(name: string): Promise<Tag | undefined> {
    const findTag = this.tags.find(tag => tag.name === name);
    return findTag;
  }

  public async findAll(): Promise<Tag[]> {
    return this.tags;
  }

  public async delete(tag_id: string): Promise<void> {
    const findIndex = this.tags.findIndex(
      tag => tag.id.toHexString() === tag_id,
    );
    this.tags = [...this.tags.slice(findIndex, 1)];
  }
}
export default FakeTagsRepository;
