"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const mongodb_1 = require("mongodb");
const FakeCategoriesRepository_1 = __importDefault(require("../repositories/fakes/FakeCategoriesRepository"));
const ShowCategoryService_1 = __importDefault(require("./ShowCategoryService"));
let fakeCategoriesRepository;
let showCategoryService;
describe('List Categories', () => {
    beforeEach(async () => {
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        showCategoryService = new ShowCategoryService_1.default(fakeCategoriesRepository);
    });
    it('should be able to show a requested category', async () => {
        const category1 = await fakeCategoriesRepository.create({
            name: 'Jest Test',
        });
        const category = await showCategoryService.execute(category1.id.toHexString());
        expect(category).toEqual(category1);
    });
    it('should not be able to show a non-valid category', async () => {
        await expect(showCategoryService.execute('non-valid')).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
    it('should not be able to show a non-existing category', async () => {
        await expect(showCategoryService.execute(new mongodb_1.ObjectId().toHexString())).rejects.toBeInstanceOf(apollo_server_1.ApolloError);
    });
});
