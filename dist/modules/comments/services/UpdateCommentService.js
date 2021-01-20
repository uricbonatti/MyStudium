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
let UpdateCommentService = class UpdateCommentService {
    constructor(usersRepository, commentsRepository) {
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
    }
    async execute({ body, user_id, comment_id }) {
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found.', '400');
        }
        const comment = await this.commentsRepository.findByID(comment_id);
        if (!comment) {
            throw new apollo_server_1.ApolloError('Comment not found.', '400');
        }
        if (!comment.author.id.equals(user.id)) {
            throw new apollo_server_1.ApolloError('User and Author not matched.', '400');
        }
        let adjustBody = body.replace(/\s{2,}/g, ' ');
        adjustBody = adjustBody.trim();
        if (adjustBody.length === 0) {
            throw new apollo_server_1.ApolloError('Comment Body need some content', '400');
        }
        comment.body = adjustBody;
        await this.commentsRepository.save(comment);
        return comment;
    }
};
UpdateCommentService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('CommentsRepository')),
    __metadata("design:paramtypes", [Object, Object])
], UpdateCommentService);
exports.default = UpdateCommentService;
