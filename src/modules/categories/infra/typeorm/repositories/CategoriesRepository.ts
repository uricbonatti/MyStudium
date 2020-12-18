import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import { MongoRepository, getMongoRepository } from 'typeorm';
import Category from '../schemas/Category';

class CategoriesRepository implements ICategoriesRepository {
  private odmRepository: MongoRepository<Category>;

  constructor() {
    this.odmRepository = getMongoRepository(Category);
  }

  public async findByName({
    name,
  }: ICreateCategoryDTO): Promise<Category | undefined> {
    const category = await this.odmRepository.findOne({ name });
    return category;
  }

  public async create({ name }: ICreateCategoryDTO): Promise<Category> {
    const category = this.odmRepository.create({ name });

    await this.odmRepository.save(category);

    return category;
  }

  public async findById(category_id: string): Promise<Category | undefined> {
    const category = await this.odmRepository.findOne(category_id);
    return category;
  }

  public async findAll(): Promise<Category[]> {
    const categories = await this.odmRepository.find();
    return categories;
  }

  public async delete(category_id: string): Promise<void> {
    await this.odmRepository.delete(category_id);
  }
}
export default CategoriesRepository;
