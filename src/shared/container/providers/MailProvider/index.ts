import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from './models/IEmailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import MailGunMailProvider from './implementations/MailGunMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  mailgun: container.resolve(MailGunMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
