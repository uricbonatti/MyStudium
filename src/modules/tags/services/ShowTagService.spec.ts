import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import FakeCategoriesRepository from '@modules/categories/repositories/fakes/FakeCategoriesRepository';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import FakeTagsRepository from '../repositories/fakes/FakeTagsRepository';
import ShowTagService from './ShowTagService';

let fakeTagsRepository: FakeTagsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let showTagService: ShowTagService;
let cat: Category;

describe('List Tags', () => {
  beforeEach(async () => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();
    showTagService = new ShowTagService(
      fakeTagsRepository,
      fakeCategoriesRepository,
    );
    cat = await fakeCategoriesRepository.create({ name: 'Teste' });
  });

  it('should be able to show a requested Tag', async () => {
    const tag_aux = await fakeTagsRepository.create({
      category: cat,
      name: 'Jest Test',
    });

    const tag = await showTagService.execute(tag_aux.id.toHexString());
    expect(tag).toEqual(tag_aux);
  });

  it('should not be able to show a non-valid Tag', async () => {
    await expect(showTagService.execute('non-valid')).rejects.toBeInstanceOf(
      ApolloError,
    );
  });

  it('should not be able to show a non-existing Tag', async () => {
    await expect(
      showTagService.execute(new ObjectId().toHexString()),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
