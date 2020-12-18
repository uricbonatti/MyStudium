import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import ShowCategoryService from './ShowCategoryService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let showCategoryService: ShowCategoryService;

describe('List Categories', () => {
  beforeEach(async () => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    showCategoryService = new ShowCategoryService(fakeCategoriesRepository);
  });
  it('should be able to show a requested category', async () => {
    const category1 = await fakeCategoriesRepository.create({
      name: 'Jest Test',
    });

    const category = await showCategoryService.execute(
      category1.id.toHexString(),
    );
    expect(category).toEqual(category1);
  });

  it('should not be able to show a non-valid category', async () => {
    await expect(
      showCategoryService.execute('non-valid'),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to show a non-existing category', async () => {
    await expect(
      showCategoryService.execute(new ObjectId().toHexString()),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
