import { container } from 'tsyringe';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

interface IForgotPassword {
  data: { email: string };
}

interface IResetPassword {
  data: {
    token: string;
    password: string;
    password_confirmation: string;
  };
}

export async function forgotPassword(
  _: any,
  { data }: IForgotPassword,
): Promise<boolean> {
  const { email } = data;
  const sendForgotPasswordEmailService = container.resolve(
    SendForgotPasswordEmailService,
  );
  sendForgotPasswordEmailService.execute({ email });
  return true;
}

export async function resetPassword(
  _: any,
  { data }: IResetPassword,
): Promise<boolean> {
  const { password, token } = data;
  const resetPasswordService = container.resolve(ResetPasswordService);
  await resetPasswordService.execute({ password, token });
  return true;
}
