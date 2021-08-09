import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import { ApolloError } from 'apollo-server';
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
    return this.odmRepository.findOne({ name });
  }

  public async create({ name }: ICreateCategoryDTO): Promise<Category> {
    try {
      const category = this.odmRepository.create({ name });

      await this.odmRepository.save(category);

      return category;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findById(category_id: string): Promise<Category | undefined> {
    return this.odmRepository.findOne(category_id);
  }

  public async findAll(): Promise<Category[]> {
    return this.odmRepository.find();
  }

  public async delete(category_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(category_id);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}
export default CategoriesRepository;
