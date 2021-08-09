import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import { MongoRepository, getMongoRepository, MoreThan } from 'typeorm';
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
    return this.odmLikeRepository.count({
      where: {
        users_liked: [liker_id],
        created_at: MoreThan(limitDate),
      },
    });
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
  }

  public async save(post: Post): Promise<Post> {
    return this.odmRepository.save(post);
  }

  public async delete(post_id: string): Promise<void> {
    await this.odmRepository.delete(post_id);
    await this.odmLikeRepository.findOneAndDelete({
      where: { post_id: new ObjectId(post_id) },
    });
  }

  public async findByID(post_id: string): Promise<Post | undefined> {
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
  }

  public async findAll(): Promise<Post[]> {
    return this.odmRepository.find();
  }

  public async findByTitle(title: string): Promise<Post[]> {
    return this.odmRepository.find({
      where: {
        title: new RegExp(`${title}`),
      },
    });
  }

  public async findBySlug(slug: string): Promise<Post[]> {
    return this.odmRepository.find({
      slug,
    });
  }

  public async findByAuthor(author_id: ObjectId): Promise<Post[]> {
    return this.odmRepository.find({
      where: {
        'author.id': author_id,
      },
    });
  }

  public async findByCategory(category_id: ObjectId): Promise<Post[]> {
    return this.odmRepository.find({
      where: {
        'category.id': category_id,
      },
    });
  }

  public async like({ post_id, user_id }: IPostLikeDTO): Promise<number> {
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
  }

  public async getLikes(post_id: ObjectId): Promise<PostLikes> {
    const postLikes = await this.odmLikeRepository.findOne({
      where: { post_id },
    });
    if (!postLikes) {
      throw new ApolloError("Post Likes can't be found");
    }
    return postLikes;
  }
}

export default PostsRepository;
