import { classToClass } from 'class-transformer'
import { container } from 'tsyringe'
import IAuthDTO from '@modules/users/dtos/IAuthDTO'
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import User from '../../typeorm/schemas/User'

interface ILoginData {
  data: IAuthDTO;
}
interface ILoginSuccess {
  token: string;
  user: User;
}

// eslint-disable-next-line import/prefer-default-export
export async function login (_, { data }: ILoginData): Promise<ILoginSuccess> {
  const { email, password } = data
  const authenticateUserService = container.resolve(AuthenticateUserService)
  const { user, token } = await authenticateUserService.execute({
    email,
    password
  })
  return { user: classToClass(user), token }
}
