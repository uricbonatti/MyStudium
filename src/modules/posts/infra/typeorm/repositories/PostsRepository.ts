import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import { MongoRepository, getMongoRepository, Like, MoreThan } from 'typeorm';
import { ObjectId } from 'mongodb';
import IPostLikeDTO from '@modules/posts/dtos/IPostLikeDTO';

import Post from '../schemas/Post';
import { ApolloError } from 'apollo-server';
import PostLikes from '../schemas/PostLikes';

class PostsRepository implements IPostsRepository {
  private odmRepository: MongoRepository<Post>;
  private odmLikeRepository: MongoRepository<PostLikes>;

  constructor() {
    this.odmRepository = getMongoRepository(Post);
    this.odmLikeRepository = getMongoRepository(PostLikes);
  }

  public async countPostsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    try {
      const postLiked = await this.odmLikeRepository.count({
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
    resume,
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
        resume,
        image_url: image_url,
        slug,
        category,
        tags,
        users_liked: [],
      });
      await this.odmRepository.save(post);
      const users_liked = this.odmLikeRepository.create({
        users_liked: [],
        post_id: post.id,
      });
      await this.odmLikeRepository.save(users_liked);
      return post;
    } catch (err) {
      console.log(err);
      throw new ApolloError('Database Timeout');
    }
  }

  public async save(post: Post): Promise<Post> {
    try {
      return this.odmRepository.save(post);
    } catch (err) {
      console.log(err);
      throw new ApolloError('Database Timeout');
    }
  }

  public async delete(post_id: string): Promise<void> {
    try {
      await this.odmRepository.delete(post_id);
      await this.odmLikeRepository.findOneAndDelete({
        where: { post_id: new ObjectId(post_id) },
      });
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async findByID(post_id: string): Promise<Post | undefined> {
    try {
      const [post, likes] = await Promise.all([
        this.odmRepository.findOne(post_id),
        this.odmLikeRepository.findOne({
          where: { post_id: new ObjectId(post_id) },
        }),
      ]);
      if (!post || !likes) {
        return undefined;
      }
      post.users_liked = likes.users_liked;

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
        where: {
          title: new RegExp(`${title}`),
        },
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

  public async like({ post_id, user_id }: IPostLikeDTO): Promise<number> {
    try {
      const findPost = await this.odmLikeRepository.findOne({ post_id });

      if (findPost) {
        let usersLikedString = findPost.users_liked.map(liked =>
          liked.toHexString(),
        );
        const index = usersLikedString.indexOf(user_id.toHexString());

        if (index >= 0) {
          if (usersLikedString.length === 1) {
            usersLikedString = [];
          } else {
            usersLikedString = [...usersLikedString.slice(index, 1)];
          }
        } else {
          usersLikedString.push(user_id.toHexString());
        }
        findPost.users_liked = [
          ...usersLikedString.map(user => new ObjectId(user)),
        ];
        await this.odmLikeRepository.save(findPost);
        return findPost.users_liked.length;
      }
      return 0;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }

  public async getLikes(post_id: ObjectId): Promise<PostLikes> {
    try {
      const postLikes = await this.odmLikeRepository.findOne({
        where: { post_id },
      });
      if (!postLikes) {
        throw new ApolloError('Database Timeout');
      }
      return postLikes;
    } catch (err) {
      throw new ApolloError('Database Timeout');
    }
  }
}

export default PostsRepository;
