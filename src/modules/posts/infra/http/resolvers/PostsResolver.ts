import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import { IContext } from '@shared/utils/interfaces'
import verifyToken from '@shared/utils/tokenValidation'
import ShowPostService from '@modules/posts/services/ShowPostService'
import SearchPostService from '@modules/posts/services/SearchPostService'
import CreatePostService from '@modules/posts/services/CreatePostService'
import UpdatePostService from '@modules/posts/services/UpdatePostService'
import DeletePostService from '@modules/posts/services/DeletePostService'
import LikePostService from '@modules/posts/services/LikePostService'
import Post from '../../typeorm/schemas/Post'

interface IGetPost {
  id: string;
}
interface IPostFilter {
  category_id?: string;
  part_of_title?: string;
  author_id?: string;
}
interface ITagID {
  tag_id: string;
}
interface ILikePost {
  post_id: string;
}

interface ICreatePost {
  data: {
    body: string;
    category_id: string;
    image_url: string;
    tag_ids: ITagID[];
    title: string;
  };
}

interface IUpdatePost {
  post_id: string;
  body?: string;
  category_id?: string;
  image_url?: string;
  tag_ids?: ITagID[];
  title?: string;
}

export async function getPost (_, { id }: IGetPost): Promise<Post> {
  const showPostService = container.resolve(ShowPostService)
  const post = await showPostService.execute({ post_id: id })

  return classToClass(post)
}

export async function listPosts (
  _,
  { author_id, category_id, part_of_title }: IPostFilter
): Promise<Post[]> {
  const searchPostService = container.resolve(SearchPostService)
  const posts = await searchPostService.execute({
    author_id,
    category_id,
    title: part_of_title
  })
  return posts
}

export async function createPost (
  _,
  { data }: ICreatePost,
  { token }: IContext
): Promise<Post> {
  const {
    title, body, category_id, image_url, tag_ids
  } = data
  const createPostService = container.resolve(CreatePostService)
  const author_id = verifyToken(token)
  const post = await createPostService.execute({
    author_id,
    body,
    category_id,
    image_url,
    tag_ids,
    title
  })
  return classToClass(post)
}

export async function updatePost (
  _,
  {
    post_id, body, category_id, image_url, tag_ids, title
  }: IUpdatePost,
  { token }: IContext
): Promise<Post> {
  const updatePostService = container.resolve(UpdatePostService)
  const user_id = verifyToken(token)
  const post = await updatePostService.execute({
    post_id,
    body,
    image_url,
    tag_ids,
    title,
    user_id
  })
  return classToClass(post)
}

export async function deletePost (
  _,
  { id }: IGetPost,
  { token }: IContext
): Promise<string> {
  const deletePostService = container.resolve(DeletePostService)
  const user_id = verifyToken(token)
  const post = await deletePostService.execute({ post_id: id, user_id })
  return post.id.toString()
}

export async function likePost (
  _,
  { post_id }: ILikePost,
  { token }: IContext
): Promise<number> {
  const user_id = verifyToken(token)
  const likePostService = container.resolve(LikePostService)
  const likes = await likePostService.execute({ user_id, post_id })
  return likes
}
