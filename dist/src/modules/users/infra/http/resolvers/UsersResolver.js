"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSummary = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = void 0;
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const ShowProfileService_1 = __importDefault(require("@modules/users/services/ShowProfileService"));
const CreateUserService_1 = __importDefault(require("@modules/users/services/CreateUserService"));
const tokenValidation_1 = __importDefault(require("@shared/utils/tokenValidation"));
const DeleteUserService_1 = __importDefault(require("@modules/users/services/DeleteUserService"));
const UpdateProfileService_1 = __importDefault(require("@modules/users/services/UpdateProfileService"));
const UserSummaryActivityService_1 = __importDefault(require("@modules/users/services/UserSummaryActivityService"));
async function getUser(_, { id }) {
    const showProfileService = tsyringe_1.container.resolve(ShowProfileService_1.default);
    const user = await showProfileService.execute({ id });
    return class_transformer_1.classToClass(user);
}
exports.getUser = getUser;
async function createUser(_, { data }) {
    const { email, name, password, github, linkedin } = data;
    const createUserService = tsyringe_1.container.resolve(CreateUserService_1.default);
    const user = await createUserService.execute({
        email,
        name,
        password,
        github,
        linkedin,
    });
    return class_transformer_1.classToClass(user);
}
exports.createUser = createUser;
async function updateUser(_, { data }, { token }) {
    const id = tokenValidation_1.default(token);
    const { email, name, old_password, password, github, linkedin, avatar_url, } = data;
    const updateProfileService = tsyringe_1.container.resolve(UpdateProfileService_1.default);
    const user = await updateProfileService.execute({
        id,
        email,
        name,
        old_password,
        password,
        github,
        linkedin,
        avatar_url,
    });
    return class_transformer_1.classToClass(user);
}
exports.updateUser = updateUser;
async function deleteUser(_, { data }, { token }) {
    const user_id = tokenValidation_1.default(token);
    const { email } = data;
    const deleteUserService = tsyringe_1.container.resolve(DeleteUserService_1.default);
    const user = await deleteUserService.execute({ user_id, email });
    return user.id.toString();
}
exports.deleteUser = deleteUser;
async function userSummary(_, { id }) {
    const userSummaryActivityService = tsyringe_1.container.resolve(UserSummaryActivityService_1.default);
    const summary = await userSummaryActivityService.execute({ user_id: id });
    return summary;
}
exports.userSummary = userSummary;
