"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeCommentsRepository_1 = __importDefault(require("../repositories/fakes/FakeCommentsRepository"));
const UpdateCommentService_1 = __importDefault(require("./UpdateCommentService"));
let fakeCommentsRepository;
let fakeUsersRepository;
let updateCommentService;
let user;
let comment;
describe('Update Comment', () => {
    beforeEach(async () => {
        fakeCommentsRepository = new FakeCommentsRepository_1.default();
        fakeUsersRepository = new FakeUsersRepository_1.default();
        updateCommentService = new UpdateCommentService_1.default(fakeUsersRepository, fakeCommentsRepository);
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456',
        });
        comment = await fakeCommentsRepository.create({
            author: user,
            body: 'Escrita Inicial',
            post_id: new mongodb_1.ObjectId(),
        });
    });
    it('should be able to update a comment', async () => {
        const updatedComment = await updateCommentService.execute({
            body: 'Escrita Alterada',
            comment_id: comment.id.toHexString(),
            user_id: user.id.toHexString(),
        });
        expect(updatedComment.body).toMatch('Escrita Alterada');
        expect(updatedComment.id).toBe(comment.id);
    });
    it('should not be able to update a comment with void body', async () => {
        await expect(updateCommentService.execute({
            body: '',
            comment_id: comment.id.toHexString(),
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to update a comment with only spaces  body', async () => {
        await expect(updateCommentService.execute({
            body: '    ',
            comment_id: comment.id.toHexString(),
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to update a non-existing comment ', async () => {
        await expect(updateCommentService.execute({
            body: 'Massa',
            comment_id: new mongodb_1.ObjectId().toHexString(),
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to update a comment with non-existing user ', async () => {
        await expect(updateCommentService.execute({
            body: 'Massa',
            comment_id: comment.id.toHexString(),
            user_id: new mongodb_1.ObjectId().toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to update a comment with user diff author ', async () => {
        const diffUser = await fakeUsersRepository.create({
            name: 'John Dao',
            email: 'johndao@example.com',
            password: '123456',
        });
        await expect(updateCommentService.execute({
            body: 'Massa',
            comment_id: comment.id.toHexString(),
            user_id: diffUser.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
