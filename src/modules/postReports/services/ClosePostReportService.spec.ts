import User from '@modules/users/infra/typeorm/schemas/User'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server'
import PostReport from '../infra/typeorm/schemas/PostReport'
import FakePostReportsRepository from '../repositories/fakes/FakePostReportsRepository'
import ClosePostReportService from './ClosePostReportService'

let fakePostReportsRepository: FakePostReportsRepository
let fakeUsersRepository: FakeUsersRepository
let closePostReport: ClosePostReportService
let report: PostReport
let user: User

describe('Close Post Report', () => {
  beforeEach(async () => {
    fakePostReportsRepository = new FakePostReportsRepository()
    fakeUsersRepository = new FakeUsersRepository()
    closePostReport = new ClosePostReportService(
      fakeUsersRepository,
      fakePostReportsRepository
    )
    user = await fakeUsersRepository.create({
      email: 'tes@tes.tes',
      name: 'John Duo',
      password: '123456'
    })
    user.permission = 2
    report = await fakePostReportsRepository.create({
      body: 'Só por reportar',
      title: 'Teste',
      post_id: new ObjectId(),
      user_id: new ObjectId()
    })
  })
  it('should be able to close a report', async () => {
    user.permission = 1
    const closedReport = await closePostReport.execute({
      action: 'nothing',
      feedback: 'só fechei',
      user_id: user.id.toHexString(),
      id: report.id.toHexString()
    })
    expect(closedReport.moderator_id).toEqual(user.id)
    expect(closedReport.closed).toEqual(true)
  })
  it('should not be able to close a report without permission', async () => {
    await expect(
      closePostReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: user.id.toHexString(),
        id: report.id.toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be able to close a non-existing report', async () => {
    user.permission = 1
    await expect(
      closePostReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: user.id.toHexString(),
        id: 'non-existing'
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
  it('should not be able to close a report with a non-existing user', async () => {
    await expect(
      closePostReport.execute({
        action: 'nothing',
        feedback: 'só fechei',
        user_id: 'non-existing',
        id: report.id.toHexString()
      })
    ).rejects.toBeInstanceOf(ApolloError)
  })
})
