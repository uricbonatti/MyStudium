import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import { differenceInCalendarDays, subDays } from 'date-fns';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import { calcWeekExp } from '@shared/utils/expTable';
import IUsersRepository from '../repositories/IUsersRepository';

interface IGenerateSummary {
  user_id: string;
}
interface IUserActivity {
  postsLiked: number;
  postsCreated: number;
  commentsLiked: number;
  commentsCreated: number;
}

export interface ISummary {
  all: IUserActivity;
  lastMonth: IUserActivity;
  lastWeek: IUserActivity;
  weekExp: number;
  lastWeekPosts: Post[];
}
@injectable()
class UserSummaryActivityService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({ user_id }: IGenerateSummary): Promise<ISummary> {
    if (!ObjectId.isValid(user_id)) {
      throw new ApolloError('Invalid User ID', '400');
    }
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found', '400');
    }
    const userPosts = await this.postsRepository.findByAuthor(user.id);
    const userComments = await this.commentsRepository.findByAuthorId(user.id);
    const monthPosts = userPosts.filter(
      post => differenceInCalendarDays(Date.now(), post.created_at) < 30,
    );
    const weekPosts = monthPosts.filter(
      post => differenceInCalendarDays(Date.now(), post.created_at) < 7,
    );
    const monthComments = userComments.filter(
      comment => differenceInCalendarDays(Date.now(), comment.created_at) < 30,
    );
    const weekComments = monthComments.filter(
      comment => differenceInCalendarDays(Date.now(), comment.created_at) < 7,
    );
    const countAllPosts = userPosts.length;
    const countAllComments = userComments.length;
    const countMonthPosts = monthPosts.length;
    const countMonthComments = monthComments.length;
    const countWeekPosts = weekPosts.length;
    const countWeekComments = weekComments.length;
    const postLiked = await this.postsRepository.countPostsLikedByUser(
      user.id,
      user.created_at,
    );
    const monthPostLiked = await this.postsRepository.countPostsLikedByUser(
      user.id,
      subDays(Date.now(), 30),
    );
    const weekPostLiked = await this.postsRepository.countPostsLikedByUser(
      user.id,
      subDays(Date.now(), 7),
    );
    const commentLiked = await this.commentsRepository.countCommentsLikedByUser(
      user.id,
      user.created_at,
    );
    const monthCommentLiked = await this.commentsRepository.countCommentsLikedByUser(
      user.id,
      subDays(Date.now(), 30),
    );
    const weekCommentLiked = await this.commentsRepository.countCommentsLikedByUser(
      user.id,
      subDays(Date.now(), 7),
    );
    const weekExp = calcWeekExp({
      num_comments: countWeekComments,
      num_liked_comments: weekCommentLiked,
      num_posts: countWeekPosts,
      num_liked_posts: weekPostLiked,
    });
    const summary: ISummary = {
      all: {
        commentsCreated: countAllComments,
        postsCreated: countAllPosts,
        commentsLiked: commentLiked,
        postsLiked: postLiked,
      },
      lastMonth: {
        commentsCreated: countMonthComments,
        postsCreated: countMonthPosts,
        postsLiked: monthPostLiked,
        commentsLiked: monthCommentLiked,
      },
      lastWeek: {
        commentsCreated: countWeekComments,
        postsCreated: countWeekPosts,
        postsLiked: weekPostLiked,
        commentsLiked: weekCommentLiked,
      },
      lastWeekPosts: weekPosts,
      weekExp,
    };
    return summary;
  }
}
export default UserSummaryActivityService;
