"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const User_1 = __importDefault(require("@modules/users/infra/typeorm/schemas/User"));
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakePostsRepository_1 = __importDefault(require("../repositories/fakes/FakePostsRepository"));
const SearchPostService_1 = __importDefault(require("./SearchPostService"));
let fakePostsRepository;
let searchPostService;
let user_id1;
let user_id2;
let category_id1;
let category_id2;
let post1;
let post2;
let post3;
describe('Search Post', () => {
    beforeEach(async () => {
        fakePostsRepository = new FakePostsRepository_1.default();
        searchPostService = new SearchPostService_1.default(fakePostsRepository);
        user_id1 = new User_1.default();
        Object.assign(user_id1, { id: new mongodb_1.ObjectId() });
        user_id2 = new User_1.default();
        Object.assign(user_id2, { id: new mongodb_1.ObjectId() });
        category_id1 = new Category_1.default();
        Object.assign(category_id1, { id: new mongodb_1.ObjectId() });
        category_id2 = new Category_1.default();
        Object.assign(category_id2, { id: new mongodb_1.ObjectId() });
        post1 = await fakePostsRepository.create({
            author: user_id1,
            body: 'Post Teste One',
            title: 'Post Teste One',
            tags: [],
            category: category_id1,
            image_url: 'image'
        });
        post2 = await fakePostsRepository.create({
            author: user_id1,
            body: 'Post Teste One',
            title: 'Post Teste Two',
            tags: [],
            category: category_id2,
            image_url: 'image'
        });
        post3 = await fakePostsRepository.create({
            author: user_id2,
            body: 'Post Teste One',
            title: 'Post Teste Two',
            tags: [],
            category: category_id1,
            image_url: 'image'
        });
    });
    it('shoud be list all posts', async () => {
        const posts = await searchPostService.execute({});
        expect(posts).toEqual([post1, post2, post3]);
    });
    it('shoud be list only user1 posts', async () => {
        const posts = await searchPostService.execute({
            author_id: user_id1.id.toHexString()
        });
        expect(posts).toEqual([post1, post2]);
    });
    it('shoud be list only category1 posts', async () => {
        const posts = await searchPostService.execute({
            category_id: category_id1.id.toHexString()
        });
        expect(posts).toEqual([post1, post3]);
    });
    it('shoud be list only posts with "Two" in title', async () => {
        const posts = await searchPostService.execute({
            title: 'Two'
        });
        expect(posts).toEqual([post2, post3]);
    });
    it('shoud be list only posts with "Two" in title and author as user1', async () => {
        const posts = await searchPostService.execute({
            title: 'Two',
            author_id: user_id1.id.toHexString()
        });
        expect(posts).toEqual([post2]);
    });
    it('shoud be list only posts with "Two" in title and in category1', async () => {
        const posts = await searchPostService.execute({
            title: 'Two',
            category_id: category_id1.id.toHexString()
        });
        expect(posts).toEqual([post3]);
    });
    it('shoud be list only user1 posts with  category2', async () => {
        const posts = await searchPostService.execute({
            author_id: user_id1.id.toHexString(),
            category_id: category_id2.id.toHexString()
        });
        expect(posts).toEqual([post2]);
    });
    it('shoud be list only user1 posts with "One" in title and category2', async () => {
        const posts = await searchPostService.execute({
            author_id: user_id1.id.toHexString(),
            category_id: category_id2.id.toHexString(),
            title: 'One'
        });
        expect(posts).toEqual([]);
    });
});
