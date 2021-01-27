import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  userSummary,
} from './UsersResolver';
import { forgotPassword, resetPassword } from './PasswordResolver';
import { login } from './SessionResolver';

export const UserQuery = {
  getUser,
  login,
  userSummary,
};

export const UserMutation = {
  createUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
};
