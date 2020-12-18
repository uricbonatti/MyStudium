export default interface ICreateUserDTO {
  email: string;
  name: string;
  description?: string;
  password: string;
  github?: string;
  linkedin?: string;
}
