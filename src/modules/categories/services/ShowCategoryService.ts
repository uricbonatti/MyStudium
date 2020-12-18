import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import Category from '../infra/typeorm/schemas/Category';
import ICategoriesRepository from '../repositories/ICategoriesRepository';

@injectable()
class ShowCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute(category_id: string): Promise<Category> {
    if (ObjectId.isValid(category_id)) {
      const category = await this.categoriesRepository.findById(category_id);
      if (category) {
        return category;
      }
      throw new ApolloError('Category dont exist', '400');
    }
    throw new ApolloError('Category ID is not valid', '400');
  }
}
export default ShowCategoryService;
