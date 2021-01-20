import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import ShowProfileService from '@modules/users/services/ShowProfileService'
import User from '@modules/users/infra/typeorm/schemas/User'
import CreateUserService from '@modules/users/services/CreateUserService'
import verifyToken from '@shared/utils/tokenValidation'
import DeleteUserService from '@modules/users/services/DeleteUserService'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import { IContext } from '@shared/utils/interfaces'
import UserSummaryActivityService, {
  ISummary
} from '@modules/users/services/UserSummaryActivityService'

interface IGetUser {
  id: string;
}
interface ICreateUser {
  data: ICreateUserDTO;
}
interface IUpdateUser {
  data: IUpdateUserDTO;
}
interface IDeleteUser {
  data: {
    email: string;
  };
}

export async function getUser (_, { id }: IGetUser): Promise<User> {
  const showProfileService = container.resolve(ShowProfileService)
  const user = await showProfileService.execute({ id })
  return classToClass(user)
}

export async function createUser (_, { data }: ICreateUser): Promise<User> {
  const {
    email, name, password, github, linkedin
  } = data
  const createUserService = container.resolve(CreateUserService)
  const user = await createUserService.execute({
    email,
    name,
    password,
    github,
    linkedin
  })
  return classToClass(user)
}

export async function updateUser (
  _,
  { data }: IUpdateUser,
  { token }: IContext
): Promise<User> {
  const id = verifyToken(token)
  const {
    email,
    name,
    old_password,
    password,
    github,
    linkedin,
    avatar_url
  } = data
  const updateProfileService = container.resolve(UpdateProfileService)
  const user = await updateProfileService.execute({
    id,
    email,
    name,
    old_password,
    password,
    github,
    linkedin,
    avatar_url
  })
  return classToClass(user)
}

export async function deleteUser (
  _,
  { data }: IDeleteUser,
  { token }: IContext
): Promise<string> {
  const user_id = verifyToken(token)
  const { email } = data
  const deleteUserService = container.resolve(DeleteUserService)
  const user = await deleteUserService.execute({ user_id, email })
  return user.id.toString()
}

export async function userSummary (_, { id }: IGetUser): Promise<ISummary> {
  const userSummaryActivityService = container.resolve(
    UserSummaryActivityService
  )
  const summary = await userSummaryActivityService.execute({ user_id: id })

  return summary
}
