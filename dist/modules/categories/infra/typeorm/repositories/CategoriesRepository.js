"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Category_1 = __importDefault(require("../schemas/Category"));
class CategoriesRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(Category_1.default);
    }
    async findByName({ name }) {
        const category = await this.odmRepository.findOne({ name });
        return category;
    }
    async create({ name }) {
        const category = this.odmRepository.create({ name });
        await this.odmRepository.save(category);
        return category;
    }
    async findById(category_id) {
        const category = await this.odmRepository.findOne(category_id);
        return category;
    }
    async findAll() {
        const categories = await this.odmRepository.find();
        return categories;
    }
    async delete(category_id) {
        await this.odmRepository.delete(category_id);
    }
}
exports.default = CategoriesRepository;
