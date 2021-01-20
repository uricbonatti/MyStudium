"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const typeorm_1 = require("typeorm");
const Tag_1 = __importDefault(require("../schemas/Tag"));
class TagsRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(Tag_1.default);
    }
    async create({ name, category }) {
        const tag = this.odmRepository.create({
            name,
            category,
        });
        await this.odmRepository.save(tag);
        return tag;
    }
    async findById(tag_id) {
        const tag = await this.odmRepository.findOne(tag_id);
        return tag;
    }
    async findByCategory(category_id) {
        const tags = await this.odmRepository.find({
            where: {
                'category.id': mongodb_1.ObjectId.createFromHexString(category_id),
            },
        });
        return tags;
    }
    async findByName(name) {
        const tag = await this.odmRepository.findOne({ name });
        return tag;
    }
    async findAll() {
        const tags = await this.odmRepository.find();
        return tags;
    }
    async delete(tag_id) {
        await this.odmRepository.delete(tag_id);
    }
}
exports.default = TagsRepository;
