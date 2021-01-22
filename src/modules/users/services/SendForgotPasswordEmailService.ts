import 'reflect-metadata';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import { ApolloError } from 'apollo-server';

import IEmailProvider from '@shared/container/providers/MailProvider/models/IEmailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IEmailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new ApolloError('User does not exist.');
    }
    const { token } = await this.userTokensRepository.generate(user.id);
    const forgotPasswordTemplate =
      process.env.LOCAL_SYSTEM === 'win'
        ? 'src/modules/users/views/forgot_password.hbs'
        : path.resolve(
            'src',
            'modules',
            'users',
            'views',
            'forgot_password.hbs',
          );

    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[Studium] Recuperação de senha',

      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
    console.log('email enviado');
  }
}

export default SendForgotPasswordEmailService;
