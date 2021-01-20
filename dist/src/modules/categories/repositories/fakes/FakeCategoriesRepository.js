"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Category_1 = __importDefault(require("@modules/categories/infra/typeorm/schemas/Category"));
class FakeCategoriesRepository {
    constructor() {
        this.categories = [];
    }
    async create({ name }) {
        const category = new Category_1.default();
        Object.assign(category, {
            id: new mongodb_1.ObjectId(),
            name,
        });
        this.categories.push(category);
        return category;
    }
    async findById(category_id) {
        const findCategory = this.categories.find(category => category.id.toHexString() === category_id);
        return findCategory;
    }
    async findAll() {
        return this.categories;
    }
    async delete(category_id) {
        const findIndex = this.categories.findIndex(category => category.id.toHexString() === category_id);
        this.categories = [...this.categories.slice(findIndex, 1)];
    }
    async findByName({ name, }) {
        const findCategory = this.categories.find(category => category.name === name);
        return findCategory;
    }
}
exports.default = FakeCategoriesRepository;
