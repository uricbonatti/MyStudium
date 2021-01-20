"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcWeekExp = void 0;
const expTable = {
    v1: {
        post: 500,
        comment: 100,
        postLike: 25,
        commentLike: 10,
    },
};
exports.default = expTable;
function calcWeekExp({ num_comments, num_liked_comments, num_liked_posts, num_posts, }) {
    const expBase = expTable.v1;
    const expComments = num_comments * expBase.comment;
    const expPost = num_posts * expBase.post;
    const expLikes = num_liked_comments * expBase.commentLike +
        num_liked_posts * expBase.postLike;
    return expComments + expPost + expLikes;
}
exports.calcWeekExp = calcWeekExp;
