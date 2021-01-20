"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Comment_1 = __importDefault(require("@modules/comments/infra/typeorm/schemas/Comment"));
const date_fns_1 = require("date-fns");
class FakeCommentsRepository {
    constructor() {
        this.comments = [];
    }
    async create(data) {
        const comment = new Comment_1.default();
        Object.assign(comment, {
            users_liked: [],
            id: new mongodb_1.ObjectId(),
        }, data);
        this.comments.push(comment);
        return comment;
    }
    async delete(comment_id) {
        const findIndex = this.comments.findIndex(comment => comment.id.toHexString() === comment_id);
        if (findIndex >= 0) {
            if (this.comments.length === 1) {
                this.comments = [];
            }
            else {
                this.comments = [...this.comments.slice(findIndex, 1)];
            }
        }
    }
    async save(comment) {
        const findIndex = this.comments.findIndex(findComment => findComment.id === comment.id);
        this.comments[findIndex] = comment;
        return comment;
    }
    async findByID(comment_id) {
        const findComment = await this.comments.find(comment => comment.id.toHexString() === comment_id);
        return findComment;
    }
    async findByAuthorId(author_id) {
        const findComments = this.comments.filter(comment => author_id.equals(comment.author.id));
        return findComments;
    }
    async findByPostId(post_id) {
        const findComments = this.comments.filter(comment => comment.post_id.equals(post_id));
        return findComments;
    }
    async isLiked({ user_id, comment_id, }) {
        const findIndex = this.comments.findIndex(comment => comment_id.equals(comment.id));
        const user = this.comments[findIndex].users_liked.find(user_like => user_like.equals(user_id));
        return !!user;
    }
    async like({ user_id, comment_id }) {
        const findIndex = this.comments.findIndex(comment => comment_id.equals(comment.id));
        if (findIndex < 0) {
            return 0;
        }
        const likesStored = [...this.comments[findIndex].users_liked];
        const userLikeIndex = likesStored.findIndex(user_like => user_id.equals(user_like));
        if (userLikeIndex >= 0) {
            if (likesStored.length === 1) {
                this.comments[findIndex].users_liked = [];
            }
            else {
                this.comments[findIndex].users_liked = [
                    ...this.comments[findIndex].users_liked.slice(userLikeIndex, 1),
                ];
            }
        }
        else {
            this.comments[findIndex].users_liked.push(user_id);
        }
        return this.comments[findIndex].users_liked.length;
    }
    async likesNumber(comment_id) {
        const findIndex = this.comments.findIndex(comment => comment_id.equals(comment.id));
        return this.comments[findIndex].getLikes();
    }
    async countCommentsLikedByUser(liker_id, limitDate) {
        const commentIsLiked = await this.comments.map(comment => comment.users_liked.includes(liker_id) &&
            date_fns_1.isAfter(comment.created_at, limitDate));
        return commentIsLiked.filter(liked => liked).length;
    }
}
exports.default = FakeCommentsRepository;
