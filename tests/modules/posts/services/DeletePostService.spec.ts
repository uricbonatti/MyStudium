import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/schemas/User';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import DeletePostService from '@modules/posts/services/DeletePostService';
import Post from '@modules/posts/infra/typeorm/schemas/Post';

let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let deletePostService: DeletePostService;
let user: User;
let post: Post;

describe('Delete Post', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    deletePostService = new DeletePostService(
      fakePostsRepository,
      fakeUsersRepository,
    );

    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456',
    });
    post = await fakePostsRepository.create({
      author: user,
      body: 'LorenYpsolon',
      slug: 'teste-teste',
      category: new Category(),
      resume: 'resumo',
      tags: [],
      image_url: 'teste.com/teste.png',
      title: 'Post Teste',
    });
  });
  it('should be able to delete the post', async () => {
    const deletedPost = await deletePostService.execute({
      user_id: user.id.toHexString(),
      post_id: post.id.toHexString(),
    });

    expect(deletedPost).toHaveProperty('id');
    expect(deletedPost).toBeInstanceOf(Post);
  });
  it('should not be abre to delete a post with user diff author', async () => {
    const diffUser = await fakeUsersRepository.create({
      name: 'John Duo Three',
      email: 'johnduo2@example.com',
      password: '123456',
    });
    await expect(
      deletePostService.execute({
        user_id: diffUser.id.toHexString(),
        post_id: post.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be abre to delete a post with non-exist user ', async () => {
    await expect(
      deletePostService.execute({
        user_id: new ObjectId().toHexString(),
        post_id: post.id.toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be abre to delete a non-existing post', async () => {
    await expect(
      deletePostService.execute({
        user_id: user.id.toHexString(),
        post_id: new ObjectId().toHexString(),
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be abre to delete a non-valid post', async () => {
    await expect(
      deletePostService.execute({
        user_id: user.id.toHexString(),
        post_id: '',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
