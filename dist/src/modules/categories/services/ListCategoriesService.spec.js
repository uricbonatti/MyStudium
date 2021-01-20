"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FakeCategoriesRepository_1 = __importDefault(require("../repositories/fakes/FakeCategoriesRepository"));
const ListCategoriesService_1 = __importDefault(require("./ListCategoriesService"));
let fakeCategoriesRepository;
let listCategoriesService;
describe('List Categories', () => {
    beforeEach(async () => {
        fakeCategoriesRepository = new FakeCategoriesRepository_1.default();
        listCategoriesService = new ListCategoriesService_1.default(fakeCategoriesRepository);
    });
    it('should be able to list categories', async () => {
        const category1 = await fakeCategoriesRepository.create({
            name: 'Jest Test',
        });
        const category2 = await fakeCategoriesRepository.create({
            name: 'Jest Test2',
        });
        const category3 = await fakeCategoriesRepository.create({
            name: 'Jest Test3',
        });
        const categories = await listCategoriesService.execute();
        expect(categories).toEqual([category1, category2, category3]);
    });
});
