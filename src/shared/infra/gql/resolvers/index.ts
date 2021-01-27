import ScalarResolver from './ScalarResolver';

import { UserMutation, UserQuery } from '@modules/users/infra/gql/resolvers';
import { PostMutations, PostQuerys } from '@modules/posts/infra/gql/resolvers';
import {
  CategoriesQuerys,
  CategoriesMutations,
} from '@modules/categories/infra/gql/resolvers';
import { TagsMutations, TagsQuerys } from '@modules/tags/infra/gql/resolvers';
import {
  CommentsMutations,
  CommentsQuerys,
} from '@modules/comments/infra/gql/resolvers';

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
  ...ScalarResolver,
  Query,
  Mutation,
};
