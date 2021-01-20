"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCategoriesRepository_1 = __importDefault(require("@modules/categories/repositories/fakes/FakeCategoriesRepository"));
const FakeTagsRepository_1 = __importDefault(require("@modules/tags/repositories/fakes/FakeTagsRepository"));
const CreatePostService_1 = __importDefault(require("./CreatePostService"));
const FakePostsRepository_1 = __importDefault(require("../repositories/fakes/FakePostsRepository"));
let fakeUsersRepository;
let fakeCategoriesRepository;
let fakeTagsRepository;
let fakePostsRepository;
let createPostService;
let user;
let category;
let tag;
describe('Create Post', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        fakeTagsRepository = new FakeTagsRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
        category = await fakeCategoriesRepository.create({
            name: 'Teste',
        });
        tag = await fakeTagsRepository.create({
            category,
            name: 'Teste Tag',
        });
        await fakeTagsRepository.create({
            category,
            name: 'Teste Tag2',
        });
        createPostService = new CreatePostService_1.default(fakeUsersRepository, fakePostsRepository, fakeTagsRepository, fakeCategoriesRepository);
    });
    it('should be able to create a new Post', async () => {
        const post = await createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        });
        expect(post).toHaveProperty('id');
    });
    it('should not be able to create a non-valid author/user', async () => {
        await expect(createPostService.execute({
            author_id: new mongodb_1.ObjectId().toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a non-existing category', async () => {
        await expect(createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: new mongodb_1.ObjectId().toHexString(),
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create two post with same slug by single user', async () => {
        await createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        });
        await expect(createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a non-valid category', async () => {
        await expect(createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: 'non-valid',
            tag_ids: [
                {
                    tag_id: tag.id.toHexString(),
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a non-valid tag', async () => {
        await expect(createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: 'non-valid',
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a non-existing tag', async () => {
        await expect(createPostService.execute({
            author_id: user.id.toHexString(),
            title: 'Post Teste',
            body: 'Loren Ypsolon',
            image_url: 'teste.com/teste.png',
            category_id: category.id.toHexString(),
            tag_ids: [
                {
                    tag_id: new mongodb_1.ObjectId().toHexString(),
                },
            ],
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
