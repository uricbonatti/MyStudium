interface IMailConfig {
  driver: 'ethereal' | 'mailgun';
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
      email: 'suporte@studium-platform.com.br',
      name: 'Suporte Studium',
    },
  },
} as IMailConfig;
