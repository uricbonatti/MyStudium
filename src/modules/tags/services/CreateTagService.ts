import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository';
import ITagsRepository from '../repositories/ITagsRepository';
import Tag from '../infra/typeorm/schemas/Tag';

interface ICreateTag {
  user_id: string;
  category_id: string;
  name: string;
}

@injectable()
class CreateTagService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({
    name,
    category_id,
    user_id,
  }: ICreateTag): Promise<Tag> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }

    const category = await this.categoriesRepository.findById(category_id);
    if (!category) {
      throw new ApolloError('Category not found', '400');
    }
    const checkTagExist = await this.tagsRepository.findByName(name);
    if (checkTagExist) {
      throw new ApolloError('This Tag already exist');
    }
    return this.tagsRepository.create({
      category,
      name,
    });
  }
}
export default CreateTagService;
