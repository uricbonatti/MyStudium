import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import { MongoRepository, getMongoRepository, Like, MoreThan } from 'typeorm';
import { ObjectId } from 'mongodb';
import IPostLikeDTO from '@modules/posts/dtos/IPostLikeDTO';

import Post from '../schemas/Post';
import { ApolloError } from 'apollo-server';

class PostsRepository implements IPostsRepository {
  private odmRepository: MongoRepository<Post>;

  constructor() {
    this.odmRepository = getMongoRepository(Post);
  }

  public async countPostsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    try {
      const postLiked = await this.odmRepository.count({
        where: {
          users_liked: [liker_id],
          created_at: MoreThan(limitDate),
        },
      });
      return postLiked;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
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
    try {
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
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async save(post: Post): Promise<Post> {
    try {
      return this.odmRepository.save(post);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(post_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(post_id);
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByID(post_id: string): Promise<Post | undefined> {
    try {
      const post = await this.odmRepository.findOne(post_id);
      return post;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findAll(): Promise<Post[]> {
    try {
      const posts = await this.odmRepository.find();
      return posts;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByTitle(title: string): Promise<Post[]> {
    try {
      const posts = await this.odmRepository.find({
        where: { title: Like(`%${title}%`) },
      });
      return posts;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findBySlug(slug: string): Promise<Post[]> {
    try {
      const posts = await this.odmRepository.find({
        slug,
      });
      return posts;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByAuthor(author_id: ObjectId): Promise<Post[]> {
    try {
      const posts = await this.odmRepository.find({
        where: {
          'author.id': author_id,
        },
      });
      return posts;
    } catch {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByCategory(category_id: ObjectId): Promise<Post[]> {
    try {
      const posts = await this.odmRepository.find({
        where: {
          'category.id': category_id,
        },
      });
      return posts;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async isLiked({ post_id, user_id }: IPostLikeDTO): Promise<boolean> {
    try {
      const findPost = await this.odmRepository.findOne(post_id.toHexString());
      if (findPost && findPost.users_liked.indexOf(user_id) >= 0) {
        return true;
      }
      return false;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async like({ post_id, user_id }: IPostLikeDTO): Promise<number> {
    try {
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
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async likesNumber(post_id: ObjectId): Promise<number> {
    try {
      const postLikes = await this.odmRepository.findOne(post_id.toHexString());
      if (!postLikes) {
        return 0;
      }
      return postLikes.getLikes();
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}

export default PostsRepository;
