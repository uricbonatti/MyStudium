import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import FakeCategoriesRepository from '@modules/categories/repositories/fakes/FakeCategoriesRepository';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import FakeTagsRepository from '../repositories/fakes/FakeTagsRepository';
import SearchTagsService from './SearchTagsService';
import Tag from '../infra/typeorm/schemas/Tag';

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeTagsRepository: FakeTagsRepository;
let searchTagsService: SearchTagsService;
let category1: Category;
let category2: Category;
let tag1: Tag;
let tag2: Tag;
let tag3: Tag;

describe('List Tags', () => {
  beforeEach(async () => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeTagsRepository = new FakeTagsRepository();
    searchTagsService = new SearchTagsService(fakeTagsRepository);
    category1 = await fakeCategoriesRepository.create({
      name: 'Categoria 1',
    });
    category2 = await fakeCategoriesRepository.create({
      name: 'Categoria 2',
    });
    tag1 = await fakeTagsRepository.create({
      category: category1,
      name: 'Tag 1',
    });
    tag2 = await fakeTagsRepository.create({
      category: category2,
      name: 'Tag 2',
    });
    tag3 = await fakeTagsRepository.create({
      category: category1,
      name: 'Tag 3',
    });
  });
  it('should be able to list all tags', async () => {
    const tags = await searchTagsService.execute({});
    expect(tags).toEqual([tag1, tag2, tag3]);
  });
  it('should be able to list all tags by category', async () => {
    const tags = await searchTagsService.execute({
      category_id: category1.id.toHexString(),
    });
    expect(tags).toEqual([tag1, tag3]);
  });

  it('should not be able to list all tags by non-existing category', async () => {
    await expect(
      searchTagsService.execute({
        category_id: new ObjectId().toHexString(),
      }),
    ).resolves.toEqual([]);
  });
});
