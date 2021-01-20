"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("@modules/users/infra/http/resolvers");
const resolvers_2 = require("@modules/posts/infra/http/resolvers");
const resolvers_3 = require("@modules/categories/infra/http/resolvers");
const resolvers_4 = require("@modules/tags/infra/http/resolvers");
const resolvers_5 = require("@modules/comments/infra/http/resolvers");
const Query = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resolvers_1.UserQuery), resolvers_2.PostQuerys), resolvers_5.CommentsQuerys), resolvers_3.CategoriesQuerys), resolvers_4.TagsQuerys);
const Mutation = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, resolvers_1.UserMutation), resolvers_2.PostMutations), resolvers_5.CommentsMutations), resolvers_3.CategoriesMutations), resolvers_4.TagsMutations);
exports.default = {
    Query,
    Mutation
};
