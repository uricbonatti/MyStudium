"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const FakeCategoriesRepository_1 = __importDefault(require("@modules/categories/repositories/fakes/FakeCategoriesRepository"));
const FakeTagsRepository_1 = __importDefault(require("@modules/tags/repositories/fakes/FakeTagsRepository"));
const FakePostsRepository_1 = __importDefault(require("@modules/posts/repositories/fakes/FakePostsRepository"));
const CreateCommentService_1 = __importDefault(require("./CreateCommentService"));
const FakeCommentsRepository_1 = __importDefault(require("../repositories/fakes/FakeCommentsRepository"));
let fakeUsersRepository;
let fakeCategoriesRepository;
let fakeTagsRepository;
let fakePostsRepository;
let createCommentService;
let fakeCommentsRepository;
let user;
let category;
let tag;
let post;
describe('Create Comment', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        fakeTagsRepository = new FakeTagsRepository_1.default();
        fakeCommentsRepository = new FakeCommentsRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        createCommentService = new CreateCommentService_1.default(fakeUsersRepository, fakePostsRepository, fakeCommentsRepository);
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
        post = await fakePostsRepository.create({
            author: user,
            category,
            tags: [tag],
            title: 'Post Teste',
            body: 'Lorem Ipsolon',
            image_url: 'teste.com/teste.png',
        });
    });
    it('should be able to create a new Comment', async () => {
        const comment = await createCommentService.execute({
            author_id: user.id.toHexString(),
            body: 'Loren Ypsolon',
            post_id: post.id.toHexString(),
        });
        expect(comment).toHaveProperty('id');
    });
    it('should not be able to create a Comment with non-valid author/user', async () => {
        await expect(createCommentService.execute({
            author_id: new mongodb_1.ObjectId().toHexString(),
            body: 'Loren Ypsolon',
            post_id: post.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a Comment with non-existing post', async () => {
        await expect(createCommentService.execute({
            author_id: user.id.toHexString(),
            body: 'Loren Ypsolon',
            post_id: new mongodb_1.ObjectId().toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
