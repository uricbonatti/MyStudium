import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IEmailProvider from '../models/IEmailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import { ApolloError } from 'apollo-server-core';

@injectable()
export default class SESMailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-2',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    from,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name: nameDefault, email: emailDefault } = mailConfig.defaults.from;
    const { name: nameTo, email: emailTo } = to;
    let nameFrom: string | undefined;
    let emailFrom: string | undefined;
    if (from) {
      nameFrom = from.name;
      emailFrom = from.email;
    }

    try {
      await this.client.sendMail({
        from: {
          name: nameFrom || nameDefault,
          address: emailFrom || emailDefault,
        },
        to: { name: nameTo, address: emailTo },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
      });
    } catch (error) {
      console.log(error);
      throw new ApolloError('Error with Email sending service', '500');
    }
  }
}
