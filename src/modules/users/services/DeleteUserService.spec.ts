import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';

import FakeCommentsRepository from '@modules/comments/repositories/fakes/FakeCommentsRepository';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import Comment from '@modules/comments/infra/typeorm/schemas/Comment';
import Post from '@modules/posts/infra/typeorm/schemas/Post';
import Category from '@modules/categories/infra/typeorm/schemas/Category';

import User from '../infra/typeorm/schemas/User';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakePostsRepository: FakePostsRepository;
let deleteUserService: DeleteUserService;
let user: User;
let post: Post;
let comment: Comment;

describe('Delete User', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakePostsRepository = new FakePostsRepository();
    deleteUserService = new DeleteUserService(
      fakeUsersRepository,
      fakeCommentsRepository,
      fakePostsRepository,
    );
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    post = await fakePostsRepository.create({
      author: user,
      body: 'LorenYpsolon',
      category: new Category(),
      tags: [],
      image_url: 'teste.com/teste.png',
      title: 'Post Teste',
    });
    comment = await fakeCommentsRepository.create({
      author: user,
      body: 'Loren Ypsolon',
      post_id: post.id,
    });
  });
  it('should be able to delete the user', async () => {
    const deleteComment = jest.spyOn(fakeCommentsRepository, 'delete');
    const deletePost = jest.spyOn(fakePostsRepository, 'delete');
    const deletedUser = await deleteUserService.execute({
      user_id: user.id.toHexString(),
      email: 'johnduo@example.com',
    });
    expect(deletedUser).toHaveProperty('id');
    expect(deletePost).toHaveBeenCalledWith(post.id.toHexString());
    expect(deleteComment).toHaveBeenCalledWith(comment.id.toHexString());
  });

  it('should not be able to delete the user with different email', async () => {
    await expect(
      deleteUserService.execute({
        user_id: user.id.toHexString(),
        email: 'johnsix@example.com',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to delete the non-existing user', async () => {
    await expect(
      deleteUserService.execute({
        user_id: new ObjectId().toHexString(),
        email: 'johnduo@example.com',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
