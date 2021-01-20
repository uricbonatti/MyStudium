import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'
import User from '@modules/users/infra/typeorm/schemas/User'
import Category from '@modules/categories/infra/typeorm/schemas/Category'
import FakePostsRepository from '../repositories/fakes/FakePostsRepository'
import ShowPostService from './ShowPostService'

let fakePostsRepository: FakePostsRepository
let showPostService: ShowPostService

describe('Show Post', () => {
  beforeEach(async () => {
    fakePostsRepository = new FakePostsRepository()
    showPostService = new ShowPostService(fakePostsRepository)
  })
  it('should be able to show a post', async () => {
    const user = new User()
    Object.assign(user, { id: new ObjectId() })
    const category = new Category()
    Object.assign(category, { id: new ObjectId() })

    const post = await fakePostsRepository.create({
      author: user,
      category,
      image_url: 'any',
      body: 'body',
      title: 'Teste',
      tags: []
    })
    const listedPost = await showPostService.execute({
      post_id: post.id.toHexString()
    })
    expect(listedPost.slug).toMatch('teste')
  })
  it('should not be able to show a non-existing post', async () => {
    await expect(
      showPostService.execute({
        post_id: new ObjectId().toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
