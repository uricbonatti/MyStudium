import { inject, injectable } from 'tsyringe';
import Category from '../infra/typeorm/schemas/Category';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

@injectable()
class ListCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }
}
export default ListCategoriesService;
