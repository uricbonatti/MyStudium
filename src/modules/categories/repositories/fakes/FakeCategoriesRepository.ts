import { ObjectId } from 'mongodb'

import ICreateCategoryDTO from '@modules/categories/dtos/ICreateCategoryDTO'
import Category from '@modules/categories/infra/typeorm/schemas/Category'
import ICategoriesRepository from '../ICategoriesRepository'

class FakeCategoriesRepository implements ICategoriesRepository {
  private categories: Category[] = [];

  public async create ({ name }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category()
    Object.assign(category, {
      id: new ObjectId(),
      name
    })
    this.categories.push(category)
    return category
  }

  public async findById (category_id: string): Promise<Category | undefined> {
    const findCategory = this.categories.find(
      (category) => category.id.toHexString() === category_id
    )
    return findCategory
  }

  public async findAll (): Promise<Category[]> {
    return this.categories
  }

  public async delete (category_id: string): Promise<void> {
    const findIndex = this.categories.findIndex(
      (category) => category.id.toHexString() === category_id
    )
    this.categories = [...this.categories.slice(findIndex, 1)]
  }

  public async findByName ({
    name
  }: ICreateCategoryDTO): Promise<Category | undefined> {
    const findCategory = this.categories.find(
      (category) => category.name === name
    )
    return findCategory
  }
}
export default FakeCategoriesRepository
