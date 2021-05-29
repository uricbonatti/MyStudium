import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';
import IAuthDTO from '@modules/users/dtos/IAuthDTO';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import User from '../../typeorm/schemas/User';
import { getQueryObject } from '@aerogear/graphql-query-mapper';
import { GraphQLResolveInfo } from 'graphql';

interface ILoginData {
  data: IAuthDTO;
}
interface ILoginSuccess {
  token: string;
  user: User;
}

// eslint-disable-next-line import/prefer-default-export
export async function login(
  _: any,
  loginData: ILoginData,
  __: any,
  info: GraphQLResolveInfo,
): Promise<ILoginSuccess> {
  const queryData = getQueryObject(info);
  console.log(queryData);
  const { email, password } = loginData.data;
  const authenticateUserService = container.resolve(AuthenticateUserService);
  const { user, token } = await authenticateUserService.execute({
    email,
    password,
  });
  return { user: classToClass(user), token };
}
