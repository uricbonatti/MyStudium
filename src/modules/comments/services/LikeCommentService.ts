import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { ApolloError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import ICommentsRepository from '../repositories/ICommentsRepository';

interface ILikeComment {
  comment_id: string;
  user_id: string;
}

@injectable()
class LikeCommentService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({ user_id, comment_id }: ILikeComment): Promise<number> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new ApolloError('User not found.', 'BAD_USER_INPUT');
    }
    if (ObjectId.isValid(comment_id)) {
      const comment = await this.commentsRepository.findByID(comment_id);
      if (comment !== undefined) {
        return this.commentsRepository.like({
          comment_id: comment.id,
          user_id: user.id,
        });
      }

      throw new ApolloError('Comment not found.', 'BAD_USER_INPUT');
    }
    throw new ApolloError('Comment Id invalid', 'BAD_USER_INPUT');
  }
}
export default LikeCommentService;
