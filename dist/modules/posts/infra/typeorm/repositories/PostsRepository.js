"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Post_1 = __importDefault(require("../schemas/Post"));
class PostsRepository {
    constructor() {
        this.odmRepository = typeorm_1.getMongoRepository(Post_1.default);
    }
    async countPostsLikedByUser(liker_id, limitDate) {
        const postLiked = await this.odmRepository.count({
            where: {
                users_liked: [liker_id],
                created_at: typeorm_1.MoreThan(limitDate)
            }
        });
        return postLiked;
    }
    async create({ author, title, body, category, image_url, slug, tags }) {
        const post = this.odmRepository.create({
            author: {
                id: author.id,
                name: author.name,
                avatar_url: author.avatar_url
            },
            body,
            title,
            image_url,
            slug,
            category,
            tags
        });
        await this.odmRepository.save(post);
        return post;
    }
    async save(post) {
        return this.odmRepository.save(post);
    }
    async delete(post_id) {
        await this.odmRepository.delete(post_id);
    }
    async findByID(post_id) {
        const post = await this.odmRepository.findOne(post_id);
        return post;
    }
    async findAll() {
        const posts = await this.odmRepository.find();
        return posts;
    }
    async findByTitle(title) {
        const posts = await this.odmRepository.find({
            where: { title: typeorm_1.Like(`%${title}%`) }
        });
        return posts;
    }
    async findBySlug(slug) {
        const posts = await this.odmRepository.find({
            slug
        });
        return posts;
    }
    async findByAuthor(author_id) {
        const posts = await this.odmRepository.find({
            where: {
                'author.id': author_id
            }
        });
        return posts;
    }
    async findByCategory(category_id) {
        const posts = await this.odmRepository.find({
            where: {
                'category.id': category_id
            }
        });
        return posts;
    }
    async isLiked({ post_id, user_id }) {
        const findPost = await this.odmRepository.findOne(post_id.toHexString());
        if (findPost && findPost.users_liked.indexOf(user_id) >= 0) {
            return true;
        }
        return false;
    }
    async like({ post_id, user_id }) {
        const findPost = await this.odmRepository.findOne(post_id.toHexString());
        if (findPost) {
            const index = findPost.users_liked.indexOf(user_id);
            if (index >= 0) {
                if (findPost.users_liked.length === 1) {
                    findPost.users_liked = [];
                }
                else {
                    findPost.users_liked = [...findPost.users_liked.slice(index, 1)];
                }
            }
            else {
                findPost.users_liked.push(user_id);
            }
            await this.odmRepository.save(findPost);
            return findPost.getLikes();
        }
        return 0;
    }
    async likesNumber(post_id) {
        const postLikes = await this.odmRepository.findOne(post_id.toHexString());
        if (!postLikes) {
            return 0;
        }
        return postLikes.getLikes();
    }
}
exports.default = PostsRepository;
