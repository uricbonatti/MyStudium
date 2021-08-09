import { container } from 'tsyringe';
import { IContext } from '@shared/utils/interfaces';
import verifyToken from '@shared/utils/tokenValidation';

import CreateTagService from '@modules/tags/services/CreateTagService';
import SearchTagsService from '@modules/tags/services/SearchTagsService';
import ShowTagService from '@modules/tags/services/ShowTagService';
import Tag from '../../typeorm/schemas/Tag';

interface ICreateTag {
  data: {
    name: string;
    category_id: string;
  };
}

interface IFilterTag {
  filter: {
    category_id?: string;
  };
}
interface ID {
  id: string;
}

export async function listTags(_: any, { filter }: IFilterTag): Promise<Tag[]> {
  const { category_id } = filter;
  const searchTagsService = container.resolve(SearchTagsService);
  return searchTagsService.execute({ category_id });
}

export async function createTag(
  _: any,
  { data }: ICreateTag,
  { token }: IContext,
): Promise<Tag> {
  const { category_id, name } = data;
  const user_id = verifyToken(token);
  const createTagService = container.resolve(CreateTagService);
  return createTagService.execute({
    user_id,
    name,
    category_id,
  });
}

export async function getTag(_: any, { id }: ID): Promise<Tag> {
  const showTagService = container.resolve(ShowTagService);
  return showTagService.execute(id);
}
