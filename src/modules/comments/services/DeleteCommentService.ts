import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import ICommentsRepository from '../repositories/ICommentsRepository';

interface IDelete {
  user_id: string;
  comment_id: string;
}

@injectable()
class DeleteCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, comment_id }: IDelete): Promise<void> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User cannot be found', 'UNAUTHENTICATED');
    }
    if (!ObjectId.isValid(comment_id)) {
      throw new ApolloError('Comment ID invalid', 'BAD_USER_INPUT');
    }
    const comment = await this.commentsRepository.findByID(comment_id);
    if (!comment) {
      throw new ApolloError('Comment cannot be found', 'BAD_USER_INPUT');
    }
    if (!comment.author.id.equals(user.id)) {
      throw new ApolloError(
        'User is not the Author, then User cannot delete this post',
        'FORBIDDEN',
      );
    }
    await this.commentsRepository.delete(comment_id);
  }
}
export default DeleteCommentService;
