"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = __importDefault(require("@modules/tags/infra/typeorm/schemas/Tag"));
const mongodb_1 = require("mongodb");
class FakeTagsRepository {
    constructor() {
        this.tags = [];
    }
    async create({ name, category }) {
        const tag = new Tag_1.default();
        Object.assign(tag, {
            id: new mongodb_1.ObjectId(),
            name,
            category
        });
        this.tags.push(tag);
        return tag;
    }
    async findById(tag_id) {
        const findTag = this.tags.find((tag) => tag.id.toHexString() === tag_id);
        return findTag;
    }
    async findByCategory(category_id) {
        const findTags = this.tags.filter((tag) => tag.category.id.toHexString() === category_id);
        return findTags;
    }
    async findByName(name) {
        const findTag = this.tags.find((tag) => tag.name === name);
        return findTag;
    }
    async findAll() {
        return this.tags;
    }
    async delete(tag_id) {
        const findIndex = this.tags.findIndex((tag) => tag.id.toHexString() === tag_id);
        this.tags = [...this.tags.slice(findIndex, 1)];
    }
}
exports.default = FakeTagsRepository;
