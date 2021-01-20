"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCategoriesRepository_1 = __importDefault(require("../repositories/fakes/FakeCategoriesRepository"));
const CreateCategoryService_1 = __importDefault(require("./CreateCategoryService"));
let fakeUsersRepository;
let fakeCategoriesRepository;
let createCategoryService;
let user;
describe('Create Category', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        createCategoryService = new CreateCategoryService_1.default(fakeUsersRepository, fakeCategoriesRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
    });
    it('should be able to create a new category', async () => {
        const category = await createCategoryService.execute({
            name: 'Teste',
            user_id: user.id.toHexString(),
        });
        expect(category).toHaveProperty('id');
    });
    it('should not be able to create categories with same name', async () => {
        await createCategoryService.execute({
            name: 'Teste',
            user_id: user.id.toHexString(),
        });
        await expect(createCategoryService.execute({
            name: 'Teste',
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create category with non-valid user', async () => {
        await expect(createCategoryService.execute({
            name: 'Teste',
            user_id: new mongodb_1.ObjectId().toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
