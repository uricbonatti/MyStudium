"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsMutations = exports.CommentsQuerys = void 0;
const CommentsResolver_1 = require("./CommentsResolver");
exports.CommentsQuerys = {};
exports.CommentsMutations = {
    createComment: CommentsResolver_1.createComment,
    likeComment: CommentsResolver_1.likeComment,
    deleteComment: CommentsResolver_1.deleteComment,
    updateComment: CommentsResolver_1.updateComment,
};
