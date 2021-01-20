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
const date_fns_1 = require("date-fns");
const expTable_1 = require("@shared/utils/expTable");
let UserSummaryActivityService = class UserSummaryActivityService {
    constructor(usersRepository, postsRepository, commentsRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
    }
    async execute({ user_id }) {
        if (!mongodb_1.ObjectId.isValid(user_id)) {
            throw new apollo_server_1.ApolloError('Invalid User ID', '400');
        }
        const user = await this.usersRepository.findById(user_id);
        if (!user) {
            throw new apollo_server_1.ApolloError('User not found', '400');
        }
        const userPosts = await this.postsRepository.findByAuthor(user.id);
        const userComments = await this.commentsRepository.findByAuthorId(user.id);
        const monthPosts = userPosts.filter((post) => date_fns_1.differenceInCalendarDays(Date.now(), post.created_at) < 30);
        const weekPosts = monthPosts.filter((post) => date_fns_1.differenceInCalendarDays(Date.now(), post.created_at) < 7);
        const monthComments = userComments.filter((comment) => date_fns_1.differenceInCalendarDays(Date.now(), comment.created_at) < 30);
        const weekComments = monthComments.filter((comment) => date_fns_1.differenceInCalendarDays(Date.now(), comment.created_at) < 7);
        const countAllPosts = userPosts.length;
        const countAllComments = userComments.length;
        const countMonthPosts = monthPosts.length;
        const countMonthComments = monthPosts.length;
        const countWeekPosts = weekPosts.length;
        const countWeekComments = weekComments.length;
        const postLiked = await this.postsRepository.countPostsLikedByUser(user.id, user.created_at);
        const monthPostLiked = await this.postsRepository.countPostsLikedByUser(user.id, date_fns_1.subDays(Date.now(), 30));
        const weekPostLiked = await this.postsRepository.countPostsLikedByUser(user.id, date_fns_1.subDays(Date.now(), 7));
        const commentLiked = await this.commentsRepository.countCommentsLikedByUser(user.id, user.created_at);
        const monthCommentLiked = await this.commentsRepository.countCommentsLikedByUser(user.id, date_fns_1.subDays(Date.now(), 30));
        const weekCommentLiked = await this.commentsRepository.countCommentsLikedByUser(user.id, date_fns_1.subDays(Date.now(), 7));
        const weekExp = expTable_1.calcWeekExp({
            num_comments: countWeekComments,
            num_liked_comments: weekCommentLiked,
            num_posts: countWeekPosts,
            num_liked_posts: weekPostLiked
        });
        const summary = {
            all: {
                commentsCreated: countAllComments,
                postsCreated: countAllPosts,
                commentsLiked: commentLiked,
                postsLiked: postLiked
            },
            lastMonth: {
                commentsCreated: countMonthComments,
                postsCreated: countMonthPosts,
                postsLiked: monthPostLiked,
                commentsLiked: monthCommentLiked
            },
            lastWeek: {
                commentsCreated: countWeekComments,
                postsCreated: countWeekPosts,
                postsLiked: weekPostLiked,
                commentsLiked: weekCommentLiked
            },
            lastWeekPosts: weekPosts,
            weekExp
        };
        console.table(summary);
        return summary;
    }
};
UserSummaryActivityService = __decorate([
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject('UsersRepository')),
    __param(1, tsyringe_1.inject('PostsRepository')),
    __param(2, tsyringe_1.inject('CommentsRepository')),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserSummaryActivityService);
exports.default = UserSummaryActivityService;
