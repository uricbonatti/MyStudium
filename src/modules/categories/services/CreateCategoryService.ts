import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import ICategoriesRepository from '../repositories/ICategoriesRepository';
import Category from '../infra/typeorm/schemas/Category';

interface ICreateCategory {
  name: string;
  user_id: string;
}

@injectable()
class CreateCategoryService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({ name, user_id }: ICreateCategory): Promise<Category> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', '400');
    }
    const checkCategoryExists = await this.categoriesRepository.findByName({
      name,
    });
    if (checkCategoryExists) {
      throw new ApolloError('Category already exist', '400');
    }
    return this.categoriesRepository.create({ name });
  }
}
export default CreateCategoryService;
