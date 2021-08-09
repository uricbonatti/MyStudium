import { container } from 'tsyringe';
import verifyToken from '@shared/utils/tokenValidation';
import { IContext } from '@shared/utils/interfaces';
import LikeCommentService from '@modules/comments/services/LikeCommentService';
import CreateCommentService from '@modules/comments/services/CreateCommentService';
import UpdateCommentService from '@modules/comments/services/UpdateCommentService';
import DeleteCommentService from '@modules/comments/services/DeleteCommentService';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';

interface ILikeComment {
  comment_id: string;
}
interface ICreateComment {
  data: {
    body: string;
    post_id: string;
  };
}
interface IUpdateCommentDTO {
  data: {
    body: string;
    id: string;
  };
}
interface IDeleteComment {
  id: string;
}

export async function likeComment(
  _: any,
  { comment_id }: ILikeComment,
  { token }: IContext,
): Promise<number> {
  const user_id = verifyToken(token);
  const likeCommentService = container.resolve(LikeCommentService);
  return likeCommentService.execute({ user_id, comment_id });
}

export async function createComment(
  _: any,
  { data }: ICreateComment,
  { token }: IContext,
): Promise<Comment> {
  const author_id = verifyToken(token);
  const { body, post_id } = data;
  const createCommentService = container.resolve(CreateCommentService);
  return createCommentService.execute({
    author_id,
    body,
    post_id,
  });
}

export async function updateComment(
  _: any,
  { data }: IUpdateCommentDTO,
  { token }: IContext,
): Promise<Comment> {
  const user_id = verifyToken(token);
  const { id, body } = data;
  const updateCommentService = container.resolve(UpdateCommentService);
  return updateCommentService.execute({
    comment_id: id,
    body,
    user_id,
  });
}

export async function deleteComment(
  _: any,
  { id }: IDeleteComment,
  { token }: IContext,
): Promise<void> {
  const user_id = verifyToken(token);
  const deleteCommentService = container.resolve(DeleteCommentService);
  await deleteCommentService.execute({
    comment_id: id,
    user_id,
  });
}
