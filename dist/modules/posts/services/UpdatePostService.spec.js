"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const FakeTagsRepository_1 = __importDefault(require("@modules/tags/repositories/fakes/FakeTagsRepository"));
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakePostsRepository_1 = __importDefault(require("../repositories/fakes/FakePostsRepository"));
const UpdatePostService_1 = __importDefault(require("./UpdatePostService"));
let fakeUsersRepository;
let fakeTagsRepository;
let fakePostsRepository;
let updatePostService;
let category;
let user;
let tag1;
let tag2;
let post;
describe('Update Post', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakeTagsRepository = new FakeTagsRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        updatePostService = new UpdatePostService_1.default(fakeUsersRepository, fakePostsRepository, fakeTagsRepository);
        category = new Category_1.default();
        Object.assign(category, {
            id: new mongodb_1.ObjectId(),
            name: 'Teste'
        });
        user = await fakeUsersRepository.create({
            name: 'John Duo',
            email: 'johnduo@example.com',
            password: '123456'
        });
        tag1 = await fakeTagsRepository.create({
            category,
            name: 'Tag 1'
        });
        tag2 = await fakeTagsRepository.create({
            category,
            name: 'Tag 2'
        });
        post = await fakePostsRepository.create({
            author: user,
            category,
            body: 'Testes',
            image_url: 'url.com',
            tags: [tag1],
            title: 'Post Teste'
        });
        const category2 = new Category_1.default();
        Object.assign(category2, {
            id: new mongodb_1.ObjectId(),
            name: 'Teste'
        });
        await fakePostsRepository.create({
            author: user,
            category: category2,
            body: 'Testes',
            image_url: 'url.com',
            slug: 'testes-atualizados',
            tags: [tag1],
            title: 'Testes Atualizados'
        });
    });
    it('should be update a post', async () => {
        const updatedPost = await updatePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
            body: 'Testes Atualizados',
            image_url: 'imagem.atualizada',
            tag_ids: [
                {
                    tag_id: tag2.id.toHexString()
                }
            ],
            title: 'Post Updated'
        });
        expect(updatedPost.tags).toEqual([tag2]);
        expect(updatedPost.slug).toMatch('post-updated');
    });
    it('should not be update post title for  existing user post title', async () => {
        await fakePostsRepository.create({
            author: user,
            category,
            body: 'Testes',
            image_url: 'url.com',
            slug: 'post-updated',
            tags: [tag1],
            title: 'Testes Atualizados'
        });
        await expect(updatePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
            body: 'Testes Atualizados',
            image_url: 'imagem.atualizada',
            tag_ids: [
                {
                    tag_id: tag2.id.toHexString()
                }
            ],
            title: 'Post Updated'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be update a post with an user diff author', async () => {
        const diffUser = await fakeUsersRepository.create({
            name: 'John Duo 2',
            email: 'johnduo2@example.com',
            password: '123456'
        });
        await expect(updatePostService.execute({
            post_id: post.id.toHexString(),
            user_id: diffUser.id.toHexString(),
            title: 'Post Updated'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be update a post with a non-existing tag', async () => {
        await expect(updatePostService.execute({
            post_id: post.id.toHexString(),
            user_id: user.id.toHexString(),
            tag_ids: [
                {
                    tag_id: new mongodb_1.ObjectId().toHexString()
                }
            ]
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be update a post with a non-existing user', async () => {
        await expect(updatePostService.execute({
            post_id: post.id.toHexString(),
            user_id: new mongodb_1.ObjectId().toHexString(),
            title: 'Post Updated'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be update a non-existing post', async () => {
        await expect(updatePostService.execute({
            post_id: new mongodb_1.ObjectId().toHexString(),
            user_id: user.id.toHexString(),
            title: 'Post Updated'
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
