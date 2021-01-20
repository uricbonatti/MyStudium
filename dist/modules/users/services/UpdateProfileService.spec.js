"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const UpdateProfileService_1 = __importDefault(require("./UpdateProfileService"));
let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        updateProfile = new UpdateProfileService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        const updatedUser = await updateProfile.execute({
            id: user.id.toHexString(),
            name: 'John Joe',
            email: 'johnjoe@example.com'
        });
        expect(updatedUser.name).toBe('John Joe');
        expect(updatedUser.email).toBe('johnjoe@example.com');
    });
    it('should not be able to change to another user email ', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        const user = await fakeUsersRepository.create({
            name: 'Jonn Coe',
            email: 'jonncoe@example.com',
            password: '123456'
        });
        await expect(updateProfile.execute({
            id: user.id.toHexString(),
            name: 'Jonn Coe',
            email: 'johndoe@example.com'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        const updatedUser = await updateProfile.execute({
            id: user.id.toHexString(),
            name: 'John Joe',
            email: 'johnjoe@example.com',
            old_password: '123456',
            password: '123123'
        });
        expect(updatedUser.password).toBe('123123');
    });
    it('should not be able to update the password without the old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        await expect(updateProfile.execute({
            id: user.id.toHexString(),
            name: 'John Joe',
            email: 'johnjoe@example.com',
            password: '123123'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        await expect(updateProfile.execute({
            id: user.id.toHexString(),
            name: 'John Joe',
            email: 'johnjoe@example.com',
            old_password: 'wrong-old-password',
            password: '123123'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to show the profile from non-existing user', async () => {
        await expect(updateProfile.execute({
            id: 'non-existing-user-id',
            name: 'Test',
            email: 'example@example.com'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
