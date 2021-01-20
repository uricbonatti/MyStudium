import Category from '@modules/categories/infra/typeorm/schemas/Category';

export default interface ICreateTagDTO {
  name: string;
  category: Category;
}
