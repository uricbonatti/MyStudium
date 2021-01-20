"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.deletePost = exports.updatePost = exports.createPost = exports.listPosts = exports.getPost = void 0;
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
const ShowPostService_1 = __importDefault(require("@modules/posts/services/ShowPostService"));
const SearchPostService_1 = __importDefault(require("@modules/posts/services/SearchPostService"));
const CreatePostService_1 = __importDefault(require("@modules/posts/services/CreatePostService"));
const UpdatePostService_1 = __importDefault(require("@modules/posts/services/UpdatePostService"));
const DeletePostService_1 = __importDefault(require("@modules/posts/services/DeletePostService"));
const LikePostService_1 = __importDefault(require("@modules/posts/services/LikePostService"));
async function getPost(_, { id }) {
    const showPostService = tsyringe_1.container.resolve(ShowPostService_1.default);
    const post = await showPostService.execute({ post_id: id });
    return class_transformer_1.classToClass(post);
}
exports.getPost = getPost;
async function listPosts(_, { author_id, category_id, part_of_title }) {
    const searchPostService = tsyringe_1.container.resolve(SearchPostService_1.default);
    const posts = await searchPostService.execute({
        author_id,
        category_id,
        title: part_of_title,
    });
    return posts;
}
exports.listPosts = listPosts;
async function createPost(_, { data }, { token }) {
    const { title, body, category_id, image_url, tag_ids } = data;
    const createPostService = tsyringe_1.container.resolve(CreatePostService_1.default);
    const author_id = tokenValidation_1.default(token);
    const post = await createPostService.execute({
        author_id,
        body,
        category_id,
        image_url,
        tag_ids,
        title,
    });
    return class_transformer_1.classToClass(post);
}
exports.createPost = createPost;
async function updatePost(_, { post_id, body, category_id, image_url, tag_ids, title }, { token }) {
    const updatePostService = tsyringe_1.container.resolve(UpdatePostService_1.default);
    const user_id = tokenValidation_1.default(token);
    const post = await updatePostService.execute({
        post_id,
        body,
        image_url,
        tag_ids,
        title,
        user_id,
    });
    return class_transformer_1.classToClass(post);
}
exports.updatePost = updatePost;
async function deletePost(_, { id }, { token }) {
    const deletePostService = tsyringe_1.container.resolve(DeletePostService_1.default);
    const user_id = tokenValidation_1.default(token);
    const post = await deletePostService.execute({ post_id: id, user_id });
    return post.id.toString();
}
exports.deletePost = deletePost;
async function likePost(_, { post_id }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const likePostService = tsyringe_1.container.resolve(LikePostService_1.default);
    const likes = await likePostService.execute({ user_id, post_id });
    return likes;
}
exports.likePost = likePost;
