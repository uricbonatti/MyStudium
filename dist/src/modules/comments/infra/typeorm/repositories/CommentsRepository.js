"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const mongodb_1 = require("mongodb");
const Comment_1 = __importDefault(require("../schemas/Comment"));
class CommentsRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(Comment_1.default);
    }
    async countCommentsLikedByUser(liker_id, limitDate) {
        const commentLikes = await this.odmRepository.count({
            where: {
                users_liked: [liker_id],
                created_at: typeorm_1.MoreThan(limitDate),
            },
        });
        return commentLikes;
    }
    async create({ author, body, post_id, }) {
        const { avatar_url, id, name } = author;
        const comment = this.odmRepository.create({
            author: { id, name, avatar_url },
            body,
            post_id: new mongodb_1.ObjectId(post_id),
            users_liked: [],
        });
        await this.odmRepository.save(comment);
        return comment;
    }
    async delete(comment_id) {
        await this.odmRepository.delete(comment_id);
    }
    async save(comment) {
        return this.odmRepository.save(comment);
    }
    async findByID(comment_id) {
        const comment = await this.odmRepository.findOne(comment_id);
        return comment;
    }
    async findByAuthorId(author_id) {
        const comments = await this.odmRepository.find({
            where: {
                'author.id': author_id,
            },
        });
        return comments;
    }
    async findByPostId(post_id) {
        const comments = await this.odmRepository.find({
            post_id,
        });
        return comments;
    }
    async isLiked({ comment_id, user_id, }) {
        const findComment = await this.odmRepository.findOne(comment_id.toHexString());
        if (findComment && findComment.users_liked.indexOf(user_id) >= 0) {
            return true;
        }
        return false;
    }
    async like({ comment_id, user_id }) {
        const findComment = await this.odmRepository.findOne(comment_id.toHexString());
        if (findComment) {
            const index = findComment.users_liked.indexOf(user_id);
            if (index >= 0) {
                if (findComment.users_liked.length > 1) {
                    findComment.users_liked = [
                        ...findComment.users_liked.slice(index, 1),
                    ];
                }
                else {
                    findComment.users_liked = [];
                }
            }
            else {
                findComment.users_liked.push(user_id);
            }
            await this.odmRepository.save(findComment);
            return findComment.getLikes();
        }
        return 0;
    }
    async likesNumber(comment_id) {
        const findComment = await this.odmRepository.findOne(comment_id.toHexString());
        if (!findComment) {
            return 0;
        }
        return findComment.getLikes();
    }
}
exports.default = CommentsRepository;
