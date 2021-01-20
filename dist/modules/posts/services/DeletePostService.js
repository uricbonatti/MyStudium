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
const apollo_server_1 = require("apollo-server");
const mongodb_1 = require("mongodb");
let DeletePostService = class DeletePostService {
    constructor(postRepository, usersRepository) {
        this.postRepository = postRepository;
        this.usersRepository = usersRepository;
    }
    async execute({ user_id, post_id }) {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User cannot be found', '400');
        }
        const post = await this.postRepository.findByID(post_id);
        if (!post) {
            throw new apollo_server_1.ApolloError('Post cannot be found', '400');
        }
        if (!post.author.id.equals(new mongodb_1.ObjectId(user_id))) {
            throw new apollo_server_1.ApolloError('User is not the Author, then User cannot delete this post', '400');
        }
        await this.postRepository.delete(post_id);
        return post;
    }
};
DeletePostService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('PostRepository')),
    __param(1, tsyringe_1.inject('UsersRepository')),
    __metadata("design:paramtypes", [Object, Object])
], DeletePostService);
exports.default = DeletePostService;
