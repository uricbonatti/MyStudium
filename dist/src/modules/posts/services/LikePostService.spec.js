"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakePostsRepository_1 = __importDefault(require("../repositories/fakes/FakePostsRepository"));
const LikePostService_1 = __importDefault(require("./LikePostService"));
let fakeUsersRepository;
let fakePostsRepository;
let likePostService;
let user;
let post;
describe('Like Post', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        likePostService = new LikePostService_1.default(fakeUsersRepository, fakePostsRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
        post = await fakePostsRepository.create({
            author: user,
            body: 'Loren Ypsolon',
            category: new Category_1.default(),
            image_url: 'teste.com/test.png',
            tags: [],
            title: 'Post Teste',
        });
    });
    it('should be able to like a post', async () => {
        const likes = await likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
        });
        expect(likes).toBe(1);
    });
    it('should be able to unlike a post after like', async () => {
        await likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
        });
        const likes = await likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
        });
        expect(likes).toBe(0);
    });
    it('should be able one or more users like a post', async () => {
        const user2 = await fakeUsersRepository.create({
            name: 'John Duo2',
            email: 'johnduo2@example.com',
            password: '123456',
        });
        await likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user2.id.toHexString(),
        });
        const likes = await likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
        });
        expect(likes).toBe(2);
    });
    it('should not be able to like a non-existing post', async () => {
        await expect(likePostService.execute({
            post_id: new mongodb_1.ObjectId().toHexString(),
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to like a post by a non-existing user', async () => {
        await expect(likePostService.execute({
            post_id: post.id.toHexString(),
            user_id: new mongodb_1.ObjectId().toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
