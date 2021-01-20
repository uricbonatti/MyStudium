"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCommentsRepository_1 = __importDefault(require("../repositories/fakes/FakeCommentsRepository"));
const Comment_1 = __importDefault(require("../infra/typeorm/schemas/Comment"));
const DeleteCommentService_1 = __importDefault(require("./DeleteCommentService"));
let fakeUsersRepository;
let fakeCommentsRepository;
let deleteCommentService;
let user;
let comment;
describe('Delete Comment', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCommentsRepository = new FakeCommentsRepository_1.default();
        deleteCommentService = new DeleteCommentService_1.default(fakeCommentsRepository, fakeUsersRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456'
        });
        comment = await fakeCommentsRepository.create({
            author: user,
            body: 'Loren Ypsolon',
            post_id: new mongodb_1.ObjectId()
        });
    });
    it('should be able to delete the comment', async () => {
        const deletedComment = await deleteCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        expect(deletedComment).toHaveProperty('id');
        expect(deletedComment).toBeInstanceOf(Comment_1.default);
    });
    it('should not be able to delete comments without comment id', async () => {
        await expect(deleteCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: ''
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to delete comments with a non-exist comment id', async () => {
        await expect(deleteCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: new mongodb_1.ObjectId().toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to delete comments with a user diff of author', async () => {
        const diffUser = await fakeUsersRepository.create({
            name: 'John Duo Three',
            email: 'johnduo2@example.com',
            password: '123456'
        });
        await expect(deleteCommentService.execute({
            user_id: diffUser.id.toHexString(),
            comment_id: comment.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to delete comments with a non-exist user ', async () => {
        await expect(deleteCommentService.execute({
            user_id: new mongodb_1.ObjectId().toHexString(),
            comment_id: comment.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
