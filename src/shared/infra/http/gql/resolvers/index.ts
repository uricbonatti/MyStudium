import { UserMutation, UserQuery } from '@modules/users/infra/http/resolvers';
import { PostMutations, PostQuerys } from '@modules/posts/infra/http/resolvers';
import {
  CategoriesQuerys,
  CategoriesMutations,
} from '@modules/categories/infra/http/resolvers';
import { TagsMutations, TagsQuerys } from '@modules/tags/infra/http/resolvers';
import {
  CommentsMutations,
  CommentsQuerys,
} from '@modules/comments/infra/http/resolvers';

const Query = {
  ...UserQuery,
  ...PostQuerys,
  ...CommentsQuerys,
  ...CategoriesQuerys,
  ...TagsQuerys,
};
const Mutation = {
  ...UserMutation,
  ...PostMutations,
  ...CommentsMutations,
  ...CategoriesMutations,
  ...TagsMutations,
};

export default {
  Query,
  Mutation,
};
