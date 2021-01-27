import { container } from 'tsyringe';
import CreateCategoryService from '@modules/categories/services/CreateCategoryService';
import ListCategoriesService from '@modules/categories/services/ListCategoriesService';
import { IContext } from '@shared/utils/interfaces';
import verifyToken from '@shared/utils/tokenValidation';

interface ICreateCategory {
  data: {
    name: string;
  };
}

export async function createCategory(
  _: any,
  { data }: ICreateCategory,
  { token }: IContext,
) {
  const user_id = verifyToken(token);
  const { name } = data;
  const createCategoryService = container.resolve(CreateCategoryService);
  const category = await createCategoryService.execute({ name, user_id });
  return category;
}

export async function listCategories() {
  const listCategoriesService = container.resolve(ListCategoriesService);
  const categories = await listCategoriesService.execute();
  return categories;
}
