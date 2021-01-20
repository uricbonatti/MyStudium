"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const ShowProfileService_1 = __importDefault(require("./ShowProfileService"));
let fakeUsersRepository;
let showProfileService;
describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        showProfileService = new ShowProfileService_1.default(fakeUsersRepository);
    });
    it('should be able to show the profile', async () => {
        const { id } = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });
        const profile = await showProfileService.execute({
            id: id.toHexString()
        });
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });
    it('should not be able to show the profile from non-existing user', async () => {
        await expect(showProfileService.execute({
            id: 'non-existing-user-id'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
