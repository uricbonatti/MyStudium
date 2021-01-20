"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCommentsRepository_1 = __importDefault(require("../repositories/fakes/FakeCommentsRepository"));
const LikeCommentService_1 = __importDefault(require("./LikeCommentService"));
let fakeUsersRepository;
let fakeCommentsRepository;
let likeCommentService;
let user;
let comment;
describe('Like Comment', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeCommentsRepository = new FakeCommentsRepository_1.default();
        likeCommentService = new LikeCommentService_1.default(fakeUsersRepository, fakeCommentsRepository);
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
    it('should be able to like a comment', async () => {
        const likes = await likeCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        expect(likes).toBe(1);
    });
    it('should be able to one or more user like a comment', async () => {
        const user2 = await fakeUsersRepository.create({
            name: 'John Duo Two',
            email: 'johnduo2@example.com',
            password: '123456'
        });
        await likeCommentService.execute({
            user_id: user2.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        const likes2 = await likeCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        expect(likes2).toBe(2);
    });
    it('should be able to unlike a comment after like', async () => {
        await likeCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        const likes = await likeCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: comment.id.toHexString()
        });
        expect(likes).toBe(0);
    });
    it('should not be able to like a comment by a non-existing user', async () => {
        await expect(likeCommentService.execute({
            user_id: new mongodb_1.ObjectId().toHexString(),
            comment_id: comment.id.toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to like a non-existing comment ', async () => {
        await expect(likeCommentService.execute({
            user_id: user.id.toHexString(),
            comment_id: new mongodb_1.ObjectId().toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
