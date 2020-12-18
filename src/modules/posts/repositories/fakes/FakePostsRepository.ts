import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostLikeDTO from '@modules/posts/dtos/IPostLikeDTO';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import { ObjectId } from 'mongodb';
import removeAccents from 'remove-accents';
import { isAfter } from 'date-fns';
import IPostsRepository from '../IPostsRepository';

class FakePostsRepository implements IPostsRepository {
  private posts: Post[] = [];

  public async create({ title, ...rest }: ICreatePostDTO): Promise<Post> {
    const post = new Post();

    Object.assign(
      post,
      {
        id: new ObjectId(),
        title,
        slug: removeAccents(title).toLowerCase().replace(/\s/g, '-'),
        users_liked: [],
      },
      rest,
    );
    this.posts.push(post);

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

  public async findByID(post_id: string): Promise<Post | undefined> {
    const findPost = this.posts.find(post => post.id.toHexString() === post_id);
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

  public async isLiked({ user_id, post_id }: IPostLikeDTO): Promise<boolean> {
    const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
    const user = this.posts[findIndex].users_liked.find(user_like =>
      user_id.equals(user_like),
    );
    return !!user;
  }

  public async like({ user_id, post_id }: IPostLikeDTO): Promise<number> {
    const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
    if (findIndex >= 0) {
      const likesStored = this.posts[findIndex].users_liked;
      const userLikeIndex = likesStored.findIndex(user_like =>
        user_id.equals(user_like),
      );

      if (userLikeIndex >= 0) {
        if (this.posts[findIndex].users_liked.length === 1) {
          this.posts[findIndex].users_liked = [];
        } else {
          this.posts[findIndex].users_liked = [
            ...likesStored.slice(userLikeIndex, 1),
          ];
        }
      } else {
        this.posts[findIndex].users_liked.push(user_id);
      }
      return this.posts[findIndex].users_liked.length;
    }
    return 0;
  }

  public async likesNumber(post_id: ObjectId): Promise<number> {
    const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
    return this.posts[findIndex].getLikes();
  }

  public async countPostsLikedByUser(
    liker_id: ObjectId,
    limitDate: Date,
  ): Promise<number> {
    const postIsLiked = await this.posts.map(
      post =>
        post.users_liked.includes(liker_id) &&
        isAfter(post.created_at, limitDate),
    );
    return postIsLiked.filter(liked => liked).length;
  }
}

export default FakePostsRepository;
