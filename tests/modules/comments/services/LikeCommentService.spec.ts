import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';
import FakeCommentsRepository from '@modules/comments/repositories/fakes/FakeCommentsRepository';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import LikeCommentService from '@modules/comments/services/LikeCommentService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let likeCommentService: LikeCommentService;
let user: User;
let comment: Comment;

describe('Like Comment', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    likeCommentService = new LikeCommentService(
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
      body: 'Loren Ypsolon',
      post_id: new ObjectId(),
    });
  });
  it('should be able to like a comment', async () => {
    const likes = await likeCommentService.execute({
      user_id: user.id.toHexString(),
      comment_id: comment.id.toHexString(),
    });
    expect(likes).toBe(1);
  });
  it('should be able to one or more user like a comment', async () => {
    const user2 = await fakeUsersRepository.create({
      name: 'John Duo Two',
      email: 'johnduo2@example.com',
      password: '123456',
    });
    await likeCommentService.execute({
      user_id: user2.id.toHexString(),
      comment_id: comment.id.toHexString(),
    });
    const likes2 = await likeCommentService.execute({
      user_id: user.id.toHexString(),
      comment_id: comment.id.toHexString(),
    });
    expect(likes2).toBe(2);
  });
  it('should be able to unlike a comment after like', async () => {
    await likeCommentService.execute({
      user_id: user.id.toHexString(),
      comment_id: comment.id.toHexString(),
    });
    const likes = await likeCommentService.execute({
      user_id: user.id.toHexString(),
      comment_id: comment.id.toHexString(),
    });

    expect(likes).toBe(0);
  });
  it('should not be able to like a comment by a non-existing user', async () => {
    await expect(
      likeCommentService.execute({
        user_id: new ObjectId().toHexString(),
        comment_id: comment.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });

  it('should not be able to like a non-existing comment ', async () => {
    await expect(
      likeCommentService.execute({
        user_id: user.id.toHexString(),
        comment_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to like a non-valid comment ', async () => {
    await expect(
      likeCommentService.execute({
        user_id: user.id.toHexString(),
        comment_id: 'non-valid',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
