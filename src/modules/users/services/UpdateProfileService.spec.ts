import { ApolloError } from 'apollo-server';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      id: user.id.toHexString(),
      name: 'John Joe',
      email: 'johnjoe@example.com',
      description: 'description',
      avatar_url: { href: 'url' },
      github: 'github',
      linkedin: 'linkedin',
    });

    expect(updatedUser.name).toBe('John Joe');
    expect(updatedUser.email).toBe('johnjoe@example.com');
    expect(updatedUser.description).toBe('description');
    expect(updatedUser.avatar_url).toBe('url');
    expect(updatedUser.github).toBe('github');
    expect(updatedUser.linkedin).toBe('linkedin');
  });

  it('should not be able to change to another user email ', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'Jonn Coe',
      email: 'jonncoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        id: user.id.toHexString(),
        name: 'Jonn Coe',
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      id: user.id.toHexString(),
      name: 'John Joe',
      email: 'johnjoe@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        id: user.id.toHexString(),
        name: 'John Joe',
        email: 'johnjoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        id: user.id.toHexString(),
        name: 'John Joe',
        email: 'johnjoe@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        id: 'non-existing-user-id',
        name: 'Test',
        email: 'example@example.com',
      }),
    ).rejects.toBeInstanceOf(ApolloError);
  });
});
