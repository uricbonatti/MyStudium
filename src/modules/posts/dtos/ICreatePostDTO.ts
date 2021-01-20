import Tag from '@modules/tags/infra/typeorm/schemas/Tag'
import User from '@modules/users/infra/typeorm/schemas/User'
import Category from '@modules/categories/infra/typeorm/schemas/Category'

export default interface ICreatePostDTO {
  author: User;
  title: string;
  image_url: string;
  body: string;
  slug?: string;
  category: Category;
  tags: Tag[];
}

export interface JustUPdate {
  id: string;
}
