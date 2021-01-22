interface IMailConfig {
  driver: 'ethereal' | 'mailgun' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'suporte@studium.blog.br',
      name: 'Suporte Studium',
    },
  },
} as IMailConfig;
