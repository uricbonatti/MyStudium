import { ObjectId } from 'mongodb';
import User from '@modules/users/infra/typeorm/schemas/User';
import Category from '@modules/categories/infra/typeorm/schemas/Category';
import Post from '../infra/typeorm/schemas/Post';
import FakePostsRepository from '../repositories/fakes/FakePostsRepository';
import SearchPostService from './SearchPostService';
import { ApolloError } from 'apollo-server';

let fakePostsRepository: FakePostsRepository;
let searchPostService: SearchPostService;
let user_id1: User;
let user_id2: User;
let category_id1: Category;
let category_id2: Category;
let post1: Post;
let post2: Post;
let post3: Post;

describe('Search Post', () => {
  beforeEach(async () => {
    fakePostsRepository = new FakePostsRepository();
    searchPostService = new SearchPostService(fakePostsRepository);
    user_id1 = new User();
    Object.assign(user_id1, { id: new ObjectId() });
    user_id2 = new User();
    Object.assign(user_id2, { id: new ObjectId() });
    category_id1 = new Category();
    Object.assign(category_id1, { id: new ObjectId() });
    category_id2 = new Category();
    Object.assign(category_id2, { id: new ObjectId() });

    post1 = await fakePostsRepository.create({
      author: user_id1,
      body: 'Post Teste One',
      title: 'Post Teste One',
      tags: [],
      resume: 'resumo',
      category: category_id1,
      image_url: 'image',
    });
    post2 = await fakePostsRepository.create({
      author: user_id1,
      body: 'Post Teste One',
      title: 'Post Teste Two',
      tags: [],
      resume: 'resumo',
      category: category_id2,
      image_url: 'image',
    });
    post3 = await fakePostsRepository.create({
      author: user_id2,
      body: 'Post Teste One',
      title: 'Post Teste Two',
      resume: 'resumo',
      tags: [],
      category: category_id1,
      image_url: 'image',
    });
  });
  it('shoud be list all posts', async () => {
    const posts = await searchPostService.execute({});
    expect(posts).toEqual([post1, post2, post3]);
  });
  it('shoud be list only user1 posts', async () => {
    const posts = await searchPostService.execute({
      author_id: user_id1.id.toHexString(),
    });
    expect(posts).toEqual([post1, post2]);
  });
  it('shoud be list only category1 posts', async () => {
    const posts = await searchPostService.execute({
      category_id: category_id1.id.toHexString(),
    });
    expect(posts).toEqual([post1, post3]);
  });
  it('shoud be list only posts with "Two" in title', async () => {
    const posts = await searchPostService.execute({
      title: 'Two',
    });
    expect(posts).toEqual([post2, post3]);
  });
  it('shoud be list only posts with "Two" in title and author as user1', async () => {
    const posts = await searchPostService.execute({
      title: 'Two',
      author_id: user_id1.id.toHexString(),
    });
    expect(posts).toEqual([post2]);
  });
  it('shoud be list only posts with "Two" in title and in category1', async () => {
    const posts = await searchPostService.execute({
      title: 'Two',
      category_id: category_id1.id.toHexString(),
    });
    expect(posts).toEqual([post3]);
  });
  it('shoud be list only user1 posts with  category2', async () => {
    const posts = await searchPostService.execute({
      author_id: user_id1.id.toHexString(),
      category_id: category_id2.id.toHexString(),
    });
    expect(posts).toEqual([post2]);
  });
  it('shoud be list only user1 posts with "One" in title and category2', async () => {
    const posts = await searchPostService.execute({
      author_id: user_id1.id.toHexString(),
      category_id: category_id2.id.toHexString(),
      title: 'One',
    });
    expect(posts).toEqual([]);
  });

  it('should not be able to search a post with non-valid author post ', async () => {
    await expect(
      searchPostService.execute({
        author_id: 'non-valid',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
  it('should not be able to search a post with non-valid category post ', async () => {
    await expect(
      searchPostService.execute({
        category_id: 'non-valid',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
