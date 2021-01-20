"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
const User_1 = __importDefault(require("@modules/users/infra/typeorm/schemas/User"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakePostsRepository_1 = __importDefault(require("../repositories/fakes/FakePostsRepository"));
const ShowPostService_1 = __importDefault(require("./ShowPostService"));
let fakePostsRepository;
let showPostService;
describe('Show Post', () => {
    beforeEach(async () => {
        fakePostsRepository = new FakePostsRepository_1.default();
        showPostService = new ShowPostService_1.default(fakePostsRepository);
    });
    it('should be able to show a post', async () => {
        const user = new User_1.default();
        Object.assign(user, { id: new mongodb_1.ObjectId() });
        const category = new Category_1.default();
        Object.assign(category, { id: new mongodb_1.ObjectId() });
        const post = await fakePostsRepository.create({
            author: user,
            category,
            image_url: 'any',
            body: 'body',
            title: 'Teste',
            tags: []
        });
        const listedPost = await showPostService.execute({
            post_id: post.id.toHexString()
        });
        expect(listedPost.slug).toMatch('teste');
    });
    it('should not be able to show a non-existing post', async () => {
        await expect(showPostService.execute({
            post_id: new mongodb_1.ObjectId().toHexString()
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
