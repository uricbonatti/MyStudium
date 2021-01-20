import { ObjectId } from 'mongodb';

import ICreatePostDTO from '../dtos/ICreatePostDTO';
import IPostLikeDTO from '../dtos/IPostLikeDTO';
import Post from '../infra/typeorm/schemas/Post';

export default interface IPostsRepository {
  create(data: ICreatePostDTO): Promise<Post>;
  delete(post_id: string): Promise<void>;
  save(post: Post): Promise<Post>;

  findByID(post_id: string): Promise<Post | undefined>;
  findAll(): Promise<Post[]>;
  findByTitle(title: string): Promise<Post[]>;
  findByAuthor(author_id: ObjectId): Promise<Post[]>;
  findByCategory(category_id: ObjectId): Promise<Post[]>;
  findBySlug(slug: string): Promise<Post[]>;
  countPostsLikedByUser(liker_id: ObjectId, limitDate: Date): Promise<number>;

  isLiked(data: IPostLikeDTO): Promise<boolean>;
  like(data: IPostLikeDTO): Promise<number>;
  likesNumber(post_id: ObjectId): Promise<number>;
}
