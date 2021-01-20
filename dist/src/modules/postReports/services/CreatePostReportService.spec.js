"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
const FakePostsRepository_1 = __importDefault(require("@modules/posts/repositories/fakes/FakePostsRepository"));
const Tag_1 = __importDefault(require("@modules/tags/infra/typeorm/schemas/Tag"));
const FakeUsersRepository_1 = __importDefault(require("@modules/users/repositories/fakes/FakeUsersRepository"));
const apollo_server_1 = require("apollo-server");
const FakePostReportsRepository_1 = __importDefault(require("../repositories/fakes/FakePostReportsRepository"));
const CreatePostReportService_1 = __importDefault(require("./CreatePostReportService"));
let fakeUsersRepository;
let fakePostsRepository;
let fakePostReportsRepository;
let createPostReport;
let user;
let post;
describe('Create Post Report', () => {
    beforeEach(async () => {
        fakeUsersRepository = new FakeUsersRepository_1.default();
        fakePostsRepository = new FakePostsRepository_1.default();
        fakePostReportsRepository = new FakePostReportsRepository_1.default();
        createPostReport = new CreatePostReportService_1.default(fakeUsersRepository, fakePostsRepository, fakePostReportsRepository);
        user = await fakeUsersRepository.create({
            email: 'user@test.tes',
            name: 'John Duo',
            password: '123456',
        });
        const postAuthor = await fakeUsersRepository.create({
            email: 'author@test.tes',
            name: 'John Duo',
            password: '123456',
        });
        post = await fakePostsRepository.create({
            body: 'Loren Ypsolon',
            title: 'Teste Post',
            category: new Category_1.default(),
            tags: [new Tag_1.default()],
            author: postAuthor,
            image_url: 'img',
        });
    });
    it('should be able to create a post report', async () => {
        const report = await createPostReport.execute({
            body: 'Just to Report',
            post_id: post.id.toHexString(),
            title: 'Report',
            user_id: user.id.toHexString(),
        });
        expect(report).toHaveProperty('id');
        expect(report.closed).toBe(false);
    });
    it('should not be able to create a report with a non-existing user', async () => {
        await expect(createPostReport.execute({
            body: 'Just to Report',
            post_id: post.id.toHexString(),
            title: 'Report',
            user_id: 'non-existing-user',
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to create a report for a non-existing post', async () => {
        await expect(createPostReport.execute({
            body: 'Just to Report',
            post_id: 'non-existing-post',
            title: 'Report',
            user_id: user.id.toHexString(),
        })).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
