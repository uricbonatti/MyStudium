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
  };
  id: string;
}
interface IDeleteComment {
  id: string;
}

export async function likeComment(
  _,
  { comment_id }: ILikeComment,
  { token }: IContext,
): Promise<number> {
  const user_id = verifyToken(token);
  const likeCommentService = container.resolve(LikeCommentService);
  const likes = await likeCommentService.execute({ user_id, comment_id });
  return likes;
}

export async function createComment(
  _,
  { data }: ICreateComment,
  { token }: IContext,
): Promise<Comment> {
  const author_id = verifyToken(token);
  const { body, post_id } = data;
  const createCommentService = container.resolve(CreateCommentService);
  const comment = await createCommentService.execute({
    author_id,
    body,
    post_id,
  });
  return comment;
}

export async function updateComment(
  _,
  { id, data }: IUpdateCommentDTO,
  { token }: IContext,
): Promise<Comment> {
  const user_id = verifyToken(token);
  const { body } = data;
  const updateCommentService = container.resolve(UpdateCommentService);
  const comment = await updateCommentService.execute({
    comment_id: id,
    body,
    user_id,
  });
  return comment;
}

export async function deleteComment(
  _,
  { id }: IDeleteComment,
  { token }: IContext,
): Promise<string> {
  const user_id = verifyToken(token);
  const deleteCommentService = container.resolve(DeleteCommentService);
  const comment = await deleteCommentService.execute({
    comment_id: id,
    user_id,
  });
  return comment.id.toString();
}
