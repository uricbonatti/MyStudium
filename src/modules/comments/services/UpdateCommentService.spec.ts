import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import FakeCommentsRepository from '../repositories/fakes/FakeCommentsRepository';
import UpdateCommentService from './UpdateCommentService';

let fakeCommentsRepository: FakeCommentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let updateCommentService: UpdateCommentService;
let user: User;
let comment: Comment;

describe('Update Comment', () => {
  beforeEach(async () => {
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    updateCommentService = new UpdateCommentService(
      fakeUsersRepository,
      fakeCommentsRepository,
    );
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    comment = await fakeCommentsRepository.create({
      author: user,
      body: 'Escrita Inicial',
      post_id: new ObjectId(),
    });
  });
  it('should be able to update a comment', async () => {
    const updatedComment = await updateCommentService.execute({
      body: 'Escrita Alterada',
      comment_id: comment.id.toHexString(),
      user_id: user.id.toHexString(),
    });
    expect(updatedComment.body).toMatch('Escrita Alterada');
    expect(updatedComment.id).toBe(comment.id);
  });
  it('should not be able to update a comment with void body', async () => {
    await expect(
      updateCommentService.execute({
        body: '',
        comment_id: comment.id.toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to update a comment with only spaces  body', async () => {
    await expect(
      updateCommentService.execute({
        body: '    ',
        comment_id: comment.id.toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to update a non-existing comment ', async () => {
    await expect(
      updateCommentService.execute({
        body: 'Massa',
        comment_id: new ObjectId().toHexString(),
        user_id: user.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to update a comment with non-existing user ', async () => {
    await expect(
      updateCommentService.execute({
        body: 'Massa',
        comment_id: comment.id.toHexString(),
        user_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to update a comment with user diff author ', async () => {
    const diffUser = await fakeUsersRepository.create({
      name: 'John Dao',
      email: 'johndao@example.com',
      password: '123456',
    });

    await expect(
      updateCommentService.execute({
        body: 'Massa',
        comment_id: comment.id.toHexString(),
        user_id: diffUser.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
