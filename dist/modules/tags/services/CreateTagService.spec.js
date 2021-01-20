"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const FakeCategoriesRepository_1 = __importDefault(require("@modules/categories/repositories/fakes/FakeCategoriesRepository"));
const FakeTagsRepository_1 = __importDefault(require("../repositories/fakes/FakeTagsRepository"));
const CreateTagService_1 = __importDefault(require("./CreateTagService"));
let fakeUsersRepository;
let fakeCategoriesRepository;
let fakeTagsRepository;
let createTagService;
let user;
let category;
describe('Create Tag', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        fakeTagsRepository = new FakeTagsRepository_1.default();
        createTagService = new CreateTagService_1.default(fakeUsersRepository, fakeTagsRepository, fakeCategoriesRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456'
        });
        category = await fakeCategoriesRepository.create({
            name: 'Teste'
        });
    });
    it('should be able to create a new Tag', async () => {
        const tag = await createTagService.execute({
            name: 'Teste Tag',
            user_id: user.id.toHexString(),
            category_id: category.id.toHexString()
        });
        expect(tag).toHaveProperty('id');
    });
    it('should not be able to create a new Tag with same name', async () => {
        await createTagService.execute({
            name: 'Teste Tag',
            user_id: user.id.toHexString(),
            category_id: category.id.toHexString()
        });
        await expect(createTagService.execute({
            name: 'Teste Tag',
            user_id: user.id.toHexString(),
            category_id: category.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a new Tag with non-valid user', async () => {
        await expect(createTagService.execute({
            name: 'Teste Tag',
            user_id: new mongodb_1.ObjectId().toHexString(),
            category_id: category.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a new Tag with non-valid category', async () => {
        await expect(createTagService.execute({
            name: 'Teste Tag',
            user_id: user.id.toHexString(),
            category_id: new mongodb_1.ObjectId().toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
