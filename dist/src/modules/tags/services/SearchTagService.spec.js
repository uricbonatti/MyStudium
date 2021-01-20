"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const FakeCategoriesRepository_1 = __importDefault(require("@modules/categories/repositories/fakes/FakeCategoriesRepository"));
const FakeTagsRepository_1 = __importDefault(require("../repositories/fakes/FakeTagsRepository"));
const SearchTagsService_1 = __importDefault(require("./SearchTagsService"));
let fakeCategoriesRepository;
let fakeTagsRepository;
let searchTagsService;
let category1;
let category2;
let tag1;
let tag2;
let tag3;
describe('List Tags', () => {
    beforeEach(async () => {
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        fakeTagsRepository = new FakeTagsRepository_1.default();
        searchTagsService = new SearchTagsService_1.default(fakeTagsRepository);
        category1 = await fakeCategoriesRepository.create({
            name: 'Categoria 1',
        });
        category2 = await fakeCategoriesRepository.create({
            name: 'Categoria 2',
        });
        tag1 = await fakeTagsRepository.create({
            category: category1,
            name: 'Tag 1',
        });
        tag2 = await fakeTagsRepository.create({
            category: category2,
            name: 'Tag 2',
        });
        tag3 = await fakeTagsRepository.create({
            category: category1,
            name: 'Tag 3',
        });
    });
    it('should be able to list all tags', async () => {
        const tags = await searchTagsService.execute({});
        expect(tags).toEqual([tag1, tag2, tag3]);
    });
    it('should be able to list all tags by category', async () => {
        const tags = await searchTagsService.execute({
            category_id: category1.id.toHexString(),
        });
        expect(tags).toEqual([tag1, tag3]);
    });
    it('should not be able to list all tags by non-existing category', async () => {
        await expect(searchTagsService.execute({
            category_id: new mongodb_1.ObjectId().toHexString(),
        })).resolves.toEqual([]);
    });
});
