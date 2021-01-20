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
let CreatePostReportService = class CreatePostReportService {
    constructor(usersRepository, postsRepository, postReportRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.postReportRepository = postReportRepository;
    }
    async execute({ user_id, body, post_id, title, }) {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found.', '400');
        }
        const post = await this.postsRepository.findByID(post_id);
        if (!post) {
            throw new apollo_server_1.ApolloError('Post not found.', '400');
        }
        const report = await this.postReportRepository.create({
            body,
            post_id: post.id,
            title,
            user_id: user.id,
        });
        return report;
    }
};
CreatePostReportService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PostsRepository')),
    __param(2, tsyringe_1.inject('PostReportsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreatePostReportService);
exports.default = CreatePostReportService;
