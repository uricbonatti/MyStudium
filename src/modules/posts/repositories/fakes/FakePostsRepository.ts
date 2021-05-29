import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostLikeDTO from '@modules/posts/dtos/IPostLikeDTO';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import { ObjectId } from 'mongodb';
import removeAccents from 'remove-accents';
import { isAfter } from 'date-fns';
import IPostsRepository from '../IPostsRepository';
import PostLikes from '@modules/posts/infra/typeorm/schemas/PostLikes';

class FakePostsRepository implements IPostsRepository {
  private posts: Post[] = [];
  private postLikes: PostLikes[] = [];

  public async create({ title, ...rest }: ICreatePostDTO): Promise<Post> {
    const post = new Post();
    const postLike = new PostLikes();

    Object.assign(
      post,
      {
        id: new ObjectId(),
        title,
        slug: removeAccents(title).toLowerCase().replace(/\s/g, '-'),
        created_at: new Date(),
      },
      rest,
    );
    this.posts.push(post);

    Object.assign(postLike, {
      id: new ObjectId(),
      post_id: post.id,
      users_liked: [],
      created_at: postLike.created_at,
    });
    this.postLikes.push(postLike);

    return post;
  }

  public async save(post: Post): Promise<Post> {
    const findIndex = this.posts.findIndex(findPost =>
      findPost.id.equals(post.id),
    );
    this.posts[findIndex] = post;
    return post;
  }

  public async delete(post_id: string): Promise<void> {
    const findIndex = this.posts.findIndex(
      post => post.id.toHexString() === post_id,
    );
    if (this.posts.length > 1) {
      this.posts = [...this.posts.slice(findIndex, 1)];
    } else {
      this.posts = [];
    }
  }
  public async getLikes(post_id: ObjectId): Promise<PostLikes | undefined> {
    const likes = this.postLikes.find(postLike =>
      postLike.post_id.equals(post_id),
    );
    return likes;
  }
  public async findByID(post_id: string): Promise<Post | undefined> {
    const findPost = this.posts.find(post => post.id.toHexString() === post_id);
    if (!findPost) {
      return findPost;
    }
    const findLikes = await this.getLikes(findPost.id);
    findPost.users_liked = findLikes?.users_liked
      ? [...findLikes.users_liked]
      : [];
    return findPost;
  }

  public async findAll(): Promise<Post[]> {
    return this.posts;
  }

  public async findByTitle(title: string): Promise<Post[]> {
    const findPosts = this.posts.filter(post => post.title.indexOf(title) > -1);

    return findPosts;
  }

  public async findByAuthor(author_id: ObjectId): Promise<Post[]> {
    const findPosts = this.posts.filter(post =>
      post.author.id.equals(author_id),
    );
    return findPosts;
  }

  public async findByCategory(category_id: ObjectId): Promise<Post[]> {
    const findPosts = this.posts.filter(post =>
      category_id.equals(post.category.id),
    );
    return findPosts;
  }

  public async findBySlug(slug: string): Promise<Post[]> {
    const findPosts: Post[] = [];
    this.posts.forEach(post => {
      if (String(post.slug) === String(slug)) {
        findPosts.push(post);
      }
    });

    return findPosts;
  }

  public async like({ user_id, post_id }: IPostLikeDTO): Promise<number> {
    const findIndex = this.postLikes.findIndex(
      pLikes => post_id.toHexString() === pLikes.post_id.toHexString(),
    );
    if (findIndex >= 0) {
      const likesStored = this.postLikes[findIndex].users_liked;

      const userLikeIndex = likesStored.findIndex(user_like =>
        user_id.equals(user_like),
      );

      if (userLikeIndex >= 0) {
        if (this.postLikes[findIndex].users_liked.length === 1) {
          this.postLikes[findIndex].users_liked = [];
        } else {
          this.postLikes[findIndex].users_liked = [
            ...likesStored.slice(userLikeIndex, 1),
          ];
        }
      } else {
        this.postLikes[findIndex].users_liked.push(user_id);
      }
      return this.postLikes[findIndex].users_liked.length;
    }
    return 0;
  }

  public async countPostsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    const postIsLiked = await this.postLikes.map(
      post =>
        post.users_liked.includes(liker_id) &&
        isAfter(post.created_at, limitDate),
    );
    return postIsLiked.filter(liked => liked).length;
  }
}

export default FakePostsRepository;
