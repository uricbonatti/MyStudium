"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const mongodb_1 = require("mongodb");
const apollo_server_1 = require("apollo-server");
let SearchPostService = class SearchPostService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute({ title, author_id, category_id }) {
        if (author_id && !mongodb_1.ObjectId.isValid(author_id)) {
            throw new apollo_server_1.ApolloError('Invalid Author ID', '400');
        }
        if (category_id && !mongodb_1.ObjectId.isValid(category_id)) {
            throw new apollo_server_1.ApolloError('Invalid Category ID', '400');
        }
        if (author_id && category_id && title) {
            const titlePosts = await this.postsRepository.findByTitle(title);
            const authorPosts = titlePosts.filter((post) => post.author.id.equals(new mongodb_1.ObjectId(author_id)));
            const categoryPosts = authorPosts.filter((post) => mongodb_1.ObjectId.createFromHexString(category_id).equals(post.category.id));
            return categoryPosts;
        }
        if (category_id && title) {
            const titlePosts = await this.postsRepository.findByTitle(title);
            const categoryPosts = titlePosts.filter((post) => mongodb_1.ObjectId.createFromHexString(category_id).equals(post.category.id));
            return categoryPosts;
        }
        if (author_id && title) {
            const titlePosts = await this.postsRepository.findByTitle(title);
            const authorPosts = titlePosts.filter((post) => post.author.id.equals(new mongodb_1.ObjectId(author_id)));
            return authorPosts;
        }
        if (author_id && category_id) {
            const authorPosts = await this.postsRepository.findByAuthor(new mongodb_1.ObjectId(author_id));
            const categoryPosts = authorPosts.filter((post) => mongodb_1.ObjectId.createFromHexString(category_id).equals(post.category.id));
            return categoryPosts;
        }
        if (category_id) {
            return this.postsRepository.findByCategory(new mongodb_1.ObjectId(category_id));
        }
        if (title) {
            return this.postsRepository.findByTitle(title);
        }
        if (author_id) {
            return this.postsRepository.findByAuthor(new mongodb_1.ObjectId(author_id));
        }
        return this.postsRepository.findAll();
    }
};
SearchPostService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PostsRepository')),
    __metadata("design:paramtypes", [Object])
], SearchPostService);
exports.default = SearchPostService;
