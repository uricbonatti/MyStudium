import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import FakeCommentsRepository from '../repositories/fakes/FakeCommentsRepository';
import Comment from '../infra/typeorm/schemas/Comment';
import DeleteCommentService from './DeleteCommentService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let deleteCommentService: DeleteCommentService;
let user: User;
let comment: Comment;

describe('Delete Comment', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    deleteCommentService = new DeleteCommentService(
      fakeCommentsRepository,
      fakeUsersRepository,
    );

    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    comment = await fakeCommentsRepository.create({
      author: user,
      body: 'Loren Ypsolon',
      post_id: new ObjectId(),
    });
  });
  it('should be able to delete the comment', async () => {
    await expect(
      deleteCommentService.execute({
        user_id: user.id.toHexString(),
        comment_id: comment.id.toHexString(),
      }),
    ).resolves;
  });
  it('should not be able to delete comments without comment id', async () => {
    await expect(
      deleteCommentService.execute({
        user_id: user.id.toHexString(),
        comment_id: '',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to delete comments with a non-exist comment id', async () => {
    await expect(
      deleteCommentService.execute({
        user_id: user.id.toHexString(),
        comment_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to delete comments with a user diff of author', async () => {
    const diffUser = await fakeUsersRepository.create({
      name: 'John Duo Three',
      email: 'johnduo2@example.com',
      password: '123456',
    });
    await expect(
      deleteCommentService.execute({
        user_id: diffUser.id.toHexString(),
        comment_id: comment.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to delete comments with a non-exist user ', async () => {
    await expect(
      deleteCommentService.execute({
        user_id: new ObjectId().toHexString(),
        comment_id: comment.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
