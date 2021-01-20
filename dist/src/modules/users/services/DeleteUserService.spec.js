"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCommentsRepository_1 = __importDefault(require("@modules/comments/repositories/fakes/FakeCommentsRepository"));
const FakePostsRepository_1 = __importDefault(require("@modules/posts/repositories/fakes/FakePostsRepository"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakeUsersRepository_1 = __importDefault(require("../repositories/fakes/FakeUsersRepository"));
const DeleteUserService_1 = __importDefault(require("./DeleteUserService"));
let fakeUsersRepository;
let fakeCommentsRepository;
let fakePostsRepository;
let deleteUserService;
let user;
let post;
let comment;
describe('Delete User', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCommentsRepository = new FakeCommentsRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        deleteUserService = new DeleteUserService_1.default(fakeUsersRepository, fakeCommentsRepository, fakePostsRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
        post = await fakePostsRepository.create({
            author: user,
            body: 'LorenYpsolon',
            category: new Category_1.default(),
            tags: [],
            image_url: 'teste.com/teste.png',
            title: 'Post Teste',
        });
        comment = await fakeCommentsRepository.create({
            author: user,
            body: 'Loren Ypsolon',
            post_id: post.id,
        });
    });
    it('should be able to delete the user', async () => {
        const deleteComment = jest.spyOn(fakeCommentsRepository, 'delete');
        const deletePost = jest.spyOn(fakePostsRepository, 'delete');
        const deletedUser = await deleteUserService.execute({
            user_id: user.id.toHexString(),
            email: 'johnduo@example.com',
        });
        expect(deletedUser).toHaveProperty('id');
        expect(deletePost).toHaveBeenCalledWith(post.id.toHexString());
        expect(deleteComment).toHaveBeenCalledWith(comment.id.toHexString());
    });
    it('should not be able to delete the user with different email', async () => {
        await expect(deleteUserService.execute({
            user_id: user.id.toHexString(),
            email: 'johnsix@example.com',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to delete the non-existing user', async () => {
        await expect(deleteUserService.execute({
            user_id: new mongodb_1.ObjectId().toHexString(),
            email: 'johnduo@example.com',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
