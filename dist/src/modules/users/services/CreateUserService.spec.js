"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const FakeHashProvider_1 = __importDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));
const CreateUserService_1 = __importDefault(require("./CreateUserService"));
let fakeHashProvider;
let fakeUsersRepository;
let createUserService;
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeHashProvider = new FakeHashProvider_1.default();
        createUserService = new CreateUserService_1.default(fakeUsersRepository, fakeHashProvider);
    });
    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'John Doe',
            email: 'jdoe@example.com',
            password: '123456',
        });
        expect(user).toHaveProperty('id');
    });
    it('should not be able to create a new user with same email from another', async () => {
        await createUserService.execute({
            name: 'John Doe',
            email: 'jdoe@example.com',
            password: '123456',
        });
        await expect(createUserService.execute({
            name: 'John Doe2',
            email: 'jdoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
