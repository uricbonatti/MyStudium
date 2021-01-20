import { ApolloError } from 'apollo-server'
import { inject, injectable } from 'tsyringe'
import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository'
import { FullTag } from '@shared/utils/interfaces'
import Tag from '../infra/typeorm/schemas/Tag'
import ITagsRepository from '../repositories/ITagsRepository'

interface ISearchTag {
  category_id?: string;
}

@injectable()
class SearchTagsService {
  constructor (
    @inject('TagsRepository')
    private tagsRepository: ITagsRepository
  ) {}

  public async execute ({ category_id }: ISearchTag): Promise<Tag[]> {
    let tags: Tag[] = []
    if (!category_id || category_id.length === 0) {
      tags = await this.tagsRepository.findAll()
    }
    if (category_id && category_id.length > 0) {
      tags = await this.tagsRepository.findByCategory(category_id)
    }
    return tags
  }
}

export default SearchTagsService
