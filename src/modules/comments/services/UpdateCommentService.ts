import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import ICommentsRepository from '../repositories/ICommentsRepository';
import Comment from '../infra/typeorm/schemas/Comment';

interface IUpdateComment {
  user_id: string;
  comment_id: string;
  body: string;
}

@injectable()
class UpdateCommentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({
    body,
    user_id,
    comment_id,
  }: IUpdateComment): Promise<Comment> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', 'UNAUTHENTICATED');
    }
    const comment = await this.commentsRepository.findByID(comment_id);
    if (!comment) {
      throw new ApolloError('Comment not found.', 'BAD_USER_INPUT');
    }
    if (!comment.author.id.equals(user.id)) {
      throw new ApolloError('User and Author not matched.', 'BAD_USER_INPUT');
    }
    let adjustBody = body.replace(/\s{2,}/g, ' ');
    adjustBody = adjustBody.trim();
    if (adjustBody.length === 0) {
      throw new ApolloError('Comment Body need some content', 'BAD_USER_INPUT');
    }
    comment.body = adjustBody;
    await this.commentsRepository.save(comment);
    return comment;
  }
}
export default UpdateCommentService;
