import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'
import User from '@modules/users/infra/typeorm/schemas/User'
import FakeTagsRepository from '@modules/tags/repositories/fakes/FakeTagsRepository'
import Tag from '@modules/tags/infra/typeorm/schemas/Tag'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import Category from '@modules/categories/infra/typeorm/schemas/Category'
import FakePostsRepository from '../repositories/fakes/FakePostsRepository'
import UpdatePostService from './UpdatePostService'
import Post from '../infra/typeorm/schemas/Post'

let fakeUsersRepository: FakeUsersRepository
let fakeTagsRepository: FakeTagsRepository
let fakePostsRepository: FakePostsRepository
let updatePostService: UpdatePostService
let category: Category
let user: User
let tag1: Tag
let tag2: Tag
let post: Post

describe('Update Post', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeTagsRepository = new FakeTagsRepository()
    fakePostsRepository = new FakePostsRepository()
    updatePostService = new UpdatePostService(
      fakeUsersRepository,
      fakePostsRepository,
      fakeTagsRepository
    )
    category = new Category()
    Object.assign(category, {
      id: new ObjectId(),
      name: 'Teste'
    })
    user = await fakeUsersRepository.create({
      name: 'John Duo',
      email: 'johnduo@example.com',
      password: '123456'
    })
    tag1 = await fakeTagsRepository.create({
      category,
      name: 'Tag 1'
    })
    tag2 = await fakeTagsRepository.create({
      category,
      name: 'Tag 2'
    })
    post = await fakePostsRepository.create({
      author: user,
      category,
      body: 'Testes',
      image_url: 'url.com',
      tags: [tag1],
      title: 'Post Teste'
    })
    const category2 = new Category()
    Object.assign(category2, {
      id: new ObjectId(),
      name: 'Teste'
    })
    await fakePostsRepository.create({
      author: user,
      category: category2,
      body: 'Testes',
      image_url: 'url.com',
      slug: 'testes-atualizados',
      tags: [tag1],
      title: 'Testes Atualizados'
    })
  })
  it('should be update a post', async () => {
    const updatedPost = await updatePostService.execute({
      post_id: post.id.toHexString(),
      user_id: user.id.toHexString(),
      body: 'Testes Atualizados',
      image_url: 'imagem.atualizada',
      tag_ids: [
        {
          tag_id: tag2.id.toHexString()
        }
      ],
      title: 'Post Updated'
    })
    expect(updatedPost.tags).toEqual([tag2])
    expect(updatedPost.slug).toMatch('post-updated')
  })
  it('should not be update post title for  existing user post title', async () => {
    await fakePostsRepository.create({
      author: user,
      category,
      body: 'Testes',
      image_url: 'url.com',
      slug: 'post-updated',
      tags: [tag1],
      title: 'Testes Atualizados'
    })

    await expect(
      updatePostService.execute({
        post_id: post.id.toHexString(),
        user_id: user.id.toHexString(),
        body: 'Testes Atualizados',
        image_url: 'imagem.atualizada',
        tag_ids: [
          {
            tag_id: tag2.id.toHexString()
          }
        ],
        title: 'Post Updated'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })

  it('should not be update a post with an user diff author', async () => {
    const diffUser = await fakeUsersRepository.create({
      name: 'John Duo 2',
      email: 'johnduo2@example.com',
      password: '123456'
    })
    await expect(
      updatePostService.execute({
        post_id: post.id.toHexString(),
        user_id: diffUser.id.toHexString(),
        title: 'Post Updated'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be update a post with a non-existing tag', async () => {
    await expect(
      updatePostService.execute({
        post_id: post.id.toHexString(),
        user_id: user.id.toHexString(),
        tag_ids: [
          {
            tag_id: new ObjectId().toHexString()
          }
        ]
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be update a post with a non-existing user', async () => {
    await expect(
      updatePostService.execute({
        post_id: post.id.toHexString(),
        user_id: new ObjectId().toHexString(),
        title: 'Post Updated'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be update a non-existing post', async () => {
    await expect(
      updatePostService.execute({
        post_id: new ObjectId().toHexString(),
        user_id: user.id.toHexString(),
        title: 'Post Updated'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
