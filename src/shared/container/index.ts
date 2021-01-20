import { container } from 'tsyringe'

import '@modules/users/providers'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository'

import IPostsRepository from '@modules/posts/repositories/IPostsRepository'
import PostsRepository from '@modules/posts/infra/typeorm/repositories/PostsRepository'

import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository'
import CommentsRepository from '@modules/comments/infra/typeorm/repositories/CommentsRepository'

import ICategoriesRepository from '@modules/categories/repositories/ICategoriesRepository'
import CategoriesRepository from '@modules/categories/infra/typeorm/repositories/CategoriesRepository'

import ITagsRepository from '@modules/tags/repositories/ITagsRepository'
import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository'

import IPostReportsRepository from '@modules/postReports/repositories/IPostReportsRepository'
import PostReportsRepository from '@modules/postReports/infra/typeorm/repositories/PostReportsRepository'

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository
)

container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository
)

container.registerSingleton<ITagsRepository>('TagsRepository', TagsRepository)

container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  PostsRepository
)

container.registerSingleton<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository
)

container.registerSingleton<IPostReportsRepository>(
  'PostReportsRepository',
  PostReportsRepository
)
