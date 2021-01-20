"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.likeComment = void 0;
const tsyringe_1 = require("tsyringe");
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
const LikeCommentService_1 = __importDefault(require("@modules/comments/services/LikeCommentService"));
const CreateCommentService_1 = __importDefault(require("@modules/comments/services/CreateCommentService"));
const UpdateCommentService_1 = __importDefault(require("@modules/comments/services/UpdateCommentService"));
const DeleteCommentService_1 = __importDefault(require("@modules/comments/services/DeleteCommentService"));
async function likeComment(_, { comment_id }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const likeCommentService = tsyringe_1.container.resolve(LikeCommentService_1.default);
    const likes = await likeCommentService.execute({ user_id, comment_id });
    return likes;
}
exports.likeComment = likeComment;
async function createComment(_, { data }, { token }) {
    const author_id = tokenValidation_1.default(token);
    const { body, post_id } = data;
    const createCommentService = tsyringe_1.container.resolve(CreateCommentService_1.default);
    const comment = await createCommentService.execute({
        author_id,
        body,
        post_id,
    });
    return comment;
}
exports.createComment = createComment;
async function updateComment(_, { id, data }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const { body } = data;
    const updateCommentService = tsyringe_1.container.resolve(UpdateCommentService_1.default);
    const comment = await updateCommentService.execute({
        comment_id: id,
        body,
        user_id,
    });
    return comment;
}
exports.updateComment = updateComment;
async function deleteComment(_, { id }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const deleteCommentService = tsyringe_1.container.resolve(DeleteCommentService_1.default);
    const comment = await deleteCommentService.execute({
        comment_id: id,
        user_id,
    });
    return comment.id.toString();
}
exports.deleteComment = deleteComment;
