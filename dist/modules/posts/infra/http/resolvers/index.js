"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMutations = exports.PostQuerys = void 0;
const PostsResolver_1 = require("./PostsResolver");
exports.PostQuerys = {
    getPost: PostsResolver_1.getPost,
    listPosts: PostsResolver_1.listPosts
};
exports.PostMutations = {
    createPost: PostsResolver_1.createPost,
    deletePost: PostsResolver_1.deletePost,
    updatePost: PostsResolver_1.updatePost
};
