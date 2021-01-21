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
    try {
      const category = await this.odmRepository.findOne({ name });
      return category;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
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
    try {
      const category = await this.odmRepository.findOne(category_id);
      return category;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findAll(): Promise<Category[]> {
    try {
      const categories = await this.odmRepository.find();
      return categories;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
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
