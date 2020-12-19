import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import { MongoRepository, getMongoRepository, Like, MoreThan } from 'typeorm';
import { ObjectId } from 'mongodb';
import IPostLikeDTO from '@modules/posts/dtos/IPostLikeDTO';

import Post from '../schemas/Post';

class PostsRepository implements IPostsRepository {
  private odmRepository: MongoRepository<Post>;

  constructor() {
    this.odmRepository = getMongoRepository(Post);
  }

  public async countPostsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    const postLiked = await this.odmRepository.count({
      where: {
        users_liked: [liker_id],
        created_at: MoreThan(limitDate),
      },
    });
    return postLiked;
  }

  public async create({
    author,
    title,
    body,
    category,
    image_url,
    slug,
    tags,
  }: ICreatePostDTO): Promise<Post> {
    const post = this.odmRepository.create({
      author: {
        id: author.id,
        name: author.name,
        avatar_url: author.avatar_url,
      },
      body,
      title,
      image_url,
      slug,
      category,
      tags,
    });
    await this.odmRepository.save(post);
    return post;
  }

  public async save(post: Post): Promise<Post> {
    return this.odmRepository.save(post);
  }

  public async delete(post_id: string): Promise<void> {
    await this.odmRepository.delete(post_id);
  }

  public async findByID(post_id: string): Promise<Post | undefined> {
    const post = await this.odmRepository.findOne(post_id);
    return post;
  }

  public async findAll(): Promise<Post[]> {
    const posts = await this.odmRepository.find();
    return posts;
  }

  public async findByTitle(title: string): Promise<Post[]> {
    const posts = await this.odmRepository.find({
      where: { title: Like(`%${title}%`) },
    });
    return posts;
  }

  public async findBySlug(slug: string): Promise<Post[]> {
    const posts = await this.odmRepository.find({
      slug,
    });
    return posts;
  }

  public async findByAuthor(author_id: ObjectId): Promise<Post[]> {
    const posts = await this.odmRepository.find({
      where: {
        'author.id': author_id,
      },
    });
    return posts;
  }

  public async findByCategory(category_id: ObjectId): Promise<Post[]> {
    const posts = await this.odmRepository.find({
      where: {
        'category.id': category_id,
      },
    });
    return posts;
  }

  public async isLiked({ post_id, user_id }: IPostLikeDTO): Promise<boolean> {
    const findPost = await this.odmRepository.findOne(post_id.toHexString());
    if (findPost && findPost.users_liked.indexOf(user_id) >= 0) {
      return true;
    }
    return false;
  }

  public async like({ post_id, user_id }: IPostLikeDTO): Promise<number> {
    const findPost = await this.odmRepository.findOne(post_id.toHexString());

    if (findPost) {
      const index = findPost.users_liked.indexOf(user_id);
      if (index >= 0) {
        if (findPost.users_liked.length === 1) {
          findPost.users_liked = [];
        } else {
          findPost.users_liked = [...findPost.users_liked.slice(index, 1)];
        }
      } else {
        findPost.users_liked.push(user_id);
      }
      await this.odmRepository.save(findPost);
      return findPost.getLikes();
    }
    return 0;
  }

  public async likesNumber(post_id: ObjectId): Promise<number> {
    const postLikes = await this.odmRepository.findOne(post_id.toHexString());
    if (!postLikes) {
      return 0;
    }
    return postLikes.getLikes();
  }
}

export default PostsRepository;
