import { inject, injectable } from 'tsyringe'
import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'

import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository'
import ITagsRepository from '../repositories/ITagsRepository'
import Tag from '../infra/typeorm/schemas/Tag'

@injectable()
class ShowTagService {
  constructor (
    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  public async execute (tag_id: string): Promise<Tag> {
    if (ObjectId.isValid(tag_id)) {
      const tag = await this.tagsRepository.findById(tag_id)
      if (tag) {
        return tag
      }
      throw new ApolloError('Tag dont exist', '400')
    }
    throw new ApolloError('Tag ID is not valid', '400')
  }
}
export default ShowTagService
