import FakeCategoriesRepository from '../repositories/fakes/FakeCategoriesRepository';
import ListCategoriesService from './ListCategoriesService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let listCategoriesService: ListCategoriesService;

describe('List Categories', () => {
  beforeEach(async () => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    listCategoriesService = new ListCategoriesService(fakeCategoriesRepository);
  });
  it('should be able to list categories', async () => {
    const category1 = await fakeCategoriesRepository.create({
      name: 'Jest Test',
    });
    const category2 = await fakeCategoriesRepository.create({
      name: 'Jest Test2',
    });
    const category3 = await fakeCategoriesRepository.create({
      name: 'Jest Test3',
    });
    const categories = await listCategoriesService.execute();
    expect(categories).toEqual([category1, category2, category3]);
  });
});
