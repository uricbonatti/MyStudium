import { Transporter, createTransport } from 'nodemailer';
import MailGun from 'nodemailer-mailgun-transport';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IEmailProvider from '../models/IEmailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import { ApolloError } from 'apollo-server-core';

@injectable()
export default class MailGunMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const authOptions = {
      auth: {
        apiKey: process.env.MAILGUN_API_KEY || 'default',
        domain: process.env.MAILGUN_DOMAIN || 'default',
      },
    };

    this.client = createTransport(MailGun(authOptions));
  }

  public async sendMail({
    to,
    subject,
    templateData,
    from,
  }: ISendMailDTO): Promise<void> {
    try {
      let nameFrom: string | undefined;
      let emailFrom: string | undefined;
      if (from) {
        nameFrom = from.name;
        emailFrom = from.email;
      }
      const { email, name } = mailConfig.defaults.from;

      await this.client.sendMail({
        from: {
          name: nameFrom || name,
          address: emailFrom || email,
        },
        to: { name: to.name, address: to.email },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
      });
    } catch {
      throw new ApolloError('Email Timeout');
    }
  }
}
