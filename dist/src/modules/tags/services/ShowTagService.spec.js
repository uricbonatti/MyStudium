"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const mongodb_1 = require("mongodb");
const FakeCategoriesRepository_1 = __importDefault(require("@modules/categories/repositories/fakes/FakeCategoriesRepository"));
const FakeTagsRepository_1 = __importDefault(require("../repositories/fakes/FakeTagsRepository"));
const ShowTagService_1 = __importDefault(require("./ShowTagService"));
let fakeTagsRepository;
let fakeCategoriesRepository;
let showTagService;
let cat;
describe('List Tags', () => {
    beforeEach(async () => {
        fakeTagsRepository = new FakeTagsRepository_1.default();
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        showTagService = new ShowTagService_1.default(fakeTagsRepository, fakeCategoriesRepository);
        cat = await fakeCategoriesRepository.create({ name: 'Teste' });
    });
    it('should be able to show a requested Tag', async () => {
        const tag_aux = await fakeTagsRepository.create({
            category: cat,
            name: 'Jest Test',
        });
        const tag = await showTagService.execute(tag_aux.id.toHexString());
        expect(tag).toEqual(tag_aux);
    });
    it('should not be able to show a non-valid Tag', async () => {
        await expect(showTagService.execute('non-valid')).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to show a non-existing Tag', async () => {
        await expect(showTagService.execute(new mongodb_1.ObjectId().toHexString())).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
