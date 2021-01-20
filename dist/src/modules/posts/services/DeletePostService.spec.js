"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const FakePostsRepository_1 = __importDefault(require("@modules/posts/repositories/fakes/FakePostsRepository"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const DeletePostService_1 = __importDefault(require("./DeletePostService"));
const Post_1 = __importDefault(require("../infra/typeorm/schemas/Post"));
let fakeUsersRepository;
let fakePostsRepository;
let deletePostService;
let user;
let post;
describe('Delete Post', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        deletePostService = new DeletePostService_1.default(fakePostsRepository, fakeUsersRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
        post = await fakePostsRepository.create({
            author: user,
            body: 'LorenYpsolon',
            slug: 'teste-teste',
            category: new Category_1.default(),
            tags: [],
            image_url: 'teste.com/teste.png',
            title: 'Post Teste',
        });
    });
    it('should be able to delete the post', async () => {
        const deletedPost = await deletePostService.execute({
            user_id: user.id.toHexString(),
            post_id: post.id.toHexString(),
        });
        expect(deletedPost).toHaveProperty('id');
        expect(deletedPost).toBeInstanceOf(Post_1.default);
    });
    it('should not be abre to delete a post with user diff author', async () => {
        const diffUser = await fakeUsersRepository.create({
            name: 'John Duo Three',
            email: 'johnduo2@example.com',
            password: '123456',
        });
        await expect(deletePostService.execute({
            user_id: diffUser.id.toHexString(),
            post_id: post.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be abre to delete a post with non-exist user ', async () => {
        await expect(deletePostService.execute({
            user_id: new mongodb_1.ObjectId().toHexString(),
            post_id: post.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be abre to delete a non-existing post', async () => {
        await expect(deletePostService.execute({
            user_id: user.id.toHexString(),
            post_id: new mongodb_1.ObjectId().toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be abre to delete a non-valid post', async () => {
        await expect(deletePostService.execute({
            user_id: user.id.toHexString(),
            post_id: '',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
