import Category from '../infra/typeorm/schemas/Category';
import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';

export default interface ICategoriesRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findById(category_id: string): Promise<Category | undefined>;
  findAll(): Promise<Category[]>;
  delete(category_id: string): Promise<void>;
  findByName(data: ICreateCategoryDTO): Promise<Category | undefined>;
}
