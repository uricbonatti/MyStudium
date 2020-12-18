export default interface IUpdateUserDTO {
  id: string;
  email: string;
  name: string;
  description?: string;
  old_password?: string;
  password?: string;
  github?: string;
  linkedin?: string;
  avatar_url?: string;
}
