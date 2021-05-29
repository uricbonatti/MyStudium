import { inject, injectable } from 'tsyringe';
import { ApolloError } from 'apollo-server';
import Post from '../infra/typeorm/schemas/Post';
import IPostsRepository from '../repositories/IPostsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';

interface IRequest {
  post_id: string;
  user_id?: string;
}

@injectable()
class ShowPostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({ post_id, user_id }: IRequest): Promise<Post> {
    const post = await this.postsRepository.findByID(post_id);
    if (!post) {
      throw new ApolloError('Post not found.', '400');
    }
    const postLikes = await this.postsRepository.getLikes(post.id);
    if (!postLikes) {
      throw new ApolloError('Post not found.', '400');
    }
    const { users_liked } = postLikes;

    post.users_liked = users_liked;
    let isLiked: boolean | undefined;
    if (!!user_id) {
      const isLikeFound = post.users_liked.filter(
        like => like.toHexString() === user_id,
      );
      isLiked = !!isLikeFound.shift();
    }
    post.liked = isLiked;

    const postComments = await this.commentsRepository.findByPostId(post.id);
    if (!!user_id) {
      const postCommentsIfIsLiked = postComments.map(comment => {
        let commentIsLiked: boolean | undefined;
        if (!!user_id) {
          const isLikeFound = comment.users_liked.filter(
            like => like.toHexString() === user_id,
          );
          commentIsLiked = !!isLikeFound.shift();
        }
        comment.liked = commentIsLiked;
        return comment;
      });
      post.comments = postCommentsIfIsLiked;
      return post;
    }
    post.comments = postComments;

    return post;
  }
}
export default ShowPostService;
