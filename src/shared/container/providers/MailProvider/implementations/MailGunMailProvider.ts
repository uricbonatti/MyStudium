import nodemailer, { Transporter } from 'nodemailer';
import MailGun, { Options } from 'nodemailer-mailgun-transport';
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
        apiKey: `${process.env.MAILGUN_API_KEY}`,
        domain: process.env.MAILGUN_DOMAIN || '',
      },
      port: process.env.MAILGUN_SMTP_PORT,
    };

    this.client = nodemailer.createTransport(MailGun(authOptions as Options));
  }

  public async sendMail({
    to,
    subject,
    templateData,
    from,
  }: ISendMailDTO): Promise<void> {
    try {
      const { email, name } = mailConfig.defaults.from;

      await this.client.sendMail({
        from: {
          name: from?.name || name,
          address: from?.email || email,
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
