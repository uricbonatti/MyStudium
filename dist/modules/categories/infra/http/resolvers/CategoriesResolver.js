"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = exports.createCategory = void 0;
const tsyringe_1 = require("tsyringe");
const CreateCategoryService_1 = __importDefault(require("@modules/categories/services/CreateCategoryService"));
const ListCategoriesService_1 = __importDefault(require("@modules/categories/services/ListCategoriesService"));
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
async function createCategory(_, { data }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const { name } = data;
    const createCategoryService = tsyringe_1.container.resolve(CreateCategoryService_1.default);
    const category = await createCategoryService.execute({ name, user_id });
    return category;
}
exports.createCategory = createCategory;
async function listCategories() {
    const listCategoriesService = tsyringe_1.container.resolve(ListCategoriesService_1.default);
    const categories = await listCategoriesService.execute();
    return categories;
}
exports.listCategories = listCategories;
