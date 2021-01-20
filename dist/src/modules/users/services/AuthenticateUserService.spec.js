"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const AuthenticateUserService_1 = __importDefault(require("./AuthenticateUserService"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const CreateUserService_1 = __importDefault(require("./CreateUserService"));
let fakeHashProvider;
let fakeUsersRepository;
let createUserService;
let authenticateUserService;
describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeHashProvider = new FakeHashProvider_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        createUserService = new CreateUserService_1.default(fakeUsersRepository, fakeHashProvider);
        authenticateUserService = new AuthenticateUserService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be abre to authenticate', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const response = await authenticateUserService.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });
    it('should not be able to authenticate with non existing user', async () => {
        await expect(authenticateUserService.execute({
            email: 'jdoe2@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to authenticate with wrong password', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'jdoe@example.com',
            password: '123456',
        });
        await expect(authenticateUserService.execute({
            email: 'jdoe@example.com',
            password: '1234567',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
