import User from '@modules/users/infra/typeorm/schemas/User'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'
import PostReport from '../infra/typeorm/schemas/PostReport'
import FakePostReportsRepository from '../repositories/fakes/FakePostReportsRepository'
import ListOpenPostReportsService from './ListOpenPostReportsService'

let fakePostReportsRepository: FakePostReportsRepository
let fakeUsersRepository: FakeUsersRepository
let listOpenPostReports: ListOpenPostReportsService
let report: PostReport
let user: User

describe('List Open Post Reports', () => {
  beforeEach(async () => {
    fakePostReportsRepository = new FakePostReportsRepository()
    fakeUsersRepository = new FakeUsersRepository()
    listOpenPostReports = new ListOpenPostReportsService(
      fakeUsersRepository,
      fakePostReportsRepository
    )
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456'
    })
    report = await fakePostReportsRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 1',
      title: 'Teste 1',
      user_id: user.id
    })
    const report2 = await fakePostReportsRepository.create({
      post_id: new ObjectId(),
      body: 'Teste 2',
      title: 'Teste 2',
      user_id: user.id
    })
    report2.closed = true
  })
  it('should be able to list open post reports', async () => {
    user.permission = 1
    const reports = await listOpenPostReports.execute({
      user_id: user.id.toHexString()
    })
    expect(reports).toEqual([report])
  })
  it('should not be able to list open post reports without permission', async () => {
    user.permission = 2
    await expect(
      listOpenPostReports.execute({
        user_id: user.id.toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be able to list open post reports with non-existing user', async () => {
    user.permission = 2
    await expect(
      listOpenPostReports.execute({
        user_id: 'non-existing-user'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
