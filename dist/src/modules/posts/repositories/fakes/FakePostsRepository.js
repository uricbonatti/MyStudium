"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("@modules/posts/infra/typeorm/schemas/Post"));
const mongodb_1 = require("mongodb");
const remove_accents_1 = __importDefault(require("remove-accents"));
const date_fns_1 = require("date-fns");
class FakePostsRepository {
    constructor() {
        this.posts = [];
    }
    async create(_a) {
        var { title } = _a, rest = __rest(_a, ["title"]);
        const post = new Post_1.default();
        Object.assign(post, {
            id: new mongodb_1.ObjectId(),
            title,
            slug: remove_accents_1.default(title).toLowerCase().replace(/\s/g, '-'),
            users_liked: [],
        }, rest);
        this.posts.push(post);
        return post;
    }
    async save(post) {
        const findIndex = this.posts.findIndex(findPost => findPost.id.equals(post.id));
        this.posts[findIndex] = post;
        return post;
    }
    async delete(post_id) {
        const findIndex = this.posts.findIndex(post => post.id.toHexString() === post_id);
        if (this.posts.length > 1) {
            this.posts = [...this.posts.slice(findIndex, 1)];
        }
        else {
            this.posts = [];
        }
    }
    async findByID(post_id) {
        const findPost = this.posts.find(post => post.id.toHexString() === post_id);
        return findPost;
    }
    async findAll() {
        return this.posts;
    }
    async findByTitle(title) {
        const findPosts = this.posts.filter(post => post.title.indexOf(title) > -1);
        return findPosts;
    }
    async findByAuthor(author_id) {
        const findPosts = this.posts.filter(post => post.author.id.equals(author_id));
        return findPosts;
    }
    async findByCategory(category_id) {
        const findPosts = this.posts.filter(post => category_id.equals(post.category.id));
        return findPosts;
    }
    async findBySlug(slug) {
        const findPosts = [];
        this.posts.forEach(post => {
            if (String(post.slug) === String(slug)) {
                findPosts.push(post);
            }
        });
        return findPosts;
    }
    async isLiked({ user_id, post_id }) {
        const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
        const user = this.posts[findIndex].users_liked.find(user_like => user_id.equals(user_like));
        return !!user;
    }
    async like({ user_id, post_id }) {
        const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
        if (findIndex >= 0) {
            const likesStored = this.posts[findIndex].users_liked;
            const userLikeIndex = likesStored.findIndex(user_like => user_id.equals(user_like));
            if (userLikeIndex >= 0) {
                if (this.posts[findIndex].users_liked.length === 1) {
                    this.posts[findIndex].users_liked = [];
                }
                else {
                    this.posts[findIndex].users_liked = [
                        ...likesStored.slice(userLikeIndex, 1),
                    ];
                }
            }
            else {
                this.posts[findIndex].users_liked.push(user_id);
            }
            return this.posts[findIndex].users_liked.length;
        }
        return 0;
    }
    async likesNumber(post_id) {
        const findIndex = this.posts.findIndex(post => post_id.equals(post.id));
        return this.posts[findIndex].getLikes();
    }
    async countPostsLikedByUser(liker_id, limitDate) {
        const postIsLiked = await this.posts.map(post => post.users_liked.includes(liker_id) &&
            date_fns_1.isAfter(post.created_at, limitDate));
        return postIsLiked.filter(liked => liked).length;
    }
}
exports.default = FakePostsRepository;
